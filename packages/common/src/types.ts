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


export const CreateRoomPayloadSchema = z.object({
  slug : z.string().min(1, { message: "User name is required." }),
  adminId : z.string().min(1, { message: "admin ID is required." }),
});

export const RoomSchema = z.object({
  id: z.int(), // Example: 6-char hex
  adminId: z.string(),
  slug: z.string(),
  createdAt : z.date()
});


export const JoinRoomSchema = z.object({
  roomId: z.int(),
});


export {signinSchema ,signupSchema , jwtSchema}