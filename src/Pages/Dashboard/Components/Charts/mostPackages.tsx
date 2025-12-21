import { Progress, Select } from "antd";
import type { translationType } from "../../../../components/Utilities/Types/types";

const MostPackages = ({ t }: translationType) => {
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const progressList = [
    {
      id: 1,
      label: t("DIRECT"),
      value: "145236",
    },
    {
      id: 2,
      label: t("REFERRAL"),
      value: "56696",
    },
    {
      id: 3,
      label: t("SOCIAL_MEDIA"),
      value: "122310",
    },
  ];
  return (
    <div className="flex flex-col gap-4 size-full border border-mainBorderLight p-4 rounded-lg">
      <section className="title-wrapper flex items-center gap-2 justify-between capitalize">
        <div className="font-bold text-mainTextDark">{t("MOST_PACKAGES")}</div>
        <div className="min-w-[120px] [&.ant-select-item-option-content]:capitalize">
          <Select
            onChange={handleChange}
            className="capitalize *:capitalize min-w-24 w-full"
            placeholder={t("SELECT_OPTION")}
            styles={{
              popup: {
                root: {
                  textTransform: "capitalize",
                },
              },
            }}
            options={[
              { value: "LAST_7_DAYS", label: <span>{t("LAST_WEEK")}</span> },
              { value: "LAST_MONTH", label: <span>{t("LAST_MONTH")}</span> },
              { value: "LAST_YEAR", label: <span>{t("LAST_YEAR")}</span> },
            ]}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        {progressList?.map((prog) => (
          <div key={prog?.id} className="flex flex-col w-full capitalize">
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
