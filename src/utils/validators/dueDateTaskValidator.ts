import { InvalidValueError } from '../errors/InvalidValueError'
import { RequiredFieldError } from '../errors/RequiredFieldError'

export const dueDateTaskValidator = (dueDate: Date): void => {
  if (!dueDate) {
    throw new RequiredFieldError('Due date')
  }

  const today = new Date()

  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())

  if (dueDateOnly < todayOnly) {
    throw new InvalidValueError('Due date', 'date prior to the current day')
  }
}
