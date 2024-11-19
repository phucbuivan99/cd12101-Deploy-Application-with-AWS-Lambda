import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export class TodoAccess {
    constructor(
        documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
        todosTable = process.env.TODOS_TABLE
    ) {
        this.documentClient = documentClient
        this.todosTable = todosTable
        this.dynamoDbClient = DynamoDBDocument.from(this.documentClient, {
            marshallOptions: {
                removeUndefinedValues: true
            }
        })
    }

    async getAllTodos(userId) {
        console.log('Getting all todos')
        const result = await this.dynamoDbClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        return result.Items
    }

    async createTodo(todo) {
        console.log(`Creating a todo, todoId: ${todo.todoId}`)

        await this.dynamoDbClient.put({
            TableName: this.todosTable,
            Item: todo
        })

        return todo
    }

    async deleteTodo(userId, todoId) {
        console.log(`Deleting a todo, todoId: ${todoId}`)

        await this.dynamoDbClient.delete({
            TableName: this.todosTable,
            Key: { userId, todoId}
        })
    }

    async updateTodo(userId, todoId, todoUpdate) {
        console.log(`Update a todo with todoId ${todoId}`)

        await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: {
                todoId,
                userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
                ':name': todoUpdate.name,
                ':dueDate': todoUpdate.dueDate,
                ':done': todoUpdate.done
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
        })
    }

    async updateAttachmentUrl(userId, todoId) {
        await this.dynamoDbClient.update({
            TableName: this.todosTable,
            Key: { userId, todoId },
            ConditionExpression: 'attribute_exists(todoId)',
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
            }
        })
    }
}
