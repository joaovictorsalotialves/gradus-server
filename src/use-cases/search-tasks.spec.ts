import { Task } from '../entities/Task.ts'
import { InMemoryUsersRepository } from '../repositories/in-memory/inMemoryUsersRepository.ts'
import { SearchTasksUseCase } from './search-tasks.ts'

let sut: SearchTasksUseCase
let inMemoryTaskRepository: InMemoryUsersRepository

const makeTasks = (): Task[] => {
  const tasks: Task[] = []

  // Create 15 tasks with varying titles and statuses
  // 3 tasks will have 'overdue' status
  // 5 tasks will have 'pedding' status
  // 7 tasks will have 'completed' status
  for (let i = 1; i < 16; i++) {
    tasks.push(
      Task.create({
        title: `Task ${i}`,
        describe: `This is task number ${i}`,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (15 - i)),
        dueDate:
          i % 3 === 0
            ? new Date(Date.now() - 1000 * 60 * 60 * 24 * (15 - i))
            : new Date(Date.now() + 1000 * 60 * 60 * 24 * (15 - i)),
        completedAt: i % 2 === 0 ? new Date() : undefined,
      })
    )
  }
  return tasks
}

describe('Search Tasks Use Case', () => {
  beforeEach(() => {
    inMemoryTaskRepository = new InMemoryUsersRepository()
    sut = new SearchTasksUseCase(inMemoryTaskRepository)
  })

  it('should return tasks paginated', async () => {
    const tasks = makeTasks()
    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({ page: 1, limit: 10 })

    expect(result).toHaveLength(10)
  })

  it('should return tasks ordered by createdAt in ascending order', async () => {
    const tasks = makeTasks()

    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'asc',
    })

    expect(result).toHaveLength(10)

    expect(result).toEqual([...result].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()))
  })

  it('should return tasks ordered by createdAt in descending order', async () => {
    const tasks = makeTasks()

    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
    })

    expect(result).toHaveLength(10)

    expect(result).toEqual([...result].sort((a, b) => a.createdAt.getTime() + b.createdAt.getTime()))
  })

  it('should return tasks ordered by dueDate in ascending order', async () => {
    const tasks = makeTasks()

    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({
      page: 1,
      limit: 10,
      sort: 'dueDate',
      order: 'asc',
    })

    expect(result).toHaveLength(10)

    expect(result).toEqual([...result].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()))
  })

  it('should return tasks ordered by dueDate in descending order', async () => {
    const tasks = makeTasks()

    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({
      page: 1,
      limit: 10,
      sort: 'dueDate',
      order: 'desc',
    })

    expect(result).toHaveLength(10)

    expect(result).toEqual([...result].sort((a, b) => a.dueDate.getTime() + b.dueDate.getTime()))
  })

  it('should return an empty array if there are no tasks', async () => {
    const tasks = await sut.execute({})

    expect(tasks).toHaveLength(0)
  })

  it('should return tasks that match the title query', async () => {
    const tasks = makeTasks()
    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({ title: 'Task 2' })

    expect(result).toHaveLength(1) // Task 2
    expect(result.map(task => task.title)).toEqual(expect.arrayContaining(['Task 2']))
  })

  it('should return tasks that match the status query', async () => {
    const tasks = makeTasks()
    for (const task of tasks) {
      await inMemoryTaskRepository.create(task)
    }

    const result = await sut.execute({ status: 'pending' })

    expect(result).toHaveLength(5) // 5 tasks with 'pending' status
    expect(result.every(task => task.status === 'pending')).toBe(true)
  })
})
