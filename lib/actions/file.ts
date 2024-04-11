'use server';

import { randomUUID } from 'crypto';
import { stringify } from 'querystring';

export async function getPresignedUrl() {
  const param = {
    key: randomUUID(),
  };
  const response = await fetch(`${process.env.FILE_UPLOAD_URL}/presigned?${stringify(param)}`);
  const result = await response.json();

  return {
    key: param.key,
    signedUrl: result.url,
  };
}
