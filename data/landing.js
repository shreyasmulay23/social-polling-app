import {
    Activity,
    BarChart3,
    LayoutDashboard,
    LineChart,
    PencilLine,
    Send,
    ShieldCheck,
    Smartphone,
    UserPlus
} from 'lucide-react';

// Stats Data
export const statsData = [
    {
        value: '10K+',
        label: 'Active Poll Creators'
    },
    {
        value: '250K+',
        label: 'Votes Cast'
    },
    {
        value: '99.9%',
        label: 'Uptime'
    },
    {
        value: '4.9/5',
        label: 'User Rating'
    }
];

// Features Data
export const featuresData = [
    {
        icon: <LayoutDashboard className="h-8 w-8 text-blue-600"/>,
        title: 'Live Poll Dashboard',
        description:
            'Track engagement, votes, and insights in one place.'
    },
    {
        icon: <PencilLine className="h-8 w-8 text-blue-600"/>,
        title: 'Create in Seconds',
        description:
            'Intuitive poll creation with options, themes & visibility settings.'
    },
    {
        icon: <Smartphone className="h-8 w-8 text-blue-600"/>,
        title: 'Mobile-First Experience',
        description: 'Fully responsive — vote or create polls on the go.'
    },
    {
        icon: <Activity className="h-8 w-8 text-blue-600"/>,
        title: 'Realtime Voting',
        description: 'See results as they happen, no refresh needed.'
    },
    {
        icon: <ShieldCheck className="h-8 w-8 text-blue-600"/>,
        title: 'Privacy Controls',
        description: 'Decide who can vote — public or private, it\'s your call.'
    },
    {
        icon: <BarChart3 className="h-8 w-8 text-blue-600"/>,
        title: 'Insights & Analytics',
        description: 'Discover what your audience really thinks with rich insights.'
    }
];

// How It Works Data
export const howItWorksData = [
    {
        icon: <UserPlus className="h-8 w-8 text-blue-600"/>,
        title: '1. Create Your Account',
        description:
            'Sign up in seconds — no complex setup, no fluff.'
    },
    {
        icon: <Send className="h-8 w-8 text-blue-600"/>,
        title: '2. Build & Share Polls',
        description:
            'Add your questions, customize, and send the link. That’s it.'
    },
    {
        icon: <LineChart className="h-8 w-8 text-blue-600"/>,
        title: '3. Get Instant Insights',
        description:
            'Watch votes roll in live and view detailed analytics to make smarter decisions.'
    }
];

// Testimonials Data
export const testimonialsData = [
    {
        name: 'Sarah Johnson',
        role: 'Product Manager, Votedge',
        image: 'https://randomuser.me/api/portraits/women/75.jpg',
        quote:
            'Pollify helped us get real-time insights from our users in minutes. The intuitive dashboard and beautiful UI made it a breeze for my entire team.'
    },
    {
        name: 'Michael Chen',
        role: 'Founder, StartupSphere',
        image: 'https://randomuser.me/api/portraits/men/75.jpg',
        quote:
            'We embedded Pollify in our beta launch, and the feedback loop was game-changing. It’s like running a focus group, but way faster and more efficient.'
    },
    {
        name: 'Emily Rodriguez',
        role: 'Community Lead, DevTalks India',
        image: 'https://randomuser.me/api/portraits/women/74.jpg',
        quote:
            'I’ve used many polling tools, but Pollify stands out for its simplicity and real-time analytics. It’s now our go-to for event feedback and live decisions.'
    }
];