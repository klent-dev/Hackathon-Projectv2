import "./HomePage.css";

function HomePage({ onStart }) {
  return (
    <section className="home">
      <div className="home-card">
        <p className="home-kicker">Timpla</p>
        <h1 className="home-title">Cheapest Jeepney Route Finder</h1>
        <p className="home-subtitle">
          Pick your origin and destination and we’ll prioritize the very cheapest route with clear jeepney codes and stops.
        </p>

        <div className="home-actions">
          <button type="button" className="home-start" onClick={onStart}>
            Start
          </button>
        </div>

        <div className="home-notes">
          <div className="home-note">
            <strong>Goal:</strong> help commuters save money.
          </div>
          <div className="home-note">
            <strong>Default:</strong> cheapest-first, with fare ranges.
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
