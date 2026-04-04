export const revalidate = 3600;

import { getWorkshops, getCategories } from '@/lib/wordpress';
import WorkshopCalendar from '@/components/WorkshopCalendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Workshop Calendar - NanoSchool',
    description: 'View upcoming workshops and training sessions at NanoSchool.',
};

export default async function WorkshopCalendarPage() {
    // Fetch data in parallel
    // Fetching more per page to populate calendar effectively
    const [workshopData, categories] = await Promise.all([
        getWorkshops({ page: 1, perPage: 50 }),
        getCategories()
    ]);

    const { posts: workshops } = workshopData;

    return (
        <div className="bg-gray-50 min-h-screen">
            <WorkshopCalendar workshops={workshops} categories={categories} />
        </div>
    );
}
