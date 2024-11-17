import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const todosTable = process.env.TODOS_TABLE;
const todosIndex = process.env.INDEX_NAME;

export class TodosAccess {
    constructor(
        docClient = new XAWS.DynamoDB.DocumentClient()
    ) {
        this.docClient = docClient;
        this.todosTable = todosTable;
        this.todosIndex = todosIndex;
    }

    async getAllTodos(userId) {
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: this.todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        return result.Items;
    }

    async createTodoItem(todoItem) {
        await this.docClient
            .put({
                TableName: this.todosTable,
                Item: todoItem
            })
            .promise()
        return todoItem
    }

    async updateTodoItem(todoId, userId, todoUpdate) {
        await this.docClient
            .update({
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
                }
            })
            .promise();

        return todoUpdate;
    }

    async deleteTodoItem(todoId, userId) {
        await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId
                }
            })
            .promise();
    }

    async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId
                },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl
                }
            })
            .promise();
    }
}