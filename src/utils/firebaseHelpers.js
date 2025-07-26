import { db } from "../firebase";

const wordList = [
  // Places
  "Airport",
  "Library",
  "Beach",
  "Jungle",
  "Cave",
  "Cinema",
  "Stadium",
  "Hotel",
  "Museum",
  "Factory",
  "Theater",
  "Garage",
  "Castle",
  "Circus",
  "Mall",
  "Zoo",

  // Objects
  "Toothbrush",
  "Laptop",
  "Telephone",
  "Telescope",
  "Pillow",
  "Clock",
  "Knife",
  "Broom",
  "Helmet",
  "Key",
  "Wallet",
  "Mirror",
  "Shoes",
  "Remote",
  "Headphones",
  "Spoon",
  "Camera",
  "Washing Machine",

  // Events
  "Birthday Party",
  "Wedding",
  "Graduation",
  "Concert",
  "Picnic",
  "Job Interview",
  "Funeral",
  "First Date",
  "Baby Shower",

  // Roles
  "Doctor",
  "Teacher",
  "Chef",
  "Pilot",
  "Artist",
  "Farmer",
  "Police Officer",
  "Astronaut",
  "Actor",
  "Magician",
  "Nurse",
  "Scientist",
  "Waiter",

  // Activities
  "Swimming",
  "Cooking",
  "Painting",
  "Singing",
  "Studying",
  "Hiking",
  "Sleeping",
  "Gaming",
  "Fishing",
  "Shopping",
  "Writing",

  // Random words
  "Egypt",
  "Harry Potter",
  "Magnet",
  "Deodorant",
  "Michael Jackson",
  "Ateeq Rana",
  "Gays",
  "Dajjal",
  "Game Of Thrones",
  "Red Bull",
  "Buddha",
  "Bitcoin",
  "Social Media",
  "Among Us",
  "Rapist",
  "Pokemon",
  "Pharoah",
  "Mr. Bean",
  "TikTok",
  "Naruto",
  "Rick and Morty",
  "Minions",
  "Barbie",
  "UFO",
  "Kim Kardashian",
  "Spider-Man",
  "Squid Game",
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
  const starter = players[Math.floor(Math.random() * players.length)]; // 👈 New
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
