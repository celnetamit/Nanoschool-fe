import React from 'react';

interface WorkshopJsonLdProps {
    workshop: any;
    siteUrl?: string;
}

export default function WorkshopJsonLd({ workshop, siteUrl = 'https://courses.nanoschool.in' }: WorkshopJsonLdProps) {
    if (!workshop) return null;

    const slug = workshop.slug;
    const isPastEvent = new Date(workshop.date).getTime() < Date.now();
    const availability = isPastEvent ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock';

    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        'name': workshop.title.rendered,
        'description': workshop.excerpt.rendered.replace(/<[^>]*>?/gm, ''),
        'image': workshop._embedded?.['wp:featuredmedia']?.[0]?.source_url,
        'startDate': workshop.date,
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
        'location': {
            '@type': 'VirtualLocation',
            'url': `${siteUrl}/workshops/${slug}`
        },
        'organizer': {
            '@type': 'Organization',
            'name': 'NanoSchool',
            'url': siteUrl
        },
        'offers': {
          '@type': 'Offer',
          'url': `${siteUrl}/workshops/${slug}`,
          'availability': availability,
          'category': 'Professional Workshop'
        }
    };

    const workshopName = workshop.title.rendered.replace(/<[^>]*>?/gm, '');
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {
                '@type': 'Question',
                'name': `Will I get a certificate after completing the ${workshopName} workshop?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, all participants who successfully complete the ${workshopName} workshop will receive a verifiable digital certificate from NanoSchool.`
                }
            },
            {
                '@type': 'Question',
                'name': `Are the sessions for ${workshopName} recorded?`,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': `Yes, registered participants will get access to session recordings for review and future reference.`
                }
            }
        ]
    };

    // We output an array of graph nodes so the validator sees both schemas parsed neatly
    const combinedSchema = {
        '@context': 'https://schema.org',
        '@graph': [eventSchema, faqSchema]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
        />
    );
}
