import { deleteTodo } from "../../businessLogic/todos.mjs";
import { extractUserId } from "../../utils/utils.mjs";

export async function handler(event) {
  const todoId = event.pathParameters.todoId

  // TODO: Remove a TODO item by id
  const userId = extractUserId(event);
  await deleteTodo(
    userId,
    todoId
  );
  return {
    statusCode: 204,
    body: '',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
}

