import { UniqueEntityID } from './value-objects/UniqueEntityID.ts'

export abstract class Entity<Props> {
  protected props: Props
  private _id: UniqueEntityID

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  public equals(entity: Entity<Props>) {
    if (entity === this || this._id.equals(entity.id)) {
      return true
    }

    return false
  }
}
