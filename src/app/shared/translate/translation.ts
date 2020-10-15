import {LANG_EN_NAME, LANG_EN_TRANS} from './lang-en';
import {LANG_TR_NAME, LANG_TR_TRANS} from './lang-tr';
import {InjectionToken} from '@angular/core';


export const TRANSLATIONS = new InjectionToken('translations');

export const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_TR_NAME]: LANG_TR_TRANS,
};

export const TRANSLATION_PROVIDERS = [
    {provide: TRANSLATIONS, useValue: dictionary},
];
