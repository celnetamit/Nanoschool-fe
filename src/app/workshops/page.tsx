import { getWorkshops, getCategories } from '@/lib/wordpress';
import WorkshopList from '@/components/WorkshopList';

export default async function WorkshopsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page) : 1;
    const categoryId = typeof resolvedParams.category === 'string' ? parseInt(resolvedParams.category) : 0;

    // Only show these specific workshop categories
    const ALLOWED_CATEGORY_IDS = [5088, 5059, 5085]; // AI, Biotech, Nanotech

    // Fetch data in parallel
    const [workshopData, allCategories] = await Promise.all([
        getWorkshops({ page, perPage: 9, category: categoryId }),
        getCategories()
    ]);

    // Filter categories to only show AI, Biotechnology, and Nanotechnology workshops
    const categories = allCategories.filter(cat => ALLOWED_CATEGORY_IDS.includes(cat.id));

    const { posts: workshops, totalPages } = workshopData;

    return (
        <WorkshopList
            workshops={workshops}
            categories={categories}
            categoryId={categoryId}
            currentPage={page}
            totalPages={totalPages}
        />
    );
}
