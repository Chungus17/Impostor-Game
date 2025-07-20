import { db } from "../firebase";

// Create a new room
export const createRoom = async (playerId, name) => {
  const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
  await db.ref(`rooms/${roomCode}`).set({
    players: { [playerId]: { name } },
    host: playerId,
  });
  return roomCode;
};

// Join an existing room
export const joinRoom = async (roomCode, playerId, name) => {
  const snapshot = await db.ref(`rooms/${roomCode}/players`).get();
  if (!snapshot.exists() || snapshot.size >= 6) {
    throw new Error("Room does not exist or is full");
  }
  await db.ref(`rooms/${roomCode}/players/${playerId}`).set({ name });
};

// Start the game: pick word & impostor
export const startGame = async (roomCode) => {
  const snap = await db.ref(`rooms/${roomCode}/players`).get();
  const players = Object.keys(snap.val());
  const wordList = ["Zoo", "Library", "Airport", "Beach"];
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  const impostor = players[Math.floor(Math.random() * players.length)];
  await db.ref(`rooms/${roomCode}`).update({
    word: secretWord,
    impostor,
  });
};

// Sample words list
const words = ["Zoo", "Library", "Airport", "Beach"];

export const restartGame = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  const snapshot = await roomRef.once("value");
  const roomData = snapshot.val();

  if (!roomData || !roomData.players) return;

  const playerIds = Object.keys(roomData.players);
  const newImpostor = playerIds[Math.floor(Math.random() * playerIds.length)];
  const newWord = words[Math.floor(Math.random() * words.length)];

  await roomRef.update({
    impostor: newImpostor,
    word: newWord,
    countdown: 3, // trigger the countdown on all clients
  });
};

export const leaveRoom = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  await roomRef.remove();  // Deletes the entire room from Firebase
};
