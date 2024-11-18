import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION) || 300;

export class AttachmentUtils {
    constructor(s3Client = new XAWS.S3({ signatureVersion: 'v4' }), bucketName = s3BucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    getAttachmentUrl(todoId) {
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }

    getUploadUrl(todoId) {

        console.log('Generating upload URL for todoId:', todoId);
        console.log('Bucket name:', this.bucketName);
        console.log('S3 Client:', this.s3Client);
        const url = this.s3Client.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: urlExpiration
        })
        return url
    }
}