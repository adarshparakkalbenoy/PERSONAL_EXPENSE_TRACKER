import React from "react";

const DAILY_THOUGHTS = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "John C. Maxwell" },
  { text: "Beware of little expenses. A small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "Every dollar you save today is a step toward financial independence tomorrow.", author: "Financial Wisdom" },
  { text: "Financial peace isn't the acquisition of stuff. It's learning to live on less than you make.", author: "Dave Ramsey" },
  { text: "It’s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "Prioritize your future self. Automated savings today buy freedom tomorrow.", author: "Savings Principle" },
  { text: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "Small daily choices create large lifetime balances. Mind your daily impulse buys.", author: "Mindful Living" },
  { text: "Before buying, ask yourself: 'Is this a 10-minute impulse or a 10-year investment?'", author: "Smart Buyer Rule" },
  { text: "Saving money doesn't restrict your freedom; it buys your future options.", author: "Wealth Mindset" },
  { text: "An emergency fund converts financial panic into a minor inconvenience.", author: "Safety First" },
  { text: "Never spend your money before you have earned it.", author: "Thomas Jefferson" },
  { text: "He who buys what he does not need steals from himself.", author: "Swedish Proverb" },
  { text: "Frugality without creativity is deprivation; frugality with creativity is freedom.", author: "Modern Frugality" },
  { text: "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.", author: "Warren Buffett" },
  { text: "A high income with high spending is just a high-stress lifestyle in disguise.", author: "Wealth Insight" },
  { text: "Compound interest is the 8th wonder of the world. He who understands it, earns it.", author: "Albert Einstein" },
  { text: "Track every dollar. Clarity is the first step toward financial control.", author: "Ledger Rule" },
  { text: "Pay yourself first: Treat your monthly savings like your non-negotiable rent payment.", author: "Pay Yourself First" },
  { text: "True wealth is invisible: it's the unpurchased cars and preserved assets.", author: "Morgan Housel" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "Living below your means is the ultimate form of financial self-care.", author: "Self-Care Principle" },
  { text: "Wait 48 hours before any unplanned purchase over $50 to cool impulse heat.", author: "The 48-Hour Rule" },
  { text: "Review your subscription services monthly. Cancel what you don't actively use.", author: "Audit Checklist" },
  { text: "Opportunity cost is real: What else could this money do for your long-term goals?", author: "Smart Allocation" },
  { text: "Building wealth is a marathon of consistency, not a sprint of windfall gains.", author: "Long-term Vision" },
  { text: "Contentment with what you have is the fastest shortcut to financial security.", author: "Contentment Rule" },
  { text: "Financial freedom means having control over your time and choices.", author: "Freedom Goal" },
  { text: "Invest in your knowledge and skills—the highest return dividend you will ever earn.", author: "Growth Mindset" }
];

export default function DailyThought({ compact = false }) {
  // Deterministic daily thought selection based on day of month/year
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const thoughtIndex = dayOfYear % DAILY_THOUGHTS.length;
  const currentThought = DAILY_THOUGHTS[thoughtIndex];

  return (
    <div className={`daily-thought-card ${compact ? "compact" : ""}`}>
      <div className="daily-thought-header">
        <span className="badge-sparkle">✨ Daily Savings Thought</span>
        <span className="date-tag">{today.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
      </div>
      <blockquote className="thought-body">
        “{currentThought.text}”
      </blockquote>
      <p className="thought-author">— {currentThought.author}</p>
    </div>
  );
}
