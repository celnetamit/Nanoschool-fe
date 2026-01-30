import DetailView from '@/components/DetailView';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    return <DetailView params={params} type="programs" />;
}
