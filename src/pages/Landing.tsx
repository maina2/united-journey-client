import { Link } from 'react-router-dom'
import { ArrowRight, Menu, User, Calendar, Trophy, Users, Star } from 'lucide-react'

export const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
            alt="Manchester United"
            className="h-10 w-10"
          />
          <button aria-label="Open menu" className="text-black">
            <Menu size={22} />
          </button>
          <nav className="hidden md:flex items-center gap-8 font-serif text-lg text-black">
            <a href="#" className="hover:text-[#DA291C] transition-colors">News</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">MUTV</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">Tickets</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">United Store</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">Membership</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">Teams</a>
            <a href="#" className="hover:text-[#DA291C] transition-colors">Club</a>
          </nav>
        </div>
        <Link to="/login" className="text-black hover:text-[#DA291C] transition-colors">
          <User size={22} />
        </Link>
      </header>

      {/* Hero */}
      <section className="relative h-[500px] w-full overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200"
          alt="Old Trafford"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-12 md:px-16">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#DA291C] text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              My United Journey
            </span>
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.05] text-white">
              Your United Story Starts Here
            </h1>
            <p className="mt-4 text-xl text-white/80 max-w-2xl">
              Track your matches, earn badges, and celebrate your journey with the world's greatest club
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#DA291C] px-8 py-3 font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Start Your Journey
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white/20 px-8 py-3 font-semibold text-white hover:bg-white/30 transition-colors border border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-12">
            Your United Journey Awaits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Calendar className="text-[#DA291C]" size={32} />}
              title="Track Matches"
              description="Log every match you attend or watch. Build your personal history."
            />
            <FeatureCard
              icon={<Trophy className="text-[#DA291C]" size={32} />}
              title="Earn Badges"
              description="Unlock achievements as you grow your United journey."
            />
            <FeatureCard
              icon={<Users className="text-[#DA291C]" size={32} />}
              title="Compete & Rank"
              description="Climb the leaderboards and prove your loyalty."
            />
            <FeatureCard
              icon={<Star className="text-[#DA291C]" size={32} />}
              title="Share Your Story"
              description="Create beautiful cards and share your United moments."
            />
          </div>
        </div>
      </section>

      {/* Match Cards Preview */}
      <section className="grid grid-cols-1 gap-6 px-8 py-16 md:grid-cols-3 md:px-16 max-w-7xl mx-auto">
        <MatchCard
          label="Last Match"
          date="Sat 08 Aug 2026"
          competition="Premier League"
          venue="Old Trafford"
          home={{ name: "Man Utd", crest: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" }}
          away={{ name: "Liverpool", crest: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" }}
          score="2 - 1"
          statusLabel="FT"
          primaryAction="View Match"
          secondaryAction="Log Attendance"
        />
        <MatchCard
          label="Next Match"
          date="Wed 12 Aug 2026"
          competition="Premier League"
          venue="Old Trafford"
          home={{ name: "Man Utd", crest: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" }}
          away={{ name: "Arsenal", crest: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" }}
          score="20:00"
          primaryAction="Set Reminder"
          secondaryAction="Log When Played"
        />
        <MatchCard
          label="Upcoming Match"
          date="Sat 15 Aug 2026"
          competition="Premier League"
          venue="Old Trafford"
          home={{ name: "Man Utd", crest: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" }}
          away={{ name: "Chelsea", crest: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" }}
          score="17:45"
          primaryAction="Log Attendance"
          fullWidthPrimary
        />
      </section>

      {/* CTA Section */}
      <section className="bg-[#DA291C] text-white py-16 px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your United Journey?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of fans tracking their United story
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-[#DA291C] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started Now
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/60 py-8 px-8 md:px-16 text-center text-sm">
        <p>© 2026 My United Journey. Made with ❤️ for Manchester United fans</p>
        <p className="mt-1 text-[#DA291C] font-semibold">🔴 Glory Glory Man United</p>
      </footer>
    </div>
  )
}

type Team = {
  name: string
  crest: string
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-lg text-black mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function MatchCard({
  label,
  date,
  competition,
  venue,
  home,
  away,
  score,
  statusLabel,
  primaryAction,
  secondaryAction,
  fullWidthPrimary = false,
}: {
  label: string
  date: string
  competition: string
  venue: string
  home: Team
  away: Team
  score: string
  statusLabel?: string
  primaryAction: string
  secondaryAction?: string
  fullWidthPrimary?: boolean
}) {
  return (
    <div className="rounded-2xl bg-gray-100 p-6">
      <h2 className="font-serif text-2xl text-black">{label}</h2>
      <p className="mt-4 text-sm font-medium text-gray-600">{date}</p>

      <div className="mt-4 flex items-center justify-between">
        <TeamBadge team={home} />

        <div className="flex flex-col items-center">
          <div className="rounded-md bg-black px-4 py-2 font-serif text-3xl text-white">
            {score}
          </div>
          {statusLabel && (
            <span className="mt-2 text-xs font-semibold text-gray-600">
              {statusLabel}
            </span>
          )}
        </div>

        <TeamBadge team={away} />
      </div>

      <div className="mt-6">
        <p className="font-semibold text-black">{competition}</p>
        <p className="text-gray-600">{venue}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          className={`rounded-full bg-[#DA291C] px-5 py-2.5 font-semibold text-white transition-colors hover:bg-red-700 ${
            fullWidthPrimary ? "flex-1" : ""
          }`}
        >
          {primaryAction}
        </button>
        {secondaryAction && (
          <button className="flex-1 rounded-full bg-white px-5 py-2.5 font-semibold text-black transition-colors hover:bg-gray-200">
            {secondaryAction}
          </button>
        )}
      </div>
    </div>
  )
}

function TeamBadge({ team }: { team: Team }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <img src={team.crest} alt={team.name} className="h-12 w-12 object-contain" />
      <span className="font-semibold text-black">{team.name}</span>
    </div>
  )
}
