import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminView from '@/components/dashboard/AdminView';
import UserView from '@/components/dashboard/UserView';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('ns_role')?.value;
  const user = cookieStore.get('ns_user')?.value;

  // Protect the route
  if (!role || !user) {
    redirect('/dashboard/login');
  }

  return (
    <DashboardLayout role={role as 'admin'|'user'} userEmail={user}>
      {role === 'admin' ? (
        <AdminView />
      ) : (
        <UserView userEmail={user} />
      )}
    </DashboardLayout>
  );
}
