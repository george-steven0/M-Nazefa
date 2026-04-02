import { useTranslation } from "react-i18next";
import { useGetUserQuery } from "../../components/APIs/EmployeesQuery/EMPLOYEES_QUERY";
import { Image, Spin } from "antd";
import dayjs from "dayjs";
import type { singleEmployeeProps } from "../../components/Utilities/Types/types";

export default function Profile() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetUserQuery();
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center min-h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  const user = (data?.data as Partial<singleEmployeeProps>) || {};

  const displayValue = (val: string | null | undefined) => (val ? val : "N/A");
  const formatDate = (date: string | null | undefined) =>
    date ? dayjs(date).format("DD MMM YYYY") : "N/A";

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    if (!firstName && !lastName) return "U";
    return `${firstName ? firstName[0] : ""}${
      lastName ? lastName[0] : ""
    }`.toUpperCase();
  };

  return (
    <div className="w-full h-full p-4  md:p-8 font-sans bg-transparent ">
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-mainBorderLight">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-mainBorderLight flex flex-col md:flex-row items-start md:items-center gap-6 capitalize">
          <div className="[&_.ant-image-mask]:rounded-full w-20 h-20  md:w-24 md:h-24 rounded-full bg-[#1e4b85] text-white flex items-center justify-center text-3xl md:text-4xl font-normal shrink-0">
            {user?.imagePath ? (
              <Image
                src={user?.imagePath}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user?.firstName, user?.lastName)
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl md:text-3xl font-medium text-mainTextDark">
              {user?.firstName || user?.lastName
                ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                : "User Profile"}
            </h1>
            <p className="text-mainTextLight text-sm md:text-base mb-1">
              @{displayValue(user?.userName)}
            </p>
            {user?.roles && user?.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {user?.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="bg-mainOrange/10 text-mainOrange border border-mainOrange/30 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <span className="bg-[#895f12] text-[#d4a436] border border-[#785d1d] px-3 py-1 rounded-full text-xs font-medium w-fit mt-1">
                {t("No roles assigned")}
              </span>
            )}
          </div>
        </div>

        {/* Personal Info Section */}
        <div className="p-6 md:p-8 border-b border-mainBorderLight capitalize">
          <h2 className="text-xs font-semibold text-mainTextLight tracking-widest uppercase mb-4 md:mb-6">
            {t("PERSONAL INFO")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <InfoBox
              label={t("First name")}
              value={displayValue(user?.firstName)}
            />
            <InfoBox
              label={t("Last name")}
              value={displayValue(user?.lastName)}
            />
            <InfoBox
              label={t("Gender")}
              value={displayValue(user?.gender)}
              indicator={
                user?.gender?.toLowerCase() === "male"
                  ? "bg-[#3b82f6]"
                  : user?.gender?.toLowerCase() === "female"
                    ? "bg-[#ec4899]"
                    : "bg-[#9ca3af]"
              }
            />
            <InfoBox
              label={t("Date of birth")}
              value={formatDate(user?.dateOfBirth)}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="p-6 md:p-8 border-b border-mainBorderLight">
          <h2 className="text-xs font-semibold text-mainTextLight tracking-widest uppercase mb-4 md:mb-6">
            {t("CONTACT")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <InfoBox
              label={t("Email")}
              value={displayValue(user?.email)}
              isLink={user?.email ? true : false}
            />
            <InfoBox
              label={t("Phone number")}
              value={displayValue(user?.phoneNumber)}
            />
            <InfoBox
              label={t("Postal code")}
              value={displayValue(user?.postalCode)}
            />
            <InfoBox label={t("Address")} value={displayValue(user?.address)} />
          </div>
        </div>

        {/* Work Info Section */}
        <div className="p-6 md:p-8">
          <h2 className="text-xs font-semibold text-mainTextLight tracking-widest uppercase mb-4 md:mb-6">
            {t("WORK INFO")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <InfoBox label={t("Work ID")} value={displayValue(user?.workId)} />
            <InfoBox
              label={t("ID number")}
              value={displayValue(user?.idNumber)}
            />
            <InfoBox
              label={t("Starting date")}
              value={formatDate(user?.startingDate)}
            />
            {/* <InfoBox
              label={t("Profile image")}
              value={user?.imagePath ? t("Available") : "N/A"}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoBox = ({
  label,
  value,
  indicator,
  isLink,
}: {
  label: string;
  value: string;
  indicator?: string;
  isLink?: boolean;
}) => {
  return (
    <div className="flex flex-col border border-mainBorderLight rounded-lg p-3 md:p-4 bg-transparent text-left hover:border-[#a1a1aa] transition-colors">
      <span className="text-xs md:text-sm text-mainTextLight mb-1">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {indicator && indicator !== "bg-[#9ca3af]" && (
          <div className={`w-2 h-2 rounded-full ${indicator}`}></div>
        )}
        <span
          title={value}
          className={`text-sm font-medium truncate ${isLink ? "text-[#3b82f6]" : "text-mainTextDark"} ${value === "N/A" && !isLink ? "italic text-mainTextLight/70" : ""}`}
        >
          {value}
        </span>
      </div>
    </div>
  );
};
