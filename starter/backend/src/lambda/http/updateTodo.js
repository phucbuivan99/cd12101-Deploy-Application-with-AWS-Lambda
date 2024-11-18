import { updateTodo } from "../../businessLogic/todos.mjs";
import { extractUserId } from "../../utils/utils.mjs";

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const updatedTodo = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  const userId = extractUserId(event);
  await updateTodo(
    userId,
    todoId,
    updatedTodo
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