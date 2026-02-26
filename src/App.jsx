import { useState } from 'react'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import ProfileSetup from './components/ProfileSetup'
import Footer from './components/Footer'
import HeroBg from './assets/images/hero-bg.png'
import HeroIllustration from './assets/images/hero-illustration.png'
import ArchiveIllustration from './assets/images/archive-illustration.png'
import { PenTool, Users, BookOpen, Book, Cpu, Heart, Plane, Globe, Briefcase, User, Utensils, ArrowRight } from 'lucide-react'
import './App.css'

const LATEST_STORIES = [
  {
    id: 1,
    title: "Finding Light in Unexpected Places",
    excerpt: "A journey through moments of discovery and the beauty of everyday life that often goes unnoticed in our busy routines.",
    author: "lalitheshvijay",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "The Art of Digital Minimalism",
    excerpt: "How unplugging from our digital lives can lead to greater creativity, deeper focus, and a more intentional way of living.",
    author: "lalitheshvijay",
    time: "5 hours ago",
    image: "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "Stories from the Road",
    excerpt: "Lessons learned while traveling through Southeast Asia's hidden gems and the people who made each stop unforgettable.",
    author: "lalitheshvijay",
    time: "8 hours ago",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=800"
  }
];

const TRENDING_STORIES = [
  {
    id: 1,
    title: "The Future of Creative Writing",
    excerpt: "How AI and technology are reshaping the landscape of storytelling and what it means for writers everywhere.",
    author: "lalitheshvijay",
    category: "Technology",
    reads: "12.5K reads",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Mindfulness in Modern Life",
    excerpt: "Practical tips for staying present in our fast-paced world and finding calm amidst the noise of daily life.",
    author: "lalitheshvijay",
    category: "Wellness",
    reads: "9.8K reads",
    image: "https://images.unsplash.com/photo-1545208393-596371BA9a3c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    title: "A Love Letter to Small Towns",
    excerpt: "Rediscovering the charm and warmth of close-knit communities in an increasingly urbanized world.",
    author: "lalitheshvijay",
    category: "Travel",
    reads: "8.2K reads",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"
  }
];

const TOPICS = [
  { id: 1, title: 'Fiction', count: '2,500+', desc: 'Short stories, novels, and more', icon: Book, variant: 'dark' },
  { id: 2, title: 'Technology', count: '1,800+', desc: 'AI, startups, and innovation', icon: Cpu, variant: 'gradient-orange' },
  { id: 3, title: 'Wellness', count: '1,200+', desc: 'Mental health, fitness, lifestyle', icon: Heart, variant: 'gradient-yellow' },
  { id: 4, title: 'Travel', count: '980+', desc: 'Adventures and destinations', icon: Plane, variant: 'dark' },
  { id: 5, title: 'Culture', count: '750+', desc: 'Art, music, and society', icon: Globe, variant: 'light' },
  { id: 6, title: 'Business', count: '890+', desc: 'Entrepreneurship and careers', icon: Briefcase, variant: 'light' },
  { id: 7, title: 'Personal', count: '1,500+', desc: 'Memoirs and reflections', icon: User, variant: 'light' },
  { id: 8, title: 'Food', count: '620+', desc: 'Recipes and culinary tales', icon: Utensils, variant: 'light' }
];

