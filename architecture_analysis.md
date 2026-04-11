# Patient Management — Architecture Overview

> [!NOTE]
> Based on a thorough scan of every microservice, entity model, config file, and database schema in the codebase.

---

## Current Architecture

```mermaid
graph TB
    subgraph FE["🖥️ Frontend — Next.js (Port 3000)"]
        UI["React + Shadcn UI"]
    end

    subgraph GW["🌐 API Gateway (Port 8088)"]
        GWLB["Spring Cloud Gateway<br/>+ JWT Validation Filter"]
    end

    subgraph AS["🔐 Auth Service (Port 8083)"]
        AC["AuthController<br/>login · register · validate<br/>doctors · users CRUD"]
        AS_DB[("PostgreSQL — users table<br/>───────────────<br/>id (UUID)<br/>name<br/>email (unique)<br/>password<br/>role (USER│PATIENT│ADMIN)<br/>specialty")]
    end

    subgraph PS["🧑 Patient Service (Port 8080)"]
        PC["PatientController<br/>CRUD operations"]
        PS_DB[("PostgreSQL — patient table<br/>───────────────<br/>id (UUID)<br/>name · email (unique)<br/>address<br/>date_of_birth<br/>registered_date<br/>doctor_email")]
    end

    subgraph APS["📅 Appointment Service (Port 8084)"]
        APC["AppointmentController<br/>book · pending · status"]
        APS_DB[("PostgreSQL — appointment table<br/>───────────────<br/>id (UUID)<br/>patientEmail · doctorEmail<br/>doctorId · symptoms<br/>predictedSpecialty<br/>appointmentTime<br/>status · createdAt")]
    end

    subgraph NS["🔔 Notification Service (Port 8085)"]
        NC["SSE + Email<br/>No database (stateless)"]
    end

    subgraph BS["💰 Billing Service (Port 9001)"]
        BC["gRPC Server<br/>createBillingAccount"]
    end

    subgraph K["📨 Apache Kafka"]
        KT1["patient topic<br/>(Protobuf)"]
        KT2["appointment-events topic<br/>(JSON)"]
    end

    UI -->|All requests| GWLB
    GWLB -->|/auth/**| AC
    GWLB -->|/api/patient/**| PC
    GWLB -->|/api/appointments/**| APC
    GWLB -->|/api/notifications/**| NC

    AC --- AS_DB
    PC --- PS_DB
    APC --- APS_DB

    APC -->|"Feign Client<br/>/doctors · /doctors/by-specialty · /doctor"| AC
    PC -->|"gRPC"| BC
    PC -->|"Kafka Produce"| KT1
    APC -->|"Kafka Produce"| KT2
    KT2 -->|"Kafka Consume"| NC

    style AS_DB fill:#ff6b6b,stroke:#c92a2a,color:#fff
    style PS_DB fill:#ff922b,stroke:#e8590c,color:#fff
```

---

## Database Schema Summary (Current)

| Service | DB Type | Table/Collection | Key Fields |
|---|---|---|---|
| Auth Service | PostgreSQL | `users` | `id`, `name`, `email`, `password`, `role`, `specialty` |
| Patient Service | PostgreSQL | `patient` | `id`, `name`, `email`, `address`, `date_of_birth`, `registered_date`, `doctor_email` |
| Appointment Service | PostgreSQL | `appointment` | `id`, `patientEmail`, `doctorEmail`, `doctorId`, `symptoms`, `predictedSpecialty`, `status` |
| Billing Service | PostgreSQL | gRPC-managed billing accounts | `patientId`, `name`, `email` |
| Notification Service | **None** | Stateless (SSE + Email) | — |

---

## The Bug: Broken Patient Signup Flow

```mermaid
sequenceDiagram
    actor P as Patient
    participant FE as Frontend
    participant GW as API Gateway
    participant AS as Auth Service
    participant PS as Patient Service (Port 8080)
    participant BS as Billing Service (gRPC)

    P->>FE: Fill signup form (name, email, password)
    FE->>GW: POST /auth/register-patient
    GW->>AS: Forward
    AS->>AS: Save to users table<br/>(role=PATIENT, no address/DOB)

    Note over AS: ✅ Patient credential created

    AS-->>GW: Return JWT
    GW-->>FE: Token
    FE-->>P: Logged in!

    Note over PS: ❌ Patient Service NEVER<br/>receives the signup.<br/>patient table stays empty!

    Note over BS: ❌ Billing account<br/>never created either!

    Note right of PS: The patient table only gets<br/>rows when a DOCTOR manually<br/>creates a patient via the<br/>"Add Patient" button in the UI.
```

> [!CAUTION]
> **Root Cause:** `AuthService.registerPatient()` only saves to the `users` table. There is no Kafka event, no Feign call, and no synchronization mechanism to create a corresponding row in the Patient Service's `patient` table. The Patient Service's `patient` table is only populated when a **Doctor** manually clicks "Add Patient" in the dashboard.

---

## What the Auth Service is Doing Wrong

The Auth Service (`users` table) is currently storing **3 different domain concerns** in one table:

```mermaid
graph LR
    subgraph current["Current: users table (BLOATED)"]
        ID["🔑 Identity<br/>email, password"]
        DOC["🩺 Doctor Profile<br/>name, specialty"]
        PAT["🧑 Patient Identity<br/>name, role=PATIENT"]
    end

    subgraph target["Target: Separated Concerns"]
        ID2["🔑 Auth Service<br/>email, password, role"]
        DOC2["🩺 Doctor Service<br/>name, specialty,<br/>clinic, fees"]
        PAT2["🧑 Patient Service<br/>name, address,<br/>DOB, blood group"]
    end

    current --> target
```

