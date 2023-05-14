import { z } from 'zod'
import { router, protectedProcedure } from "../trpc"
import AWS from 'aws-sdk';
import { env } from '@/env/server.mjs';

export const filesRouter = router({
    deleteFiles: protectedProcedure.input(z.object({
        keys: z.array(z.string())
    })).mutation(({ input }) => {
        const s3 = new AWS.S3({
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        });

        const params = {
            Bucket: env.AWS_BUCKET_NAME,
            Delete: {
                Objects: input.keys.map((fileId) => {
                    return {
                        Key: fileId
                    }
                }
                )
            }
        };

        s3.deleteObjects(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        }
        );

        return true

    })
})
