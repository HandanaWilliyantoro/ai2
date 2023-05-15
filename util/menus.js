import {RxMagnifyingGlass, RxChatBubble, RxPencil2, RxImage, RxMagicWand} from 'react-icons/rx'
import {BsCardList} from 'react-icons/bs'

const menus = [
    {
        label: 'Search',
        slug: '/',
        icon: <RxMagnifyingGlass className='w-3 h-3 ml-2' />,
        premium: false
    },
    {
        label: 'Chat',
        slug: '/chat',
        icon: <RxChatBubble className='w-3 h-3' />,
        premium: false
    },
    {
        label: 'Image',
        slug: '/image',
        icon: <RxImage className='w-3 h-3' />,
        premium: false
    },
    {
        label: 'Write',
        slug: '/write',
        icon: <RxPencil2 className='w-3 h-3' />,
        premium: false
    },
    {
        label: 'Art',
        slug: '/art',
        icon: <RxMagicWand className='w-3 h-3' />,
        premium: false
    },
]

const writeOptions = [
    {"name":"Custom Writer", "slug": 'custom-generator', "specialFeature":false, "description": "Generate custom text for any purpose.", form: [
        {
            placeholder: 'Example: Write an email to my potential investor for my AI business',
            value: "",
            name: 'keywords' ,
            label: 'What do you want to generate?'
        }
    ]},
    {"name":"Grammar Corrector", "description": "Make sure your writing is error-free", "slug":"grammar-corrector","specialFeature":false, form: [
        {
            placeholder: 'Example: I has breakfast this morning',
            value: "",
            name: 'keywords',
            label: 'Text'
        }
    ]},
    {"name":"Blog Generator", "description": "Say goodbye to writer's block with our blog generator!", "slug":"blog-generator","specialFeature":false, form: [
        {
            placeholder: 'Example: The Benefit of Meditation',
            value: "",
            name: 'keywords',
            label: 'Blog Topic'
        },
        {
            placeholder: 'Example: Technology, economics',
            value: "",
            name: 'extra1',
            label: 'Keywords'
        },
    ]},
    {"name":"Paraphraser", "description": "Make your content shine with our easy to use content paraphraser","slug":"content-rewriter","specialFeature":false, form: [
        {
            placeholder: 'Example: Most companies try to stay ahead of the curve',
            value: "",
            name: 'keywords',
            label: 'Content to paraphrase'
        }
    ]},
    {"name":"Paragraph Writer", "description": "Generate paragraph in a single click", "slug":"paragraph-writer","specialFeature":false, form: [
        {
            placeholder: 'Example: How to oprimize your websites',
            value: "",
            name: 'keywords',
            label: 'What the paragraph is about?'
        }
    ]},
    {"name":"Sentence Expander", "description": "Expand you sentence in a single click", "slug":"sentence-expander","specialFeature":false, form: [
        {
            placeholder: 'Example: Expand your sentence in a single click',
            value: "",
            name: 'keywords',
            label: 'Sentence to expand'
        }
    ]},
    {"name":"Content Summarizer", "description": "Get the main point of any text in a single click", "slug":"content-summarizer","specialFeature":false, form: [
        {
            placeholder: 'Write the text here..',
            value: "",
            name: 'keywords',
            label: 'Content'
        }
    ]},
    {"name":"Reply to Message", "description":"Reply to WhatsApp, Slack or any other message", "slug":"reply-to-message","specialFeature":false, form: [
        {
            placeholder: 'Example: Hi Jenny! How did you spend your weekend?',
            value: "",
            name: 'keywords',
            label: 'Message'
        },
        {
            placeholder: 'Example: I went to east coast park with my family',
            value: "",
            name: 'extra1',
            label: 'What do you want to include?'
        },
    ]},
    {"name":"Reply to Email", "description": "Make your email replies more efficient", "slug":"reply-to-email","specialFeature":false, form: [
        {
            placeholder: 'Example: Hi Jenny! How did you spend your weekend?',
            value: "",
            name: 'keywords',
            label: 'Received Email'
        },
        {
            placeholder: 'Example: I went to east coast park with my family',
            value: "",
            name: 'extra1',
            label: 'What do you want to include? (optional)'
        },
    ]},
    {"name":"Press Release", "description": "Create Professional Press Releases in Seconds","slug":"press-release-generator","specialFeature":false, form: [
        {
            placeholder: 'Example: Handana AI',
            value: "",
            name: 'keywords',
            label: 'Product/service Name'
        },
        {
            placeholder: 'Example: Handana AI launch a new product',
            value: "",
            name: 'extra1',
            label: 'What is your press release about?'
        },
        {
            placeholder: 'Example: Artificial Intelligence, Economy',
            value: "",
            name: 'extra2',
            label: 'Keywords'
        },
    ]},
    {"name":"Catchy Tagline", "description":"Create catchy slogans and taglines", "slug":"catchy-tagline","specialFeature":false, form: [
        {
            placeholder: 'Name: (example: Handana AI is a tool with a variety of writing task)',
            value: "",
            name: 'keywords',
            label: 'Tell us about your business or product'
        },
    ]},
    {"name":"Headline Generator", "description":"Make your headlines pop with our headline generator!","slug":"headline-generator","specialFeature":false, form: [
        {
            placeholder: 'example: Website Design',
            value: "",
            name: 'keywords',
            label: 'Article Topic'
        },
    ]},
    {"name":"Job Description", "description":"Quickly generate job descriptions for any position", "slug":"job-description","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
        {
            placeholder: 'Example: Trained in conflict & communication',
            value: "",
            name: 'extra1',
            label: 'Key Skills'
        },
    ]},
    {"name":"Job Summary", "description":"Get a strong, attention-grabbing summary", "slug":"job-summary","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
        {
            placeholder: 'Example: trained in conflict & communication',
            value: "",
            name: 'extra1',
            label: 'Company overview and expectation'
        },
    ]},
    {"name":"Job Qualification", "description":"Generate job qualifications for any job posting", "slug":"job-qualification","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
        {
            placeholder: 'Example: work experience & particular knowledge',
            value: "",
            name: 'extra1',
            label: 'Requirements'
        },
    ]},
    {"name":"Job Responsibilities", "description":"Generate job responsibilities for any job description", "slug":"job-responsibilities","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
        {
            placeholder: 'Specify core responsibilities & day to day activities',
            value: "",
            name: 'extra1',
            label: 'Responsibilites & Duties'
        },
    ]},
    {"name":"Interview Questions", "description": "Make your next interview question a breeze", "slug":"interview-questions","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
    ]},
    {"name":"Interview Feedbacks", "description": "Write Interview Feedback With Ease and Confidence", "slug":"interview-feedbacks","specialFeature":false, form: [
        {
            placeholder: 'Example: accountant',
            value: "",
            name: 'keywords',
            label: 'Job title'
        },
        {
            placeholder: 'Example: Know design patterns & CI/CD pipelines',
            value: "",
            name: 'extra1',
            label: 'Feedback Notes'
        },
    ]},
]

export {
    menus,
    writeOptions,
}