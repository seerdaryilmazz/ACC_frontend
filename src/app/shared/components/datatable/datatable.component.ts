import { Component, OnInit, QueryList, Input, AfterContentInit, ContentChildren,
  Output, EventEmitter, IterableDiffer, DoCheck, IterableChanges, IterableDiffers, OnChanges } from '@angular/core';
import { ColumnComponent } from './column/column.component';
import { TranslateService } from '../../translate/translate.service';
import { LocalDataSource } from 'ng2-smart-table';
import { UtilsService } from '../../../services/utils.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements AfterContentInit, OnInit, DoCheck, OnChanges {

  @ContentChildren('columns') columns: QueryList<ColumnComponent>;
  @Input() data;
  @Input() style;
  @Input() searchQuery;
  @Output() userRowSelect: EventEmitter<any> = new EventEmitter();

  private difference: IterableDiffer<any>;

  localDataSource = new LocalDataSource();
  filteredData = [];
  datatableSettings;

  constructor(
    private translateService: TranslateService,
    private iterableDiffers: IterableDiffers,
    private datePipe: DatePipe,
    private utilsService: UtilsService) {
      this.difference = this.iterableDiffers.find(this.data || []).create();
    }

  ngOnInit() {
  }

  // Obje referansı değişikliğini kontrol eder.
  ngOnChanges(ngOnChanges) {
    if (ngOnChanges.data && ngOnChanges.data.currentValue) {
      this.setData(ngOnChanges.data.currentValue);
    }
    if (ngOnChanges.searchQuery && ngOnChanges.searchQuery.currentValue !== ngOnChanges.searchQuery.previousValue) {
      this.onSearch(ngOnChanges.searchQuery.currentValue);
    }
  }

  // Obje içeriği değişikliğini kontrol eder.
  // Ex. Mutable array operasyonlarından sonraki değişiklikleri yakalar (push, shift, pop, unshift...)
  ngDoCheck() {
    if (this.difference) {
      const changes: IterableChanges<any> = this.difference.diff(this.data);
      if (changes) {
        this.setData(changes['collection']);
      }
    }
  }

  onRowSelect(event) {
    if (event.data) {
      event.data = event.data.initialData;
    }
    this.userRowSelect.emit(event);
  }

  ngAfterContentInit() {
    this.translateService.languageObservable.subscribe(r => {
      this.initializeDatatable();
    });
    this.initializeDatatable();
  }

  initializeDatatable() {
    this.datatableSettings = {
      noDataMessage: this.translateService.instant('NO_DATA_FOUND'),
      actions: false,
      mode: 'external',
      columns: {},
    };
    // Column settings
    // For additional settings : https://akveo.github.io/ng2-smart-table/#/documentation
    this.columns['_results'].forEach(column => {
      const columnIdentifier = column.value.split('.').join('');
      this.datatableSettings.columns[columnIdentifier] = {
        title: this.translateService.instant(column.title),
        width: column.width,
        type: column.type ? column.type : (column.rendererComponent ? 'custom' : 'text'),
        renderComponent: column.rendererComponent ? column.rendererComponent : null,
      };
      if (column.sortFunction) {
        this.datatableSettings.columns[columnIdentifier]['compareFunction'] = column.sortFunction;
      }
    });
    if (this.data) {
      this.setData();
    }
  }

  // Flattens the nested values to use on searching
  setData(data = this.data) {
    if (this.datatableSettings && this.datatableSettings.columns) {
      this.filteredData = [];
      data.forEach(item => {
        const simplifiedItem = { 'initialData': item };
        this.columns['_results'].forEach(column => {
          const columnIdentifier = column.value.split('.').join('');
          if (column.customValueFunction && !column.rendererComponent) {
            simplifiedItem[columnIdentifier] = column.customValueFunction(this.utilsService.getNestedData(item, column.value), item, column);
          } else {
            const val = this.utilsService.getNestedData(item, column.value);
            simplifiedItem[columnIdentifier] = val;
            if (column.translate) {
              simplifiedItem[columnIdentifier] = this.translateService.instant(val);
            } else if (column.dateFormat) {
              simplifiedItem[columnIdentifier] = this.datePipe.transform(val, column.dateFormat);
            }
          }
        });
        this.filteredData.push(simplifiedItem);
      });
      this.localDataSource.load(this.filteredData);
    }
  }

  onSearch(query: string = '') {
    if (query !== '') {
      const filterArray = [];
      this.columns['_results'].forEach(column => {
        if (column.search) {
          let filterField = {};
          const columnIdentifier = column.value.split('.').join('');
          filterField = {
            field: columnIdentifier,
            search: query,
          };
          filterArray.push(filterField);
        }
      });
      this.localDataSource.setFilter(filterArray, false);
    } else {
      this.localDataSource.reset();
      this.localDataSource.refresh();
      this.localDataSource.load(this.filteredData);
    }
  }
}
