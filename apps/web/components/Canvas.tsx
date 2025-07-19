import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { useSocket } from "../hooks/useSocket";

type ShapeType = "rect" | "circle" | "oval" | "line";

export function Canvas({ roomSlug, roomId }: { roomSlug: string; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { socket, loading, error } = useSocket();

  const [selectedShape, setSelectedShape] = useState<ShapeType>("rect");

 const shapeRef = useRef<ShapeType>("rect");

useEffect(() => {
  shapeRef.current = selectedShape; // always store the latest shape
}, [selectedShape]);

useEffect(() => {
  if (!canvasRef.current || !socket) return;

  initDraw(canvasRef.current, roomId, socket, shapeRef); // pass ref, not value
}, [socket, loading]);


  if (loading) {
    return <div>Connecting to the server with {roomSlug}...</div>;
  }

  if (!socket) {
    return <div>There may be some error connecting WebSocket.</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Canvas */}
      <canvas ref={canvasRef} className="border border-gray-400" width={800} height={800}></canvas>

      {/* Shape Selector (inline inside Canvas) */}
      <div className="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded shadow-md z-10">
        {["rect", "circle", "oval", "line"].map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape as ShapeType)}
            className={`w-10 h-10 flex items-center justify-center rounded border ${
              selectedShape === shape ? "bg-blue-500" : "bg-gray-100"
            }`}
          >
            {shape === "rect" && (
              <svg width="20" height="20">
                <rect width="16" height="10" x="2" y="5" stroke="black" fill="none" strokeWidth="2" />
              </svg>
            )}
            {shape === "circle" && (
              <svg width="20" height="20">
                <circle cx="10" cy="10" r="6" stroke="black" fill="none" strokeWidth="2" />
              </svg>
            )}
            {shape === "oval" && (
              <svg width="24" height="20">
                <ellipse cx="12" cy="10" rx="8" ry="4" stroke="black" fill="none" strokeWidth="2" />
              </svg>
            )}
            {shape === "line" && (
              <svg width="20" height="20">
                <line x1="2" y1="18" x2="18" y2="2" stroke="black" strokeWidth="2" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
