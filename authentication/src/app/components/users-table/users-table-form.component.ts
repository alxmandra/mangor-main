import { DataSource } from '@angular/cdk/collections';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  AfterViewInit,
  QueryList,
  ViewChild,
  ContentChild,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from 'src/app/services/userService';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MangorDialogComponent } from '../dialog/dialog.component';
import { PortalModule } from '@angular/cdk/portal';
import { ModalService } from '../dialog/modalService';
import { FormsModule } from '@angular/forms';

export interface PeriodicElement {
  username: string;
  position: number;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  actions: string
}
/**
 * @title Table example that shows how to wrap a table component for definition and behavior reuse.
 */
@Component({
  selector: 'users-table-form',
  styleUrls: ['users-table-form.component.css'],
  templateUrl: 'users-table-form.component.html',
  standalone: true,
  providers: [
    PortalModule,
    MangorDialogComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MangorDialogComponent, PortalModule, HttpClientModule, BrowserAnimationsModule, MatButtonModule, forwardRef(() => WrapperUsersTable), MatSortModule, MatTableModule],
})
export class UsersTableForm implements AfterViewInit {

  modalService: ModalService;
  userService: UserService;
  users: any[] = [];
  showError: boolean = false;

  constructor(private cd: ChangeDetectorRef, viewContainerRef: ViewContainerRef) {
    this.userService = inject(UserService);
    this.modalService = inject(ModalService);
    this.modalService.vcRef = viewContainerRef;
    this.getDataPortion()
  }
  getDataPortion() {
    this.userService.getUsers().subscribe({
      next: data => {
        this.users = Object.values(data).map((user, idx) => ({ ...user, position: idx + 1, actions: { delete: () => { this.deleteUser(user._id) } } }));
        this.addData()
      },
      error: (e) => {
        const modalConfig = { header: "Fetching Users", bodyText: e.error }
        this.modalService.open('modal-1', modalConfig)
        this.cd.detectChanges();
        console.log(e);
      }
    })
  }

  deleteUser(_id: string) {
    this.userService.deleteUser(_id).subscribe(() => this.getDataPortion(), e => {
      const modalConfig = { header: "Delete User", bodyText: e.error.message }
      this.modalService.open('modal-1', modalConfig)
      this.cd.markForCheck()

      this.cd.detectChanges();
      this.showError = true;
      this.cd.detectChanges();
    })
  }

  displayedColumns: string[] = ['position', 'username', 'firstName', 'lastName', 'email', 'token', 'actions'];

  dataSource = new MatTableDataSource<PeriodicElement>(this.users);

  @ViewChild('sort')
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.cd.detectChanges();
  }

  clearTable() {
    this.dataSource.data = [];
    this.cd.detectChanges();
  }

  addData() {
    this.dataSource.data = this.users;
    this.cd.detectChanges();
  }
}

/**
 * Table component that accepts column and row definitions in its content to be registered to the
 * table.
 */
@Component({
  selector: 'wrapper-table',
  templateUrl: 'wrapper-table.html',
  styles: [
    `
    table {
      width: 100%;
    }
  `,
  ],
  standalone: true,
  imports: [MatTableModule, MatSortModule],
})
export class WrapperUsersTable<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef)
  headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef)
  rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef)
  columnDefs!: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow)
  noDataRow!: MatNoDataRow;

  @ViewChild(MatTable, { static: true })
  table!: MatTable<T>;

  @Input()
  columns!: string[];

  @Input()
  dataSource!: DataSource<T>;

  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
    this.table.setNoDataRow(this.noDataRow);
  }
}