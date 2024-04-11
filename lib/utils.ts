import { type ClassValue, clsx } from 'clsx';
import { Session } from 'next-auth';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateDate(dateParam: string): string {
  const date = new Date(dateParam);
  const diff = Date.now() - date.getTime();

  const min = Math.floor(diff / (1000 * 60));
  const hour = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (min < 60) {
    return min + '분';
  }
  if (hour < 24) {
    return hour + '시간';
  }
  if (days < 7) {
    return days + '일';
  }
  if (days < 30) {
    return Math.floor(days / 7) + '주';
  }
  if (days < 365) {
    return Math.floor(days / 30) + '달';
  }
  return Math.floor(days / 365) + '년';
}

export function isBlank(str: string | null | undefined) {
  if (!str) return true;
  if (str.indexOf(' ') > 0) return true;
  return false;
}

export function getUsername(session: Session | undefined | null): string {
  let username;
  if (!session || !session.user || !session.user.username) {
    // console.log('로그인 필요');
    username = 'Fintone';
  } else {
    username = session.user.username;
  }
  return username;
}

export function getTargetUsername(path: string): string {
  let targetUsername = decodeURIComponent(path);
  if (isBlank(targetUsername)) {
    console.log('안 좋은 이름');
  }
  return targetUsername;
}
