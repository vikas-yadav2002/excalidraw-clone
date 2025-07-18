import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

interface ChatRequest extends Request {
  user?: {
    id: string;
    name?: string;
  };
  params: {
    roomSlug: string;
  };
}

// Get room by slug
const getRoom = async (slug: string) => {
  const room = await prismaClient.room.findFirst({
    where: { slug },
  });
  return room;
};

export const chat = async (req: ChatRequest, res: Response) => {
  const roomSlug = req.params.roomSlug;

  if (!roomSlug) {
    return res.status(400).json({
      success: false,
      message: "Room slug is not present in the URL",
    });
  }

  const room = await getRoom(roomSlug);

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "No room found with this slug",
    });
  }

  // Fetch last 50 messages for the room
  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: room.id,
    },
    orderBy: {
      id: 'desc', // or 'asc' based on latest first or not
    },
    take: 50,
    // include: {
    //   user: true, // If chat has a relation to user (optional)
    // },
  });

  return res.json({
    success: true,
    message : chats,
    roomId : room.id,
    user: req.user || null,
  });
};


export const getRoomBySlug = async (req: Request, res: Response) => {
  const { roomSlug } = req.params;

  if (!roomSlug) {
    return res.status(400).json({
      success: false,
      message: "Room slug is required in URL",
    });
  }

  const room = await getRoom(roomSlug); // or use prismaClient.room.findUnique({ where: { slug: roomSlug } })

  if (!room) {
    return res.status(404).json({
      success: false,
      message: "No room found with this slug",
    });
  }

  return res.status(200).json({
    success: true,
    roomId: room.id,
  });
};

export const getChatsByRoomId = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({
      success: false,
      message: "Room ID is required in URL",
    });
  }

  const parsedRoomId = parseInt(roomId, 10);
  if (isNaN(parsedRoomId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Room ID",
    });
  }

  const chats = await prismaClient.chat.findMany({
    where: {
      roomId: parsedRoomId,
    },
    orderBy: {
      id: 'desc',
    },
    take: 50,
  });

  return res.status(200).json(
  chats.map(chat => chat.message)
  );
};