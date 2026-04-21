import React, { useState, useEffect } from 'react';

export default function SavingsCard({ cheapestFare, baselineFare, baselineLabel }) {
  const savings = baselineFare - cheapestFare;
  const savingsPercent = Math.round((savings / baselineFare) * 100);
  const dailySavings = savings * 2; // round trip
  const monthlySavings = dailySavings * 22; // working days

  // Animated counter
  const [displaySavings, setDisplaySavings] = useState(0);

  useEffect(() => {
    setDisplaySavings(0);
    const duration = 1200;
    const steps = 30;
    const increment = savings / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), savings);
      setDisplaySavings(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [savings]);

  if (savings <= 0) return null;

  return (
    <section className="savings-section" id="savings-card">
      <div className="savings-card">
        <h2 className="savings-title">💰 Your Savings</h2>

        <div className="savings-comparison">
          <div className="savings-col expensive">
            <span className="savings-label">{baselineLabel}</span>
            <span className="savings-amount expensive-amount">₱{baselineFare}</span>
            <div className="savings-bar-track">
              <div className="savings-bar expensive-bar" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="savings-vs">VS</div>

          <div className="savings-col cheap">
            <span className="savings-label">Timpla Route</span>
            <span className="savings-amount cheap-amount">₱{cheapestFare}</span>
            <div className="savings-bar-track">
              <div
                className="savings-bar cheap-bar"
                style={{ width: `${Math.round((cheapestFare / baselineFare) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="savings-hero">
          <div className="savings-hero-number">
            <span className="hero-currency">₱</span>
            <span className="hero-amount">{displaySavings}</span>
          </div>
          <span className="hero-label">saved per trip!</span>
          <span className="hero-percent">({savingsPercent}% cheaper)</span>
        </div>

        <div className="savings-projections">
          <div className="projection">
            <span className="projection-icon">📅</span>
            <span className="projection-label">Daily (round trip)</span>
            <span className="projection-value">₱{dailySavings}</span>
          </div>
          <div className="projection">
            <span className="projection-icon">📆</span>
            <span className="projection-label">Monthly (22 days)</span>
            <span className="projection-value highlight">₱{monthlySavings.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
