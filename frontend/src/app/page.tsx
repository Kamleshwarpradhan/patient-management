"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Users,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  UserPlus,
  ClipboardList,
  TrendingUp,
  Star,
  Zap,
  Clock,
  FileText,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.push("/dashboard");
      return;
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ─── Navbar ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-b border-gray-100"
            : "bg-transparent"
          }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PatientHub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-50/40 blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Zap className="h-3.5 w-3.5" />
            Simplify your clinical workflow
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Streamline Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Medical Practice
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed md:text-xl">
            The all-in-one platform for managing patients, scheduling appointments,
            and tracking analytics — so you can focus on what matters most: your patients.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Setup in minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-amber-500" />
              <span>Trusted by 500+ doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="relative py-24 bg-gradient-to-b from-gray-50/80 to-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                manage your clinic
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful tools designed specifically for healthcare professionals
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Users,
                title: "Patient Management",
                desc: "Complete patient records with search, create, update and organize all in one place.",
                color: "from-blue-500 to-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
              },
              {
                icon: CalendarDays,
                title: "Smart Scheduling",
                desc: "Intuitive calendar with appointment tracking, reminders, and scheduling tools.",
                color: "from-emerald-500 to-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Real-time insights on patient trends, recovery rates, and practice performance.",
                color: "from-purple-500 to-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100",
              },
              {
                icon: ShieldCheck,
                title: "Secure & Reliable",
                desc: "Enterprise-grade security with JWT authentication and role-based access control.",
                color: "from-amber-500 to-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-100",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`group relative rounded-2xl border ${feature.border} ${feature.bg}/30 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/[0.04] hover:-translate-y-1 hover:bg-white`}
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg shadow-black/10`}
                >
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Get started in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                3 simple steps
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Up and running in less than 5 minutes
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: UserPlus,
                title: "Create Your Account",
                desc: "Sign up with your email and start your free trial. No credit card required.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                step: "02",
                icon: ClipboardList,
                title: "Add Your Patients",
                desc: "Import or manually add patient records with our intuitive interface.",
                color: "from-indigo-500 to-purple-500",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Track & Grow",
                desc: "Monitor analytics, manage appointments, and grow your practice effortlessly.",
                color: "from-purple-500 to-pink-500",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center group">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br border border-gray-100 shadow-lg shadow-black/[0.06] transition-all group-hover:shadow-xl group-hover:-translate-y-1"
                  style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                >
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                    <item.icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <div className="mb-2 text-xs font-bold text-gray-300 tracking-widest uppercase">
                  Step {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center text-white">
            {[
              { value: "500+", label: "Active Doctors" },
              { value: "50K+", label: "Patients Managed" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Capabilities List ─── */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
                Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  modern clinics
                </span>
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Whether you&apos;re a solo practitioner or running a multi-doctor clinic,
                PatientHub adapts to your workflow.
              </p>
              <div className="space-y-4">
                {[
                  "Complete patient CRUD with search and filtering",
                  "Role-based access control (Admin, Doctor, Staff)",
                  "Real-time patient statistics and charts",
                  "Interactive appointment calendar",
                  "Microservices architecture for scalability",
                  "Secure JWT-based authentication",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Preview Card */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8 shadow-xl shadow-black/[0.04]">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Analytics Dashboard</div>
                    <div className="text-xs text-gray-400">Real-time insights</div>
                  </div>
                </div>
                {/* Mini stat cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Total Patients", value: "492", icon: Users, color: "text-blue-500" },
                    { label: "This Month", value: "+28", icon: TrendingUp, color: "text-green-500" },
                    { label: "Appointments", value: "12", icon: CalendarDays, color: "text-purple-500" },
                    { label: "Reports", value: "8", icon: FileText, color: "text-amber-500" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-3.5">
                      <s.icon className={`h-4 w-4 ${s.color} mb-2`} />
                      <div className="text-xl font-bold">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="rounded-3xl border border-gray-200 bg-white p-12 shadow-2xl shadow-black/[0.04]">
            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <HeartPulse className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to transform your practice?
            </h2>
            <p className="mb-8 text-gray-500 text-lg max-w-lg mx-auto">
              Join hundreds of doctors already using PatientHub to manage their patients more efficiently.
            </p>
            <Link
              href="/signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-100 bg-white py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <HeartPulse className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">PatientHub</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/login" className="hover:text-gray-600 transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-gray-600 transition-colors">Sign Up</Link>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
            <p className="text-xs text-gray-400">
              © 2026 PatientHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
