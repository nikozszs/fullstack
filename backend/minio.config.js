import dotenv from 'dotenv';
import * as Minio from 'minio';

dotenv.config();

export const minioConfig = {
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
}

export const BUCKET_NAME = process.env.MINIO_BUCKET_NAME

const minioClient = new Minio.Client(minioConfig);

export default minioClient;

console.log('MinIO Config loaded:', {
    endPoint: minioConfig.endPoint,
    port: minioConfig.port,
    useSSL: minioConfig.useSSL,
    accessKey: minioConfig.accessKey ? '***' : 'not set',
    secretKey: minioConfig.secretKey ? '***' : 'not set',
    bucketName: BUCKET_NAME
});