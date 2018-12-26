'use strict';

import { createHmac } from 'crypto';

export const signBlob = (
  key: string | Buffer | NodeJS.TypedArray | DataView,
  blob: string | Buffer | NodeJS.TypedArray | DataView
) => {
  return (
    'sha1=' +
    createHmac('sha1', key)
      .update(blob)
      .digest('hex')
  );
};
