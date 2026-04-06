import { getInternships } from '@/lib/internships';
import { notFound } from 'next/navigation';
import InternshipApplyForm from '@/components/forms/InternshipApplyForm';
import Image from 'next/image';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
    const { key } = await params;
    const internships = await getInternships();
    const internship = internships.find(i => i.key === key);

    if (!internship) {
        return { title: 'Registration - Internship Not Found' };
    }

    return {
        title: `Apply for ${internship.title} | NanoSchool`,
        description: `Enroll in our ${internship.title} program. Limited slots available for the upcoming session.`,
    };
}

export default async function InternshipApplyPage({
    params,
}: {
    params: Promise<{ key: string }>;
}) {
    const { key } = await params;
    const internships = await getInternships();
    const internship = internships.find(i => i.key === key);

    if (!internship) {
        notFound();
    }

    // Generate a simple application token
    const applicationId = `int_apl_${Math.floor(Math.random() * 1000) + 1}`;

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">Registration Form</h1>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                        <span className="text-sm font-bold text-slate-600">Registering for: <span className="text-slate-900">{internship.title}</span></span>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden">
                    <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                {internship.image && (
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 flex-shrink-0 shadow-lg">
                                        <Image 
                                            src={internship.image} 
                                            alt={internship.title} 
                                            fill 
                                            className="object-cover" 
                                        />
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Applicant Information</h2>
                                    <p className="text-slate-400 text-sm font-medium">Please provide accurate details to ensure smooth enrollment.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                                <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/10">ID: {internship.code}</div>
                                <div className="bg-teal-500/20 text-teal-300 px-3 py-2 rounded-lg border border-teal-500/20">Ref: {applicationId}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 md:p-12">
                        <InternshipApplyForm 
                            internship={internship} 
                            applicationId={applicationId} 
                        />
                    </div>
                </div>

                <div className="mt-8 text-center text-slate-400 text-sm font-medium">
                    <p>Secured by NanoSchool Encryption • Trusted by 5,000+ Students</p>
                </div>

            </div>
        </div>
    );
}
