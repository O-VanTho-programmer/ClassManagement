'use client';

import Button from '@/components/Button/Button';
import HeaderAvatar from '@/components/HeaderAvatar/HeaderAvatar';
import { useUser } from '@/context/UserContext';
import { ArrowRight, Shield, User, GraduationCap, Calendar, ClipboardCheck, BookCheck, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {

  const user = useUser();
  const router = useRouter();
  
  const handleGotoDashboardHub = () => {
    router.push('/dashboard/hub');
  }

  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-6">
        <nav className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <img
                src="/logo_only.jpg"
                alt="Class Hub Logo"
                className="h-8 w-8"
              />
            </div>
            <span className="text-xl font-bold text-gray-800">Class Hub</span>
          </div>
          {user ? (
            <HeaderAvatar name={user?.name}/>
          ) : (
            <a
              href="/auth"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              Sign In
              <ArrowRight size={16} />
            </a>
          )}
        </nav>
      </header>

      <main className="flex items-center justify-center min-h-screen pt-24 pb-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">

          <div className="flex flex-col gap-8 text-center lg:text-left items-center lg:items-start">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Your Complete
              <br />
              <span className="text-blue-600">Class Management</span>
              <br />
              Solution
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Manage schedules, track student attendance, and assign homework all in one place. Built for managers, teachers, and students.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
              <RoleCard
                icon={<Shield size={24} className="text-red-600" />}
                title="Manager"
                description="Oversee hub operations"
                href="/dashboard/manager"
              />
              <RoleCard
                icon={<User size={24} className="text-blue-600" />}
                title="Teacher"
                description="Manage your classes"
                href="/dashboard/teacher"
              />
              <RoleCard
                icon={<GraduationCap size={24} className="text-green-600" />}
                title="Student"
                description="View your schedule"
                href="/dashboard/student"
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <img
              src="/banner.png"
              alt="Class Hub application dashboard"
              className="rounded-2xl shadow-xl"
              width={500}
              height={500}
            />

            <Button style='mt-10 text-2xl font-bold px-6! py-4!' color='blue' title='Start Now' onClick={handleGotoDashboardHub}/>
          </div>

        </div>
      </main>

      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem
            icon={<Calendar size={28} className="text-blue-600" />}
            title="Weekly Schedules"
            description="View and manage all class schedules in a clean, interactive calendar."
          />
          <FeatureItem
            icon={<ClipboardCheck size={28} className="text-green-600" />}
            title="Track Attendance"
            description="Easily mark attendance for every class session on a dynamic grid."
          />
          <FeatureItem
            icon={<BookCheck size={28} className="text-indigo-600" />}
            title="Assign Homework"
            description="Create homework in your library and assign it to multiple classes with ease."
          />
        </div>
      </section>

      <footer className="w-full py-6 bg-gray-800">
      </footer>
    </div >
  );
}


interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function RoleCard({ icon, title, description, href }: RoleCardProps) {
  return (
    <a
      href={href}
      className="block p-6 bg-white rounded-xl border border-gray-200 shadow-md hover:border-blue-500 hover:shadow-lg transition-all transform hover:-translate-y-1"
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </a>
  );
}

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-base text-gray-600">{description}</p>
    </div>
  );
}