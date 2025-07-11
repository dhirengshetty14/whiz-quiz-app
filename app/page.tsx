
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Users, Zap, Trophy, Clock, Target, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-600/10"></div>
        
        <div className="relative flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo and Branding */}
            <div className="flex items-center justify-center mb-6 animate-bounce-gentle">
              <div className="bg-gradient-whiz p-4 rounded-2xl shadow-xl mr-4">
                <Brain className="h-12 w-12 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 text-shadow">
                  Whiz<span className="text-transparent bg-gradient-whiz bg-clip-text">Quiz</span>
                </h1>
                <p className="text-lg font-medium text-gray-600 mt-1">
                  AI-Powered Quiz Fun 🎯
                </p>
              </div>
            </div>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
              Create <span className="font-bold text-blue-600">AI-generated quizzes</span> instantly 
              or join friends for an epic battle of wits! Choose from 10 exciting topics and 
              compete in <span className="font-bold text-orange-600">real-time</span> 🚀
            </p>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              <Card className="card-whiz group animate-slide-in hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <div className="bg-gradient-accent p-3 rounded-xl mr-4 group-hover:animate-wiggle">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900">Host a Quiz</div>
                      <div className="text-sm font-normal text-gray-600">Be the QuizMaster!</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 mb-6 text-lg">
                    🎮 Create your quiz session, pick your favorite topic, and watch friends join the fun
                  </p>
                  <Link href="/create">
                    <Button size="lg" className="btn-whiz w-full text-lg">
                      Create New Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="card-whiz group animate-slide-in hover-lift" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center text-2xl">
                    <div className="bg-gradient-success p-3 rounded-xl mr-4 group-hover:animate-wiggle">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900">Join a Quiz</div>
                      <div className="text-sm font-normal text-gray-600">Ready to compete?</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-gray-700 mb-6 text-lg">
                    🎯 Enter a session code and jump into the action - may the best brain win!
                  </p>
                  <Link href="/join">
                    <Button size="lg" className="btn-accent w-full text-lg">
                      Join Existing Quiz
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-5xl mx-auto">
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 animate-fade-in">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">10 Topics</h3>
                <p className="text-sm text-gray-600">From Sports to Science, we've got you covered!</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-xl w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">15 Seconds</h3>
                <p className="text-sm text-gray-600">Think fast! Each question is timed for maximum thrill</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Real-time</h3>
                <p className="text-sm text-gray-600">Watch the leaderboard update live as you play</p>
              </div>
              
              <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/80 transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">AI-Powered</h3>
                <p className="text-sm text-gray-600">Smart questions generated just for your session</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-orange-600 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-black mb-2">8</div>
              <div className="text-blue-100">Questions per Quiz</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-black mb-2">10</div>
              <div className="text-blue-100">Exciting Topics</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-black mb-2">15</div>
              <div className="text-blue-100">Seconds per Question</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-black mb-2">∞</div>
              <div className="text-blue-100">Fun Guaranteed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-white/30 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Ready to test your knowledge? Create a quiz or join one now! 🧠✨
          </p>
        </div>
      </div>
    </div>
  )
}
