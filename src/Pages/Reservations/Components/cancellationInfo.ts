import type { TFunction } from "i18next";
import dayjs from "dayjs";

type CancelledReservation = {
  cancelledAt?: string | null;
  cancelledByName?: string | null;
  cancelReason?: string | null;
};

/** "Cancelled by X on 08-10-2026 09:30 PM - reason" (or "unknown" for old cancellations). */
export const cancellationInfo = (
  reservation: CancelledReservation | null | undefined,
  t: TFunction,
): string => {
  if (!reservation?.cancelledAt) return t("CANCEL_INFO_UNKNOWN");
  const who = reservation.cancelledByName || t("NA");
  const when = dayjs(reservation.cancelledAt).format("DD-MM-YYYY hh:mm A");
  const why = reservation.cancelReason ? ` - ${reservation.cancelReason}` : "";
  return `${t("CANCELLED_BY")} ${who} (${when})${why}`;
};
