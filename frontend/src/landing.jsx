import { Link } from 'react-router-dom';
import './landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <img src="/Images/Logo-sans arriere plan.png" alt="Logo" />
          <h1>Web-based Data Management for AI</h1>
        </div>
        <p className="intro-text">
          A platform to manage datasets, perform analytic, and integrate machine learning models
        </p>
        <Link to="/login" className="btn">Get Started</Link>
      </header>

      <section className="features">
        <div className="feature">
          <img src="/Images/Vizualisation.png" alt="Visualization" />
          <p>Visualization</p>
        </div>
        <div className="feature">
          <img src="/Images/analys.jpg" alt="Analysis" />
          <p>Analysis</p>
        </div>
        <div className="feature">
          <img src="/Images/data.png" alt="Data" />
          <p>Data</p>
        </div>
      </section>

      <footer className="footer">
        <p>Contact: team@AI-datamangement-platform.com</p>
        <div className="socials">
          <a href="#"><img src="/Images/Lindkelind.png" alt="LinkedIn" />LinkedIn</a>
          <a href="#"><img src="/Images/GitHub.png" alt="GitHub" />GitHub</a>
          <a href="#"><img src="/Images/Twitter.png" alt="Twitter" />Twitter</a>
        </div>
      </footer>
    </div>
  );
}
