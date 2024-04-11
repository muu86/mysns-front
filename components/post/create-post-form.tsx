'use client';

import { createPost } from '@/lib/actions/post';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useState } from 'react';
import Preview from './preview-image';
import { getPresignedUrl } from '@/lib/actions/file';

type ImageFile = {
  url: string;
  file: File;
  s3Key?: string;
};

export default function CreatePostForm() {
  const [content, setContent] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileInput = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      const url = URL.createObjectURL(file);
      const newFile: ImageFile = { url, file };
      setImageFiles([...imageFiles, newFile]);
      setSelectedFileUrl(url);

      const buffer = await file.arrayBuffer();
      const { key, signedUrl } = await getPresignedUrl();
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: buffer,
      });
      newFile.s3Key = key;
      setUploading(false);
    }
  };

  const handleClearPreview = (id: string) => {
    // 배열 중에 하나를 삭제했을 때 selectedImageId 값을 다시 설정해줘야 함.
    // 삭제한 이미지의 왼쪽 이미지를 자동으로 선택하도록 한다.
    // 원래 index 저장

    // 리스트 길이가 1 이라 삭제하면 선택된 이미지가 없는 경우
    // 리스트 길이는 1 이상인데 0번 인덱스(첫번째 이미지)를 삭제하는 경우
    // 리스트 길이도 1 이상이고 1번 인덱스를 삭제하는 경우가 아니라 그냥 인덱스 - 1 만 하면 되는 경우
    const indexToDelete = imageFiles.findIndex((f) => f.url === id);
    if (selectedFileUrl === imageFiles[indexToDelete].url) {
      let nextSelectedIndex = indexToDelete === 0 ? indexToDelete + 1 : indexToDelete - 1;
      if (imageFiles.length === 1) nextSelectedIndex = -1;
      setSelectedFileUrl(nextSelectedIndex === -1 ? '' : imageFiles[nextSelectedIndex].url);
    }

    setImageFiles(
      imageFiles.filter((file) => {
        return file.url !== id;
      })
    );
  };

  const formActionHandler = () => {
    createPost({
      content: content,
      fileKeys: imageFiles.filter((f) => !!f.s3Key).map((f) => f.s3Key!),
    });
  };

  return (
    <div className="flex flex-col w-full py-4">
      <form action={formActionHandler}>
        {/* 이미지, 미디어 파일 */}
        <div className="w-full mb-4 flex flex-row justify-end gap-2">
          <div className="hover:myhover">
            <label className="w-20 flex flex-col justify-center items-center hover:cursor-pointer">
              <PlusCircleIcon className="w-8" />
              <input
                disabled={uploading}
                className="hidden"
                type="file"
                accept="image/**"
                multiple
                name="files"
                onChange={handleFileInput}
              />
              <span className="text-xs">이미지 추가</span>
            </label>
          </div>
          {/* 저장 */}
          <div className="hover:myhover">
            <button disabled={uploading} type="submit" className="w-20 flex flex-col items-center justify-center">
              <CheckCircleIcon className="w-8" />
              <span className="text-xs">저장</span>
            </button>
          </div>
        </div>
        {imageFiles && (
          <Preview
            imageFiles={imageFiles}
            handleClearPreview={handleClearPreview}
            selectedFileUrl={selectedFileUrl}
            setSelectedFileUrl={setSelectedFileUrl}
          />
        )}
        {/* 텍스트 */}
        <div className="py-3">
          <div className="border rounded-lg has-[:focus]:border-neutral-800">
            <textarea
              name="content"
              className="w-full rounded-lg min-h-56 p-6 resize-none focus:outline-none"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
