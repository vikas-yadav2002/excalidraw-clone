"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // npm install sonner

export default function RoomManager() {
  const router = useRouter();

  const [roomToCreate, setRoomToCreate] = useState("");
  const [roomToJoin, setRoomToJoin] = useState("");

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);

  /* ----------------------------------------------------
     CREATE ROOM (Production Ready)
  ------------------------------------------------------*/
  const handleCreateRoom = async () => {
    if (!roomToCreate.trim()) {
      toast.error("Room name cannot be empty.");
      return;
    }

    setLoadingCreate(true);

    try {
      const res = await fetch("/api/v1/rooms/create-room", {
        method: "POST",
        body: JSON.stringify({ slug: roomToCreate }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create room.");
        setLoadingCreate(false);
        return;
      }

      toast.success("Room created successfully!");

      router.push(`/room/canvas/${data.slug}`);

    } catch (err) {
      toast.error("Unexpected server error.");
      console.error(err);
    }

    setLoadingCreate(false);
  };

  /* ----------------------------------------------------
     JOIN ROOM (Production Ready)
  ------------------------------------------------------*/
  const handleJoinRoom = async () => {
    if (!roomToJoin.trim()) {
      toast.error("Enter a room name to join.");
      return;
    }

    setLoadingJoin(true);

    try {
      const res = await fetch(`http://localhost:3003/api/v1/rooms/check-room?slug=${roomToJoin}`)
      const data = await res.json();

      if (!data.exists) {
        alert("No room found with this name.");
        setLoadingJoin(false);
        return;
      }

      toast.success("Joining room...");
      router.push(`/room/canvas/${roomToJoin}`);

    } catch (err) {
      toast.error("Unexpected server error.");
      console.error(err);
    }

    setLoadingJoin(false);
  };

  return (
    <div className="relative h-screen w-full bg-gray-900 text-white">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:2rem_2rem]" />

      {/* Foreground content */}
      <div className="relative z-10 flex h-full w-full">
        
        {/* Left - Create room */}
        <div className="w-1/2 flex flex-col justify-center items-center px-12">
          <h2 className="text-4xl font-bold text-emerald-400 mb-6">
            Create a Room
          </h2>

          <input
            type="text"
            placeholder="Enter a new room name"
            value={roomToCreate}
            onChange={(e) => setRoomToCreate(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />

          <button
            disabled={loadingCreate}
            onClick={handleCreateRoom}
            className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex justify-center items-center"
          >
            {loadingCreate ? (
              <span className="loader border-white border-t-transparent"></span>
            ) : (
              "Create & Go"
            )}
          </button>

          <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
            💡 Start a new collaborative session and invite others to join.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-700 h-3/4 self-center"></div>

        {/* Right - Join room */}
        <div className="w-1/2 flex flex-col justify-center items-center px-12">
          <h2 className="text-4xl font-bold text-emerald-400 mb-6">
            Join a Room
          </h2>

          <input
            type="text"
            placeholder="Enter existing room name"
            value={roomToJoin}
            onChange={(e) => setRoomToJoin(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-gray-500"
          />

          <button
            disabled={loadingJoin}
            onClick={handleJoinRoom}
            className="mt-4 w-full max-w-md py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition duration-200 ease-in-out transform hover:scale-105 active:scale-95 flex justify-center items-center"
          >
            {loadingJoin ? (
              <span className="loader border-white border-t-transparent"></span>
            ) : (
              "Join Room"
            )}
          </button>

          <p className="text-sm text-gray-400 mt-8 max-w-md text-center">
            🔑 Enter the exact room name to join the shared workspace.
          </p>
        </div>
      </div>

      {/* Loader CSS */}
      <style>
        {`
          .loader {
            width: 20px;
            height: 20px;
            border: 3px solid #fff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 0.6s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
