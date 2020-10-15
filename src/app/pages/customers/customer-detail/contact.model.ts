export class Contact {
    id:any;
    active:boolean = true;
    default:boolean
    companyLocation:any;
    companyServiceTypes = [];
    gender:any = new Object();
    firstName:string;
    lastName:string;
    department:any = new Object();
    title:any = new Object();
    phoneNumbers=[];
    emails=[];
    company:any;
    _key:any;
    fullname:any;
}

export class PhoneNumber {
    phoneNumber:any= new Object();
    numberType:any;
    usageType:any;
    default:boolean;
}

export class Email {
   email:any= new Object();
    usageType:any;
    default:boolean;
}