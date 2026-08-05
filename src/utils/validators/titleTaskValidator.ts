import { RequiredFieldError } from '../errors/RequiredFieldError'

export const titleTaskValidator = (title: string): void => {
  if (!title || title.trim() === '') {
    throw new RequiredFieldError('Title')
  }
}
