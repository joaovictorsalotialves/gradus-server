import request from 'supertest'
import { app } from '../app.js'

describe('Create Task Controller (e2e)', () => {
  it('should be able to create a task (e2e)', async () => {
    const today = new Date(Date.now() + 1000 * 60 * 60 * 24)

    const response = await request(app).post('/task').send({
      title: 'Test Task',
      describe: 'This is a test task',
      dueDate: today.toString(),
    })

    expect(response.statusCode).toEqual(201)
    expect(response.body.id).toBeTruthy()
    expect(response.body.title).toBe('Test Task')
    expect(response.body.describe).toBe('This is a test task')
    expect(response.body.slug).toBe(`test-task-${response.body.id.substring(0, 8)}`)
    expect(response.body.status).toBe('pending')
    expect(response.body.dueDate).toBeTruthy()
    expect(response.body.createdAt).toBeTruthy()
  })
})
