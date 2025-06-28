export class Notes {
  constructor(  public studentId: string,
                public ueId : string,
                public value : number,
                public timestamp: Date = new Date(),
                public teacherId : string,
                public comments ?: string,
                public _id ?: string,
                public assignmentId?: string,  // Refers to UeContent._id
                public submissionId?: string   // Refers to UeReturn._id

) {
    this.studentId = studentId;
    this.ueId = ueId;
    this.value = value;
    this.timestamp = timestamp;
    this.teacherId = teacherId;
    this.comments = comments;
    this._id = _id;
    this.assignmentId = assignmentId;
    this.submissionId = submissionId;
  }

}
