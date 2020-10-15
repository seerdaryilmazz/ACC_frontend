import { Component, Input, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { AngularEditorConfig, AngularEditorComponent } from '@kolkov/angular-editor';
import { TranslateService } from '../../translate/translate.service';

@Component({
  template: `
    <div #div [hidden]="true" [innerHtml]="value"></div>
    <!-- <div>{{strippedText}}</div> -->
    <angular-editor #editor class="editor" [config]="descriptionConfig" [(ngModel)]="strippedText"></angular-editor>
  `,
  styles: [
    '.editor ::ng-deep .angular-editor-textarea {border: 0px !important;}',
  ],
})
export class RichTextViewComponent implements ViewCell, AfterViewInit {
  @Input() value: any;
  @Input() rowData: any;
  @ViewChild('editor', {static: false}) editor: AngularEditorComponent;
  @ViewChild('div', {static: false}) div: ElementRef;
  strippedText;

  descriptionConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: false,
    showToolbar: false,
    sanitize: true,
    toolbarPosition: 'top',
  };

  constructor(private cdRef: ChangeDetectorRef, private translateService: TranslateService) {
  }

  ngAfterViewInit() {
    const innerText = this.translateService.instant(this.div.nativeElement.innerText, this.rowData.initialData.TranslateParams);
    this.strippedText = innerText.length > 100 ? innerText.substring(0, 98) + '...' : innerText;
    this.cdRef.detectChanges();
  }
}
