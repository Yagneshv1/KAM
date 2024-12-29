import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ColDef } from "ag-grid-community";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})

export class TableComponent {
    @Input() rowData: any;
    @Input() columnDefs: any;

    @Output() cellClickedEvent = new EventEmitter<any>();

    onCellClicked(event: any) {
        console.log(event)
        this.cellClickedEvent.emit({
            headerName: event.colDef.headerName,
            rowData: event.data
        })
    }
}