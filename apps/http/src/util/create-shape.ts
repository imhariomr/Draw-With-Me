import { prismaClient } from "@repo/db/client";
import { shapeValidator } from "../validation/shape.validation"

export const createShape = async (payload: any) => {
  const parsedData = shapeValidator.safeParse(payload);
  if (!parsedData.success) {
    console.log("parsedData",parsedData);
    throw new Error(parsedData.error.issues[0]?.message || "Invalid shape data");
  }
  const { type, X, y, drawX, drawY, radius, slug } = parsedData.data;

  const shapeData: any = {
    type,
    X,
    y,
    slug: slug,
  };

  if (type === "rectangle") {
    shapeData.drawX = drawX;
    shapeData.drawY = drawY;
  } else if (type === "circle") {
    shapeData.radius = radius;
  } else {
    throw new Error("Unsupported shape type");
  }

  const newShape = await prismaClient.shape.create({
    data: shapeData,
  });

  return newShape;
};


export const deleteShape = async(payload:any)=>{
  const deletedShape = await prismaClient.shape.delete({
    where:{
      id: payload?.id
    }
  })
  return deletedShape;
}


