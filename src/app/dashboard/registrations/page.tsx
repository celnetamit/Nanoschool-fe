import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RegistrationsView from "@/components/dashboard/RegistrationsView";

export default async function RegistrationsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    redirect('/dashboard/login');
  }

  const user = session.user as any;

  return (
    <DashboardLayout 
      role={user.role} 
      userEmail={user.email!}
      userName={user.name}
      userImage={user.image}
    >
      <div className="space-y-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Unified Registry
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl text-lg">
            Audit and manage every touchpoint across the NanoSchool ecosystem, from initial course inquiries to verified internship success.
          </p>
        </div>
        
        <RegistrationsView />
      </div>
    </DashboardLayout>
  );
}
