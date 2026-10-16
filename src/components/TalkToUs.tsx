import React, { useState, useEffect } from 'react';
import { DiscussionEmbed, CommentCount } from 'disqus-react';
import {
  MessageSquare,
  MessageCircle,
  Mail,
  Phone,
  Building2,
  Users,
  Sparkles,
  HelpCircle,
  Send,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
}

const TOPICS: Topic[] = [
  {
    id: 'propertyseek-general-feedback',
    title: 'PropertySeek Community: Talk to Us & Buyer Feedback',
    category: 'General Discussion',
    description: 'Share your property hunt experience, ask questions, or request new features.',
  },
  {
    id: 'propertyseek-new-launches-2026',
    title: 'Singapore 2026 New Launches: Pricing & Best Stacks',
    category: 'New Launches Advice',
    description: 'Community insights on Grand Dunman, Lentor Modern, Terra Hill, and Chuan Park.',
  },
  {
    id: 'propertyseek-ura-gls-vacant-sites',
    title: 'URA Vacant Sites & Land Bids Discussion',
    category: 'GLS & Market Intelligence',
    description: 'Discuss upcoming government land sales tenders and developer bid projections.',
  },
];

export const TalkToUs: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(TOPICS[0]);
  const [currentUrl, setCurrentUrl] = useState<string>('https://propertyseek.sg/talk-to-us');

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(`${window.location.origin}/talk-to-us#${selectedTopic.id}`);
    }
  }, [selectedTopic]);

  const disqusShortname = 'propertyseek';

  // Article configuration object matching user specs
  const articleConfig = {
    url: currentUrl,
    identifier: selectedTopic.id,
    title: selectedTopic.title,
    language: 'en',
    remoteAuthS3: '', // Configured via server if SSO is active
    apiKey: '', // Disqus API Key
    sso: {
      name: 'PropertySeek',
      button: 'https://propertyseek.sg/favicon.ico',
      icon: 'https://propertyseek.sg/favicon.ico',
      url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'https://propertyseek.sg/login',
      logout: typeof window !== 'undefined' ? `${window.location.origin}/logout` : 'https://propertyseek.sg/logout',
      profile_url: typeof window !== 'undefined' ? `${window.location.origin}/users/{username}` : 'https://propertyseek.sg/users/{username}',
      width: '800',
      height: '400',
    },
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Community Forum &amp; Direct Support</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Talk to Us
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Have questions about Singapore new launches, URA vacant land sales, or need tailored property advice? Join the Disqus community discussion or reach out directly to the PropertySeek team.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Disqus Forum Active</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
              <span>WhatsApp Concierge: +65 9123 4567</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout: Forum on Left, Direct Contact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Disqus Discussion Forum (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Discussion Topic Switcher */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Discussion Thread:
              </span>

              {/* Comment Count component as requested */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <CommentCount shortname={disqusShortname} config={articleConfig}>
                  Comments
                </CommentCount>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTopic.id === topic.id
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-0.5">
                    {topic.category}
                  </span>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">
                    {topic.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {topic.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Discussion Card & Disqus Embed */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-emerald-700">
                  {selectedTopic.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {selectedTopic.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedTopic.description}
                </p>
              </div>

              <div className="text-xs text-slate-500">
                Shortname: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-slate-800">{disqusShortname}</code>
              </div>
            </div>

            {/* Disqus Discussion Embed as specified */}
            <div className="min-h-[400px] pt-2">
              <DiscussionEmbed shortname={disqusShortname} config={articleConfig} />
            </div>

            {/* Note & Fallback Link */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <span>
                Disqus authentication supported via Google, Facebook, Twitter, or guest comment.
              </span>
              <a
                href={`https://${disqusShortname}.disqus.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Open in Disqus Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Contact & Agent Concierge (1 col) */}
        <div className="space-y-6">
          {/* Quick Support Channels */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Direct Property Concierge</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <a
                href="https://wa.me/6591234567?text=Hi%20PropertySeek%2C%20I%20would%20like%20to%20speak%20to%20a%20new%20launch%20advisor."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 flex items-center justify-between text-emerald-900 font-bold transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div>WhatsApp Advisor</div>
                    <div className="text-[10px] text-emerald-700 font-normal">Fastest response (&lt; 15 mins)</div>
                  </div>
                </div>
                <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
              </a>

              <a
                href="tel:+6591234567"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div>Phone Hotline</div>
                    <div className="text-[10px] text-slate-500 font-normal">+65 9123 4567 (9am - 8pm SGT)</div>
                  </div>
                </div>
                <span className="text-xs">→</span>
              </a>

              <a
                href="mailto:contact@propertyseek.sg?subject=PropertySeek%20Inquiry"
                className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800 font-bold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div>Official Email</div>
                    <div className="text-[10px] text-slate-500 font-normal">contact@propertyseek.sg</div>
                  </div>
                </div>
                <span className="text-xs">→</span>
              </a>
            </div>
          </div>

          {/* Quick Direct Message Form */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-700" />
              <span>Send Us a Direct Message</span>
            </h3>
            <p className="text-xs text-slate-500">
              Leave your feedback or enquiry; an accredited Singapore new launch specialist will be in touch.
            </p>

            {contactSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-900">
                  Message Sent Successfully!
                </div>
                <p className="text-[11px] text-slate-600">
                  Thank you for reaching out. We will respond to your inquiry shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rachel Tan"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@example.com or +65..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    How can we help?
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about the property, budget, or school proximity you are seeking..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}

            <p className="text-[10px] text-slate-400 text-center">
              Privacy protected: No data sold or shared. Strict Team One compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
