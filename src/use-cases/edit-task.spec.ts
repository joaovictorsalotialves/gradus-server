import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { InvalidValueError } from '../utils/errors/InvalidValueError.ts'
import { RequiredFieldError } from '../utils/errors/RequiredFieldError.ts'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError.ts'
import { EditTaskUseCase } from './edit-task.ts'

let sut: EditTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  })
}

describe('Edit Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new EditTaskUseCase(inMemoryTaskRepository)
  })

  it('should edit an existing task', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 48) // 2 days in the future

    const updatedTask = await sut.execute({
      id: task.id.value,
      title: 'Updated Task Title',
      describe: 'Updated description',
      dueDate,
    })

    expect(updatedTask.title).toBe('Updated Task Title')
    expect(updatedTask.describe).toBe('Updated description')
    expect(updatedTask.dueDate).toEqual(dueDate)
    expect(updatedTask.updatedAt).toBeTruthy()
  })

  it('should throw an error if the task is not found', async () => {
    await expect(() =>
      sut.execute({
        id: 'invalid-id',
        title: 'Updated Task',
        describe: 'Description',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    ).rejects.toBeInstanceOf(TaskNotFoundError)
  })

  it('should throw an error if the title is empty', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await expect(() =>
      sut.execute({
        id: task.id.value,
        title: '',
        describe: 'Description',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
    ).rejects.toBeInstanceOf(RequiredFieldError)
  })

  it('should throw an error if the due date is empty', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await expect(() =>
      sut.execute({
        id: task.id.value,
        title: 'Updated Task',
        describe: 'Description',
        dueDate: '' as unknown as Date, // Forcefully casting to Date to simulate an empty due date
      })
    ).rejects.toBeInstanceOf(RequiredFieldError)
  })

  it('should throw an error if the due date is in the past', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    await expect(() =>
      sut.execute({
        id: task.id.value,
        title: 'Updated Task',
        describe: 'Description',
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day in the past
      })
    ).rejects.toBeInstanceOf(InvalidValueError)
  })
})
