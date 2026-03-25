import { useSearchParams, useNavigate } from "react-router-dom";
import {
  useDeactivateClientMutation,
  useGetCustomerByIdQuery,
} from "../../../components/APIs/ClientQuery/CLIENTS_QUERY";
import Title from "../../../components/Common/Title/title";
import { useTranslation } from "react-i18next";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Skeleton, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { GrFavorite } from "react-icons/gr";

// ─── Icons ───────────────────────────────────────────────────────────────────
import {
  FaRegCircleUser,
  FaStar,
  FaUserXmark,
  FaWhatsapp,
} from "react-icons/fa6";
import { MdOutlineMail, MdOutlineCalendarMonth, MdPets } from "react-icons/md";
import { FiPhoneCall, FiEdit } from "react-icons/fi";
import { HiOutlineIdentification } from "react-icons/hi2";
import {
  PiWarningCircleLight,
  PiHouseLight,
  PiMapPinLight,
  PiBuildingLight,
} from "react-icons/pi";
import {
  BsBadgeVr,
  BsDoorOpen,
  BsWindowStack,
  BsTagFill,
} from "react-icons/bs";
import { LuBath, LuBedDouble, LuSofa } from "react-icons/lu";
import { TbToolsKitchen2 } from "react-icons/tb";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";

// ─── Helper ───────────────────────────────────────────────────────────────────
const NA = ({ label }: { label?: string }) => (
  <span className="text-gray-400 italic text-xs">{label ?? "—"}</span>
);

/** Renders a labelled info row inside a card */
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 shrink-0 text-[#094769]">{icon}</span>
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className="text-sm text-gray-700 font-medium mt-0.5">{value}</span>
    </div>
  </div>
);

