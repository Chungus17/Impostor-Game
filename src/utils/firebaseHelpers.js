import { db } from "../firebase";

const wordList = [
  // Movies / Shows
  "Titanic",
  "Avatar",
  "Frozen",
  "Batman",
  "Inception",
  "Barbie",
  "Jaws",
  "Shrek",
  "Gladiator",
  "Aladdin",
  "Godzilla",
  "Twilight",

  // Animals
  "Elephant",
  "Penguin",
  "Giraffe",
  "Crocodile",
  "Octopus",
  "Whale",
  "Zebra",
  "Turtle",
  "Camel",
  "Monkey",

  // Famous People (first name or last name only)
  "Einstein",
  "Messi",
  "Obama",
  "Drake",
  "Tesla",
  "Newton",
  "Ronaldo",
  "Cleopatra",
  "Napoleon",
  "Gandhi",
  "Shakespeare",

  // Ancient / Historical / Mythology
  "Pharaoh",
  "Pyramid",
  "Gladius",
  "Viking",
  "Samurai",
  "Mummy",

  // Famous Foods / Dishes
  "Donut",
  "Curry",
  "Falafel",
  "Biryani",
  "Kebab",
  "Pancake",
  "Lasagna",

  // Popular Random / Pop Culture
  "Pokémon",
  "iPhone",
  "TikTok",
  "Netflix",
  "Lego",
  "Minecraft",
  "Snapchat",
  "Mario",
  "Minions",
  "PlayStation",
  "YouTube",
  "Emoji",
  "Google",
  "AirPods",
  "Fortnite",

  // Extra additions
  "Coffee",
  "Ateeq",
  "Gays",
  "Dashti",
  "Shagging",
  "Mallu",
  "Dragon",
  "Game Of Thrones",

];


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
  const secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  const impostor = players[Math.floor(Math.random() * players.length)];
  const starter = players[Math.floor(Math.random() * players.length)]; 
  await db.ref(`rooms/${roomCode}`).update({
    word: secretWord,
    impostor,
    starter,
  });
};

export const restartGame = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  const snapshot = await roomRef.once("value");
  const roomData = snapshot.val();

  if (!roomData || !roomData.players) return;

  const playerIds = Object.keys(roomData.players);
  const newImpostor = playerIds[Math.floor(Math.random() * playerIds.length)];
  const newStarter = playerIds[Math.floor(Math.random() * playerIds.length)];
  const newWord = wordList[Math.floor(Math.random() * wordList.length)];

  await roomRef.update({
    impostor: newImpostor,
    word: newWord,
    starter: newStarter,
    countdown: 3,
  });
};

export const leaveRoom = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  await roomRef.remove(); // Deletes the entire room from Firebase
};
