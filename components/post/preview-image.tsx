'use client';

import { MinusCircleIcon } from '@heroicons/react/16/solid';
import { PhotoIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { Dispatch, MouseEvent, SetStateAction } from 'react';

type PreviewProps = {
  imageFiles: { url: string; file: File }[];
  handleClearPreview: (url: string) => void;
  selectedFileUrl: string;
  setSelectedFileUrl: Dispatch<SetStateAction<string>>;
};

type ThumbnailProps = {
  url: string;
  file: File;
  selectedFileUrl: string;
  setSelectedFileUrl: Dispatch<SetStateAction<string>>;
  handleClearPreview: (url: string) => void;
};

export default function Preview({ imageFiles, handleClearPreview, selectedFileUrl, setSelectedFileUrl }: PreviewProps) {
  return (
    <div className="flex flex-col items-center">
      {/* 상단 프리뷰 이미지 썸네일 리스트 */}
      {/* <div className="w-full flex flex-row py-2 flex-wrap justify-center items-center gap-2"> */}
      <div className="w-full grid grid-cols-5 grid-flow-row place-items-center gap-2">
        {imageFiles.map(({ url, file }) => (
          <Thumbnail
            key={url}
            url={url}
            file={file}
            selectedFileUrl={selectedFileUrl}
            setSelectedFileUrl={setSelectedFileUrl}
            handleClearPreview={handleClearPreview}
          />
        ))}
      </div>
      {/* 메인 프리뷰 이미지 */}
      <div className="w-full">
        <div className="h-[500px] my-4 border rounded-lg relative flex justify-center items-center">
          {imageFiles.length === 0 ? (
            <PhotoIcon className="w-20 h-20 opacity-25" />
          ) : (
            <Image src={selectedFileUrl} fill alt={`preview_${selectedFileUrl}`} className="object-contain"></Image>
          )}
        </div>
      </div>
    </div>
  );
}

const Thumbnail = ({ url, file, selectedFileUrl, setSelectedFileUrl, handleClearPreview }: ThumbnailProps) => {
  const handleOnClickClearPreview = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleClearPreview(url);
  };

  const handleSelectPreviewImage = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setSelectedFileUrl(url);
  };

  return (
    <div
      key={url}
      className={clsx(`group/image relative shrink-0 w-16 h-16 border`, {
        'border-neutral-400 rounded-lg': url === selectedFileUrl,
      })}
      onClick={handleSelectPreviewImage}
    >
      <Image src={url} fill alt={`preview_${url}`} className="px-2 object-cover"></Image>
      <button className="absolute -top-2 -right-2 text-red-600" onClick={handleOnClickClearPreview}>
        <MinusCircleIcon className="w-6 h-6" />
      </button>
    </div>
  );
};
