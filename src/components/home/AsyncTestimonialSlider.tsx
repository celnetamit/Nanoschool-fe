import { getFeedbacks } from '@/lib/feedback';
import TestimonialSlider from '@/components/TestimonialSlider';

export default async function AsyncTestimonialSlider() {
    // Await the feedbacks inside this specific Server Component
    // so it doesn't block the rest of the HomePage streaming
    const feedbacks = await getFeedbacks();

    return <TestimonialSlider feedbacks={feedbacks} />;
}
