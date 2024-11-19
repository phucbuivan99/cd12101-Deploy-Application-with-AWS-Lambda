import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Starting event: ', event)

    const todoId = event.pathParameters.todoId
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    await deleteTodo(userId, todoId)

    return {
      statusCode: 204
    }
  })
