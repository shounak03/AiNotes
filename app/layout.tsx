import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {Toaster} from 'sonner'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Note-Taking App',
  description: 'An AI-powered note-taking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" min-h-screen bg-custom-gradient-1">
          <Header />
          <main className="flex-grow p-10" >
            {children}
          </main>
          <Toaster />
          <Footer />
        </div>
        

      </body>
    </html>
  )
}

