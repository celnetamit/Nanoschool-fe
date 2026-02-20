export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    name: string;
    items: FAQItem[];
}

export const FAQ_DATA: FAQCategory[] = [
    {
        name: 'General',
        items: [
            {
                question: 'What is an online programme? And how does it differ from normal Distance Learning Programme?',
                answer: 'An online programme is a next-level distance learning programme where students study interactive online material via the Internet at their own pace. Examinations are conducted online at the end of the program.'
            },
            {
                question: 'What extra edge does Nano School Club give me?',
                answer: 'It offers self-paced learning, interactive e-Learning Study Material (LMS), e-books, online presentations, videos, quizzes, mentoring support, and certification from the Director of Nano Science and Technology Consortium.'
            },
            {
                question: 'Is NSTC affiliated to UGC/AICTE?',
                answer: 'These training programs do not come under the preview or affiliation of AICTE/UGC. NSTC provides certification training programs similar to other corporate houses and has been active in this area for 15 years.'
            },
            {
                question: 'Does NSTC provide placement assistance?',
                answer: 'Yes, NSTC has an in-house placement division that guides participants in preparing resumes, interview techniques, and arranging interviews with potential companies.'
            },
            {
                question: 'Who will benefit from NSTC’s online programmes?',
                answer: 'Students, graduates, post-graduates, and PhD holders in scientific disciplines, as well as experienced professionals, academicians, and researchers.'
            }
        ]
    },
    {
        name: 'Courses',
        items: [
            {
                question: 'What kind of courses do you offer on your platform?',
                answer: 'A wide range of courses in science and technology, including emerging technologies, nanotechnology, biotechnology, etc.'
            },
            {
                question: 'Are the courses free or paid?',
                answer: 'The courses are paid to ensure top-quality education with the latest technology and interactive learning tools.'
            },
            {
                question: 'How long does a course usually last?',
                answer: 'Most courses typically last between four to twelve weeks.'
            },
            {
                question: 'Are the courses interactive or just pre-recorded lectures?',
                answer: 'Learners access an e-Learning Management System (e-LMS) which includes interactive materials accessible anytime.'
            },
            {
                question: 'Are the courses taught by industry experts?',
                answer: 'Yes, the courses are designed and provided through the e-LMS by industry experts with extensive experience.'
            }
        ]
    },
    {
        name: 'Registration Process',
        items: [
            {
                question: 'How do I register?',
                answer: 'Visit the website, click "Enroll Now," select "Online Courses," choose your course, and complete the contact and payment information.'
            },
            {
                question: 'When should I register?',
                answer: 'Most courses are offered four times a year. It is recommended to register early as some courses fill up quickly.'
            },
            {
                question: 'Can I get a refund if I am unable to attend my Online Course?',
                answer: 'Full tuition refunds require cancellation via email to courses@skillzip.com at least 5 business days before the course start date.'
            }
        ]
    },
    {
        name: 'Course Completion',
        items: [
            {
                question: 'I completed my course! Now what?',
                answer: 'You will have 90 days of read-only access to materials and are eligible for a digital verified certificate (via Accredible) within 3 weeks of completion.'
            },
            {
                question: 'Can I audit an Online Course?',
                answer: 'Yes, you can choose to participate without receiving a certificate by notifying the instructor at the start of the course.'
            },
            {
                question: 'Can I put my Online Course(s) toward a professional certificate or degree program?',
                answer: 'Courses are intended to deepen knowledge but cannot be formally applied as credits to other institutions\' degree programs.'
            }
        ]
    },
    {
        name: 'Technical',
        items: [
            {
                question: 'Do I need a Computer for NSTC’s online programmes?',
                answer: 'Yes, access to a computer with an internet connection is required.'
            },
            {
                question: 'What type of Internet connection do I require?',
                answer: 'A dial-up or Broadband connection is sufficient for accessing study material and appearing for tests.'
            }
        ]
    },
    {
        name: 'Mentorship',
        items: [
            {
                question: 'What does NSTC stand for?',
                answer: 'Nanoscience and Technology Consortium of India, established in 2006.'
            },
            {
                question: 'Is there a Registration fee for becoming a Mentor?',
                answer: 'Registration is absolutely free of charge.'
            },
            {
                question: 'Who can become a Mentor with NSTC?',
                answer: 'Individuals with a PhD, five or more years of experience, and a reputable position in an institute or company. Outstanding achievement records may also be considered.'
            },
            {
                question: 'What is the procedure to become a Mentor?',
                answer: 'Register in the Mentorship section under "Opportunities," fill out the form, undergo a background check/sample presentation, and sign a consent form.'
            },
            {
                question: 'How do Mentors get rewarded?',
                answer: 'Mentors receive remuneration based on a prior agreement. Payments are transferred directly to bank accounts within 15 days of event completion.'
            },
            {
                question: 'What kind of mentoring opportunities do you offer?',
                answer: 'Virtual skill workshops, online self-paced courses, consultancy, industry projects, and judging competitions.'
            },
            {
                question: 'Can I mentor on your platform if I am based outside of India?',
                answer: 'Yes, international mentors are welcome and receive remuneration via PayPal or direct bank transfer.'
            }
        ]
    }
];
