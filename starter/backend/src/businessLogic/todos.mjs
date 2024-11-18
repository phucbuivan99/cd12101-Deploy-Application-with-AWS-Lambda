import { v4 as uuidv4 } from 'uuid';
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';
import { TodosAccess } from '../dataLayer/todosAccess.mjs';
const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createTodo(newTodo, userId) {
    const todoId = uuidv4();
    const createdAt = new Date().toISOString();
    const attachmentUrl = attachmentUtils.getAttachmentUrl(todoId)

    const todoItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: attachmentUrl,
        ...newTodo,
    };

    return await todosAccess.createTodoItem(todoItem);
}

export async function getTodosForUser(userId) {
    return await todosAccess.getAllTodos(userId);
}