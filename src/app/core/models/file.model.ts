import { Observable } from "rxjs";

export class FileModel {
    public name: string ;
    public uploading = false;
    
    public uploadPercent: Observable<number | undefined>;
    public downloadURL: string;

    constructor(public file: File = file) {
        this.name = file.name;
    }
}
