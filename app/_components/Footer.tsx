import { format } from 'date-fns'
import Image from 'next/image'
import React from 'react'

function Footer() {
    const year = format(new Date(), "yyyy")
    return (
        <footer className="bg-gray-100">
            <div className=" mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">


                <div className="w-full flex gap-2 justify-between items-center">
                    <div>
                        <Image src="/logo.png" alt="logo" width={200} height={50} />
                    </div>

                    <div>
                        <p className="mx-auto ml-3 text-center text-xl font-semibold leading-relaxed text-primary lg:text-right">
                            Track Smart, Spend Wise, Save More! <br /> Take Control of Your Finance with Ease!
                        </p>
                    </div>
                </div>

                <p className="mt-12 text-center text-sm text-gray-500">
                    Copyright &copy; {year}. All rights reserved.
                </p>
            </div>
        </footer>

    )
}

export default Footer