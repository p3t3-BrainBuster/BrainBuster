import { useGlobalContext } from "../utils/GlobalState";
import { QUERY_USERS } from "../utils/queries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { SET_USERS } from "../utils/actions";

import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth";
import Navbar from "../components/Nav";
import JoinGame from "../components/JoinGame";

const Home = () => {
  const navigate = useNavigate();

  const [state, dispatch] = useGlobalContext();
  const { data, loading } = useQuery(QUERY_USERS);

  const users = data?.users || [];
  console.log(users);

  useEffect(() => {
    dispatch({ type: SET_USERS, payload: users });
  }, [data]);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  const handleCreateGame = () => {
    navigate("/create-game");
  };

  const handleJoinGame = () => {
    navigate("/join-game");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <>
      <Navbar />
      <div
        className="container"
        style={{
          backgroundColor: "#A7FFEB",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#212121",
        }}
      >
        <div className="avatarCont" style={{ marginBottom: "20px" }}></div>
        <div
          className="join"
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h1 style={{ color: "#7E57C2" }}>Welcome to BrainBuster</h1>
          {AuthService.loggedIn() ? (
            <div className="game-options">
              <button
                onClick={handleCreateGame}
                style={{
                  backgroundColor: "#FF4081",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  margin: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Create Game
              </button>
              {/* <button
                onClick={handleJoinGame}
                style={{
                  backgroundColor: "#FF4081",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  margin: "10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Join Game
              </button> */}
            </div>
          ) : (
            <div>
              <p style={{ color: "#616161" }}>
                Please log in or sign up to create or join a game.
              </p>
              <div>
                <button
                  onClick={handleLogin}
                  style={{
                    backgroundColor: "#FF4081",
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    margin: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Login
                </button>
                <button
                  onClick={handleSignup}
                  style={{
                    backgroundColor: "#FF4081",
                    color: "#FFFFFF",
                    padding: "10px 20px",
                    margin: "10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
