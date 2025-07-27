'use client'
import { useEffect, useState } from "react";
import Card from "../../components/card";
import Navbar from "../../components/navbar";
import axios from "axios";

export default function Dashboard() {
  const [roomdata, setRoomdata] = useState<any>([]);
  const getRoomdata = async() =>{
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/getRooms`);
    if(response){
      setRoomdata(response?.data?.data);
    }
  }
  useEffect(()=>{
    getRoomdata();
  },[])
  return (
    <>
      <Navbar />
      <div className="w-screen min-h-screen bg-black pt-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-screen-xl mx-auto w-full">
          {roomdata.length > 0 ? (
            roomdata.map((room: any, index: number) => (
              <Card key={index} {...room}  index={index}/>
            ))
          ) : (
            <div className="flex items-center justify-center w-full col-span-full py-10">
              <span className="text-gray-400 w-full py-5 bg-slate-900 font-bold text-xl text-center">
                No Room Found
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
