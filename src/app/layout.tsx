import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'শুভ বিবাহ — রোকন ❤ ইভা',
  description: 'মোঃ রোকন হাসান ও জাকিয়া সুলতানা ইভার শুভ বিবাহ। গায়ে হলুদ: ২১ মার্চ · বর যাত্রা: ২৩ মার্চ · বৌ-ভাত: ২৭ মার্চ ২০২৬।',
  openGraph: {
    title: 'শুভ বিবাহ — রোকন ❤ ইভা',
    description: 'বৌ-ভাত: ২৭ মার্চ ২০২৬ | হাওলাদার কমিউনিটি সেন্টার, ঠাকুরগাঁও',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  )
}
