import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { PriorTasksService } from './prior-tasks.service';
import { NbDialogService } from '@nebular/theme';
import { SpecificOrderComponent } from '../specific-order/specific-order.component';

@Component({
    selector: 'prior-tasks-comp',
    templateUrl: 'prior-tasks.component.html',
    styleUrls: ['prior-tasks.component.scss'],
})

export class PriorTasksComponent implements OnInit {
    @ViewChild('dialog', { static: false }) dialog: TemplateRef<any>;
    @ViewChild('orderDetailModal', { static: false }) orderDetailModal: TemplateRef<any>;
    @ViewChild('specificOrderComponent', { static: false }) specificOrderComponent: SpecificOrderComponent;

    priorTaskList: any = [];
    selectedPriorTask;
    showDetail = false;
    selectedTask;
    constructor(private service: PriorTasksService, private dialogService: NbDialogService) { }

    ngOnInit() {

    }

    getUserPriorTasks(useremail, dateRange) {
        this.service.getPriorTasks(useremail, dateRange).subscribe(result => {
            this.priorTaskList = result;
        });
    }

    showOrderDetailModal() {
        this.dialogService.open(this.orderDetailModal);
    }
}
