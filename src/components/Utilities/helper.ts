import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc"; // Required for the 'Z' (UTC) output
import type { FileType } from "./Types/types";

// dayjs.extend(utc);

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
  const format = dayjs(date)?.format("DD-MM-YYYY, h:mm A");
  return format;
};

export const DateOnlyFormat = (date: string) => {
  if (!date) return;
  const format = dayjs(date)?.format("DD-MM-YYYY");
  return format;
};
