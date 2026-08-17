import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import DailyThought from "../components/DailyThought";

export default function About() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <span className="eyebrow">Financial Empowerment & Clarity</span>
        <h1>Master Your Money. Build Lasting Wealth.</h1>
        <p className="about-lead">
          Ledger is an intuitive, intelligent expense management and budget tracking platform 
          designed to transform daily spending habits into long-term financial independence.
        </p>

        {!isAuthenticated && (
          <div className="about-cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started — Register Free
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Log In to Account
            </Link>
          </div>
        )}
      </section>

      {/* Daily Thought Highlight */}
      <section className="about-thought-section">
        <DailyThought />
      </section>

      {/* App Features Overview */}
      <section className="about-features-section">
        <div className="section-header text-center">
          <span className="eyebrow">Platform Capabilities</span>
          <h2>Everything You Need for Financial Control</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Real-Time Expense Tracking</h3>
            <p>
              Effortlessly log, categorize, and complete expenses with instant feedback. 
              Keep full visibility over where every dollar flows.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Smart Budget Guardrails</h3>
            <p>
              Set customizable monthly budget thresholds. Automated alert banners warn you 
              before overspending happens.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Visual Category Analytics</h3>
            <p>
              Dynamic category breakdown charts reveal spending concentration in food, 
              housing, entertainment, and utilities.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>Personalized Money Advisor</h3>
            <p>
              Intelligent spending advice tailored to your actual habits, highlighting daily spending caps 
              and category optimization tips.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Wisdom & Principles */}
      <section className="about-principles-section">
        <div className="section-header">
          <span className="eyebrow">Financial Wellness Principles</span>
          <h2>Core Mindsets for Building Wealth</h2>
        </div>

        <div className="principles-container">
          <div className="principle-box">
            <div className="principle-number">01</div>
            <div className="principle-content">
              <h4>The 50/30/20 Budgeting Strategy</h4>
              <p>
                Divide your net income into three clear buckets: <strong>50% Needs</strong> (housing, groceries, utilities), 
                <strong> 30% Wants</strong> (dining out, entertainment, hobbies), and <strong>20% Savings & Debt Payoff</strong>. 
                This creates sustainable balance without feeling deprived.
              </p>
            </div>
          </div>

          <div className="principle-box">
            <div className="principle-number">02</div>
            <div className="principle-content">
              <h4>The Emergency Fund Blueprint</h4>
              <p>
                Prioritize accumulating 3 to 6 months of living expenses in an easily accessible liquid account. 
                An emergency buffer turns unexpected life events from catastrophic financial crises into minor bumps in the road.
              </p>
            </div>
          </div>

          <div className="principle-box">
            <div className="principle-number">03</div>
            <div className="principle-content">
              <h4>The 48-Hour Rule for Impulse Purchases</h4>
              <p>
                Whenever you feel the impulse to buy a non-essential item over $50, enforce a mandatory 48-hour cooling-off period. 
                Over 70% of impulse buying desires fade once emotional heat cools down.
              </p>
            </div>
          </div>

          <div className="principle-box">
            <div className="principle-number">04</div>
            <div className="principle-content">
              <h4>Pay Yourself First</h4>
              <p>
                Automate your monthly savings transfer on payday before allocating money to discretionary expenses. 
                Saving first guarantees your wealth grows consistently every month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Callout */}
      <section className="about-footer-callout">
        <h3>Ready to Take Control of Your Financial Future?</h3>
        <p>Join Ledger today and start tracking your path to financial freedom.</p>
        <div style={{ marginTop: "1rem" }}>
          {isAuthenticated ? (
            <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <Link to="/register" className="btn btn-primary">Create Your Free Account</Link>
          )}
        </div>
      </section>
    </div>
  );
}
