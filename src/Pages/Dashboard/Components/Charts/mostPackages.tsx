import { Progress, Select } from "antd";
import type { translationType } from "../../../../components/Utilities/Types/types";

const MostPackages = ({ t }: translationType) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const progressList = [
    {
      id: 1,
      label: "direct",
      value: "145236",
    },
    {
      id: 2,
      label: "Referral",
      value: "56696",
    },
    {
      id: 3,
      label: "Social Media",
      value: "122310",
    },
  ];
  return (
    <div className="flex flex-col gap-4 size-full border border-mainBorderLight p-4 rounded-lg">
      <section className="title-wrapper flex items-center justify-between capitalize">
        <div className="text-lg font-bold text-mainTextDark max-w-[50%]">
          {t("MOST_PACKAGES")}
        </div>
        <div className="grow [&.ant-select-item-option-content]:capitalize">
          <Select
            onChange={handleChange}
            className="capitalize *:capitalize min-w-24 w-full"
            placeholder="Select Option"
            styles={{
              popup: {
                root: {
                  textTransform: "capitalize",
                },
              },
            }}
            options={[
              { value: "LAST_7_DAYS", label: <span>last week</span> },
              { value: "LAST_MONTH", label: <span>last month</span> },
              { value: "LAST_YEAR", label: <span>last year</span> },
            ]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {progressList?.map((prog) => (
          <div className="flex flex-col w-full capitalize">
            <div className="label-container w-full flex items-center justify-between">
              <span>{prog?.label}</span>
              <span>{prog?.value}</span>
            </div>
            <div>
              <Progress strokeColor={"#EF9B4F"} percent={prog?.id * 25} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MostPackages;
