import React from "react"

type ShapeType = "rect" | "circle" | "oval" | "line";

type ShapeSelectorProps = {
  selectedShape: ShapeType;
  setSelectedShape: React.Dispatch<React.SetStateAction<ShapeType>>;
};


export const   ShapeSelector = React.memo(({selectedShape , setSelectedShape} : ShapeSelectorProps)=>{
  return (
    <div className="absolute top-4 left-4 flex gap-2 bg-white p-2 rounded shadow-md z-10">
  {["rect", "circle", "oval", "line"].map((shape) => (
    <button
      key={shape}
      onClick={() => setSelectedShape(shape as any)}
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
  )
})