import { getPrograms } from '@/lib/wordpress';
import Card from '@/components/Card';

export default async function ProgramsPage() {
    const programs = await getPrograms();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Academic & Research Programs
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Comprehensive curriculum programs for universities and research institutions.
                </p>
            </div>

            {programs.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white rounded-lg border border-dashed">
                    No programs found at the moment.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program) => (
                        <Card key={program.id} post={program} type="programs" />
                    ))}
                </div>
            )}
        </div>
    );
}
