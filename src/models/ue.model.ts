export class Ue {
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public credits: number,
    public instructorId: string,
    public _id ?: number
  ) {
    this._id = _id
    this.code = code
    this.name = name
    this.description = description
    this.credits = credits
    this.instructorId = instructorId

  }
}
