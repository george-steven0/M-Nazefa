import avatar from "../../../assets/imgs/avatar.png";

const EmployeeCard = () => {
  return (
    <div
      className={`cursor-pointer py-3 flex flex-col justify-start items-center gap-2 px-3 border-b border-r border-[#E2E1E1]`}
    >
      <div className="">
        <img src={avatar} alt="employee" className="size-24 rounded-full" />
      </div>

      <div>
        <p
          className="line-clamp-1 text-[#1D1B1B] capitalize font-medium"
          title="Employee name"
        >
          Employee Name
        </p>
      </div>

      <div>
        <p className="capitalize text-mainGray" title="Employee name">
          Role
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;
