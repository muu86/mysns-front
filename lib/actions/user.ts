'use server';

import { auth } from '@/app/api/auth/[...nextauth]/auth';
import { UserProfileType } from '@/types/definitions';
import { Profile } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getUserByIssuerAndSubject(profile: Profile) {
  const response = await fetch(
    `${process.env.SERVER_BASE_URL}/user/exists?issuer=${profile.iss}&subject=${profile.sub}`,
    {
      method: 'GET',
      cache: 'no-store',
    }
  );
  if (response.status === 404) {
    return null;
  }
  const user = await response.json();
  return user;
}

export async function getUserProfile(username: string): Promise<UserProfileType | null> {
  const response = await fetch(`${process.env.SERVER_BASE_URL}/user/profile?username=${username}`, {
    method: 'GET',
    cache: 'no-cache',
  });

  if (response.status === 400 || response.status === 404) {
    return null;
  }

  const user: UserProfileType = await response.json();
  return user;
}

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session) return;

  formData.append('sub', session.profile.sub as string);
  formData.append('iss', session.profile.iss as string);
  formData.append('first', session.profile.given_name as string);
  formData.append('last', session.profile.family_name as string);
  formData.append('email', session.profile.email as string);
  formData.append('emailVerified', session.profile.email_verified ? '1' : '0');

  const response = await fetch(`${process.env.SERVER_BASE_URL}/user`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  switch (response.status) {
    case 400:
    case 409: {
      return {
        error: true,
        body: result,
      };
    }
    case 500:
      redirect('/');
    default:
      return {
        message: 'success',
      };
  }
}

export async function updateUserProfile({
  username,
  content,
  addresses,
  file,
}: {
  username: string;
  content?: string;
  addresses?: string[];
  file?: string;
}) {
  const session = await auth();
  if (!session?.user?.username || session.user.username !== username) {
    redirect('/login');
  }

  const response = await fetch(`${process.env.SERVER_BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, content, addresses, file }),
  });

  if (response.status !== 200) {
    throw new Error('status 오류');
  }

  revalidatePath(`/user/${username}`, 'page');

  return {
    message: 'success',
  };
}