/** Stat chip used in the quick-stats row */
const StatChip = ({
  label,
  value,
  color = "#094769",
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) => (
  <div
    className="flex flex-col items-center justify-center rounded-xl px-5 py-3 gap-1"
    style={{ background: `${color}12`, border: `1px solid ${color}22` }}
  >
    <span className="text-lg font-bold" style={{ color }}>
      {value}
    </span>
    <span className="text-[11px] text-gray-500 uppercase tracking-wider">
      {label}
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ViewClient = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const id = params.get("id");

  const { data, isLoading, isFetching } = useGetCustomerByIdQuery(
    id ? { id } : skipToken,
  );

  const [deactivateClient, { isLoading: deactivateClientLoading }] =
    useDeactivateClientMutation();

  const handleDeactivateClient = async () => {
    const values = {
      customerId: id!,
      isActive: data?.data?.isActive === true ? false : true,
    };
    await deactivateClient(values).unwrap();
    toast.success(
      data?.data?.isActive
        ? "Client deactivated successfully"
        : "Client activated successfully",
    );
    // navigate("/clients");
  };

  const customer = data?.data;

  const fullName = [
    customer?.firstName,
    customer?.middleName,
    customer?.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || <NA />;

  const formatList = (
    data: string | string[] | { value: string }[] | undefined,
  ) => {
    if (!data) return "";

    if (typeof data === "string") {
      return data.replace(/_/g, " , ");
    }

    return data
      .map((item) => (typeof item === "string" ? item : item.value))
      .join(", ");
  };

  return (
    <>
      {isLoading || isFetching ? (
        <div className="flex flex-col gap-6">
          <Skeleton avatar active paragraph={{ rows: 3 }} />
          <Skeleton active paragraph={{ rows: 6 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-10">
          {/* ── Page Header ─────────────────────────────────────── */}
          <header className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <Button
                shape="circle"
                icon={<IoArrowBackOutline size={18} />}
                onClick={() => navigate("/clients")}
                className="border-gray-200 hover:bg-gray-100"
              />
              <Title title={`${t("CUSTOMER")} #${id}`} subTitle />
            </div>

            <div className="flex items-center gap-2">
              <Button
                icon={<FiEdit size={16} />}
                onClick={() => navigate(`/clients/edit-client?id=${id}`)}
                className="flex items-center gap-1 border-[#094769] text-[#094769] hover:bg-[#094769] hover:text-white"
              >
                {t("EDIT")}
              </Button>
              <Button
                loading={deactivateClientLoading}
                onClick={handleDeactivateClient}
                className={
                  customer?.isActive
                    ? "bg-red-500/10 text-red-600 border-none hover:bg-red-500/80 hover:text-white font-medium"
                    : "bg-green-500/10 text-green-700 border-none hover:bg-green-500/80 hover:text-white font-medium"
                }
              >
                {customer?.isActive ? t("DEACTIVATE") : t("ACTIVATE")}
              </Button>
            </div>
          </header>

          {/* ── Profile Card ─────────────────────────────────────── */}
          <section
            className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #f0f6fb 0%, #ffffff 60%, #f9fbff 100%)",
            }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-[#094769] via-[#1a7aaa] to-[#094769]" />

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="shrink-0 flex items-center justify-center size-20 rounded-full bg-[#094769]/10 text-[#094769] border-4 border-white shadow">
                <FaRegCircleUser size={40} />
              </div>

              {/* Name + badges */}
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-[#1d2d3e] truncate">
                  {fullName}
                </h1>

                <div className="flex flex-wrap gap-2 items-center">
                  {/* Status badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                      customer?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span
                      className={`block size-1.5 rounded-full ${
                        customer?.isActive ? "bg-green-600" : "bg-red-500"
                      }`}
                    />
                    {customer?.isActive ? t("ACTIVE") : t("DEACTIVATED")}
                  </span>

                  {/* Old customer badge */}
                  {customer?.isOld && (
                    <Tag
                      icon={<FaStar size={10} className="mr-1" />}
                      color="gold"
                      className="rounded-full text-[11px] font-semibold border-0 m-0 flex items-center gap-0.5"
                    >
                      {t("OLD_CUSTOMER")?.replace(/[?؟]/g, "")}
                    </Tag>
                  )}

                  {/* Membership badge */}
                  {customer?.hasMembership && (
                    <Tag
                      icon={<BsTagFill size={10} className="mr-1" />}
                      color="blue"
                      className="rounded-full text-[11px] font-semibold border-0 m-0 flex items-center gap-0.5"
                    >
                      {t("MEMBERSHIP_NUMBER")?.replace(/[?؟]/g, "")}
                      {customer?.memberShipNumber
                        ? ` · ${customer.memberShipNumber}`
                        : ""}
                    </Tag>
                  )}

                  {/* Customer type */}
                  {customer?.customerTypeName && (
                    <Tag
                      icon={<AiOutlineUser size={10} className="mr-1" />}
                      color="cyan"
                      className="rounded-full text-[11px] font-semibold border-0 m-0 flex items-center gap-0.5"
                    >
                      {customer.customerTypeName}
                    </Tag>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex gap-3 shrink-0 flex-wrap">
                <StatChip
                  label={t("NO_OF_RESERVATION")}
                  value={customer?.noOfReservations ?? 0}
                  color="#094769"
                />
                <StatChip
                  label={t("LAST_RESERVATION_DATE")}
                  value={
                    customer?.lastReservationDate
                      ? dayjs(customer.lastReservationDate).format("DD MMM YY")
                      : "—"
                  }
                  color="#1a7aaa"
                />
              </div>
            </div>
          </section>

          {/* ── Details Grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* ── Contact Info Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-[#094769] flex items-center gap-2 pb-2 border-b border-gray-100">
                <FiPhoneCall size={16} />
                {t("PERSONAL_INFO")}
              </h2>

              {/* Phone numbers */}
              <InfoRow
                icon={<FiPhoneCall size={16} />}
                label={t("PHONE_NUMBER")}
                value={
                  customer?.phoneNumbers && customer.phoneNumbers.length > 0 ? (
                    <ul className="flex flex-col gap-1">
                      {customer.phoneNumbers.map((p) => (
                        <li key={p.id} className="font-mono text-sm">
                          {p.phoneNumber || <NA />}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NA />
                  )
                }
              />

              {/* WhatsApp */}
              <InfoRow
                icon={<FaWhatsapp size={16} className="text-green-500" />}
                label="WhatsApp"
                value={
                  customer?.whatsAppNumber ? (
                    <a
                      href={`https://wa.me/${customer.whatsAppNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 hover:underline font-mono"
                    >
                      {customer.whatsAppNumber}
                    </a>
                  ) : (
                    <NA />
                  )
                }
              />

              {/* Email */}
              <InfoRow
                icon={<MdOutlineMail size={16} />}
                label="Email"
                value={
                  customer?.email ? (
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-[#094769] hover:underline"
                    >
                      {customer.email}
                    </a>
                  ) : (
                    <NA />
                  )
                }
              />

              {/* ID Number */}
              <InfoRow
                icon={<HiOutlineIdentification size={16} />}
                label={t("ID_NUMBER")}
                value={
                  customer?.idNumber ? (
                    <span className="font-mono tracking-widest text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {customer.idNumber}
                    </span>
                  ) : (
                    <NA />
                  )
                }
              />

              {/* Entry Date */}
              <InfoRow
                icon={<MdOutlineCalendarMonth size={16} />}
                label={t("JOINING_DATE") || "Entry Date"}
                value={
                  customer?.entryDate ? (
                    dayjs(customer.entryDate).format("DD MMM YYYY")
                  ) : (
                    <NA />
                  )
                }
              />

              {/* Status */}
              <InfoRow
                icon={<PiWarningCircleLight size={16} />}
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      customer?.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <span
                      className={`block size-1.5 rounded-full ${
                        customer?.isActive ? "bg-green-600" : "bg-red-500"
                      }`}
                    />
                    {customer?.isActive ? t("ACTIVE") : t("DEACTIVATED")}
                  </span>
                }
              />

              {/* General Notes */}
              {customer?.generalNotes && (
                <InfoRow
                  icon={<BsBadgeVr size={16} />}
                  label={t("GENERAL_NOTES") || "General Notes"}
                  value={
                    <p className="text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-lg p-2 leading-relaxed whitespace-pre-line">
                      {customer.generalNotes}
                    </p>
                  }
                />
              )}

              {customer?.favoriteList && (
                <InfoRow
                  icon={<GrFavorite size={16} />}
                  label={t("FAVORITE_LIST") || "Favorite List"}
                  value={
                    <p className="text-sm text-gray-600 bg-green-50 border border-green-100 rounded-lg p-2 leading-relaxed whitespace-pre-line">
                      {formatList(customer.favoriteList)}
                    </p>
                  }
                />
              )}

              {customer?.notRecommendedWorkerList && (
                <InfoRow
                  icon={<FaUserXmark size={16} />}
                  label={
                    t("NOT_RECOMMENDED_WORKERS") || "Not Recommended Workers"
                  }
                  value={
                    <p className="text-sm text-gray-600 bg-red-50 border border-red-100 rounded-lg p-2 leading-relaxed">
                      {formatList(customer.notRecommendedWorkerList)}
                    </p>
                  }
                />
              )}
            </div>

            {/* ── Addresses ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5 max-h-[520px] overflow-y-auto">
              <h2 className="text-base font-semibold text-[#094769] flex items-center gap-2 pb-2 border-b border-gray-100 sticky top-0 bg-white z-10 capitalize">
                <PiMapPinLight size={16} />
                {t("ADDRESS")}
                <span className="ml-auto text-xs text-gray-400 font-normal">
                  {customer?.address?.length ?? 0}{" "}
                  {customer?.address && customer.address.length === 1
                    ? "address"
                    : "addresses"}
                </span>
              </h2>

              {!customer?.address || customer.address.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
                  <PiHouseLight size={40} />
                  <span className="text-sm">{t("NA")}</span>
                </div>
              ) : (
                customer.address.map((addr, index) => (
                  <div
                    key={addr.id ?? index}
                    className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 bg-gray-50/50"
                  >
                    {/* Address header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-[#094769]">
                        {t("ADDRESS")} #{index + 1}
                      </span>
                      {/* <div className="flex gap-1">
                        {addr.addressTypeId && (
                          <Tag
                            color="geekblue"
                            className="rounded-full text-[10px] border-0 m-0"
                          >
                            Type {addr.addressTypeId}
                          </Tag>
                        )}
                        {addr.buildingTypeId && (
                          <Tag
                            color="purple"
                            className="rounded-full text-[10px] border-0 m-0"
                          >
                            Bldg {addr.buildingTypeId}
                          </Tag>
                        )}
                      </div> */}
                    </div>

                    {/* Street + Landmark */}
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<PiMapPinLight size={14} />}
                        label={t("STREET")}
                        value={addr.street ?? <NA />}
                      />
                      <InfoRow
                        icon={<PiBuildingLight size={14} />}
                        label={t("LANDMARK")}
                        value={addr.landMark ?? <NA />}
                      />
                    </div>

                    {/* Apartment + Floor */}
                    <div className="grid grid-cols-2 gap-3">
                      <InfoRow
                        icon={<BsDoorOpen size={14} />}
                        label={t("APARTMENT")}
                        value={addr.apartment ?? <NA />}
                      />
                      <InfoRow
                        icon={<PiBuildingLight size={14} />}
                        label={t("FLOOR")}
                        value={
                          addr.floor !== null && addr.floor !== undefined ? (
                            addr.floor
                          ) : (
                            <NA />
                          )
                        }
                      />
                    </div>

                    {/* Room stats row */}
                    <div className="flex flex-wrap gap-3 pt-1">
                      {[
                        {
                          icon: <LuBedDouble size={14} />,
                          label: t("NUMBER_OF_BEDROOMS") || "Beds",
                          val: addr.numberOfBedrooms,
                        },
                        {
                          icon: <LuBath size={14} />,
                          label: t("NUMBER_OF_BATHROOMS") || "Baths",
                          val: addr.numberOfBathrooms,
                        },
                        {
                          icon: <LuSofa size={14} />,
                          label: t("NUMBER_OF_LIVINGROOMS") || "Living",
                          val: addr.numberOfLivingRooms,
                        },
                        {
                          icon: <TbToolsKitchen2 size={14} />,
                          label: t("NUMBER_OF_KITCHENS") || "Kitchens",
                          val: addr.numberOfKitchens,
                        },
                        {
                          icon: <BsWindowStack size={14} />,
                          label: t("NUMBER_OF_WINDOWS") || "Windows",
                          val: addr.numberOfWindows,
                        },
                      ].map(({ icon, label, val }) => (
                        <Tooltip key={label} title={label}>
                          <span className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-600 shadow-sm">
                            {icon}
                            <span className="font-semibold">{val ?? 0}</span>
                          </span>
                        </Tooltip>
                      ))}
                    </div>

                    {/* Description */}
                    {addr.fullDescription && (
                      <div className="mt-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">
                          {t("DESCRIPTION")}
                        </span>
                        <p className="text-sm text-gray-600 mt-1 bg-white border border-gray-100 rounded-lg px-3 py-2 leading-relaxed">
                          {addr.fullDescription}
                        </p>
                      </div>
                    )}

                    {/* Has pets */}
                    {addr.hasPets !== null && addr.hasPets !== undefined && (
                      <Tag
                        color={addr.hasPets ? "green" : "red"}
                        className={`flex items-center gap-1 text-xs p-2 rounded-lg`}
                      >
                        <span>
                          <MdPets
                            size={15}
                            // className={`${addr.hasPets ? "text-green-600" : "text-red-600"}`}
                          />
                        </span>
                        <span>{addr.hasPets ? "Has pets" : "No pets"}</span>
                      </Tag>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewClient;
