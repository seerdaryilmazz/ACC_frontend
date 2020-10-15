export class AuthenticationError { }

export class BusinessError {
    public errorCode: number;
    public errorText?: string;

    constructor(errorCode?: number, errorText?: string) {
        this.errorCode = errorCode;
        this.errorText = errorText;
    }
}