import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const urlExpiration = Number(process.env.SIGNED_URL_EXPIRATION) || 300

const s3Client = new S3Client()

export async function getAttachmentUrl(todoId) {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: todoId
  })
  const url = await getSignedUrl(s3Client, command, {
    expiresIn: urlExpiration
  })
  return url
}
