import request from 'supertest'
import { app } from '../app'
import { db } from '../db/client'
import { schema } from '../db/schemas/index'

describe('Mark Task Not Controller (e2e)', () => {
  beforeAll(async () => {
    await db.delete(schema.tasks).execute()
  })

  it('should be able to mark a task not completed (e2e)', async () => {
    await db.insert(schema.tasks).values({
      id: '71c74475-e8e6-4cfb-a4f7-89729a1baabc',
      title: 'Test Task',
      describe: 'This is a test task',
      slug: 'test-task-71c74475',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      completedAt: new Date(),
    })

    const response = await request(app).patch('/task/71c74475-e8e6-4cfb-a4f7-89729a1baabc/not-completed')

    expect(response.statusCode).toEqual(200)
    expect(response.body.completedAt).toBeUndefined()
  })
})
