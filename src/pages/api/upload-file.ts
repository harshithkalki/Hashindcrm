import AWS from 'aws-sdk';
import type { NextApiHandler } from 'next';
import { env } from '@/env/server.mjs';

const s3 = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

const handler: NextApiHandler = async (req, res) => {
  const { file } = req.body;

  const params = {
    Bucket: 'your-bucket-name',
    Key: file.name,
    Body: file.data,
    ContentType: file.type,
    ACL: 'public-read',
  };

  try {
    const data = await s3.upload(params).promise();
    res
      .status(200)
      .json({ message: 'File uploaded successfully', url: data.Location });
  } catch (error) {
    res.status(500).json({ message: (error as AWS.AWSError).message });
  }
};

export default handler;
