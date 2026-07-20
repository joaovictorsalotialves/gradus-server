import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { RemoveTaskUseCase } from './remove-task.ts'

let sut: RemoveTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  })
}

describe('Remove Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new RemoveTaskUseCase(inMemoryTaskRepository)
  })

  it('should remove the task when given a valid ID', async () => {
    inMemoryTaskRepository.create(makeTask())

    await expect(sut.execute({ id: inMemoryTaskRepository.items[0].id.value })).resolves.not.toThrow()
  })

  it('should throw an error if the task is not found', async () => {
    await expect(sut.execute({ id: 'non-existent-id' })).rejects.toBeInstanceOf(Error)
  })
})
