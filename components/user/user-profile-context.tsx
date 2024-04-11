'use client';

import { updateUserProfile } from '@/lib/actions/user';
import { AddressType, UserProfileType } from '@/types/definitions';
import { UpdateUserPayload } from '@/types/api-definition';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from 'react';
import { z } from 'zod';
import { getPresignedUrl } from '@/lib/actions/file';

export type UserProfileContextState = {
  isOwner: boolean;
  isAddressModal: boolean;
  allAddresses: AddressType[];
  profile: UserProfileType;
  file: ProfileFile | undefined;
  result: string;
  uploading: boolean;
};

export type UserProfileContextActions = {
  setIsAddressModal: Dispatch<SetStateAction<boolean>>;
  setAllAddresses: Dispatch<SetStateAction<AddressType[]>>;
  setProfile: Dispatch<SetStateAction<UserProfileType>>;
  setFile: Dispatch<SetStateAction<ProfileFile | undefined>>;
  setUploading: Dispatch<SetStateAction<boolean>>;
  fileUploadHandler: (file: File) => void;
  submitAction: () => void;
};

export type UserProfileContextType = {
  states: UserProfileContextState;
  actions: UserProfileContextActions;
};

export const UserProfileContext = createContext<UserProfileContextType>({} as UserProfileContextType);

export type ProfileFile = {
  url: string;
  file?: File;
  s3Key?: string;
};

export default function UserProfileContextProvider({
  userProfile,
  isOwner,
  children,
}: PropsWithChildren<{ userProfile: UserProfileType; isOwner: boolean }>) {
  console.log('userProfile: ', userProfile);
  const [isAddressModal, setIsAddressModal] = useState<boolean>(false);
  const [allAddresses, setAllAddresses] = useState<AddressType[]>([]);
  const [profile, setProfile] = useState<UserProfileType>(userProfile);
  const [file, setFile] = useState<ProfileFile | undefined>();
  const [submitResult, setSubmitResult] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    setFile({
      url: (userProfile.files && userProfile.files[0]?.url?.md) || '',
    });
  }, [userProfile]);

  const fileUploadHandler = async (inputFile: File) => {
    setUploading(true);

    const url = URL.createObjectURL(inputFile);
    const newFile: ProfileFile = { url, file: inputFile };

    const buffer = await inputFile.arrayBuffer();
    const { key, signedUrl } = await getPresignedUrl();
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: buffer,
    });
    newFile.s3Key = key;

    setUploading(false);

    setFile(newFile);
  };

  const submitAction = async () => {
    const param = {
      username: profile.username,
      content: profile.content,
      addresses: profile.addresses?.map((a) => a.code),
      file: file?.s3Key,
    };

    const result = await updateUserProfile(param);

    if (result?.message === 'success') {
      setSubmitResult('업데이트 성공');
      setTimeout(() => {
        setSubmitResult('');
      }, 1000);
    }
  };

  const value = {
    states: {
      isOwner,
      isAddressModal,
      allAddresses,
      profile,
      result: submitResult,
      file,
      uploading,
    },
    actions: {
      setIsAddressModal,
      setAllAddresses,
      setProfile,
      setFile,
      setUploading,
      fileUploadHandler,
      submitAction,
    },
  };

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}
