export class CannotUpdateDeletedTaskError extends Error {
  constructor() {
    super('Cannot update a deleted task')
  }
}
