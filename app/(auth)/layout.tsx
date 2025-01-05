import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-custom-gradient-3">
  
          <main className="flex items-center justify-center min-h-screen">
            {children}
          </main>
          <Toaster />
        </div>
        

      </body>
    </html>
  )
}
