import avatar from "../../../assets/imgs/logo-cropped.svg";
import type { employeeResponseProps } from "../../../components/Utilities/Types/types";

type employeeCardProps = {
  employee: employeeResponseProps;
};
const EmployeeCard = ({ employee }: employeeCardProps) => {
  // console.log(employee);

  return (
    <div
      className={`cursor-pointer py-3 flex flex-col justify-start items-center gap-2 px-3 border-b min-h-[200px]  border-r border-l border-[#E2E1E1]`}
    >
      <div className="">
        <img
          src={employee?.imagePath ? employee?.imagePath : avatar}
          alt="employee"
          className="size-24 rounded-full"
        />
      </div>

      <div>
        <p
          className="line-clamp-1 text-[#1D1B1B] capitalize font-medium"
          title="Employee name"
        >
          {employee?.fullName}
        </p>
      </div>

      <div>
        <p
          className="capitalize text-mainGray line-clamp-1"
          title="Employee name"
        >
          {employee?.roles && employee?.roles.length > 0
            ? employee?.roles.join(", ")
            : "Role"}
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;
