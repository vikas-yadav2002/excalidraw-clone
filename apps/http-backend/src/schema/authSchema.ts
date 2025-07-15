import z from "zod"

const signinSchema = z.object({
    username : z.string().email("Required email") ,
    password : z.string().min(4)
})

const signupSchema = z.object({
    username : z.string().email("Required email") ,
    name : z.string(),
    password : z.string().min(4)
})

const jwtSchema = z.object({
    token : z.string()
})

export type SigninPayload = z.infer<typeof signinSchema>;
export type SignupPayload = z.infer<typeof signupSchema>;
export {signinSchema ,signupSchema , jwtSchema}