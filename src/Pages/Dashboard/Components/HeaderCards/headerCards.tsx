import { BiDollar } from "react-icons/bi";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
type headerCardPropsType = {
  data: {
    id: number | string;
    label: string;
    value: string;
    perecent: string;
    type: string;
    currency?: boolean;
  };
};
const HeaderCards = ({ data }: headerCardPropsType) => {
  return (
    <article className="flex items-center justify-between w-full capitalize p-4 rounded-lg border border-[#E4E4E7]">
      <div className="flex flex-col gap-4">
        <p className="text-lg text-[#71717A]">{data?.label}</p>
        <p className="text-xl text-[#18181B] font-bold flex items-center">
          <span>{data?.currency ? <BiDollar /> : ""}</span>
          <span>{parseInt(data?.value)?.toLocaleString()}</span>
        </p>
      </div>

      <div
        className={`flex items-center gap-1 ${
          data?.type === "up" ? "text-green-600" : "text-red-600"
        }`}
      >
        <span>{data?.type === "up" ? "+" : "-"}</span>
        <span>{data?.perecent}%</span>
        <span>
          {data?.type === "up" ? <BsArrowUpShort /> : <BsArrowDownShort />}
        </span>
      </div>
    </article>
  );
};

export default HeaderCards;
