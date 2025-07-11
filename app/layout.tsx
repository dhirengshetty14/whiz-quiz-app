
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhizQuiz - AI-Powered Quiz Fun',
  description: 'Create and play exciting AI-powered quizzes with friends. Choose from 10 topics and compete in real-time!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
          {children}
        </div>
      </body>
    </html>
  )
}
