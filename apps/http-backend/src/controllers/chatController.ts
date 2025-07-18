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
