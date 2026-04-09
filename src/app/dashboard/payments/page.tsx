import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminPaymentsView from '@/components/dashboard/AdminPaymentsView';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminPaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || (session.user as any).role !== 'admin') {
    redirect('/dashboard/login');
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
      <AdminPaymentsView />
    </DashboardLayout>
  );
}
