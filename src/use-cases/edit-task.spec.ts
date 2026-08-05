import { Task } from '../entities/Task'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository'
import { CannotUpdateCompletedTaskError } from '../utils/errors/CannotUpdateCompletedTaskError'
import { InvalidValueError } from '../utils/errors/InvalidValueError'
import { RequiredFieldError } from '../utils/errors/RequiredFieldError'
import { TaskNotFoundError } from '../utils/errors/TaskNotFoundError'
import { EditTaskUseCase } from './edit-task'

let sut: EditTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTask = () => {
  return Task.create({
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), 
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

    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 48) 

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

  it('should persist the changes in the repository', async () => {
    const task = makeTask()
    await inMemoryTaskRepository.create(task)

    const dueDate = new Date(Date.now() + 1000 * 60 * 60 * 48)

    await sut.execute({
      id: task.id.value,
      title: 'Updated Task Title',
      describe: 'Updated description',
      dueDate,
    })

    const updated = await inMemoryTaskRepository.findById(task.id.value)

    expect(updated).not.toBeNull()
    expect(updated?.title).toBe('Updated Task Title')
    expect(updated?.describe).toBe('Updated description')
    expect(updated?.dueDate).toEqual(dueDate)
    expect(updated?.updatedAt).toBeTruthy()
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

  it('should throw an error if the task is completed', async () => {
    const task = makeTask()
    task.completedAt = new Date()
    await inMemoryTaskRepository.create(task)

    await expect(() =>
      sut.execute({
        id: task.id.value,
        title: 'Updated Task',
        describe: 'Updated description',
        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      })
    ).rejects.toBeInstanceOf(CannotUpdateCompletedTaskError)
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
        dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), 
      })
    ).rejects.toBeInstanceOf(InvalidValueError)
  })
})
