import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { startGame } from "../utils/firebaseHelpers";

const LobbyPage = () => {
  const { roomCode } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({});
  const [host, setHost] = useState(null);

  useEffect(() => {
    const ref = db.ref(`rooms/${roomCode}`);

    ref.on("value", (snapshot) => {
      const data = snapshot.val();
      setPlayers(data?.players || {});
      setHost(data?.host);

      if (data?.word) {
        // If game started, redirect to game page
        navigate(`/game/${roomCode}`, { state });
      }
    });

    return () => ref.off();
  }, [roomCode, navigate, state]);

  const handleStartGame = () => {
    startGame(roomCode);
  };

  return (
    <div className="container">
      <h2>Room: {roomCode}</h2>
      <h3>Players:</h3>
      <ul>
        {Object.values(players).map((player, i) => (
          <li key={i}>{player.name}</li>
        ))}
      </ul>
      {state.playerId === host && (
        <button onClick={handleStartGame}>Start Game</button>
      )}
    </div>
  );
};

export default LobbyPage;
