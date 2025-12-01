import { AiOutlineFieldTime } from "react-icons/ai";
const CommingSoon = () => {
  return (
    <div className="w-full h-full text-mainOrange flex flex-col gap-3 items-center justify-center">
      <p>
        <AiOutlineFieldTime size={80} />
      </p>
      <h1 className="text-4xl ">Comming Soon...</h1>
    </div>
  );
};

export default CommingSoon;
