'use client';

import {featuresData, howItWorksData, statsData, testimonialsData} from '@/data/landing';
import HeroSection from "@/components/hero";
import {Card, CardContent} from '@/components/ui/card';
import Link from 'next/link';
import {Button} from "@/components/ui/button";
import {useAuth} from "@/context/auth-context";


export default function Home() {
    const {user, isLoading} = useAuth()

    if (isLoading) return null // or loading spinner

    return (
        <div className={'mt-[100px]'}>
            <HeroSection/>
            <section className={'py-20 bg-blue-50'}>
                <div className={'container mx-auto px-4'}>
                    <div className={'grid grid-cols-2 md:grid-cols-4 gap-8'}>
                        {statsData.map((item, index) => (
                            <div key={index} className={'text-center'}>
                                <div className={'text-4xl font-bold text-blue-600 mb-2'}>{item.value}</div>
                                <div className={'text-gray-600'}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className={'py-20'}>
                <div className={'container mx-auto px-4'}>
                    <h2 className={'text-3xl font-bold text-center mb-12'}>Everything You Need to Know</h2>
                    <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}>
                        {featuresData.map((item, index) => (
                            <Card key={index} className={'p-6'}>
                                <CardContent className={'space-y-4 pt-4'}>
                                    {item.icon}
                                    <h3 className={'text-xl font-semibold'}>{item.title}</h3>
                                    <p className={'text-gray-600'}>{item.description}</p>
                                </CardContent>

                            </Card>

                        ))}
                    </div>
                </div>
            </section>
            <section className={'py-20 bg-blue-50'}>
                <div className={'container mx-auto px-4'}>
                    <h2 className={'text-3xl font-bold text-center mb-16'}>How It Works</h2>
                    <div className={'grid grid-cols-1 md:grid-cols-3 gap-8'}>
                        {howItWorksData.map((item, index) => (
                            <div key={index} className={'text-center'}>
                                <div
                                    className={'w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6'}>
                                    {item.icon}
                                </div>
                                <h3 className={'text-xl font-semibold mb-4'}>{item.title}</h3>
                                <p className={'text-gray-600'}>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className={'py-20'}>
                <div className={'container mx-auto px-4'}>
                    <h2 className={'text-3xl font-bold text-center mb-12'}>What our users say</h2>
                    <div className={'grid grid-cols-1 md:grid-cols-3 gap-8'}>
                        {testimonialsData.map((item, index) => (
                            <Card key={index} className={'p-6'}>
                                <CardContent className={' pt-4'}>
                                    <div className={'flex items-center mb-4'}>
                                        <img src={item.image} alt={item.name} width={40} height={40}
                                               className={'rounded-full'}/>
                                        <div className={'ml-4'}>
                                            <div className={'font-semibold'}>{item.name}</div>
                                            <div className={'text-sm text-gray-600'}>{item.role}</div>
                                        </div>
                                    </div>
                                    <p className={'text-gray-600'}>{item.quote}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
            <section className={'py-20 bg-blue-600'}>
                <div className={'container mx-auto px-4 text-center'}>
                    <h2 className={'text-3xl font-bold text-center mb-4 text-white'}>Ready to take control of your
                        polls?</h2>
                    <p className={'text-blue-100 mb-8 max-w-2xl mx-auto'}>
                        Empower your voice and your audience. Create, share, and analyze polls effortlessly—all from one
                        sleek, powerful dashboard.
                    </p>
                    <Link href={user ? '/dashboard' : '/login'}>
                        <Button size={'lg'} className={'bg-white text-blue-600 hover:bg-blue-50 animate-bounce'}>Start
                            Free Trial</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
