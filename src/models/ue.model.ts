export class Ue {
  constructor(
    public id : number,
    public code : string,
    public name : string,
    public description : string,
    public credits : number,
    public instructorId : string
  ) {
    this.id = id
    this.code = code
    this.name = name
    this.description = description
    this.credits = credits
    this.instructorId = instructorId

  }
}
