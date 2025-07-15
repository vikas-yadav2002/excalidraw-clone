import z, { email } from "zod"

const signinSchema = z.object({
    email : z.string().email("Required email") ,
    password : z.string().min(4)
})

const signupSchema = z.object({
    name : z.string(),
    email : z.string().email(),
    password : z.string().min(4)
})

const jwtSchema = z.object({
    token : z.string()
})



// Schema for the payload expected from the middleware/headers
// This represents the information about the user creating the room.
export const CreateRoomPayloadSchema = z.object({
  name: z.string().min(1, { message: "User name is required." }),
  userId: z.string().min(1, { message: "User ID is required." }),
});

// Infer the TypeScript type for the payload
// export type CreateRoomPayload = z.infer<typeof CreateRoomPayloadSchema>;

// Schema for a Room object
// This defines the structure of a room that will be created and stored.
export const RoomSchema = z.object({
  roomId: z.string().regex(/^[0-9a-fA-F]{6}$/, { message: "Room ID must be a 6-character hexadecimal string." }), // Example: 6-char hex
  creatorId: z.string(),
  creatorName: z.string(),
  members: z.array(z.object({
    userId: z.string(),
    name: z.string(),
  })).default([]), // Array of member objects, default to empty
  createdAt: z.date().default(() => new Date()),
});

// Infer the TypeScript type for a Room
// export type Room = z.infer<typeof RoomSchema>;

// Schema for joining a room (if you were to implement a joinRoom endpoint)
export const JoinRoomSchema = z.object({
  roomId: z.string().regex(/^[0-9a-fA-F]{6}$/, { message: "Room ID must be a 6-character hexadecimal string." }),
//   name: z.string().min(1, { message: "User name is required." }),
//   userId: z.string().min(1, { message: "User ID is required." }),
});

// export type JoinRoomPayload = z.infer<typeof JoinRoomSchema>;

// export type SigninPayload = z.infer<typeof signinSchema>;
// export type SignupPayload = z.infer<typeof signupSchema>;
export {signinSchema ,signupSchema , jwtSchema}