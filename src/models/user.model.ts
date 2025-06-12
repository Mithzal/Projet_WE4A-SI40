export class User {
  constructor(
    public name: string,
    public email: string,
    public role: string,
    public courses: [],
    public password: string,
    public _id?: string,
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.courses = courses;
    this.password = password;

  }
}
