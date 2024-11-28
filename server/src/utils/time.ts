import { DateTime } from "luxon";

type tat = {
  time: number;
  status: number;
};
export const calculateTat = (
  createdAt: any,
  updatedAt: any,
  stat: number
): tat => {
  // Convert to DateTime objects using Luxon
  const start = DateTime.fromJSDate(createdAt, { zone: "Asia/Kolkata" });
  let end = DateTime.fromJSDate(updatedAt, { zone: "Asia/Kolkata" });

  // If start and end times are the same, use the current time for end
  if (stat !== 1) {
    end = DateTime.now().setZone("Asia/Kolkata");
  }

  // Define working hours and days
  const workStartHour = 8;
  const workEndHour = 20; // 8 PM
  const workDays = [1, 2, 3, 4, 5, 6]; // Monday to Saturday

  // Adjust start time if it is outside working hours
  const adjustStartTime = (time: DateTime): DateTime => {
    if (!workDays.includes(time.weekday)) {
      do {
        time = time.plus({ days: 1 });
      } while (!workDays.includes(time.weekday));
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    if (time.hour < workStartHour) {
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    if (time.hour >= workEndHour) {
      time = time.plus({ days: 1 });
      while (!workDays.includes(time.weekday)) {
        time = time.plus({ days: 1 });
      }
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    return time;
  };

  // Adjust end time if it is outside working hours
  const adjustEndTime = (time: DateTime): DateTime => {
    if (time.hour >= workEndHour) {
      return time.set({ hour: workEndHour, minute: 0, second: 0 });
    } else if (time.hour < workStartHour) {
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }
    return time;
  };

  // Adjust start and end times
  let adjustedStart = adjustStartTime(start);
  let adjustedEnd = adjustEndTime(end);

  if (adjustedStart > adjustedEnd) {
    return { time: 0, status: 0 };
  }

  // Calculate total business hours between start and end times
  const calculateBusinessHours = (start: DateTime, end: DateTime) => {
    let totalHours = 0;
    let current = start;

    while (current < end) {
      const isWorkingDay = workDays.includes(current.weekday);
      const isWithinWorkingHours =
        current.hour >= workStartHour && current.hour < workEndHour;

      if (isWorkingDay && isWithinWorkingHours) {
        const nextHour = current.plus({ hours: 1 });
        if (nextHour > end) {
          totalHours += end.diff(current, "hours").hours;
          break;
        } else {
          totalHours += 1;
        }
        current = nextHour;
      } else {
        current = current
          .plus({ days: 1 })
          .set({ hour: workStartHour, minute: 0, second: 0 });
      }
    }

    return totalHours;
  };

  const totalHours = calculateBusinessHours(adjustedStart, adjustedEnd);

  // Determine status based on hours
  let status = 0;
  if (totalHours > 16) {
    status = 1;
  } else if (totalHours > 18) {
    status = 2;
  }

  return {
    time: Math.floor(totalHours),
    status
  };
};

export const getDateRangeForCurrentMonth = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1); // First day of the month
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
    999
  ); // Last day of the month
  return { startOfMonth, endOfMonth };
};

export const getDateRangeForToday = () => {
  const now = new Date();
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );
  return { startOfDay, endOfDay };
};
