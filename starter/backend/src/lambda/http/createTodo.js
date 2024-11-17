import { createTodo } from "../../businessLogic/todos.mjs";
import { extractUserId } from "../../utils/utils.mjs";

export async function handler(event) {
  const newTodo = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const userId = extractUserId(event);
  const todo = await createTodo(newTodo, userId);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item: todo }),
  };
}

