
# 🧠 WhizQuiz - AI-Powered Multiplayer Quiz Platform

> **Turn any topic into an engaging quiz experience with the power of AI!**

Hey there! 👋 Welcome to WhizQuiz - a real-time multiplayer quiz platform that I built because honestly, I was tired of boring static quizzes. This thing uses AI to generate fresh questions on the fly, supports multiple players in real-time, and actually looks pretty good too (if I do say so myself).

## 🚀 What Makes This Special?

WhizQuiz isn't just another quiz app. Here's what makes it tick:

- **🤖 AI-Powered Questions**: No more manually creating questions! Just pick a topic and let the AI cook up some brain-teasers
- **⚡ Real-Time Multiplayer**: Everyone plays together - no waiting, no lag, just pure quiz action
- **🎯 10 Diverse Topics**: From Sports to Science, Technology to Travel - there's something for everyone
- **📱 Responsive Design**: Works seamlessly on phones, tablets, and desktops (because who doesn't quiz on mobile?)
- **🏆 Live Leaderboards**: See how you stack up against friends in real-time
- **🔗 Easy Sharing**: One-click share links that actually work (yes, even the clipboard stuff!)

## 🛠️ Tech Stack

I went with the modern stack approach here - no regrets:

### Frontend
- **Next.js 14** - App Router, because the old way was getting stale
- **TypeScript** - Life's too short for runtime errors
- **Tailwind CSS** - Utility-first styling that just works
- **Radix UI** - Accessible components that don't fight you
- **Framer Motion** - Smooth animations that feel natural
- **React Hook Form** - Form handling without the headaches

### Backend
- **PostgreSQL** - Reliable, powerful, and plays nice with everything
- **Prisma ORM** - Database queries that actually make sense
- **LLM API Integration** - The secret sauce for question generation

### Deployment & Tools
- **Vercel-Ready** - Built with deployment in mind
- **ESLint + Prettier** - Code stays clean automatically
- **TypeScript** - Did I mention type safety? Yeah, it's everywhere

## 🏃‍♂️ Quick Start

### Prerequisites

Before you dive in, make sure you have:
- Node.js 18+ (18.17.0 or higher)
- PostgreSQL database (local or hosted)
- Git (obviously)
- A decent code editor (VS Code is my go-to)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/whizquiz.git
   cd whizquiz
   ```

2. **Install dependencies**
   ```bash
   cd app
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the `app` directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/whizquiz"
   
   # AI API (contact me for access)
   ABACUSAI_API_KEY="your-api-key-here"
   
   # NextAuth (generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma db push
   
   # (Optional) Seed with sample data
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

That's it! Head over to `http://localhost:3000` and start creating quizzes! 🎉

## 📖 How to Use

### Creating a Quiz
1. Click "Create Quiz" on the homepage
2. Enter your name as the host
3. Pick a topic from our curated list
4. Wait for the AI to generate questions (usually takes 10-15 seconds)
5. Share the room code with friends
6. Start the quiz when everyone's ready!

### Joining a Quiz
1. Click "Join Quiz" on the homepage
2. Enter the room code (it's that 6-character thing)
3. Add your name
4. Wait in the lobby for the host to start
5. Answer questions as fast as you can!

### Pro Tips
- **Speed matters**: You get bonus points for quick answers
- **Share smartly**: Use the copy link button - it handles all the clipboard nonsense
- **Mobile-friendly**: The UI adapts to your screen size, so quiz anywhere
- **Real-time updates**: Everything syncs automatically - no need to refresh

## 🏗️ Project Structure

Here's how I organized everything (because structure matters):

```
whizquiz/
├── app/
│   ├── app/                    # Next.js 14 app directory
│   │   ├── api/               # API routes
│   │   │   ├── generate-questions/  # AI question generation
│   │   │   └── sessions/      # Session management
│   │   ├── create/            # Quiz creation page
│   │   ├── join/              # Join quiz page
│   │   ├── quiz/[code]/       # Dynamic quiz routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── ui/               # Radix UI components
│   │   ├── quiz-question.tsx  # Question display
│   │   └── quiz-timer.tsx     # Timer component
│   ├── lib/                   # Utilities and types
│   │   ├── db.ts             # Database connection
│   │   ├── types.ts          # TypeScript definitions
│   │   └── utils.ts          # Helper functions
│   ├── prisma/               # Database schema
│   └── hooks/                # Custom React hooks
└── README.md                 # You are here!
```

## 🎨 Design Philosophy

I wanted WhizQuiz to feel modern but not intimidating. The design system uses:
- **Gradient backgrounds** that aren't too busy
- **Consistent spacing** using Tailwind's system
- **Accessible colors** that work for everyone
- **Smooth animations** that enhance (not distract from) the experience
- **Mobile-first approach** because that's where people actually use apps

## 🔧 Development

### Running Tests
```bash
# Type checking
yarn build

# Linting
yarn lint
```

### Database Management
```bash
# View your data
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your-migration-name
```

### Environment Setup
The app expects these environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `ABACUSAI_API_KEY`: For AI question generation
- `NEXTAUTH_SECRET`: For session management
- `NEXTAUTH_URL`: Your app's URL

## 🚨 Troubleshooting

### Common Issues

**"Database connection failed"**
- Check your `DATABASE_URL` in `.env.local`
- Make sure PostgreSQL is running
- Verify database credentials

**"Questions aren't generating"**
- Verify your `ABACUSAI_API_KEY` is correct
- Check network connectivity
- Look at the browser console for error messages

**"Real-time features aren't working"**
- Make sure you're not blocking WebSocket connections
- Check if you're behind a strict firewall
- Try refreshing the page

**"Clipboard sharing doesn't work"**
- This is usually a browser security thing
- Try using HTTPS in production
- The app has fallbacks for this scenario

### Getting Help
- Check the GitHub issues first
- Include your error messages and browser info
- Describe what you were trying to do when it broke

## 🤝 Contributing

I'd love your help making WhizQuiz even better! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (and test them!)
4. **Commit with a clear message**: `git commit -m "Add amazing feature"`
5. **Push to your branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### What I'm Looking For
- **Bug fixes** (there are always bugs)
- **New quiz topics** (expand the variety!)
- **UI improvements** (make it even prettier)
- **Performance optimizations** (faster is better)
- **Better mobile experience** (mobile-first mindset)

### Code Style
- Use TypeScript everywhere
- Follow the existing Prettier config
- Write meaningful commit messages
- Test your changes locally first

## 🎯 Future Ideas

Some things I'm thinking about (contributions welcome!):
- **Custom quiz creation** - Let users add their own questions
- **Team mode** - Quiz with teams instead of individuals
- **Image questions** - Support for visual quiz questions
- **Quiz history** - Save and replay past quizzes
- **Difficulty levels** - Easy, medium, hard question variants
- **Time pressure modes** - Different timing challenges

## 📄 License

This project is MIT licensed. See the [LICENSE](LICENSE) file for details.

Basically: use it, modify it, share it, just don't blame me if something breaks! 😄

## 🙏 Acknowledgments

- **Radix UI** for the component primitives
- **Vercel** for making deployment actually enjoyable
- **The TypeScript team** for saving us from JavaScript chaos
- **Everyone who beta tested** and found all the bugs I missed

## 📬 Contact

Got questions? Found a bug? Want to collaborate?

- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/whizquiz/issues)
- **Email**: your.email@example.com
- **Twitter**: [@yourusername](https://twitter.com/yourusername)

---

**Built with ❤️ and way too much coffee** ☕

P.S. - If you use this for your next party or team building event, I'd love to hear about it! Send me a screenshot or something - it totally makes my day when I see people actually using stuff I built.
