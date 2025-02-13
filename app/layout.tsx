import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Outfit } from 'next/font/google'
 
export const metadata = {
  title: "BudgeX | Budget Tracker",
  description: "Track Smart, Spend Wise, Save More!",
  icons: {
      icon: "/favicon.png",
  },
};

const outfit = Outfit({
  subsets: ['latin'],
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}