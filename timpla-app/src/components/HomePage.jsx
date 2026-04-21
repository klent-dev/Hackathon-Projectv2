import "./HomePage.css";

function HomePage({ onSelectRole }) {
  return (
    <section className="home">
      <div className="home-card">
        <p className="home-kicker">Timpla</p>
        <h1 className="home-title">Choose your role</h1>
        <p className="home-subtitle">
          Select whether you are riding as a passenger or driving as a driver before entering the app.
        </p>

        <div className="home-actions">
          <button type="button" className="home-start" onClick={() => onSelectRole("passenger")}>
            Passenger
          </button>
          <button type="button" className="home-start home-driver" onClick={() => onSelectRole("driver")}>
            Driver
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
