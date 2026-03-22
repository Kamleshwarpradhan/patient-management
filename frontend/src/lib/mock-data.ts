import { Appointment, PatientToday, MonthlyData, WorkingHoursData } from "@/types/types";

export const patientsToday: PatientToday[] = [
    {
        id: "1",
        name: "Zaina Riddle",
        initials: "ZR",
        condition: "Headache",
        time: "",
        hasCheckmark: true,
    },
    {
        id: "2",
        name: "Jakub Tucker",
        initials: "JT",
        condition: "Runny nose",
        time: "10:30",
        avatarColor: "bg-blue-500",
    },
    {
        id: "3",
        name: "Aleksander Craig",
        initials: "AC",
        condition: "Cold",
        time: "11:30",
        avatarColor: "bg-amber-500",
    },
    {
        id: "4",
        name: "Brianna Sears",
        initials: "BS",
        condition: "Flu",
        time: "12:00",
    },
    {
        id: "5",
        name: "Rory Todd",
        initials: "RT",
        condition: "Stomach-ache",
        time: "12:15",
    },
    {
        id: "6",
        name: "Mariyah Mcmahon",
        initials: "MM",
        condition: "Runny nose",
        time: "12:30",
        avatarColor: "bg-purple-500",
    },
    {
        id: "7",
        name: "Austin Camacho",
        initials: "AC",
        condition: "Headache",
        time: "12:55",
    },
];

export const appointments: Appointment[] = [
    {
        id: "1",
        patientName: "Zaina Riddle",
        initials: "ZR",
        status: "First visit",
        date: "May 23",
        time: "5:00 PM",
        payment: "Paid",
    },
    {
        id: "2",
        patientName: "Jakub Tucker",
        initials: "JT",
        status: "Follow-up",
        date: "May 23",
        time: "6:00 PM",
        payment: "Pending",
    },
    {
        id: "3",
        patientName: "Aleksander Craig",
        initials: "AC",
        status: "First visit",
        date: "May 23",
        time: "7:00 PM",
        payment: "Pending",
    },
    {
        id: "4",
        patientName: "Brianna Sears",
        initials: "BS",
        status: "Discharge summary",
        date: "May 24",
        time: "9:00 AM",
        payment: "Paid",
    },
    {
        id: "5",
        patientName: "Rory Todd",
        initials: "RT",
        status: "First visit",
        date: "May 24",
        time: "10:00 AM",
        payment: "Paid",
    },
];

export const monthlyData: MonthlyData[] = [
    { month: "Jan", recovered: 45 },
    { month: "Feb", recovered: 52 },
    { month: "Mar", recovered: 38 },
    { month: "Apr", recovered: 65 },
    { month: "May", recovered: 48 },
    { month: "Jun", recovered: 112 },
    { month: "Jul", recovered: 78 },
    { month: "Aug", recovered: 55 },
    { month: "Sep", recovered: 40 },
    { month: "Oct", recovered: 62 },
    { month: "Nov", recovered: 58 },
    { month: "Dec", recovered: 70 },
];

export const workingHoursData: WorkingHoursData[] = [
    { name: "Patient reception", value: 26, color: "#6C9BFF" },
    { name: "Document processing", value: 10, color: "#FFB86C" },
    { name: "Online consultations", value: 4, color: "#FF79C6" },
];
