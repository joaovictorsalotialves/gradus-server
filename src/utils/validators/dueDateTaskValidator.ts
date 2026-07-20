import { InvalidValueError } from '../errors/InvalidValueError.ts'
import { RequiredFieldError } from '../errors/RequiredFieldError.ts'

export const dueDateTaskValidator = (dueDate: Date): void => {
  if (!dueDate) {
    throw new RequiredFieldError('Due date')
  }

  if (dueDate < new Date()) {
    throw new InvalidValueError('Due date', 'date prior to the current day')
  }
}
