import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Assignment} from '../classes/assignmentClass';
import {MatTooltip} from "@angular/material/tooltip";
import {MatGridList} from "@angular/material/grid-list";

@Component({
    selector: 'app-assignment',
    templateUrl: './assignment.component.html',
    styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements AfterViewInit {
    @Input() assignment: Assignment;
    @Input() editableName: boolean;
    @Output() edited = new EventEmitter<Assignment>();
    @Output() removed = new EventEmitter<Assignment>();

    @ViewChild('asgnmtWrapper') asgnmtWrapperElement: ElementRef;
    @ViewChild('gottenPointsInput') gottenInputElement: ElementRef;
    @ViewChild('possiblePointsInput') possibleInputElement: ElementRef;
    @ViewChild('nameH4') nameH4Element: ElementRef;
    @ViewChild('nameInput') nameInputElement: ElementRef;
    @ViewChild('toolTip') toolTip: MatTooltip;

    public tagIconColor: string = 'black';

    ngAfterViewInit(): void {
        if (this.assignment.score[0] != null) {
            this.gottenInputElement.nativeElement.value = String(this.assignment.score[0]);
        }
        if (this.assignment.score[1] != null) {
            this.possibleInputElement.nativeElement.value = String(this.assignment.score[1]);
        }

        if (this.editableName) {
            this.nameH4Element.nativeElement.style.display = 'none';
            this.nameInputElement.nativeElement.style.display = 'iniital';
        } else {
            this.nameH4Element.nativeElement.style.display = 'initial';
            this.nameInputElement.nativeElement.style.display = 'none';
        }

        if (this.assignment.noGrade) {
            this.asgnmtWrapperElement.nativeElement.className += ' noGrade';
            this.toolTip.disabled = false;
        } else {
            this.asgnmtWrapperElement.nativeElement.classList.remove('noGrade');
            this.toolTip.disabled = true;
        }
    }

    public updateGottenPoints(valStr: string) {
        let valueNum = Number.parseFloat(valStr);
        this.assignment.score[0] = Number.isNaN(valueNum) ? null : valueNum;
        this.edited.emit(this.assignment);
    }

    public updatePossiblePoints(valStr: string) {
        let valueNum = Number.parseFloat(valStr);
        this.assignment.score[1] = Number.isNaN(valueNum) ? null : valueNum;
        this.edited.emit(this.assignment);
    }
}
