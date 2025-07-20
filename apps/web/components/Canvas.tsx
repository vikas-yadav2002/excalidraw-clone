'use client';

import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { useSocket } from "../hooks/useSocket";
import { RectangleHorizontal, Circle, Minus, Pencil , Eraser } from 'lucide-react'; // Using Oval from lucide

// Added "pencil" to the type definition to match the button array
type ShapeType = "rect" | "circle"  | "line" | "pencil" | "erasure";

// A mapping from shape names to their corresponding lucide-react icons
const shapeIcons: Record<ShapeType, React.ReactNode> = {
  rect: <RectangleHorizontal size={20} />,
  circle: <Circle size={20} />,
  line: <Minus size={20} />,
  pencil: <Pencil size={20} />,
  erasure : <Eraser size={20}/>
};

export function Canvas({ roomSlug, roomId }: { roomSlug: string; roomId: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { socket, loading } = useSocket();

  const [selectedShape, setSelectedShape] = useState<ShapeType>("rect");
  const shapeRef = useRef<ShapeType>("rect");

  useEffect(() => {
    // Keep the ref updated with the latest selected shape
    shapeRef.current = selectedShape;
  }, [selectedShape]);

  useEffect(() => {
    if (!canvasRef.current || !socket || loading) return;

    // Pass the ref to the drawing initialization function
    initDraw(canvasRef.current, roomId, socket, shapeRef);
  }, [socket, loading, roomId]); // Added roomId to dependency array

  if (loading) {
    return <div className="flex items-center justify-center h-full">Connecting to {roomSlug}...</div>;
  }

  if (!socket) {
    return <div className="flex items-center justify-center h-full">Could not connect to the server.</div>;
  }

  return (
    <div className="relative w-full h-full">
      {/* Canvas Element */}
      <canvas 
        ref={canvasRef} 
        className="border border-gray-300 bg-white" 
        width={800} 
        height={800}
      ></canvas>

      {/* Shape Selector Toolbar */}
      <div className="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200 z-10">
        {(Object.keys(shapeIcons) as ShapeType[]).map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape)}
            className={` cursor-grab w-10 h-10 flex items-center justify-center rounded-md border transition-all duration-150 ${
              selectedShape === shape 
                ? "bg-blue-500 text-white border-blue-600" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:border-gray-400"
            }`}
            title={`Select ${shape.charAt(0).toUpperCase() + shape.slice(1)}`} 
          >
            {shapeIcons[shape]}
          </button>
        ))}
      </div>
    </div>
  );
}
