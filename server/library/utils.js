import jwt from "jsonwebtoken";

// Function to generate a token for a user
export const generateToken = (userid)=>{
    const token = jwt.sign({userid}, process.env.JWT_SECRET)
    return token;
}