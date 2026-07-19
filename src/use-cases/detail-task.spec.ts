import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { DetailTaskUseCase } from './detail-task.ts'

let sut: DetailTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  })
}

describe('Detail Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new DetailTaskUseCase(inMemoryTaskRepository)
  })

  it('should return the correct task when given a valid ID', async () => {
    inMemoryTaskRepository.create(makeTask())

    const task = await sut.execute({ id: inMemoryTaskRepository.items[0].id.value })

    expect(task.id.value).toBeTruthy()
    expect(task.createdAt).toBeTruthy()
    expect(task).contain({
      title: 'Test Task',
      describe: 'This is a test task',
      slug: `test-task-${task.id.value.substring(0, 8)}`,
      dueDate: inMemoryTaskRepository.items[0].dueDate,
    })
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(Error)
  })
})
