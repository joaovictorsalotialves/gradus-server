import request from 'supertest'
import { app } from '../app'
import { db } from '../db/client'
import { schema } from '../db/schemas/index'

describe('Remove Task Controller (e2e)', () => {
  beforeAll(async () => {
    await db.delete(schema.tasks).execute()
  })

  it('should be able to remove a task (e2e)', async () => {
    await db.insert(schema.tasks).values({
      id: '4f3e0a50-e425-4b90-ba6b-a40e21109819',
      title: 'Test Task',
      describe: 'This is a test task',
      slug: 'test-task-4f3e0a50',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    const response = await request(app).delete('/task/4f3e0a50-e425-4b90-ba6b-a40e21109819')

    expect(response.statusCode).toEqual(200)
  })
})
