import {email, z} from 'zod'

export const registerSchema = z.object({
username: z.string({
    required_error: 'Username is required',
    message: 'Username is required'
}),
email: 
    z.email({
        required_error: 'Email is required',
        message: 'Invalid email'
    }).min(1,{
        message: "Email cannot be empty"
    }),
password: 
    z.string({
       required_error: 'Password is required',
       message: 'Password is required'
    }).min(6,{
        message: "Password must be at last 6 characters"
    }),
})

export const loginSchema = z.object({
    email:z.email({
        required_error: "Email is required",
        message: "Email is not valid",
    }),
    password: z.string({
        required_error:"Password is required",
    }).min(6,{
        message: "Password must be at least 6 characters",
    }),
})