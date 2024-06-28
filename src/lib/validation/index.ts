import { z } from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2,{message: "Too Short!"}),
    username: z.string().min(4,{message: "Too Short!"}).max(12,{message:"Too Long!"}),
    email: z.string().email({message:"Enter a valid email address!"}),
    password: z.string().min(8,{message: 'Password mus be atleast 8 character!'})
  });

  export const SignInValidation = z.object({
    email: z.string().email({message:"Enter a valid email address!"}),
    password: z.string().min(8,{message: 'Password mus be atleast 8 character!'})
  });