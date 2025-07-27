import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Card(props: any) {
  const router = useRouter();
  const handleSubmit = () => {
    router.push(`/canvas/${props?.slug}`);
  };
  return (
    <div className="cursor-pointer w-full h-60 bg-gradient-to-tr from-emerald-400 via-teal-500 to-cyan-500 text-white p-4  border border-teal-300 shadow-lg shadow-teal-500/40 rounded-xl relative" onClick={handleSubmit}>
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-center select-none">
          <b>{props?.slug || "N/A"}</b>
        </div>
        <div className="absolute bottom-2 left-4 text-sm text-white opacity-80 select-none">
          Created By:{" "}
          <b>
            <i>{props?.user?.username || "N/A"}</i>
          </b>
        </div>
      </div>
    </div>
  );
}
