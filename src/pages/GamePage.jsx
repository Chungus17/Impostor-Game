import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi"; // exit icon
import { db } from "../firebase";
import { restartGame, leaveRoom } from "../utils/firebaseHelpers";
import Countdown from "../components/Countdown";

const GamePage = () => {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const { playerId } = state;
  const navigate = useNavigate();

  const [word, setWord] = useState("");
  const [host, setHost] = useState(null);
  const [showCountdown, setShowCountdown] = useState(true);

  useEffect(() => {
    const ref = db.ref(`rooms/${roomCode}`);

    const handleValueChange = (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        navigate("/");
        return;
      }

      if (data?.word && data?.impostor && data?.players) {
        const role = playerId === data.impostor ? "Impostor" : data.word;
        setWord(role);
      }

      if (data?.host) setHost(data.host);

      if (data?.countdown && data.countdown > 0) {
        setShowCountdown(true);
      }
    };

    ref.on("value", handleValueChange);
    return () => ref.off("value", handleValueChange);
  }, [roomCode, playerId, navigate]);

  const handleRestart = async () => {
    await restartGame(roomCode);
  };

  const handleLeaveRoom = async () => {
    await leaveRoom(roomCode);
  };

  return (
    <>
      {playerId === host && (
        <div className="exit-btn-container">
          <button
            onClick={handleLeaveRoom}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "2rem",
              color: "red",
              zIndex: 1000,
              width: "fit-content",
            }}
            title="Leave Room"
            aria-label="Leave Room"
          >
            <FiLogOut />
          </button>
        </div>
      )}
      <div className="main-container">
        <div
          className="container"
          style={{ position: "relative", paddingTop: "50px" }}
        >
          {showCountdown ? (
            <Countdown onComplete={() => setShowCountdown(false)} />
          ) : (
            <>
              <h2>Your word is:</h2>
              <h1>{word}</h1>

              {playerId === host && (
                <button
                  style={{
                    marginTop: "20px",
                    padding: "10px 20px",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={handleRestart}
                >
                  Restart Game
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default GamePage;
