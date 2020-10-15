import { Injectable, Inject } from '@angular/core';
import { TRANSLATIONS } from './translation';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { isString } from 'util';


@Injectable()
export class TranslateService {
    _currentLang: string;
    private language = new Subject<string>();
    languageObservable = this.language.asObservable();
    currentLanguage = 'TR';

    public get currentLang() {
        return this._currentLang;
    }

    // inject our translations
    constructor( @Inject(TRANSLATIONS) private _translations: any) {
    }

    public use(lang: string): void {
        this._currentLang = lang;
        this.language.next(lang);
    }

    public translate(key: string, constants?: string[]): string {
        const translation = key;
        this._currentLang = localStorage.getItem('lang');

        if(this._translations[this.currentLang]&&this._translations[this.currentLang][key]){
            let literalTranslation = this._translations[this.currentLang][key];
            if(constants){
                constants.forEach((constant, index)=>{
                    if(isString(constant)){
                        literalTranslation = literalTranslation.replace(`{${index}}`, constant)
                    }
                })
            }
            return literalTranslation;
        }
        if (key != undefined && key != null) {
            const partialTranslation = key.toString().split('-');
            if (partialTranslation != undefined) {
                if (this._translations[this.currentLang] && partialTranslation.length > 1) {
                    let translated;

                    let i = 0;
                    partialTranslation.forEach(tr => {
                        if (i != 0) {
                            if (this._translations[this.currentLang][tr.trim()] != undefined) {
                                translated = translated + '-' + this._translations[this.currentLang][tr.trim()];
                            } else {
                                translated = translated + '-' + tr;
                            }
                        } else {
                            if (this._translations[this.currentLang][partialTranslation[0].trim()] != undefined) {
                                translated = this._translations[this.currentLang][partialTranslation[0].trim()];
                            } else {
                                translated = partialTranslation[0];
                            }
                        }
                        i = i + 1;
                    });
                    return translated;
                }
            }
        }
        return translation;
    }

    public instant(key: string, constants?: string[]) {
        return this.translate(key, constants);
    }

}
