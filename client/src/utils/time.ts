import { DateTime } from "luxon";

export const convertToIST = (dateTime: string) => {
  // Parse the given datetime and convert it to IST
  const istDateTime = DateTime.fromISO(dateTime, { zone: "Asia/Kolkata" });

  // Format the date to 'dd/MM/yyyy hh:mm a'
  return istDateTime.toFormat("dd/MM/yyyy hh:mm a");
};

export const formatDateToDDMMYYYY = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};