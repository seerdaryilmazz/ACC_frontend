import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class ParameterService {
    constructor(){}
    

    getParameter(parameterType){
       var parameters = JSON.parse(localStorage.getItem("Parameters"))
       var parameter = parameters[parameterType]
       return parameter ? parameter: [];
    }
}