---

## Proposed Architecture (After Transition)

```mermaid
graph TB
    subgraph FE["🖥️ Frontend (Port 3000)"]
        UI["React + Shadcn UI"]
    end

    subgraph GW["🌐 API Gateway (Port 8088)"]
        GWLB["Spring Cloud Gateway<br/>+ JWT Filter"]
    end

    subgraph AS["🔐 Auth Service (Port 8083)"]
        AC["AuthController<br/>login · register · validate<br/>(IDENTITY ONLY)"]
        AS_DB[("PostgreSQL — users<br/>───────────────<br/>id · email<br/>password · role")]
    end

    subgraph DS["🩺 Doctor Service (Port 8086) — NEW"]
        DC["DoctorController<br/>profile CRUD<br/>search by specialty"]
        DS_DB[("PostgreSQL — doctors<br/>───────────────<br/>id · name · email<br/>specialty · experience<br/>clinic_address · fee")]
    end

    subgraph PS["🧑 Patient Service (Port 8080)"]
        PC["PatientController<br/>profile CRUD<br/>medical records"]
        PS_DB[("PostgreSQL — patient<br/>───────────────<br/>id · name · email<br/>address · date_of_birth<br/>registered_date<br/>doctor_email")]
    end

    subgraph APS["📅 Appointment Service (Port 8084)"]
        APC["AppointmentController"]
        APS_DB[("PostgreSQL — appointment")]
    end

    subgraph NS["🔔 Notification Service (Port 8085)"]
        NC["SSE + Email"]
    end

    subgraph BS["💰 Billing Service (Port 9001)"]
        BC["gRPC Server"]
    end

    subgraph K["📨 Apache Kafka"]
        KT0["user-registered topic — NEW"]
        KT1["patient topic (Protobuf)"]
        KT2["appointment-events topic"]
    end

    UI --> GWLB
    GWLB -->|/auth/**| AC
    GWLB -->|/api/doctors/**| DC
    GWLB -->|/api/patient/**| PC
    GWLB -->|/api/appointments/**| APC
    GWLB -->|/api/notifications/**| NC

    AC --- AS_DB
    DC --- DS_DB
    PC --- PS_DB
    APC --- APS_DB

    AC -->|"Publish: user-registered"| KT0
    KT0 -->|"role=USER → create doctor profile"| DC
    KT0 -->|"role=PATIENT → create patient record"| PC

    APC -->|"Feign: /doctors/**"| DC
    PC -->|gRPC| BC
    PC -->|Produce| KT1
    APC -->|Produce| KT2
    KT2 -->|Consume| NC

    style AS_DB fill:#51cf66,stroke:#2b8a3e,color:#fff
    style DS_DB fill:#51cf66,stroke:#2b8a3e,color:#fff
    style PS_DB fill:#51cf66,stroke:#2b8a3e,color:#fff
    style KT0 fill:#ffd43b,stroke:#e67700,color:#333
```

---

## Proposed Signup Flows (Event-Driven)

### Patient Signup (Fixed)
```mermaid
sequenceDiagram
    actor P as Patient
    participant FE as Frontend
    participant GW as API Gateway
    participant AS as Auth Service
    participant K as Kafka
    participant PS as Patient Service
    participant BS as Billing Service

    P->>FE: Fill signup (name, email, password, address, DOB)
    FE->>GW: POST /auth/register-patient
    GW->>AS: Forward
    AS->>AS: Save credentials to users table
    AS->>K: ✅ Publish "user-registered"<br/>{role: PATIENT, email, name}
    AS-->>FE: Return JWT

    K->>PS: Consume event
    PS->>PS: ✅ Auto-create patient row<br/>in patient table
    PS->>BS: ✅ gRPC: createBillingAccount
```

### Doctor Signup (New)
```mermaid
sequenceDiagram
    actor D as Doctor
    participant FE as Frontend
    participant GW as API Gateway
    participant AS as Auth Service
    participant K as Kafka
    participant DS as Doctor Service

    D->>FE: Fill signup (name, email, password, specialty)
    FE->>GW: POST /auth/register
    GW->>AS: Forward
    AS->>AS: Save credentials to users table
    AS->>K: ✅ Publish "user-registered"<br/>{role: USER, email, name, specialty}
    AS-->>FE: Return JWT

    K->>DS: Consume event
    DS->>DS: ✅ Auto-create doctor profile<br/>in doctors table
```

---

## Before vs After

| Aspect | 🔴 Current | 🟢 After Transition |
|---|---|---|
| **Auth Service** | Stores identity + name + specialty | Identity only (email, password, role) |
| **Doctor Data** | In Auth `users` table | Own `Doctor Service` on port 8086 |
| **Patient Signup** | Only saved in `users` table | Auto-synced to `patient` table via Kafka |
| **Billing Account** | Only created on manual "Add Patient" | Auto-created on patient signup |
| **Specialty Lookups** | Feign → Auth Service | Feign → Doctor Service |
| **Total Services** | 6 (Auth, Patient, Appointment, Notification, Billing, Gateway) | 7 (+ Doctor Service) |
| **Coupling** | Auth is a bottleneck | Each domain scales independently |
