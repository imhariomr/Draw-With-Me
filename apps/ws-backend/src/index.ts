// interface room{
//     roomSlug:{
//     }
// }
import { WebSocketServer } from 'ws';
import { prismaClient } from "@repo/db/client";
import { verifyToken } from '@clerk/backend';
import 'dotenv/config'
import { createShape,deleteShape} from '../../http/dist/util/create-shape';


const wss = new WebSocketServer({
    port:4002
})
const users:any = [];
wss.on('connection',async(ws,req)=>{
    const url = req.url;
    const queryParams = new URLSearchParams(url?.split('?')[1]);
    const token:string = queryParams.get('token') || '';
    const verified = await verifyToken(token,{ secretKey: process.env.CLERK_SECRET_KEY });
    const userId = verified?.sub;
    if(!userId){
        ws.send(JSON.stringify({ type: "UNAUTHORIZED", message: "Invalid or expired token" }));
        ws.close();
    }
    ws.on('message',async (data:any)=>{
        try{
            const obj = JSON.parse(data.toString());    
            let user = users.find((x:any)=> x.ws == ws);
            if(!user){
                user = { userId, rooms: [], ws };
                users.push(user);
            }
            const {type,slug,payload} = obj;
            if(type === 'subscribe'){
                const room = await prismaClient.room.findFirst({
                    where:{
                        slug:slug || payload?.slug
                    }
                })
                if(!room){
                    ws.send(JSON.stringify({ type: "ERROR", message: "Room not found" }));
                    return;
                }
                if(!user?.rooms?.includes(slug)){
                    user?.rooms.push(slug);
                }
            }
            if(type === 'unsubscribe'){
                const user = users.find((x:any) => x.ws === ws);
                if(!user){
                    return;
                }
                user.room = user?.rooms.filter((x:any) => x === payload?.slug);
            }

            if(type==='drawShape'){
                const shape = await createShape(payload);
                users.forEach((user:any) => {
                    if(user?.rooms.includes(payload?.slug)){
                        user.ws.send(JSON.stringify(shape));
                    }
                });
            }
            if(type==='deleteShape'){
                const deletedShape:any = await deleteShape(payload);
                users.forEach((user:any) => {
                    if(user?.rooms.includes(payload?.slug)){
                        user.ws.send(JSON.stringify({
                            type: "shapeDeleted",
                            id: deletedShape.id,
                            shapeType: deletedShape.type, 
                            roomId: payload?.slug,           
                            slug: deletedShape.slug       
                        }));
                        
                    }
                });
            }
        }catch(err){
            console.log("webSocketMessageErr: ",err);
        }
    })
})