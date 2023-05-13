import { env } from '@/env/server.mjs';
import AWS from 'aws-sdk';
import type { NextApiHandler } from 'next';




const handler: NextApiHandler = async (req, res) => {
    const s3 = new AWS.S3({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    });

    const params = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: req.query.key as string,
    };

    try {
        const data = await s3.getObject({ ...params }).promise();
        res.status(200).send(data.Body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}

export default handler;
