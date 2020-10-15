import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate/translate.pipe';
import { CommonModule } from '@angular/common';
import { TRANSLATION_PROVIDERS } from './translate/translation';
import { EscapeHtmlPipe } from './pipe/keep-html.pipe';
import { FindInArrayOfObjectsPipe } from './pipe/find-in-array-of-objects.pipe';

@NgModule({
    declarations: [TranslatePipe, EscapeHtmlPipe, FindInArrayOfObjectsPipe],
    imports: [CommonModule],
    exports: [TranslatePipe, FindInArrayOfObjectsPipe],
    providers: [TRANSLATION_PROVIDERS, EscapeHtmlPipe],
})

export class MainPipe {}
