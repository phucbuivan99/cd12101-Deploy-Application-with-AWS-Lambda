import { generateAttachmentUrl } from "../../businessLogic/todos.mjs";

export function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const url = generateAttachmentUrl(todoId)
  return {
    statusCode: 204,
    body: JSON.stringify({ uploadUrl: url })
  }
}

