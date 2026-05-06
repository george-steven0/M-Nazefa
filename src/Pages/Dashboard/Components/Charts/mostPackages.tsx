import { Progress, Skeleton } from "antd";
import type { mostUsedPackage } from "../../../../components/Utilities/Types/types";
import type { TFunction } from "i18next";

type mostPackagesProps = {
  t: TFunction;
  data?: mostUsedPackage[];
  isLoading: boolean;
};
const MostPackages = ({ t, data, isLoading }: mostPackagesProps) => {
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };

  const progressList = data?.map((item) => ({
    id: item?.id,
    label: item?.name,
    value: item?.usageCount,
    percent: item?.usagePercent,
  }));
  return (
    <div className="flex flex-col gap-4 size-full border border-mainBorderLight p-4 rounded-lg">
      <section className="title-wrapper flex items-center gap-2 justify-between capitalize">
        <div className="font-bold text-mainTextDark">{t("MOST_PACKAGES")}</div>
        {/* <div className="min-w-[120px] [&.ant-select-item-option-content]:capitalize">
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
        </div> */}
      </section>

      <section className="flex flex-col gap-4 h-full justify-around">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                active
                paragraph={{ rows: 0 }}
                className="w-full [&_.ant-skeleton-title]:w-full"
                style={{ width: "100%" }}
              />
            ))
          : progressList?.map((prog) => (
              <div key={prog?.id} className="flex flex-col w-full capitalize">
                <div className="label-container w-full flex items-center justify-between">
                  <span>{prog?.label}</span>
                  <span>{prog?.value}</span>
                </div>
                <div>
                  <Progress strokeColor={"#EF9B4F"} percent={prog?.percent} />
                </div>
              </div>
            ))}
      </section>
    </div>
  );
};

export default MostPackages;
