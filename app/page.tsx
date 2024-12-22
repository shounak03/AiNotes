import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-b from-primary to-primary-foreground text-white">
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Note-Taking
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Organize your thoughts, boost your productivity, and unlock new insights with our AI assistant.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Smart Organization</h2>
            <p>Our AI helps you categorize and structure your notes for easy retrieval.</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">AI Insights</h2>
            <p>Get intelligent suggestions and connections between your notes.</p>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Seamless Sync</h2>
            <p>Access your notes from any device, anytime, anywhere.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

