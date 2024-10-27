import { DateTime } from "luxon";

export const calculateTat = (createdAt: any, updatedAt: any, stat: number) => {
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
    // If the day is not a working day, move to the next working day
    if (!workDays.includes(time.weekday)) {
      // Move to the next working day and set the time to the start of the working hours
      do {
        time = time.plus({ days: 1 });
      } while (!workDays.includes(time.weekday));
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    // If the time is before working hours, adjust to the start of the working day
    if (time.hour < workStartHour) {
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    // If the time is after working hours, move to the next working day
    if (time.hour >= workEndHour) {
      time = time.plus({ days: 1 });
      // Adjust to the next working day if necessary
      while (!workDays.includes(time.weekday)) {
        time = time.plus({ days: 1 });
      }
      return time.set({ hour: workStartHour, minute: 0, second: 0 });
    }

    // If the time is within working hours, no adjustment needed
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

  // If the start date is after the end date, something is wrong
  if (adjustedStart > adjustedEnd) {
    return { time: "0 seconds", status: 0 };
  }

  // Calculate the total business time between two DateTime objects
  const calculateBusinessTime = (start: DateTime, end: DateTime) => {
    let totalMinutes = 0;
    let current = start;

    while (current < end) {
      const isWorkingDay = workDays.includes(current.weekday);
      const isWithinWorkingHours = current.hour >= workStartHour && current.hour < workEndHour;

      if (isWorkingDay && isWithinWorkingHours) {
        const nextHour = current.plus({ hours: 1 });
        if (nextHour > end) {
          totalMinutes += Math.floor(end.diff(current, "minutes").minutes);
          break;
        } else {
          totalMinutes += 60; // Add full hour
        }
        current = nextHour;
      } else {
        // Move to the start of the next working day
        current = current.plus({ days: 1 }).set({ hour: workStartHour, minute: 0, second: 0 });
      }
    }

    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return { totalHours, totalMinutes: remainingMinutes };
  };

  const { totalHours, totalMinutes } = calculateBusinessTime(adjustedStart, adjustedEnd);

  // Determine the highest denomination for display
  let tat,
    status = 0;
  if (totalHours > 0) {
    if (totalHours > 16) {
      status = 1;
    } else if (totalHours > 18) {
      status = 2;
    }
    tat = `${totalHours} hour${totalHours > 1 ? "s" : ""}`;
  } else if (totalMinutes > 0) {
    tat = `${totalMinutes} minute${totalMinutes > 1 ? "s" : ""}`;
  } else {
    tat = "0 seconds";
  }

  return { time: tat, status };
};
