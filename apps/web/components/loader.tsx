import { ScaleLoader } from "react-spinners";

interface loader {
  height?: any;
  width?: any;
}

export default function Loader({ height, width }: loader) {
  return (
    <>
      <ScaleLoader color="#f5f5f5" height={height} width={width} />
    </>
  );
}