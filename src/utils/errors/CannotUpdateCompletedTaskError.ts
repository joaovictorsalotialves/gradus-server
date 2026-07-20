export class CannotUpdateCompletedTaskError extends Error {
  constructor() {
    super('Cannot update a completed task')
  }
}
