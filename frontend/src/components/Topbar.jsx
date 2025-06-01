// src/components/Topbar.jsx
import "./Topbar.css";
import SearchBar from "./SearchBar";
import defaultAvatar from "/Images/user (1).png";
import { Link } from "react-router-dom";

export default function Topbar({ showSearchBar = true }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <img src="/Images/Logo2.svg" alt="Logo" className="topbar-logo" />
      </div>

      {showSearchBar && (
        <div className="topbar-center">
          <SearchBar />
        </div>
      )}

      <div className="topbar-right">
        <Link
          to={"/dashboard/dataset"}
          className="topbar-btn"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          Datasets
        </Link>

        <Link
          to={"/dashboard/profile"}
          className="topbar-icon"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          <img src={defaultAvatar} alt="Profile" className="topbar-avatar" />
        </Link>
      </div>
    </header>
  );
}
