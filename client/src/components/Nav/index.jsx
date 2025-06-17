import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from "../../utils/auth";
import styles from "./nav.module.css";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: 1000,
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Link
          to="/dashboard"
          style={{ textDecoration: "none", color: "#7E57C2" }}
        >
          <h1>BrainBuster</h1>
        </Link>

        {/* Hamburger Icon */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            width: "30px",
            height: "25px",
            zIndex: 1001,
          }}
        >
          <span
            style={{
              width: "30px",
              height: "3px",
              backgroundColor: "#7E57C2",
              transition: "all 0.3s linear",
              transform: isOpen
                ? "rotate(45deg) translate(6px, 6px)"
                : "rotate(0)",
            }}
          />
          <span
            style={{
              width: "30px",
              height: "3px",
              backgroundColor: "#7E57C2",
              transition: "all 0.3s linear",
              opacity: isOpen ? "0" : "1",
            }}
          />
          <span
            style={{
              width: "30px",
              height: "3px",
              backgroundColor: "#7E57C2",
              transition: "all 0.3s linear",
              transform: isOpen
                ? "rotate(-45deg) translate(6px, -6px)"
                : "rotate(0)",
            }}
          />
        </div>

        {/* Menu Items */}
        <div
          style={{
            position: "fixed",
            top: "64px",
            right: isOpen ? "0" : "-100%",
            height: "calc(100vh - 64px)",
            width: "250px",
            backgroundColor: "#FFFFFF",
            transition: "right 0.3s ease-in-out",
            boxShadow: "-2px 0 5px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            padding: "2rem",
          }}
        >
          {Auth.loggedIn() ? (
            <>
              <Link
                to="/home"
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Create a Game
              </Link>
              <Link
                to="/profile"
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Profile
              </Link>
              <Link
                to="/leaderboard"
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Leaderboard
              </Link>
              <Link
                to="/dashboard"
                className={styles.navItem}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Dashboard
              </Link>
              <a
                href="/"
                onClick={() => {
                  Auth.logout();
                  setIsOpen(false);
                }}
                className={styles.navItem}
                style={{
                  color: "#FF4081",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className={styles.navItem}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Signup
              </Link>
              <Link
                to="/login"
                className={styles.navItem}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                Login
              </Link>
              <Link
                to="/about"
                className={styles.navItem}
                style={{
                  color: "#7E57C2",
                  textDecoration: "none",
                  padding: "1rem",
                  borderRadius: "8px",
                  margin: "0.5rem 0",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
              >
                About
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
