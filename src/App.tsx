import { useEffect, useRef } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ProjectReport } from "./pages/ProjectReport";
import { site } from "./data/site";

function ScrollRestoration() {
  const location = useLocation();
  const navigation = useNavigationType();
  const saved = useRef(new Map<string, number>());
  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);
  useEffect(() => {
    const restore = () => {
      if (location.hash)
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView();
      else
        window.scrollTo({
          top: navigation === "POP" ? saved.current.get(location.key) || 0 : 0,
          behavior: "instant",
        });
    };
    const frame = requestAnimationFrame(restore);
    const remember = () => saved.current.set(location.key, window.scrollY);
    window.addEventListener("scroll", remember, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", remember);
    };
  }, [location.key, location.hash, navigation]);
  return null;
}

export function App() {
  const location = useLocation();
  return (
    <>
      <ScrollRestoration />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <nav className="page-width nav-inner" aria-label="Main navigation">
          <Link className="wordmark" to="/">
            {site.name}
          </Link>
          <div className="nav-links">
            <Link to="/#notable">Projects</Link>
            <Link to="/#approach" className="nav-secondary">
              Our approach
            </Link>
            <Link to="/#contact">Contact</Link>
            <Link to="/#donate" className="button nav-donate">
              Make a difference
            </Link>
          </div>
        </nav>
      </header>
      <main id="main" key={location.pathname}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectReport />} />
          <Route
            path="*"
            element={
              <div className="page-width not-found">
                <p className="eyebrow">404 / Page not found</p>
                <h1>This place isn’t on the map.</h1>
                <Link to="/" className="button">
                  Return to the atlas ↗
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="site-footer page-width">
        <Link className="wordmark" to="/">
          {site.name}
        </Link>
        <p>Independent initiative examples · concept website</p>
        <a href={site.figmaUrl} target="_blank" rel="noopener noreferrer">
          View the design ↗
        </a>
      </footer>
    </>
  );
}
