import multer from 'multer';
import AWS from 'aws-sdk';
import { env } from '@/env/server.mjs';
import type { Request, Response } from 'express';
import { createId } from '@paralleldrive/cuid2';

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: Request, res: Response) {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    try {
      s3.upload(
        {
          Bucket: env.AWS_BUCKET_NAME,
          Key: createId(),
          Body: file.buffer,
          ACL: 'public-read',
        },
        (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Something went wrong' });
          }

          return res.status(200).json({
            message: 'File uploaded successfully',
            url: data.Location,
          });
        }
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  });
}
