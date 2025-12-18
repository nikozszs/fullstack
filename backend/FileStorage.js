import * as Minio from 'minio';
import { minioConfig } from './minio.config.js';

class FileStorageService {
    constructor() {
        this.client = new Minio.Client(minioConfig);
        this.bucketName = 'media';
    }

    async ensureBucketExists() {
        const exists = await this.client.bucketExists(this.bucketName);
        if (!exists) {
            await this.client.makeBucket(this.bucketName, 'us-east-1');
            console.log(`✅ Бакет "${this.bucketName}" создан`);
        }
    }

    async uploadFile(file, subfolder = '') {
        await this.ensureBucketExists();

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.originalname.split('.').pop();
        const fileName = `${subfolder}/${timestamp}_${randomString}.${extension}`.replace(/^\//, '');

        await this.client.putObject(
            this.bucketName,
            fileName,
            file.buffer,
            file.size,
            { 'Content-Type': file.mimetype }
        );

        const fileUrl = `/api/files/${fileName}`;

        return {
            url: fileUrl,
            fileName: fileName,
            size: file.size,
            mimetype: file.mimetype
        }
    }

    async deleteFile(fileName) {
        await this.client.removeObject(this.bucketName, fileName);
    }
}

export default new FileStorageService();