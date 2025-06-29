export interface ForumMessage {
  content: string;
  type : string;
  timestamp: Date;
  author : string;
}
export class Forums {
  constructor(
    public courseId: string,
    public title: string,
    public messages ?: ForumMessage[],
    public _id?: string
  ) {
    this.courseId = courseId;
    this.title = title;
    this.messages = messages;
    this._id = _id;
  }
}
