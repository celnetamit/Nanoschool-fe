import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminPaymentsView from '@/components/dashboard/AdminPaymentsView';
import StudentPaymentsView from '@/components/dashboard/StudentPaymentsView';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function PaymentsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/dashboard/login');
  }

  const role = (session.user as any).role || 'user';
  const userEmail = session.user.email!;
  const userName = session.user.name || undefined;
  const userImage = session.user.image || undefined;

  return (
    <DashboardLayout 
      role={role as 'admin'|'user'} 
      userEmail={userEmail}
      userName={userName}
      userImage={userImage}
    >
      {role === 'admin' ? (
        <AdminPaymentsView />
      ) : (
        <StudentPaymentsView />
      )}
    </DashboardLayout>
  );
}
