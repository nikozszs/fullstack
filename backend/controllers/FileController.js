import minioClient, { BUCKET_NAME } from '../minio.config.js';

export const initMinIO = async () => {
    try {
        const exists = await minioClient.bucketExists(BUCKET_NAME);
        if (!exists) {
            await minioClient.makeBucket(BUCKET_NAME, 'us-east-1');
            console.log(`✅ Бакет "${BUCKET_NAME}" создан`);
            const policy = {
                Version: "2012-10-17",
                Statement: [
                    {
                        Effect: "Allow",
                        Principal: { AWS: ["*"] },
                        Action: ["s3:GetObject"],
                        Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                    }
                ]
            };
            
            await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy));
            console.log(`✅ Публичный доступ к бакету "${BUCKET_NAME}" настроен`);
        }
    } catch (err) {
        console.log(err)
    }
}

export const uploadToMinIO = async (file, folder = 'uploads') => {
    try {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const extension = file.originalname.split('.').pop();
        const fileName = `${folder}/${timestamp}_${random}.${extension}`;

        await minioClient.putObject(
            BUCKET_NAME,
            fileName,
            file.buffer,
            file.size,
            {
                'Content-Type': file.mimetype,
                'Content-Disposition': 'inline'
            }
        );

        const fileUrl = `/api/files/${fileName}`;
        
        return {
            url: fileUrl,
            fileName: fileName,
            size: file.size,
            mimetype: file.mimetype
        }
    } catch (err) {
        console.log(err)
    }
}

export const getFileFromMinIO = async (req, res) => {
    try {
        const { bucket = BUCKET_NAME, filename } = req.params
        const stat = await minioClient.statObject(bucket, filename)
        const dataStream = await minioClient.getObject(bucket, filename)

        res.setHeader('Content-Type', stat.metaData['content-type'] || 'application/octet-stream');
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', `inline; filename="${filename.split('/').pop()}"`);

        dataStream.pipe(res);
        
        dataStream.on('error', (err) => {
            console.error('Ошибка потока:', err);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Ошибка чтения файла' });
            }
        });
    } catch (err) {
        console.log(err)
        if (err.code === 'NoSuchKey') {
            res.status(404).json({ message: 'Файл не найден' });
        } else {
            res.status(500).json({ message: 'Ошибка сервера', error: err.message });
        }
    }
}