const ARCHIVE_STATS = [
  { label: 'Total Stories', value: '10K+' },
  { label: 'Topics', value: '50+' },
  { label: 'Writers', value: '5K+' },
  { label: 'Updated', value: 'Daily' }
];

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const handleAuthClose = () => {
    setIsAuthOpen(false);
  };

  return (
    <div className="app">
      <Header onAuthClick={() => setIsAuthOpen(true)} />

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <img src={HeroBg} className="hero-bg" alt="Hero Background" />
          <div className="container hero">
            <div className="hero-content-wrapper">
              <div className="hero-text">
                <h1>Where Stories Come to Life</h1>
                <p>A place for writers to share their voice and readers to discover extraordinary stories.</p>
                <div className="hero-btns">
                  <button className="btn-primary" onClick={() => setIsAuthOpen(true)}>Start Writing</button>
                  <a href="#latest" className="btn-secondary">Explore Stories</a>
                </div>
              </div>
              <div className="hero-illustration">
                <img src={HeroIllustration} alt="Storytelling Illustration" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose La'verse?</h2>
              <p>Everything you need to share your voice with the world</p>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <PenTool size={24} />
                </div>
                <h3>Beautiful Editor</h3>
                <p>Write with ease using our distraction-free editor designed for focused creativity and elegant formatting.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <Users size={24} />
                </div>
                <h3>Engaged Community</h3>
                <p>Connect with passionate readers and writers who appreciate thoughtful content and meaningful conversations.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <BookOpen size={24} />
                </div>
                <h3>Curated Discovery</h3>
                <p>Find stories that matter to you through personalized recommendations and expertly curated collections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Stories Section */}
        <section id="latest" className="stories-section">
          <div className="container">
            <div className="section-header">
              <h2>Latest Stories</h2>
              <p>The newest content from our community of writers</p>
            </div>

            <div className="stories-grid">
              {LATEST_STORIES.map(story => (
                <article key={story.id} className="story-card">
                  <div className="story-image">
                    <img src={story.image} alt={story.title} />
                  </div>
                  <div className="story-content">
                    <span className="story-time">{story.time}</span>
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <span className="story-author">By {story.author}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Section */}
        <section id="trending" className="trending-section">
          <div className="container">
            <div className="section-header">
              <h2>Trending Now</h2>
              <p>The most popular stories this week</p>
            </div>

            <div className="trending-list">
              {TRENDING_STORIES.map(story => (
                <article key={story.id} className="trending-card">
                  <div className="trending-rank">{story.id}</div>
                  <div className="trending-content">
                    <h3>{story.title}</h3>
                    <p>{story.excerpt}</p>
                    <div className="trending-meta">
                      <span className="meta-reads">{story.reads}</span>
                      <span className="meta-dot"></span>
                      <span className="meta-author">{story.author}</span>
                      <span className="meta-dot"></span>
                      <span className="meta-category">{story.category}</span>
                    </div>
                  </div>
                  <div className="trending-image">
                    <img src={story.image} alt={story.title} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section id="topics" className="topics-section">
          <div className="container">
            <div className="section-header">
              <h2>Explore Topics</h2>
              <p>Find stories that match your interests</p>
            </div>

            <div className="topics-grid">
              {TOPICS.map(topic => (
                <div key={topic.id} className={`topic-card ${topic.variant}`}>
                  <div className="topic-icon">
                    <topic.icon size={28} />
                  </div>
                  <div className="topic-info">
                    <h3>{topic.title}</h3>
                    <span className="topic-count">{topic.count} stories</span>
                    <p>{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Archive Section */}
        <section id="archive" className="archive-section">
          <div className="container">
            <div className="archive-inner">
              <div className="archive-content">
                <span className="section-tag">The Archive</span>
                <h2>Dive into our collection</h2>
                <p>Explore our complete library of stories, essays, and creative works. From timeless classics to daily new arrivals, discover the depth of the La'verse community's voice.</p>

                <div className="archive-stats-grid">
                  {ARCHIVE_STATS.map((stat, index) => (
                    <div key={index} className="stat-card">
                      <span className="stat-value">{stat.value}</span>
                      <span className="stat-label">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <button className="btn-primary archive-cta">
                  Browse Full Archive
                </button>
              </div>

              <div className="archive-visual">
                <img
                  src={ArchiveIllustration}
                  alt="Creative Book Illustration"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Share Your Story?</h2>
              <p>Join thousands of writers who have found their voice on La'verse. Start your journey today.</p>
              <div className="cta-buttons">
                <button className="btn-cta-primary" onClick={() => setIsAuthOpen(true)}>
                  Create Your Account <ArrowRight size={18} />
                </button>
                <a href="#latest" className="btn-cta-secondary">Learn More</a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleAuthClose}
      />

      {showProfileSetup && (
        <div className="modal-overlay" onClick={() => setShowProfileSetup(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ProfileSetup
              onComplete={() => setShowProfileSetup(false)}
              onSkip={() => setShowProfileSetup(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
