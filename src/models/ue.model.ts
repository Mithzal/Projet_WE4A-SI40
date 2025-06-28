export interface UeReturn {
  userId: string;
  fileId: string;
  fileName: string;
  submissionDate: Date;
  _id?: string;
}

export interface UeContent {
  type: string;
  title: string;
  text: string;
  fileId?: string;
  _id?: string;
  returnDate?: Date;
  returns?: UeReturn[];
}

export class Ue {
  constructor(
    public code: string,
    public name: string,
    public description: string,
    public credits: number,
    public instructorId: string,
    public imageFileId?: string, // Nouvel attribut pour stocker l'ID de l'image de la carte de cours
    public _id ?: string,
    public content ?: UeContent[]
  ) {
    this._id = _id
    this.code = code
    this.name = name
    this.description = description
    this.credits = credits
    this.instructorId = instructorId
    this.imageFileId = imageFileId
    this.content = content;

  }
}
