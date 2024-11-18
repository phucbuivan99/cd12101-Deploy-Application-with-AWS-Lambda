import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export class AttachmentUtils {
    constructor(s3Client = new XAWS.S3({ signatureVersion: 'v4' }), bucketName = s3BucketName) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
    }

    getAttachmentUrl(todoId) {
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
    }

    getUploadUrl(todoId) {
        const url = this.s3.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId,
            Expires: urlExpiration
        })
        return url
    }
}