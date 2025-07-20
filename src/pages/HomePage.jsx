import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../utils/firebaseHelpers";
import { db } from "../firebase";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // Unique player ID using Firebase push key
  const playerId = db.ref().push().key;

  const handleCreateRoom = async () => {
    try {
      const code = await createRoom(playerId, name);
      navigate(`/lobby/${code}`, { state: { playerId, name } });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomCode, playerId, name);
      navigate(`/lobby/${roomCode}`, { state: { playerId, name } });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="main-container">
      <div className="container">
        <h1>Impostor Word Game</h1>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <hr />
        <input
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
        <button onClick={handleJoinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default HomePage;
