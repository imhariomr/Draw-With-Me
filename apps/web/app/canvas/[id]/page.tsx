'use client'
import { useEffect, useRef, useState } from "react"
import { initDraw } from "../../../draw/initDraw";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import ShapeSelector from "../../../components/tool";

export default function Canvas(){
    const params = useParams();
    const {getToken} = useAuth();
    const webSocketapi = process.env.NEXT_PUBLIC_WEB_SOCKET_SERVER;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedShape, setSelectedShape] = useState<string>('rectangle');
    const [shapes,setShapes] = useState([]);
    const socketRef = useRef<WebSocket | null>(null);
    const initDrawRef = useRef<initDraw | null>(null);
    const hasConnectedRef = useRef(false);
    const getShapes = async()=>{
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getShapes/${params?.id}`)
        .then((res:any)=>{
            setShapes(res?.data?.data);
        }).catch((error:any)=>{
            toast.error(error?.response?.data?.message)
        })
    };

    const setUpWebSocketConnection = async()=>{
        if (hasConnectedRef.current) return; 
        hasConnectedRef.current = true;
        const token:any = await getToken();
        const ws = new WebSocket(`${webSocketapi}?token=${encodeURIComponent(token)}`);
        socketRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: "subscribe",slug: params?.id}));
        };
    }

    useEffect(() => {
        if (initDrawRef.current) {
            initDrawRef.current.selectedShape = selectedShape;
        }
    }, [selectedShape]);

    useEffect(() => {
        const tryInitDraw = () => {
            const canvas = canvasRef.current;
            if (canvas && socketRef.current) {
                if (!initDrawRef.current) {
                    initDrawRef.current = new initDraw(canvas, shapes, selectedShape, socketRef.current, params?.id);
                }
            }
        };
        tryInitDraw();
    }, [shapes]);

    useEffect(()=>{
        getShapes();
        setUpWebSocketConnection();
        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    },[])
    return(
        <>
        <ShapeSelector selectedShape={selectedShape} onShapeChange={setSelectedShape}/>
        <canvas ref={canvasRef} className="w-full h-full block" style={{ position: "absolute", top: 0, left: 0 }}></canvas>
        </>
    )
}