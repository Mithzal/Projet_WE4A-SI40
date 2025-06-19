export class Notes {
  constructor(  public studentId: string,
                public ueId : string,
                public value : number,
                public timestamp: Date = new Date(),
                public teacherId : string,
                public comment ?: string,
                public _id ?: string

) {
    this.studentId = studentId;
    this.ueId = ueId;
    this.value = value;
    this.timestamp = timestamp;
    this.teacherId = teacherId;
    this.comment = comment;
    this._id = _id;
  }

}
