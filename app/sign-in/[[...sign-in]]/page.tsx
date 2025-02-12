import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
    return (

        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                    <Image src="/sign-in.webp" alt="background" width="100" height="100" className="absolute inset-0 h-full w-full object-cover" />
                </aside>

                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                >
                    <div className="max-w-xl lg:max-w-3xl flex flex-col items-center justify-center">
                        <a className="block text-blue-600" href="#">
                            <span className="sr-only">Home</span>
                            <Image src="/logo.png" alt="logo" width={200} height={50} />
                        </a>

                        <h1 className="my-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                            Welcome to Squid 
                        </h1>

                        <SignIn />
                    </div>
                </main>
            </div>
        </section>

    )



}