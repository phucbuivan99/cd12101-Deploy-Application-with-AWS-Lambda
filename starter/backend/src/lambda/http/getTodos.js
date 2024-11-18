import { getTodosForUser } from "../../businessLogic/todos.mjs"
import { extractUserId } from "../../utils/utils.mjs"

export async function handler(event) {
  const userId = extractUserId(event)
  const todos = await getTodosForUser(userId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({
      items: todos
    })
  }
}
