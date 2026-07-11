import dayjs from "dayjs";
import { toast } from "react-toastify";
import type { APIErrorProps, FileType } from "./Types/types";
import utc from "dayjs/plugin/utc"; // Required for the 'Z' (UTC) output
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const cleanDeep = <T>(data: T): T => {
  // Handle Arrays
  if (Array.isArray(data)) {
    return data
      .map((item) => cleanDeep(item))
      .filter(
        (item) => item !== null && item !== undefined && item !== "",
      ) as unknown as T;
  }

  if (typeof data === "object" && data !== null) {
    return Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => [key, cleanDeep(value)]) // Recursively clean value
        .filter(([, value]) => {
          // Keep if value is not empty, null, or undefined
          // Also check for empty objects/arrays if you want to remove them too
          return (
            value !== null &&
            value !== undefined &&
            value !== "" &&
            !(typeof value === "object" && Object.keys(value).length === 0)
          );
        }),
    );
  }

  // Return primitives (string, number, boolean)
  return data;
};

export const fullDateFormat = (date: string) => {
  if (!date) return;
  const format = dayjs.utc(date).local().format("DD-MM-YYYY, h:mm A");
  return format;
};

export const DateOnlyFormat = (date: string) => {
  if (!date) return;
  const format = dayjs(date)?.format("DD-MM-YYYY");
  return format;
};

/**
 * Shows backend error messages from a failed API request as a toast.
 *
 * When the response carries validation errors, their messages are shown
 * (joined by new lines); otherwise the provided translated `fallbackMessage`
 * is shown instead.
 *
 * @param error - The error caught from an RTK Query `.unwrap()` call.
 * @param fallbackMessage - Already-translated message to show when the
 *   response has no validation error messages (e.g. `t("AREA_ADD_FAILED")`).
 */
export const handleApiError = (
  error: unknown,
  fallbackMessage: string,
): void => {
  const err = error as APIErrorProps;
  const validationErrors = err?.data?.validationErrors;

  if (validationErrors && validationErrors.length > 0) {
    const messages = err?.data?.errorMessage?.length
      ? err.data.errorMessage.join("\n")
      : validationErrors.join("\n");
    toast.error(messages);
  } else {
    toast.error(fallbackMessage);
  }
};
