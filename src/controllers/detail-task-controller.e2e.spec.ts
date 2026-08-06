import { sql } from 'drizzle-orm'
import request from 'supertest'
import { app } from '../app'
import { db } from '../db/client'
import { schema } from '../db/schemas/index'

describe('Detail Task Controller (e2e)', () => {
  it('should be able to detail a task (e2e)', async () => {
    await db.insert(schema.tasks).values({
      id: '202191a0-1da9-4715-900e-dfe21de090e1',
      title: 'Test Task',
      describe: 'This is a test task',
      slug: 'test-task-202191a0',
      status: 'pending',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
    })

    const response = await request(app).get('/task/202191a0-1da9-4715-900e-dfe21de090e1')

    expect(response.statusCode).toEqual(200)
    expect(response.body.id).toBeTruthy()
    expect(response.body.title).toBe('Test Task')
    expect(response.body.describe).toBe('This is a test task')
    expect(response.body.slug).toBe(`test-task-${response.body.id.substring(0, 8)}`)
    expect(response.body.status).toBe('pending')
    expect(response.body.dueDate).toBeTruthy()
    expect(response.body.createdAt).toBeTruthy()
  })
})
