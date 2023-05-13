import multer from 'multer';
import AWS from 'aws-sdk';
import { env } from '@/env/server.mjs';
import type { Request, Response } from 'express';

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

async function uploadFile(file: Express.Multer.File) {
    const params = {
        Body: file.buffer,
        Bucket: env.AWS_BUCKET_NAME,
        ContentType: file.mimetype,
        Key: file.originalname,
        ACL: 'public-read',
    }
    return {
        url: (await s3.upload(params).promise()).Location,
        name: file.originalname,
    }
}



export default async function handler(req: Request, res: Response) {
    upload.array('files')(req, res, async (err) => {

        if (err) {
            return res.status(400).json({ message: 'No file provided' });
        }

        const files = req.files as Express.Multer.File[];

        if (!files) {
            return res.status(400).json({ message: 'No file provided' });
        }

        try {
            await Promise.all(files.map(uploadFile)).then((data) => {
                return res.status(200).json({
                    message: 'Files uploaded successfully',
                    files: data,
                });
            })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Something went wrong' });
        }
    });
}
