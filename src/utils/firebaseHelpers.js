import { db } from "../firebase";

const wordList = [
  // Places
  "Airport",
  "Library",
  "Beach",
  "Hospital",
  "Restaurant",
  "Jungle",
  "Cave",
  "Cinema",
  "Bakery",
  "Stadium",
  "Farm",
  "Hotel",
  "Museum",
  "Park",
  "Desert",
  "Factory",
  "Theater",
  "Supermarket",
  "Garage",
  "Mountain",
  "Aquarium",
  "Subway",
  "Castle",
  "Circus",
  "Campsite",
  "Mall",
  "Space Station",
  "Amusement Park",
  "Haunted House",

  // Objects
  "Toothbrush",
  "Laptop",
  "Backpack",
  "Telephone",
  "Sunglasses",
  "Telescope",
  "Pillow",
  "Clock",
  "Microwave",
  "Broom",
  "Helmet",
  "Key",
  "Wallet",
  "Mirror",
  "Shoes",
  "Towel",
  "Remote",
  "Headphones",
  "Spoon",
  "Camera",

  // Events
  "Birthday Party",
  "Wedding",
  "Graduation",
  "Concert",
  "Picnic",
  "Job Interview",
  "Funeral",
  "Sport Match",
  "First Date",
  "Baby Shower",
  "Fire Drill",

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
  "Dancing",
  "Singing",
  "Studying",
  "Hiking",
  "Sleeping",
  "Gaming",
  "Fishing",
  "Shopping",
  "Reading",
  "Writing",
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
  await db.ref(`rooms/${roomCode}`).update({
    word: secretWord,
    impostor,
  });
};

export const restartGame = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  const snapshot = await roomRef.once("value");
  const roomData = snapshot.val();

  if (!roomData || !roomData.players) return;

  const playerIds = Object.keys(roomData.players);
  const newImpostor = playerIds[Math.floor(Math.random() * playerIds.length)];
  const newWord = wordList[Math.floor(Math.random() * wordList.length)];

  await roomRef.update({
    impostor: newImpostor,
    word: newWord,
    countdown: 3,
  });
};

export const leaveRoom = async (roomCode) => {
  const roomRef = db.ref(`rooms/${roomCode}`);
  await roomRef.remove(); // Deletes the entire room from Firebase
};
