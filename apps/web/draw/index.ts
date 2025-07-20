import axios from "axios";
import { HTTP_BACKEND_URL } from "../config/links";

type Shape =
  | {
      type: "rect";
      xstart: number;
      ystart: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      xstart: number;
      ystart: number;
      radius: number;
    }
  | {
      type: "line";
      xstart: number;
      ystart: number;
      xend: number;
      yend: number;
    }
  | {
      type: "pencil";
      options: { color: string; lineWidth: number; lineCap: CanvasLineCap };
      points: { x: number; y: number }[];
    };

export type SelectedShape = "rect" | "circle" | "line" | "pencil" | "erasure";

let initialShapes: Shape[] = [];

/**
 * Helper function to check if a point is close to a line segment.
 * @param p The point to check (e.g., the mouse cursor).
 * @param a The start point of the line segment.
 * @param b The end point of the line segment.
 * @param threshold The distance threshold (how close is "near").
 */
function isPointNearLine(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
  threshold = 5
): boolean {
  const L2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (L2 === 0)
    return Math.sqrt((p.x - a.x) ** 2 + (p.y - a.y) ** 2) < threshold;
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / L2;
  t = Math.max(0, Math.min(1, t));
  const closestX = a.x + t * (b.x - a.x);
  const closestY = a.y + t * (b.y - a.y);
  const distance = Math.sqrt((p.x - closestX) ** 2 + (p.y - closestY) ** 2);
  return distance < threshold;
}

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  selectedShapeRef: React.RefObject<SelectedShape>
) => {
  // Join the WebSocket room for collaboration
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "join-room", roomId }));
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  // Set canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "rgb(20, 20, 20)"; // Set background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Load existing shapes from the backend
  initialShapes = await getAllShapes(roomId);

  // Initial render of the canvas with loaded shapes
  clearAndRedraw(ctx, canvas, initialShapes);

  // Listen for new shapes from other users via WebSocket
  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.type === "chat" && parsedData.message) {
      try {
        const shape: Shape =
          typeof parsedData.message === "string"
            ? JSON.parse(parsedData.message)
            : parsedData.message;

        initialShapes.push(shape);
        clearAndRedraw(ctx, canvas, initialShapes);
      } catch (err) {
        console.error("Error parsing shape from WebSocket:", err);
      }
    }
  };

  // --- Drawing State ---
  let clicked = false;
  let XStart = 0;
  let YStart = 0;
  let currentPencilPath: { x: number; y: number }[] = [];

  // --- Event Handlers ---
  const onMouseDown = (e: MouseEvent) => {
    clicked = true;
    XStart = e.offsetX;
    YStart = e.offsetY;

    if (selectedShapeRef.current === "pencil") {
      currentPencilPath = [{ x: XStart, y: YStart }];
    }
  };

  const onMouseUp = (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    const xCurrent = e.offsetX;
    const yCurrent = e.offsetY;

    const shapeType = selectedShapeRef.current;
    let newShape: Shape | null = null;

    if (shapeType === "rect") {
      newShape = {
        type: "rect",
        xstart: Math.min(XStart, xCurrent),
        ystart: Math.min(YStart, yCurrent),
        width: Math.abs(xCurrent - XStart),
        height: Math.abs(yCurrent - YStart),
      };
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(
        (xCurrent - XStart) ** 2 + (yCurrent - YStart) ** 2
      );
      newShape = { type: "circle", xstart: XStart, ystart: YStart, radius };
    } else if (shapeType === "line") {
      newShape = {
        type: "line",
        xstart: XStart,
        ystart: YStart,
        xend: xCurrent,
        yend: yCurrent,
      };
    } else if (shapeType === "pencil") {
      if (currentPencilPath.length > 1) {
        newShape = {
          type: "pencil",
          options: { color: "white", lineWidth: 2, lineCap: "round" },
          points: currentPencilPath,
        };
      }
      currentPencilPath = [];
    }

    if (newShape) {
      console.log(newShape);
      initialShapes.push(newShape);
      clearAndRedraw(ctx, canvas, initialShapes);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(newShape),
          roomId,
        })
      );
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!clicked) return;

    //  console.log(selectedShapeRef)
    const xCurrent = e.offsetX;
    const yCurrent = e.offsetY;
    const shapeType = selectedShapeRef.current;

    // Redraw everything to show a live preview of the shape being drawn
    clearAndRedraw(ctx, canvas, initialShapes);
    ctx.strokeStyle = "white"; // Preview color

    if (shapeType === "rect") {
      const width = Math.abs(xCurrent - XStart);
      const height = Math.abs(yCurrent - YStart);
      ctx.strokeRect(
        Math.min(XStart, xCurrent),
        Math.min(YStart, yCurrent),
        width,
        height
      );
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(
        (xCurrent - XStart) ** 2 + (yCurrent - YStart) ** 2
      );
      ctx.beginPath();
      ctx.arc(XStart, YStart, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shapeType === "line") {
      ctx.beginPath();
      ctx.moveTo(XStart, YStart);
      ctx.lineTo(xCurrent, yCurrent);
      ctx.stroke();
    } else if (shapeType === "pencil") {
      currentPencilPath.push({ x: e.offsetX, y: e.offsetY });

      if (currentPencilPath.length === 0) return;

      ctx.lineCap = "round";
      ctx.lineWidth = 2; // currently default fututre todo to improve upon user demand
      // todo have to find out the cause of this issue and fix it thatis the use (!)
      ctx.beginPath();
      ctx.moveTo(currentPencilPath[0]!.x, currentPencilPath[0]!.y);
      for (let i = 1; i < currentPencilPath.length; i++) {
        ctx.lineTo(currentPencilPath[i]!.x, currentPencilPath[i]!.y);
      }
      ctx.stroke();
    } else if (shapeType === "erasure") {
      // Loop through all saved shapes in reverse.
      // We loop backwards because if we remove an item, it won't mess up the index of the next items.
      if (initialShapes.length < 1) return;
      for (let i = initialShapes.length - 1; i >= 0; i--) {
        const shape = initialShapes[i];
        let hit = false;

        // --- Collision Detection Logic ---
        if (shape!.type === "rect") {
          // Check if the eraser's current position (xCurrent, yCurrent) is inside the rectangle.
          hit =
            xCurrent > shape!.xstart &&
            xCurrent < shape!.xstart + shape!.width &&
            yCurrent > shape!.ystart &&
            yCurrent < shape!.ystart + shape!.height;
        } else if (shape!.type === "circle") {
          // Check if the distance from the eraser to the circle's center is less than its radius.
          const distance = Math.sqrt(
            (xCurrent - shape!.xstart) ** 2 + (yCurrent - shape!.ystart) ** 2
          );
          hit = distance < shape!.radius;
        } else if (shape!.type === "line") {
          hit = isPointNearLine(
            { x: xCurrent, y: yCurrent },
            { x: shape!.xstart, y: shape!.ystart },
            { x: shape!.xend, y: shape!.yend }
          );
        } else if (shape!.type === "pencil") {
          // Check if the point is near any segment of the pencil path
          for (let j = 0; j < shape!.points.length - 1; j++) {
            if (
              isPointNearLine(
                { x: xCurrent, y: yCurrent },
                shape!.points[j]!,
                shape!.points[j + 1]!
              )
            ) {
              hit = true;
              break;
            }
          }
        }
        if (hit) {
          console.log("hit happened");
          initialShapes.splice(i, 1);
          clearAndRedraw(ctx, canvas, initialShapes);
          break;
        }
      }
    }
  };

  // Attach event listeners to the canvas
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
};
/**
 * Clears the canvas and redraws all shapes from the provided array.
 */
