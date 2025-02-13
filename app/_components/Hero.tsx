import Image from 'next/image'
import React from 'react'

function Hero() {
    return (
        <section className="bg-gray-50 flex flex-col items-center justify-center">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Track Smart, Spend Wise
                        <strong className="font-extrabold text-primary sm:block"> Save More! </strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Take Control of Your Finance with Ease!
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            className="block w-full rounded-sm bg-primary px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-white hover:text-primary font-semibold border-2 border-primary focus:ring-3 focus:outline-hidden sm:w-auto"
                            href="/sign-up"
                        >
                            Get Started
                        </a>

                        
                    </div>
                </div>
            </div>
            <Image src="/dashboard.png" alt="dashboard" width={1000} height={500} className='mt-5 rounded-lg mb-7' />
        </section>
    )
}

export default Hero