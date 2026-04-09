import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CertificationsView from "@/components/dashboard/CertificationsView";

export default async function CertificatesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
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
      <div className="max-w-[1600px] mx-auto">
        <CertificationsView />
      </div>
    </DashboardLayout>
  );
}
