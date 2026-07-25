import { useMemo, useState } from "react";
import {
  Calendar as BigCalendar,
  dayjsLocalizer,
  Views,
  type View,
  type ToolbarProps,
} from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, DatePicker, Modal, Popconfirm, Segmented, Skeleton, Tag } from "antd";
import { toast } from "react-toastify";
import { FaUser, FaPhoneAlt, FaMapMarkerAlt, FaConciergeBell } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import { LuChevronLeft, LuChevronRight, LuCalendarPlus } from "react-icons/lu";

import Title from "../../components/Common/Title/title";
import { useAppSelector } from "../../components/APIs/store";
import {
  useGetReservationsCalendarQuery,
  useToggleReservationStatusMutation,
} from "../../components/APIs/Reservations/RESERVATION_QUERY";
import type {
  APIErrorProps,
  calendarReservationProps,
} from "../../components/Utilities/Types/types";

const localizer = dayjsLocalizer(dayjs);

// ─── Event type ──────────────────────────────────────────────────────────────
type ReservationEvent = {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  resource: calendarReservationProps;
};

// ─── Custom toolbar (Google/Apple-like header) ───────────────────────────────
const CalendarToolbar = ({
  label,
  date,
  view,
  onNavigate,
  onView,
}: ToolbarProps<ReservationEvent, object>) => {
  const { t } = useTranslation();

  return (
    <div className="cal-toolbar">
      <div className="cal-toolbar-left">
        <Button
          shape="round"
          onClick={() => onNavigate("TODAY")}
          className="border-mainBorderLight text-mainColor font-medium"
        >
          {t("TODAY")}
        </Button>

        <div className="cal-nav">
          <button
            type="button"
            aria-label={t("BACK")}
            onClick={() => onNavigate("PREV")}
          >
            <LuChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label={t("NEXT")}
            onClick={() => onNavigate("NEXT")}
          >
            <LuChevronRight size={20} />
          </button>
        </div>

        <span className="cal-label">{label}</span>
      </div>

      <div className="cal-toolbar-right">
        <DatePicker
          allowClear={false}
          value={dayjs(date)}
          onChange={(picked) => picked && onNavigate("DATE", picked.toDate())}
          className="min-h-9"
        />

        <Segmented
          value={view}
          onChange={(value) => onView(value as View)}
          options={[
            { label: t("MONTH"), value: Views.MONTH },
            { label: t("WEEK"), value: Views.WEEK },
            { label: t("DAY"), value: Views.DAY },
            { label: t("AGENDA"), value: Views.AGENDA },
          ]}
        />
      </div>
    </div>
  );
};

// ─── Modal detail row ────────────────────────────────────────────────────────
const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="cal-detail-row">
    <span className="cal-detail-icon">{icon}</span>
    <div className="flex flex-col">
      <span className="cal-detail-label">{label}</span>
      <span className="cal-detail-value">{value || "---"}</span>
    </div>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
const CalendarPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useAppSelector((state) => state?.lang);

  const [date, setDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<View>(Views.MONTH);
  const [selected, setSelected] = useState<calendarReservationProps | null>(
    null,
  );
  // Date of an empty slot the user clicked (opens the "add reservation" prompt)
  const [slotDate, setSlotDate] = useState<Date | null>(null);

  const { data, isLoading, isFetching } = useGetReservationsCalendarQuery();

  const [toggleReservationStatus, { isLoading: isCancelling }] =
    useToggleReservationStatusMutation();

  // Map reservations → calendar events
  const events: ReservationEvent[] = useMemo(() => {
    return (data?.data ?? [])
      .filter((reservation) => reservation.reservationDate)
      .map((reservation) => {
        const start = dayjs(reservation.reservationDate).toDate();
        const end = reservation.endDate
          ? dayjs(reservation.endDate).toDate()
          : dayjs(reservation.reservationDate).add(1, "hour").toDate();

        return {
          id: reservation.id,
          title: reservation.customerName || t("NA"),
          start,
          end,
          resource: reservation,
        };
      });
  }, [data, t]);

  // Mute past days (reservations can't be added in the past)
  const dayPropGetter = (day: Date) => {
    if (dayjs(day).isBefore(dayjs(), "day")) {
      return { className: "rbc-past-day" };
    }
    return {};
  };

  // Colour each event by its state
  const eventPropGetter = (event: ReservationEvent) => {
    const reservation = event.resource;
    let className = "evt-unconfirmed";
    if (reservation.isActive === false) className = "evt-cancelled";
    else if (reservation.isConfirmed) className = "evt-confirmed";
    return { className };
  };

  const messages = useMemo(
    () => ({
      today: t("TODAY"),
      previous: t("BACK"),
      next: t("NEXT"),
      month: t("MONTH"),
      week: t("WEEK"),
      day: t("DAY"),
      agenda: t("AGENDA"),
      date: t("DATE"),
      time: t("TIME"),
      event: t("RESERVATION"),
      noEventsInRange: t("NO_RESERVATIONS_IN_RANGE"),
      showMore: (total: number) => `+${total} ${t("MORE")}`,
    }),
    [t],
  );

  const closeModal = () => setSelected(null);

  const handleView = () => {
    if (!selected) return;
    navigate(`/reservations/reservation-details?id=${selected.id}`);
  };

  const handleEdit = () => {
    if (!selected) return;
    navigate(`/reservations/edit-reservation?id=${selected.id}`);
  };

  const handleAddReservation = () => {
    if (!slotDate) return;
    // Month view has no time context → pin to 00:00 of the day.
    // Week/Day views carry the exact clicked time, so keep it.
    const picked =
      view === Views.MONTH ? dayjs(slotDate).startOf("day") : dayjs(slotDate);
    const dateParam = encodeURIComponent(picked.toISOString());
    setSlotDate(null);
    navigate(`/reservations/add-reservation?date=${dateParam}`);
  };

  const handleCancel = async () => {
    if (!selected) return;
    try {
      await toggleReservationStatus({
        reservationId: String(selected.id),
        isActive: false,
      }).unwrap();
      toast.success(t("RESERVATION_CANCELLED_SUCCESS"));
      closeModal();
    } catch (error) {
      const err = error as APIErrorProps;
      err?.data?.errorMessages?.forEach((message) => toast.error(message));
    }
  };

  const statusTag = (reservation: calendarReservationProps) => {
    if (reservation.isActive === false)
      return <Tag color="error">{t("CANCELLED")}</Tag>;
    if (reservation.isConfirmed)
      return <Tag color="success">{t("CONFIRMED")}</Tag>;
    return <Tag>{t("NOT_CONFIRMED")}</Tag>;
  };

  return (
    <main className="nazefa-calendar-wrapper">
      <header className="mb-6">
        <Title title={t("CALENDAR")} subTitle />
      </header>

      {isLoading || isFetching ? (
        <Skeleton active paragraph={{ rows: 14 }} />
      ) : (
        <div className="nazefa-calendar h-[74vh] min-h-[600px]">
          <BigCalendar
            localizer={localizer}
            events={events}
            date={date}
            view={view}
            onNavigate={(next) => setDate(next)}
            onView={(next) => setView(next)}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            popup
            selectable
            rtl={lang === "ar"}
            onSelectEvent={(event) => setSelected(event.resource)}
            onSelectSlot={(slotInfo) => {
              if (dayjs(slotInfo.start).isBefore(dayjs(), "day")) {
                toast.warning(t("CANNOT_ADD_PAST_RESERVATION"));
                return;
              }
              setSlotDate(slotInfo.start);
            }}
            eventPropGetter={eventPropGetter}
            dayPropGetter={dayPropGetter}
            components={{ toolbar: CalendarToolbar }}
            messages={messages}
            style={{ height: "100%" }}
          />
        </div>
      )}

      {/* ── Reservation quick-view modal ─────────────────────────────────── */}
      <Modal
        open={!!selected}
        onCancel={closeModal}
        footer={null}
        title={
          <div className="flex items-center gap-3">
            <span>{t("RESERVATION_DETAILS")}</span>
            {selected ? statusTag(selected) : null}
          </div>
        }
      >
        {selected ? (
          <div className="mt-4">
            <div className="flex flex-col">
              <DetailRow
                icon={<FaUser size={15} />}
                label={t("CUSTOMER_NAME")}
                value={selected.customerName}
              />
              <DetailRow
                icon={<FaPhoneAlt size={15} />}
                label={t("CUSTOMER_PHONE")}
                value={selected.customerPhone}
              />
              <DetailRow
                icon={<FaMapMarkerAlt size={15} />}
                label={t("CUSTOMER_ADDRESS")}
                value={selected.customerAddress}
              />
              <DetailRow
                icon={<FaConciergeBell size={15} />}
                label={t("SERVICE_TYPE")}
                value={selected.serviceType}
              />
            </div>

            <div className="mt-6 flex flex-col gap-2.5 [&>button]:capitalize [&>button]:font-semibold">
              <Button
                block
                size="large"
                type="primary"
                icon={<BiEdit size={16} />}
                onClick={handleEdit}
                className="bg-mainColor border-none hover:bg-mainColor/90!"
              >
                {t("EDIT_RESERVATION")}
              </Button>

              <Button
                block
                size="large"
                icon={<AiOutlineEye size={16} />}
                onClick={handleView}
                className="border-mainColor text-mainColor hover:bg-mainColor! hover:text-white!"
              >
                {t("VIEW_FULL_DETAILS")}
              </Button>

              {selected.isActive === false ? null : (
                <>
                  <div className="my-0.5 h-px bg-gray-100" />
                  <Popconfirm
                    title={t("CANCEL_RESERVATION")}
                    description={t("DELETE_CONFIRM_MESSAGE")}
                    okText={t("CANCEL_RESERVATION")}
                    cancelText={t("CANCEL")}
                    okButtonProps={{ danger: true, loading: isCancelling }}
                    onConfirm={handleCancel}
                  >
                    <Button
                      block
                      danger
                      size="large"
                      type="text"
                      icon={<MdCancel size={16} />}
                      className="hover:bg-red-50!"
                    >
                      {t("CANCEL_RESERVATION")}
                    </Button>
                  </Popconfirm>
                </>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      {/* ── Empty-day → add reservation prompt ───────────────────────────── */}
      <Modal
        open={!!slotDate}
        onCancel={() => setSlotDate(null)}
        footer={null}
        width={400}
        title={t("ADD_NEW_RESERVATION")}
      >
        {slotDate ? (
          <div className="mt-2">
            <div className="cal-detail-row">
              <span className="cal-detail-icon">
                <LuCalendarPlus size={16} />
              </span>
              <div className="flex flex-col">
                <span className="cal-detail-label">{t("DATE")}</span>
                <span className="cal-detail-value">
                  {view === Views.MONTH
                    ? dayjs(slotDate).format("dddd, DD MMM YYYY")
                    : dayjs(slotDate).format("dddd, DD MMM YYYY • hh:mm A")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 [&>button]:capitalize">
              <Button onClick={() => setSlotDate(null)}>{t("CANCEL")}</Button>
              <Button
                type="primary"
                icon={<LuCalendarPlus size={16} />}
                onClick={handleAddReservation}
                className="bg-mainColor border-none hover:bg-mainColor/90!"
              >
                {t("ADD_NEW_RESERVATION")}
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </main>
  );
};

export default CalendarPage;
