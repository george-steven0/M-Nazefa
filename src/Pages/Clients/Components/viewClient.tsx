import { useSearchParams } from "react-router-dom";
import {
  useDeactivateClientMutation,
  useGetCustomerByIdQuery,
} from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { skipToken } from "@reduxjs/toolkit/query";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi2";
import { PiWarningCircleLight } from "react-icons/pi";
import { Button, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ViewClient = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const id = params.get("id");

  // console.log(id);

  const { data, isLoading, isFetching } = useGetCustomerByIdQuery(
    id ? { id } : skipToken
  );

  const [deactivateClient, { isLoading: deactivateClientLoading }] =
    useDeactivateClientMutation();

  const handleDeactivateClient = async () => {
    const values = {
      customerId: id!,
      isActive: data?.data?.isActive === true ? false : true,
    };
    await deactivateClient(values).unwrap();
    await toast.success("Client Deactivated Successfully");
    navigate("/clients");
  };
  //   console.log(data);

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex items-start justify-between gap-5">
          <Skeleton avatar active paragraph={{ rows: 5 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <>
          <header>
            <Title title={t("CUSTOMER") + "# " + id} subTitle />
          </header>

          <main className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5">
              <section className="flex flex-col gap-3">
                <div className="bg-[#f4f4f4] p-5 rounded-md shadow-sm flex flex-col gap-2 items-center">
                  <div>
                    <FaRegCircleUser size={35} className="text-[#094769]" />
                  </div>

                  <h2 className="text-xl text-[#29415f] capitalize font-medium">
                    {data?.data?.firstName + " " + data?.data?.lastName}
                  </h2>

                  <hr className="text-gray-200 w-full my-2" />

                  <div className="details-wrapper w-full flex flex-col gap-4 [&>div>div>span]:capitalize ">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className=" text-gray-500">
                          <MdOutlineMail size={20} />
                        </span>
                        <span className="font-medium text-gray-600">
                          Email:
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {data?.data?.email}
                      </p>
                    </div>

                    <div className="flex items-start gap-5">
                      <div className="flex items-center gap-1">
                        <span className=" text-gray-500">
                          <FiPhoneCall size={20} />
                        </span>
                        <span className="font-medium text-gray-600">
                          Phone:
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 list-disc list-outside flex flex-col gap-1">
                        {data?.data?.phoneNumbers?.map((item) => (
                          <li>{item?.phoneNumber}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className=" text-gray-500">
                          <HiOutlineIdentification size={20} />
                        </span>
                        <span className="font-medium text-gray-600">
                          ID Number:
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {data?.data?.idNumber}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className=" text-gray-500">
                          <PiWarningCircleLight size={20} />
                        </span>
                        <span className="font-medium text-gray-600">
                          Status:
                        </span>
                      </div>
                      <p
                        className={`flex items-center gap-1 py-1 px-2 rounded-full  min-w-[60px] text-center text-xs ${
                          data?.data?.isActive
                            ? "text-green-600 bg-green-400/20"
                            : "text-red-600 bg-red-400/20"
                        } `}
                      >
                        <span
                          className={`block size-2 rounded-full ${
                            data?.data?.isActive ? "bg-green-600" : "bg-red-600"
                          }`}
                        ></span>
                        <span>
                          {data?.data?.isActive ? "Active" : "Inactive"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  loading={deactivateClientLoading}
                  onClick={handleDeactivateClient}
                  className={`${
                    data?.data?.isActive
                      ? "bg-mainRed/20 text-mainRed border-none hover:bg-mainRed/80 hover:text-white font-medium"
                      : "bg-green-400/20 text-green-600 border-none hover:bg-green-400/80 hover:text-white font-medium"
                  }`}
                >
                  {data?.data?.isActive ? t("DEACTIVATE") : t("ACTIVATE")}
                </Button>
              </section>

              <section className="address-wrapper bg-[#f4f4f4] p-5 rounded-md shadow-sm flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                {data?.data?.address?.map((address, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 capitalize text-[#5f5f5f] [&>p>span]:font-medium [&>p>span]:text-[#333] border-b border-[#ccc] pb-3"
                  >
                    <h2 className="text-lg font-medium text-[#094769]">
                      Address #{index + 1}
                    </h2>
                    <p>
                      <span>{t("STREET")}</span>:{" "}
                      {address?.street ? address?.street : "----"}
                    </p>
                    <p>
                      <span>{t("LANDMARK")}</span>:{" "}
                      {address?.landMark ? address?.landMark : "----"}
                    </p>
                    <p>
                      <span>{t("APARTMENT")}</span>:{" "}
                      {address?.apartment ? address?.apartment : "----"}
                    </p>
                    <p>
                      <span>{t("FLOOR")}</span>:{" "}
                      {address?.floor ? address?.floor : "----"}
                    </p>
                    {/* <p>
                      <span>{t("BRIDE_CLEANS")}</span>:{" "}
                      {address?.brideCleansUp ? "Yes" : "No"}
                    </p>
                    <p>
                      <span>{t("RODENTS")}</span>:{" "}
                      {address?.rodents ? "Yes" : "No"}
                    </p>
                    <p>
                      <span>{t("INSECTS")}</span>:{" "}
                      {address?.insects ? "Yes" : "No"}
                    </p>
                    <p>
                      <span>{t("TOOLS")}</span>:{" "}
                      {address?.tools ? address?.tools : "----"}
                    </p> */}
                    <p>
                      <span>{t("NUMBER_OF_WINDOWS")}</span>:{" "}
                      {address?.numberOfWindows
                        ? address?.numberOfWindows
                        : "----"}
                    </p>
                    {/* <p>
                      <span>{t("NO_WORKERS")}</span>:{" "}
                      {address?.numberOfWorkers
                        ? address?.numberOfWorkers
                        : "----"}
                    </p>
                    <p>
                      <span>{t("MATERIAL_BY_GM")}</span>:{" "}
                      {address?.materialWeight
                        ? address?.materialWeight + " GM"
                        : "----"}
                    </p> */}
                    <p>
                      <span>{t("DESCRIPTION")}</span>:{" "}
                      {address?.fullDescription
                        ? address?.fullDescription
                        : "----"}
                    </p>
                    {/* <p>
                      <span>{t("VISIT_DURATION")}</span>:{" "}
                      {address?.visitStart && address?.visitEnd ? (
                        <span>
                          {dayjs(address?.visitStart).format(
                            "DD-MM-YYYY, HH:mm"
                          )}{" "}
                          -{" "}
                          {dayjs(address?.visitEnd).format("DD-MM-YYYY, HH:mm")}
                        </span>
                      ) : (
                        "----"
                      )}
                    </p> */}
                  </div>
                ))}
              </section>
            </div>
          </main>
        </>
      )}
    </>
  );
};

export default ViewClient;
