import { Component, OnInit, Input } from '@angular/core';
import { SelectedOrdersService } from '../../../../shared/components/selected-orders/selected-orders.service';
import { UtilsService } from '../../../../services/utils.service';
import { DatePipe } from '@angular/common';
import { ParameterService } from '../../../../services/parameter.service';
import { TranslateService } from '../../../../shared/translate/translate.service';

const ORDER_TYPES = [{name: 'SPOT_QUOTE', code: ['01']}, {name: 'GENERAL_QUOTE', code: ['02', '03', '04']}];
const SERVICE_GROUPS = ['IMP', 'EXP'];

@Component({
  selector: 'pw-graph',
  templateUrl: './pw-graph.component.html',
  styleUrls: ['./pw-graph.component.scss'],
})
export class PwGraphComponent implements OnInit {
  @Input() companyInfo;
  @Input() companyLocationInfo;
  countryOptions;
  countryFilter;
  locationOptions = [];
  locationFilter;
  periodOptions = ['MONTHLY', 'WEEKLY'];
  periodFilter;
  startDateFilter: Date;
  endDateFilter: Date;
  fullTruckOptions = ['Komple', 'Parsiyel'];
  fullTruckFilter;
  serviceGroupOptions = SERVICE_GROUPS;
  serviceGroupFilter;
  orderTypeOptions = ORDER_TYPES;
  orderTypeFilter = ORDER_TYPES;
  orders;
  totalPayweight = 0;
  userEmail;
  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5'],
  };
  graphData;
  constructor(private selectedOrderService: SelectedOrdersService,
    private datePipe: DatePipe,
    private paramService: ParameterService,
    private translateService: TranslateService,
    private utilsService: UtilsService) { }

  ngOnInit() {
    this.userEmail = this.utilsService.getUserInfoFromLocalStorage().UserEmail;
    this.countryOptions = this.paramService.getParameter('Countries');
    this.startDateFilter = new Date(new Date().getFullYear(), 0, 1);
    this.endDateFilter = new Date();
    this.periodFilter = 'MONTHLY';
  }

  getOrders() {
    this.locationOptions = this.companyLocationInfo ? [this.companyInfo.CompanyLocation] : this.companyInfo.CompanyLocations;
    if (this.locationOptions.length === 1) {
      this.locationFilter = this.locationOptions[0];
    }
    const ids = this.locationOptions.map(i => i.mappedIds && i.mappedIds.length > 0 && i.mappedIds[0].applicationLocationId);
    this.selectedOrderService.getAllOrders(this.userEmail).subscribe(result => {
      this.orders = result;
      this.orders = this.orders.filter(o => ids.includes(o.CompanyId));
      this.drawGraph();
    });
  }

  drawGraph() {
    this.totalPayweight = 0;
    const filteredOrders = this.filterOrders(this.orders);
    const graphData = [];
    const data = {
      'name': '',
      'series': [],
    };

    const startDate = new Date(this.startDateFilter);
    if (this.periodFilter === 'MONTHLY') {
      while (startDate.valueOf() < this.endDateFilter.valueOf()) {
        const dateFilteredOrders = this.dateFilterOrders(filteredOrders, startDate, this.periodFilter);
        this.setGraphPoints(dateFilteredOrders, startDate, data);
        startDate.setMonth(startDate.getMonth() + 1);
      }
    } else if (this.periodFilter === 'WEEKLY') {
      while (startDate.valueOf() < this.endDateFilter.valueOf()) {
        const dateFilteredOrders = this.dateFilterOrders(filteredOrders, startDate, this.periodFilter);
        this.setGraphPoints(dateFilteredOrders, startDate, data);
        startDate.setDate(startDate.getDate() + 7);
      }
    }
    graphData.push(data);
    this.graphData = graphData;
  }

  dateFilterOrders(filteredOrders, startDate, period) {
    return filteredOrders.filter(o => {
      let endDate = new Date(startDate);
      if (period === 'WEEKLY') {
        endDate.setDate(endDate.getDate() + 7);
      } else if (period === 'MONTHLY') {
        endDate.setMonth(endDate.getMonth() + 1);
      }
      if (endDate.getTime() > this.endDateFilter.getTime()) {
        endDate = this.endDateFilter;
      }
      const date = new Date(o.ReadyDate);
      return startDate.valueOf() <= date.valueOf() && date.valueOf() < endDate.valueOf();
    });
  }

  setGraphPoints(dateFilteredOrders, startDate, data) {
    const dateLabel = this.datePipe.transform(new Date(startDate), 'dd.MM.yyyy');
    let pw = 0;
    dateFilteredOrders.forEach(i => {
      pw += i.PW;
      this.totalPayweight += i.PW;
    });
    data.series.push({
      'name': dateLabel,
      'value': pw,
    });
  }

  filterOrders(orders) {
    if (this.periodFilter == null ) {
      this.periodFilter = 'MONTHLY';
    }
    if (this.serviceGroupFilter == null) {
      this.serviceGroupFilter = SERVICE_GROUPS;
    }
    if (this.orderTypeFilter == null) {
      this.orderTypeFilter = ORDER_TYPES;
    }
    return orders.filter(order => {
      const country = order.ServiceGroup === 'IMP' ? order.LoadingInformation.split(' -')[0] : order.DeliveryInformation.split(' -')[0];
      const readyDate = new Date(order.ReadyDate);

      return (this.fullTruckFilter ? this.fullTruckFilter.includes(order.FullTruck) : true)
       && (this.serviceGroupFilter ? this.serviceGroupFilter.includes(order.ServiceGroup) : true)
       && (this.orderTypeFilter ? this.flat(this.orderTypeFilter.map(i => i.code)).includes(order.OrderType) : true)
       && (this.countryFilter ? this.countryFilter.includes(country) : true)
       && (this.locationFilter ? this.locationFilter.mappedIds[0].applicationLocationId === order.CompanyId : true)
       && (this.startDateFilter ? this.startDateFilter.valueOf() < readyDate.valueOf() : true)
       && (this.endDateFilter ? this.endDateFilter.valueOf() > readyDate.valueOf() : true);
    }).sort((a, b) => new Date(a.ReadyDate).getTime() - new Date(b.ReadyDate).getTime());
  }

  flat(array) {
    const arr = [];
    array.forEach(internalArray => {
      internalArray.forEach(i => {
        arr.push(i);
      });
    });
    return arr;
  }

  searchFn(field?): (term, item) => {} {
    return (term, item) => {
      return this.translateService.instant(field ? item[field] : item).toLocaleLowerCase().includes(term.toLocaleLowerCase());
    };
  }
}
