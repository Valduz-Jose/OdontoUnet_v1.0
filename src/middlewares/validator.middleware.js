import { ZodError } from "zod";

export const validateSchema = (schema)=> (req,res,next)=>{
    const result = schema.safeParse(req.body);
    if (!result.success) {
        // console.log(result.error.issues.map((err)=>err.message))
        return res.status(400).json(
            result.error.issues.map((err)=>err.message),
        )
    }
    req.body = result.data;
    next();
}

// export const validateSchema = (schema)=> (req,res,next)=>{

// }

// try {
//         schema.parse(req.body);
//         next();
//     } catch (error) {
//         return res
//         .status(400).
//         json(error.errors.map((error)=>error.message));
//     }