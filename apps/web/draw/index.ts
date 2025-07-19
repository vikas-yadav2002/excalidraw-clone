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
    };

type SelectedShape = "rect" | "circle" | "oval" | "line";

let initialShapes: Shape[] = [];

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  selectedShapeRef: React.RefObject<SelectedShape>
) => {
  // Join the WebSocket room
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "join-room", roomId }));
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Load existing shapes
  initialShapes = await getAllShapes(roomId);

  // Set canvas background
  ctx.fillStyle = "rgb(20, 20, 20)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw existing shapes
  clearCanvas(ctx, canvas, initialShapes);

  // Listen for messages from others
  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.type === "chat" && parsedData.message) {
      try {
        const shape: Shape =
          typeof parsedData.message === "string"
            ? JSON.parse(parsedData.message)
            : parsedData.message;

        initialShapes.push(shape);
        clearCanvas(ctx, canvas, initialShapes);
      } catch (err) {
        console.error("Error parsing shape from WebSocket:", err);
      }
    }
  };

  // Drawing logic
  let clicked = false;
  let XStart = 0;
  let YStart = 0;

  const onMouseDown = (e: MouseEvent) => {
    clicked = true;
    XStart = e.clientX;
    YStart = e.clientY;
  };

  const onMouseUp = (e: MouseEvent) => {
    clicked = false;

    const xCurrent = e.clientX;
    const yCurrent = e.clientY;

    const x = Math.min(XStart, xCurrent);
    const y = Math.min(YStart, yCurrent);
    const width = Math.abs(xCurrent - XStart);
    const height = Math.abs(yCurrent - YStart);

    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
    const shapeType = selectedShapeRef.current;
    let newShape: Shape | null = null;

    if (shapeType === "rect") {
      newShape = {
        type: "rect",
        xstart: x,
        ystart: y,
        width,
        height,
      };
    } else if (shapeType === "circle") {
      newShape = {
        type: "circle",
        xstart: XStart + width / 2,
        ystart: YStart + height / 2,
        radius,
      };
    }
    console.log(newShape);
    if (newShape) {
      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify(newShape),
          roomId,
        })
      );

      initialShapes.push(newShape);
      clearCanvas(ctx, canvas, initialShapes);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!clicked) return;

    const xCurrent = e.clientX;
    const yCurrent = e.clientY;

    const x = Math.min(XStart, xCurrent);
    const y = Math.min(YStart, yCurrent);
    const width = Math.abs(xCurrent - XStart);
    const height = Math.abs(yCurrent - YStart);

    const shapeType = selectedShapeRef.current;

    clearCanvas(ctx, canvas, initialShapes);
    ctx.strokeStyle = "white";

    if (shapeType === "rect") {
      ctx.strokeRect(x, y, width, height);
    } else if (shapeType === "circle") {
      const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
};

function clearCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[]
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(20, 20, 20)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const shape of shapes) {
    ctx.strokeStyle = "white";
    if (shape.type === "rect") {
      ctx.strokeRect(shape.xstart, shape.ystart, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.xstart, shape.ystart, shape.radius, 0, Math.PI * 2);
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
    return [];
  }
}
