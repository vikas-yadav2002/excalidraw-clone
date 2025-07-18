import axios from "axios";
import { HTTP_BACKEND_URL } from "../config/links";
import { AnyCnameRecord } from "dns";

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

let initialShapes: Shape[] = [];

export const initDraw = async (
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket
) => {
  console.log("roomId:", roomId);
  if (socket.readyState === WebSocket.OPEN) {
    const data = {
      type: "join-room",
      roomId,
    };
    socket.send(JSON.stringify(data));
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  initialShapes = await getAllShapes(roomId);

  // Fill background
  ctx.fillStyle = "rgb(20, 20, 20)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  console.log("calling ssocket");
  //socket logic

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

  console.log("after socket");

  let clicked = false;
  let XStart = 0;
  let YStart = 0;

  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    XStart = e.clientX;
    YStart = e.clientY;
  });

  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    const xCurrent = e.clientX;
    const yCurrent = e.clientY;

    const x = Math.min(XStart, xCurrent);
    const y = Math.min(YStart, yCurrent);
    const width = Math.abs(xCurrent - XStart);
    const height = Math.abs(yCurrent - YStart);

    const newShape: Shape = {
      type: "rect",
      xstart: x,
      ystart: y,
      width,
      height,
    };

    const data = {
      type: "chat",
      message: JSON.stringify(newShape),
      roomId,
    };

    socket.send(JSON.stringify(data));

    initialShapes.push(newShape);
    clearCanvas(ctx, canvas, initialShapes);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      const xCurrent = e.clientX;
      const yCurrent = e.clientY;

      const x = Math.min(XStart, xCurrent);
      const y = Math.min(YStart, yCurrent);
      const width = Math.abs(xCurrent - XStart);
      const height = Math.abs(yCurrent - YStart);

      clearCanvas(ctx, canvas, initialShapes);

      ctx.strokeStyle = "white";
      ctx.strokeRect(x, y, width, height);
    }
  });

  clearCanvas(ctx, canvas, initialShapes); // draw already present shapes initially
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

    const allShapes: Shape[] = data
      .map((messageString: string) => {
        try {
          return JSON.parse(messageString) as Shape;
        } catch {
          return null;
        }
      })
      .filter((shape): shape is Shape => shape !== null);

    return allShapes;
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return [];
  }
}
