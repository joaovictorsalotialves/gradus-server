import { Task } from '../entities/Task'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'
import { DetailTaskUseCase } from './detail-task'

let sut: DetailTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), 
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

  it('should throw an error if the task has been removed', async () => {
    inMemoryTaskRepository.create(makeTask())
    inMemoryTaskRepository.items[0].deletedAt = new Date()

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).rejects.toBeInstanceOf(
      TaskNotFoundError
    )
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(TaskNotFoundError)
  })
})
