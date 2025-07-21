"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RoomManager() {
  const [roomToCreate, setRoomToCreate] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const handleCreateRoom = () => {
    if (!roomToCreate.trim()) return alert("Please enter a room name."); // For now, we are just alerting. This can be replaced with actual API call.
    alert(`Creating room: ${roomToCreate}`); // After creating, you might want to redirect the user.
    router.push(`/room/canvas/${roomToCreate}`);
    setRoomToCreate("");
  };

  const handleJoinRoom = () => {
    if (!roomToJoin.trim()) return alert("Please enter a room name.");
    router.push(`/room/canvas/${roomToJoin}`);
  };

  return (
    // Main container with relative positioning for the background
    <div className="relative h-screen w-full bg-gray-900 text-white">
            {/* Background Grid Layer */}     {" "}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
            {/* Content layer sits on top of the grid */}     {" "}
      <div className="relative z-10 flex h-full w-full">
                {/* Left - Create Room */}       {" "}
        <div className="w-1/2 flex flex-col justify-center items-center px-12">
                   {" "}
          <h2 className="text-4xl font-bold text-emerald-400 mb-6">
            Create a Room
          </h2>
                   {" "}
          <input
            type="text"
            placeholder="Enter a new room name"
            value={roomToCreate}
            onChange={(e) => setRoomToCreate(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />
                   {" "}
          <button
            onClick={handleCreateRoom}
            className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
                        Create & Go          {" "}
          </button>
                    {/* Additional Info */}         {" "}
          <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
                        💡 Start a new session and invite others to join your
            collaborative space.          {" "}
          </p>
                 {" "}
        </div>
                {/* Divider */}
                <div className="w-px bg-gray-700 h-3/4 self-center" />       {" "}
        {/* Right - Join Room */}       {" "}
        <div className="w-1/2 flex flex-col justify-center items-center px-12">
                   {" "}
          <h2 className="text-4xl font-bold text-emerald-400 mb-6">
            Join a Room
          </h2>
                   {" "}
          <input
            type="text"
            placeholder="Enter existing room name"
            value={roomToJoin}
            onChange={(e) => setRoomToJoin(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />
                   {" "}
          <button
            onClick={handleJoinRoom}
            className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95"
          >
                        Join Room          {" "}
          </button>
                    {/* Additional Info */}         {" "}
          <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
                        🔑 Enter the exact name of the room you wish to join.  
                   {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </div>
  );
}
