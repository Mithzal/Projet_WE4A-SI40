export class Files {
  constructor(
    public nom: string,
    public chemin: string,
    public type: string,
    public taille: number,
    public coursId: string,
    public uploadedBy: any,
    public dateUpload: Date,
    public description: string,
    public _id?: string,) {

    this._id = _id;
    this.nom = nom;
    this.chemin = chemin;
    this.type = type;
    this.taille = taille;
    this.coursId = coursId;
    this.uploadedBy = uploadedBy;
    this.dateUpload = dateUpload;
    this.description = description;
  }
}


