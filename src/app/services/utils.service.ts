import { Injectable } from '@angular/core';
import { TranslateService } from '../shared/translate/translate.service';

@Injectable()
export class UtilsService {
    constructor(private translateService:TranslateService){}

    getDateRangeList(){
        return [{ "name": "LAST_ONE_MONTH", "value": 30 },
        { "name": "LAST_TWO_MONTHS", "value": 60 },
        { "name": "LAST_THREE_MONTHS", "value": 90 },
        { "name": "LAST_FOUR_MONTHS", "value": 120 },
        { "name": "LAST_FIVE_MONTHS", "value": 150 },
        { "name": "LAST_SIX_MONTHS", "value": 180 },
        { "name": "LAST_YEAR", "value": 360 },
        { "name": "LAST_TWO_YEARS", "value": 720 },
        { "name": "LAST_THREE_YEARS", "value": 1080 },
        { "name": "ALL_TIME", "value": 10800 }];
    }

    calculatePriority(date){
        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
        const currentDate = new Date();
        const secondDate = new Date(date);
        const diffDays = Math.ceil(((secondDate.getTime()-currentDate.getTime()) / oneDay));
        if(diffDays>15){
            return Priority.LOW
        }
        else if (diffDays<15 && diffDays>7){
            return Priority.MEDIUM
        }
        else {
            return Priority.HIGH
        }
    }

    getUserInfoFromLocalStorage(){
        var userName;
        var userEmail;
        var displayName;
        if (localStorage.getItem('selectedUserInfo')) {
            var selectedUserInfo = JSON.parse(localStorage.getItem('selectedUserInfo'))
            userName= selectedUserInfo.username;
            userEmail =selectedUserInfo.email;
            displayName = selectedUserInfo.displayName
          }
          else {
            var selectedUserInfo = JSON.parse(localStorage.getItem('UserInfo'))
            userName= selectedUserInfo.user.username;
            userEmail =selectedUserInfo.user.email;
            displayName = selectedUserInfo.user.displayName
          }
          return {"Username":userName,"UserEmail":userEmail,"DisplayName":displayName}
    }

    getNestedData(object, path){
        path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        path = path.replace(/^\./, '');           // strip a leading dot
        var pathArray = path.split('.');
        let reducer = (acc, item) => acc && acc[item] ? acc[item] : null;
        try {
            return pathArray.reduce(reducer, object)
        } catch {
            return null;
        }
    }

    uniquifyArrayByField(array, path?) {
        let uniqufiedArray = [];
        if (path) {
            const uniqValues = [];
            array.forEach(item => {
                const value = this.getNestedData(item, path);
                if (!uniqValues.includes(value)) {
                    uniqValues.push(value);
                    uniqufiedArray.push(item);
                }
            });
        } else {
            uniqufiedArray = [...new Set(array)];
        }
        return uniqufiedArray;
    }
}

export enum Priority {
    HIGH= "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}