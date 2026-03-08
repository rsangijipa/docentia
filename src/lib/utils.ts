import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: any, timeZone: string = 'UTC'): string {
  if (!value) return '-';

  try {
    let dateObj: Date;
    if (typeof value === 'string') {
      dateObj = new Date(value);
    } else if (value?.seconds) {
      dateObj = new Date(value.seconds * 1000);
    } else if (typeof value?.toDate === 'function') {
      dateObj = value.toDate();
    } else if (value instanceof Date) {
      dateObj = value;
    } else {
      return '-';
    }

    if (isNaN(dateObj.getTime())) return '-';
    return dateObj.toLocaleDateString('pt-BR', { timeZone });
  } catch {
    return '-';
  }
}

