import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Outfit } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
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