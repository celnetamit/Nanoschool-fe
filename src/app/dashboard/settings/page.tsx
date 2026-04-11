import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import SystemSettingsView from '@/components/dashboard/SystemSettingsView';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/dashboard/login');
  }

  const role = (session.user as any).role || 'user';
  
  if (role !== 'admin') {
    redirect('/dashboard');
  }

  const userEmail = session.user.email!;
  const userName = session.user.name || undefined;
  const userImage = session.user.image || undefined;

  return (
    <DashboardLayout 
      role="admin"
      userEmail={userEmail}
      userName={userName}
      userImage={userImage}
    >
      <SystemSettingsView />
    </DashboardLayout>
  );
}
