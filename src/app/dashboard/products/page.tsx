import { getServerSession } from "next-auth/next";
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getEnrollmentsByEmail, getFormEntries, getCourses, getWorkshops, getPagedCourses } from "@/lib/wordpress";
import ProductsView from "@/components/dashboard/ProductsView";
import ProductsSkeleton from "@/components/dashboard/ProductsSkeleton";
import { Package, Users } from 'lucide-react';

export default async function MyProductsPage(props: { searchParams: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/dashboard/login');
  }

  const user = session.user as any;
  const userEmail = user.email!;
  const isAdmin = user.role === 'admin';
  const currentPage = parseInt(searchParams.page || '1', 10);

  return (
    <DashboardLayout 
      role={user.role} 
      userEmail={userEmail}
      userName={user.name}
      userImage={user.image}
    >
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsContent 
            user={user} 
            userEmail={userEmail} 
            isAdmin={isAdmin} 
            page={currentPage} 
        />
      </Suspense>
    </DashboardLayout>
  );
}

async function ProductsContent({ user, userEmail, isAdmin, page }: any) {
  // Fetch data based on role
  let enrollments: any[] = [];
  let workshops: any[] = [];
  let totalPages = 1;
  let totalItems = 0;

  if (isAdmin) {
    // Admin sees everything with pagination - Keep server-side for initial load performance
    const perPage = 12;
    const [coursesData, workshopData] = await Promise.all([
      getPagedCourses({ page, perPage }),
      getWorkshops({ page, perPage })
    ]);
    
    enrollments = coursesData.posts.map(course => ({
      meta: { mlsd4: course.title.rendered, '2dnu4': 'payment_success' },
      title: course.title.rendered,
      created_at: course.date,
      isAdminView: true,
      originalPost: course
    }));

    workshops = workshopData.posts.map(post => ({
      meta: { mlsd4: post.title.rendered },
      created_at: post.date,
      isAdminView: true,
      originalPost: post
    }));

    totalPages = Math.max(coursesData.totalPages, workshopData.totalPages);
    totalItems = coursesData.totalItems + (workshopData.posts.length > 0 ? (workshopData.totalPages * perPage) : 0);
  } else {
    // Regular user: Offload to Client-side fetch in ProductsView as requested
    enrollments = []; // Will be fetched via /api/user/enrollments
    workshops = [];
    totalItems = 0; // Will be updated on client
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <Package size={28} />
                  </div>
                  {isAdmin ? 'Library Catalog' : 'Purchased Products'}
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl text-lg">
                  {isAdmin 
                    ? 'Administrative view: Managing all active curriculum assets across the NanoSchool platform.' 
                    : 'Access and manage all your purchased courses and registered workshop sessions in one unified workspace.'}
              </p>
          </div>
          <div className="flex items-center gap-3">
              <div className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-sm font-bold shadow-sm shadow-slate-200/50">
                  <span className="text-blue-600 mr-1">{totalItems}</span> {isAdmin ? 'Total Products' : 'Assets Available'}
              </div>
          </div>
      </div>

      {isAdmin && (
        <div className="px-8 py-4 rounded-3xl bg-blue-50 border border-blue-100 flex items-center gap-4 text-blue-700 font-bold text-sm shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Users size={18} />
          </div>
          You are browsing as an Administrator. Results are paginated to maintain engine performance.
        </div>
      )}

      {/* Unified Client-side View Section */}
      <ProductsView 
        initialCourses={enrollments} 
        initialWorkshops={workshops} 
        isAdmin={isAdmin}
        currentPage={page}
        totalPages={totalPages}
      />

    </div>
  );
}

