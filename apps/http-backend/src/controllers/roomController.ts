import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { CreateRoomPayloadSchema, RoomSchema } from "@repo/common/types";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string; 
    name: string;
    email: string; 
    iat: number; 
    exp: number; 
  };
}

const createRoom = async (req: AuthenticatedRequest, res: Response) => {
 
  const adminId = req.user?.id;
  console.log(req.user)
  
  if (!adminId) {
    return res.status(401).json({
      message: "Unauthorized: User not authenticated or ID not found in token.",
    });
  }

  // Get slug from the request body
  const { slug } = req.body;

  // Validate the slug from the payload
  const validationResult = CreateRoomPayloadSchema.safeParse({
    slug: slug,
    adminId: adminId, // Pass the adminId obtained from req.user to the schema for validation
  });

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Invalid request payload. Please ensure 'slug' is provided and valid.",
      errors: validationResult.error,
    });
  }

  // Destructure validated slug (adminId is already secured from req.user)
  const { slug: validatedSlug } = validationResult.data;

  try {
    // Check if a room with the given slug already exists
    const existingRoom = await prismaClient.room.findUnique({
      where: {
        slug: validatedSlug,
      },
    });

    if (existingRoom) {
      return res.status(409).json({
        message: "Room with this slug already exists. Please choose a different slug.",
        room: existingRoom,
      });
    }

    // Create the new room in the database
    const newRoom = await prismaClient.room.create({
      data: {
        adminId: adminId, 
        slug: validatedSlug,
      },
    });
    const parsedNewRoom = RoomSchema.safeParse(newRoom);

    if (!parsedNewRoom.success) {
      console.error("Internal server error: Failed to parse created room object:", parsedNewRoom.error);
      return res.status(500).json({
        message: "Room created, but there was an issue processing its data.",
        errors: parsedNewRoom.error,
      });
    }

    console.log(`Room ${newRoom.id} created by ${newRoom.adminId} (slug: ${newRoom.slug})`);
    console.log("Room data saved to DB:", newRoom);

    res.status(201).json({
      message: "Room created successfully",
      room: newRoom,
    });

  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({
      message: "Failed to create room due to an internal server error.",
    });
  }
};

export { createRoom };