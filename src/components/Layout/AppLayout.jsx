import { Outlet } from "react-router-dom";
import Squares from "../Squares";
import "./AppLayout.css";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-shell__background">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="rgba(255, 255, 255, 0.35)"
          hoverFillColor="rgba(68, 51, 122, 0.35)"
          className="app-shell__canvas"
        />
        <div className="app-shell__overlay" />
      </div>

      <main className="app-shell__main">
        <div className="app-shell__container">
          <Outlet />
        </div>
      </main>

      <footer className="app-shell__footer">cancelled.fm</footer>
    </div>
  );
}