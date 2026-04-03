import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parses a working hours string like "1AM - 1PM" into { startTime, endTime } in "HH:mm" format
 */
export function parseWorkingHours(workingHrs: string): { startTime: string; endTime: string } {
  // Handle empty/invalid input
  if (!workingHrs || !workingHrs.includes('-')) {
    return { startTime: "09:00", endTime: "17:00" }; // fallback defaults
  }

  const [startStr, endStr] = workingHrs.split('-').map(s => s.trim());

  return {
    startTime: convertTo24Hour(startStr),
    endTime: convertTo24Hour(endStr),
  };
}

/**
 * Converts time strings like "1AM", "12:30PM", "1 PM" to "HH:mm" 24-hour format
 */
function convertTo24Hour(timeStr: string): string {
  // Remove extra spaces and normalize
  const cleaned = timeStr.replace(/\s+/g, '').toUpperCase();
  
  // Match patterns: "1AM", "12:30PM", "1:05AM", etc.
  const match = cleaned.match(/^(\d{1,2})(?::(\d{2}))?([AP]M)$/);
  if (!match) return "09:00"; // fallback

  let [, hoursStr, minutesStr, period] = match;
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;

  // Convert to 24-hour format
  if (period === 'AM') {
    if (hours === 12) hours = 0; // 12AM = 00:00
  } else {
    if (hours !== 12) hours += 12; // 1PM-11PM add 12
  }

  // Pad with leading zeros
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Optional: Format back to "1AM - 1PM" for display or submission
 */
export function formatWorkingHours(startTime: string, endTime: string): string {
  return `${convertTo12Hour(startTime)} - ${convertTo12Hour(endTime)}`;
}

function convertTo12Hour(time24: string): string {
  const [hoursStr, minutesStr] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  
  const mins = minutes > 0 ? `:${String(minutes).padStart(2, '0')}` : '';
  return `${hours}${mins}${period}`;
}
