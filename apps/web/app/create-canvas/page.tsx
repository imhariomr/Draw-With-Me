'use client'
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form"
import { toast } from "react-toastify";
import loader from "../../components/loader";
import Loader from "../../components/loader";
import { useRouter } from "next/navigation";

interface FormValue{
    canvasName:string
}
export default function CreateCanvas(){
  const router = useRouter();
  const { user } = useUser();
  const [isloading,setIsloading] = useState(false);
  const [userData,setuserData] = useState();
  const {register,handleSubmit,formState: { errors,isValid }} = useForm<FormValue>({mode: "onChange",});

    const onSubmit = async(data:FormValue)=>{
      console.log(data);
      setIsloading(true);
      const payload = {
        roomName : data?.canvasName,
        user:{
          email : user?.primaryEmailAddress?.emailAddress,
          username : user?.username
        }
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/createRoom`,payload)
      .then((res:any)=>{
        setIsloading(false);
        toast.success("All set! Your creative space is live 🎨🚀");
        router.push('/dashboard');
      })
      .catch(error => {
        toast.error(error?.response?.data?.message)
        console.log("abc",error?.response?.data?.message);
        setIsloading(false);
      });
    }
    useEffect(()=>{
    },[user])
    return(
        <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
            <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-[#111111] text-gray-100 shadow-[0_0_30px_rgba(0,255,255,0.07)] rounded-2xl p-6 space-y-4"
      >
        <div className="flex flex-col">
          <label
            htmlFor="canvasName"
            className="mb-1 text-lg font-medium text-gray-700"
          >
            Canvas Name
          </label>
          <input
            id="canvasName"
            type="text"
            {...register('canvasName', { required: 'Canvas name is required' })}
            className="px-4 py-2 bg-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter canvas name"
          />
          {errors.canvasName && (
            <p className="mt-1 text-sm text-red-500">
              {errors.canvasName.message}
            </p>
          )}
        </div>
  
        <button
          type="submit" disabled={!isValid || isloading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-lg font-semibold transition duration-300
            ${(!isValid || isloading) ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
          `}
        >
          {isloading && (
                <span className="flex items-center">
                    <Loader height={12} width={2} />
                </span>
            )}
          {!isloading && <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>}
          <span>Create Canvas</span>
        </button>
      </form>
        </div>
    )
}