function clearAndRedraw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(20, 20, 20)"; // Set background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const shape of shapes) {
    ctx.strokeStyle = "white"; // Default stroke color for saved shapes

    if (shape.type === "rect") {
      ctx.strokeRect(shape.xstart, shape.ystart, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.xstart, shape.ystart, shape.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (shape.type === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.xstart, shape.ystart);
      ctx.lineTo(shape.xend, shape.yend);
      ctx.stroke();
    } else if (shape.type === "pencil") {
      if (shape.points.length < 2) continue;

      // Apply saved styles for the pencil path
      ctx.strokeStyle = shape.options.color;
      ctx.lineWidth = shape.options.lineWidth;
      ctx.lineCap = shape.options.lineCap;

      ctx.beginPath();
      // Use non-null assertion (!) as we've checked the length
      ctx.moveTo(shape.points[0]!.x, shape.points[0]!.y);
      for (let i = 1; i < shape.points.length; i++) {
        ctx.lineTo(shape.points[i]!.x, shape.points[i]!.y);
      }
      ctx.stroke();
    }
  }
}

async function getAllShapes(roomId: string): Promise<Shape[]> {
  const token = localStorage.getItem("token");
  if (!token) return [];

  try {
    const res = await axios.get(`${HTTP_BACKEND_URL}/chats/room/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;
    if (!Array.isArray(data)) return [];

    // Parse the message strings into Shape objects
    return data
      .map((msg: string) => {
        try {
          return JSON.parse(msg) as Shape;
        } catch {
          return null;
        }
      })
      .filter((s): s is Shape => s !== null);
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    // Return an empty array if an error occurs
    return [];
  }
}
