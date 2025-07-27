import { Request, Response } from "express";
import {
  roomNameValidator,
  roomValidator,
  shapeValidator,
} from "../validation/shape.validation";
import { prismaClient } from "@repo/db/client";

export const createRoom = async (req: Request, res: Response) => {
  const parsedData: any = roomNameValidator.safeParse(req.body);
  if (!parsedData?.success) {
    const zodError = parsedData?.error;
    const firstError = zodError?.errors?.[0];
    const errorMessage = firstError ? `${firstError.path.join('.')}: ${firstError.message}`: "Invalid input";
    res.status(400).json({ message: errorMessage });
    return;
  }
  const { roomName, user } = parsedData?.data;
  try {
    const findRoomSlug = await prismaClient.room.findUnique({
      where: { slug: roomName },
    });
    if (findRoomSlug) {
      return res.status(409).json({ message: "Room already exists" });
    }
    const newRoom = await prismaClient.room.create({
      data: {
        slug: roomName,
        user: user,
      },
    });
    return res.status(200).json({message: newRoom});
  } catch (err: any) {
    // console.log("createRoomError", err);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

// export const createShape = async (req: Request, res: Response) => {
//   const parsedData: any = shapeValidator.safeParse(req.body);
//   if (!parsedData) {
//     res.status(500).json({ message: parsedData?.error[0]?.message });
//     return;
//   }
//   const { type, X, y, drawX, drawY, radius, roomId } = parsedData.data;

//   try {
//     const shapeData: any = {
//       type,
//       X,
//       y,
//       roomId: roomId || 1,
//     };
//     if (type === "rectangle") {
//       shapeData.drawX = drawX;
//       shapeData.drawY = drawY;
//     } else if (type === "circle") {
//       shapeData.radius = radius;
//     } else {
//       return res.status(400).json({ message: "Unsupported shape type" });
//     }

//     const newShape = await prismaClient.shape.create({ data: shapeData });
//     return res.status(201).json({ shape: newShape });
//   } catch (err: any) {
//     console.log("createShape", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

export const getAllShapes = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  try {
    const parsedData = roomValidator.safeParse({ slug });
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.issues[0]?.message || "Invalid room slug" });
    }

    const shapes = await prismaClient.shape.findMany({
      where: {
        room: {
          slug: parsedData.data.slug,
        },
      },
    });

    return res.status(200).json({ data: shapes });
  } catch (err) {
    console.log("getAllShapes error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllRooms = async(req:Request,res:Response) =>{
  try{
    const data = await prismaClient.room.findMany();
    return res.status(200).json({data:data})
  }catch(err){
    console.log("getAllRooms error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export const deleteShape = async(req:Request,res:Response)=>{
  const {id} = req.body;
  const deletedShape = await prismaClient.shape.delete({
    where:{
      id
    }
  })

  return res.status(200).json({deletedShape})
}