'use client';

import { useState } from 'react';

export default function RoomManager() {
  const [roomToCreate, setRoomToCreate] = useState('');
  const [roomToJoin, setRoomToJoin] = useState('');

  const handleCreateRoom = () => {
    if (!roomToCreate.trim()) return alert("Please enter a room name.");
    alert(`Creating room: ${roomToCreate}`);
    setRoomToCreate('');
  };

  const handleJoinRoom = () => {
    if (!roomToJoin.trim()) return alert("Please enter a room name.");
    alert(`Joining room: ${roomToJoin}`);
    setRoomToJoin('');
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">

      {/* Left - Create Room */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <h2 className="text-4xl font-bold text-blue-400 mb-6">Create a Room</h2>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomToCreate}
          onChange={(e) => setRoomToCreate(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          onClick={handleCreateRoom}
          className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-lg transition duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          Create Room
        </button>

        {/* Additional Info */}
        <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
          💡 Customize your room, add a password, and invite friends after creation. These features will be available soon.
        </p>
      </div>

      {/* Divider */}
      <div className="w-px bg-gray-700 h-full" />

      {/* Right - Join Room */}
      <div className="w-1/2 flex flex-col justify-center items-center px-12">
        <h2 className="text-4xl font-bold text-green-400 mb-6">Join a Room</h2>
        <input
          type="text"
          placeholder="Enter room name"
          value={roomToJoin}
          onChange={(e) => setRoomToJoin(e.target.value)}
          className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        />
        <button
          onClick={handleJoinRoom}
          className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold rounded-lg transition duration-200 ease-in-out hover:scale-105 active:scale-95"
        >
          Join Room
        </button>

        {/* Additional Info */}
        <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
          🔑 Make sure the room name is correct. Some rooms may be private and require a password (feature coming soon).
        </p>
      </div>
    </div>
  );
}
