import { AiOutlineFieldTime } from "react-icons/ai";
import { useTranslation } from "react-i18next";
const CommingSoon = () => {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full text-mainOrange flex flex-col gap-3 items-center justify-center">
      <p>
        <AiOutlineFieldTime size={80} />
      </p>
      <h1 className="text-4xl ">{t("COMING_SOON")}</h1>
    </div>
  );
};

export default CommingSoon;
