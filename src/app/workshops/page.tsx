import { getWorkshops, getCategories } from '@/lib/wordpress';
import WorkshopList from '@/components/WorkshopList';
import { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
    title: 'Online Hands-on Workshops & Training | NanoSchool',
    description: 'Join our intensive hands-on workshops in AI, Biotech, and Nanotech. Get practical, real-world experience. View upcoming schedules and secure your seat today.',
    openGraph: {
        title: 'Online Hands-on Workshops & Training | NanoSchool',
        description: 'Join our intensive hands-on workshops in AI, Biotech, and Nanotech.',
        type: 'website',
    },
};

// Generic AEO-optimized FAQs for Workshops
const workshopFAQs = [
    {
        question: "Are these workshops live or recorded?",
        answer: "All our workshops are conducted live by industry experts to ensure interactive, hands-on learning and real-time Q&A sessions. Recordings are typically provided after the session for your reference."
    },
    {
        question: "Do I receive a certificate upon completion?",
        answer: "Yes, you will receive a verifiable digital certificate of completion from NanoSchool that you can showcase on your professional profiles like LinkedIn."
    },
    {
        question: "Who can attend NanoSchool workshops?",
        answer: "Our workshops are designed for students, academicians, researchers, and professionals looking to upskill in cutting-edge domains like Artificial Intelligence, Biotechnology, and Nanotechnology."
    },
    {
        question: "Is there any prerequisite for joining?",
        answer: "Most of our foundational workshops do not require strictly advanced prerequisites, but basic familiarity with the domain is helpful. Specific prerequisites, if any, are listed on the individual workshop page."
    }
];

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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://courses.nanoschool.in';

    // Generate ItemList schema for SEO
    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'itemListElement': workshops.map((workshop: any, index: number) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'url': `${siteUrl}/workshops/${workshop.slug}`,
            'name': workshop.title.rendered
        }))
    };

    return (
        <>
            <JsonLd data={itemListSchema} />
            <WorkshopList
                workshops={workshops}
                categories={categories}
                categoryId={categoryId}
                currentPage={page}
                totalPages={totalPages}
                faqs={workshopFAQs}
            />
        </>
    );
}
