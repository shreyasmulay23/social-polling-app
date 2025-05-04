'use client';

import React, {useEffect, useRef} from 'react';
import {Button} from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import {useAuth} from "@/context/auth-context";

const HeroSection = () => {
    const imageRef = useRef<HTMLDivElement>(null);

    const {user, isLoading} = useAuth()

    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 100;
            if (imageElement) {
                if (scrollPosition >= scrollThreshold) {
                    imageElement.classList.add('scrolled');
                } else {
                    imageElement.classList.remove('scrolled');
                }
            }

        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    if (isLoading) return null // or loading spinner

    return (
        <div className={'pb-20 px-4'}>
            <div className={'container mx-auto text-center'}>
                <h1 className={'text-5xl md:text-8xl lg:text-[105px] pd-6 gradient-title'}>Create. Vote. Discover.
                    <br/> The easiest way to make decisions, together.</h1>
                <p className={'text-xl text-gray-600 mb-8 max-w-2xl mx-auto'}>Pollify helps you run stunning, real-time
                    polls with live insights — whether you&apos;re gathering opinions, making team decisions, or just having
                    fun.</p>
                <div className={'flex justify-center space-x-4'}>
                    <Link href={!!user ? '/dashboard' : '/login'}> <Button className={'px-8'} size="lg">Get Started</Button></Link>
                </div>
                <div className={'hero-image-wrapper'}>
                    <div ref={imageRef} className={'hero-image'}>
                        <Image src={'/banner.jpg'} width={1280} height={720} alt="Banner"
                               className={'rounded-lg shadow-2xl border mx-auto'}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
