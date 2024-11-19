import * as uuid from 'uuid'
import { TodoAccess } from '../dataLayer/todosAccess.mjs'
import { getAttachmentUrl } from '../fileStorage/attachmentUtils.mjs'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId) {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(userId, createTodoRequest) {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    attachmentUrl: createTodoRequest.attachmentUrl,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString,
    name: createTodoRequest.name,
    done: false
  })
}

export async function updateTodo(userId, todoId, updateTodoRequest) {
  return await todoAccess.updateTodo(
    userId,
    todoId,
    updateTodoRequest
  )
}

export async function deleteTodo(userId, todoId) {
  await todoAccess.deleteTodo(userId, todoId)
}

export async function generateAttachmentUrl(userId, todoId) {
  const url = await getAttachmentUrl(todoId)
  await todoAccess.updateAttachmentUrl(userId, todoId)
  return url
}
