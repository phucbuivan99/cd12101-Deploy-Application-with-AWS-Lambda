import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../businessLogic/todos.mjs'
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

    const newTodo = JSON.parse(event.body)
    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)
    const newItem = await createTodo(userId, newTodo)

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  })
