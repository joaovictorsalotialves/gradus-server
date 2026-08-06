import request from 'supertest'
import { app } from '../app'
import { db } from '../db/client'
import { schema } from '../db/schemas/index'

describe('Mark Task Controller (e2e)', () => {
  beforeAll(async () => {
    await db.delete(schema.tasks).execute()
  })

  it('should be able to mark a task completed (e2e)', async () => {
    await db.insert(schema.tasks).values({
      id: 'a192df86-0d9b-4282-8f97-dc2c6db8917d',
      title: 'Test Task',
      describe: 'This is a test task',
      slug: 'test-task-a192df86',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    const response = await request(app).patch('/task/a192df86-0d9b-4282-8f97-dc2c6db8917d/completed')

    expect(response.statusCode).toEqual(200)
    expect(response.body.completedAt).toBeTruthy()
  })
})
