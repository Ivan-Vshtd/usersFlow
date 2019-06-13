import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public subject: Subject<string> = new Subject<string>();

  constructor() { }
}
