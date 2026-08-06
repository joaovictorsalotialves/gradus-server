import request from 'supertest'
import { app } from '../app'
import { db } from '../db/client'
import { schema } from '../db/schemas/index'

describe('Edit Task Controller (e2e)', () => {
  beforeAll(async () => {
    await db.delete(schema.tasks).execute()
  })

  it('should be able to edit a task (e2e)', async () => {
    await db.insert(schema.tasks).values({
      id: 'ab072608-0e38-46c2-bb3b-1198ac4887c3',
      title: 'Test Task',
      describe: 'This is a test task',
      slug: 'test-task-ab072608',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    const response = await request(app)
      .put('/task/ab072608-0e38-46c2-bb3b-1198ac4887c3')
      .send({
        title: 'Test Task UPDATE',
        describe: 'This is a test task UPDATE',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      })

    expect(response.statusCode).toEqual(200)
    expect(response.body.id).toBeTruthy()
    expect(response.body.title).toBe('Test Task UPDATE')
    expect(response.body.describe).toBe('This is a test task UPDATE')
    expect(response.body.slug).toBe(`test-task-update-${response.body.id.substring(0, 8)}`)
    expect(response.body.status).toBe('pending')
    expect(response.body.dueDate).toBeTruthy()
    expect(response.body.createdAt).toBeTruthy()
    expect(response.body.updatedAt).toBeTruthy()
  })
})
