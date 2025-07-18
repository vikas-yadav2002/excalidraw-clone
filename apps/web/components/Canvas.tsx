import { useEffect, useRef } from "react";
import { initDraw } from "../draw";
import { useSocket } from "../hooks/useSocket";

export function Canvas({
  roomSlug,
  roomId,
}: {
  roomSlug: string;
  roomId: string;
}) {
  const canvasrf = useRef<HTMLCanvasElement | null>(null);
  const { socket, loading, error } = useSocket();

  useEffect(() => {
    const canvas = canvasrf.current;
    if (!canvas || !socket) return;

    if (socket.readyState === WebSocket.OPEN) {
      initDraw(canvas, roomId, socket);
    } else {
      socket.addEventListener("open", () => {
        initDraw(canvas, roomId, socket);
      });
    }
  }, [socket]);

  if (loading) {
    return <div>Connecting to the server with {roomSlug}...</div>;
  }

  if (!loading && socket) {
    return <canvas ref={canvasrf} width={800} height={800}></canvas>;
  }

  return <div>There may be some error.</div>;
}
