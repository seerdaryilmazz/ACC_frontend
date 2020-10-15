import {AbstractControl} from '@angular/forms';

export class ComponentEmailValidator {

  public static validate(c:string) {
    let EMAIL_REGEXP = /^$|^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@([a-z0-9]([a-z0-9-]*[a-z0-9]))\.([a-z0-9][a-z0-9]*([a-z0-9]))(\.([a-z0-9][a-z0-9]*([a-z0-9])))*$/i;

    return EMAIL_REGEXP.test(c) ? true : false;
  }
}
