// src/controllers/roomController.ts
import { Request, Response } from "express";
// import { CreateRoomPayloadSchema, Room, RoomSchema } from "../schema/roomSchema";
import { CreateRoomPayloadSchema,  RoomSchema } from "@repo/common/types"

// Helper function to generate a random 6-character hexadecimal string
const generateRoomId = (): string => {
  // Generate a random number and convert to hex, then slice to 6 characters
  return Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
};

const createRoom = async (req: Request, res: Response) => {
  // Middleware is expected to set 'x-user-name' and 'x-user-id' headers
//   const userName = req.headers['x-user-name'] as string | undefined;
//   const userId = req.headers['x-user-id'] as string | undefined;
   const {userName , userId}  = req.body

  // Validate the payload from headers using Zod
  const validationResult = CreateRoomPayloadSchema.safeParse({
    name: userName,
    userId: userId,
  });

  if (!validationResult.success) {
    // If validation fails, send a 400 Bad Request with validation errors
    return res.status(400).json({
      message: "Missing or invalid user information in headers. Please ensure 'x-user-name' and 'x-user-id' are provided.",
      errors: validationResult.error, // Zod's detailed error array
    });
  }

  // Destructure validated data
  const { name: creatorName, userId: creatorId } = validationResult.data;

  // Generate a unique room ID
  const newRoomId = generateRoomId();

  let newRoom ;
  try {
    newRoom = RoomSchema.parse({
      roomId: newRoomId,
      creatorId: creatorId,
      creatorName: creatorName,
      members: [{ userId: creatorId, name: creatorName }], // Creator is the first member
      createdAt: new Date(), // Set creation timestamp
    });
  } catch (error) {
    if (error) {
      console.error("Internal server error: Failed to construct room object:", error);
    } else {
      console.error("Internal server error during room construction:", error);
    }
    return res.status(500).json({
      message: "Failed to create room due to an internal server error.",
    });
  }

  // --- Database Logic Placeholder ---
  // In a real application, you would save 'newRoom' to your database here.
  // Example: await db.collection('rooms').add(newRoom);
  console.log(`Room ${newRoom.roomId} created by ${newRoom.creatorName} (${newRoom.creatorId})`);
  console.log("Room data (no DB save yet):", newRoom);
  // --- End Database Logic Placeholder ---

  // Respond with the created room details
  res.status(201).json({
    message: "Room created successfully",
    room: newRoom, // Return the full room object
  });
};

export { createRoom };