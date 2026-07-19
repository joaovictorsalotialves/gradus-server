import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { CreateTaskUseCase } from './create-task.ts'

let sut: CreateTaskUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeRequest = () => {
  return {
    title: 'Test Task',
    describe: 'This is a test task',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day in the future
  }
}

describe('Create Task Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new CreateTaskUseCase(inMemoryTaskRepository)
  })

  it('should create a new task', async () => {
    const request = makeRequest()

    const task = await sut.execute(request)

    expect(task.id.value).toBeTruthy()
    expect(task.createdAt).toBeTruthy()
    expect(task).contain({
      title: 'Test Task',
      describe: 'This is a test task',
      slug: `test-task-${task.id.value.substring(0, 8)}`,
      dueDate: request.dueDate,
    })
  })

  it('should persist in task repository', async () => {
    const request = makeRequest()

    const task = await sut.execute(request)

    const persistedTask = await inMemoryTaskRepository.findById(task.id.value)

    expect(inMemoryTaskRepository.items).toHaveLength(1)
    expect(persistedTask).toEqual(task)
  })

  it('should throw an error if the title is empty', async () => {
    const request = {
      ...makeRequest(),
      title: '',
    }

    await expect(sut.execute(request)).rejects.toBeInstanceOf(Error)
  })

  it('should throw an error if the due date is empty', async () => {
    const request = {
      ...makeRequest(),
      dueDate: null as unknown as Date, // Forcefully casting to Date to simulate an empty due date
    }

    await expect(sut.execute(request)).rejects.toBeInstanceOf(Error)
  })

  it('should throw an error if the due date is in the past', async () => {
    const request = {
      ...makeRequest(),
      dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day in the past
    }

    await expect(sut.execute(request)).rejects.toBeInstanceOf(Error)
  })
})
