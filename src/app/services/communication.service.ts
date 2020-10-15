import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class CommunicationService {
    public isOpen : boolean = false;
    constructor(){}
    
    @Output() change: EventEmitter<boolean> = new EventEmitter();
    @Output() changeForHeader: EventEmitter<boolean> = new EventEmitter();

  
    toggle(showLoading){
        this.isOpen = showLoading;
        this.change.emit(showLoading);
    }

    changeHeaderUsernameAndImage(userNameObject){
        setTimeout(() => {
                    this.changeForHeader.emit(userNameObject);
        }, 1000);
    }
}