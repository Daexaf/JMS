import { Component, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
// import { HttpProviderService } from '../Service/http-provider.service';
import { LocalServiceService } from '../Service/local-service.service';

@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header">
      <h5 class="modal-title" id="modal-title">Delete Confirmation</h5>
      <button type="button" class="btn close" aria-label="Close button" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to delete?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">CANCEL</button>
      <button type="button" ngbAutofocus class="btn btn-success" (click)="modal.close('Ok click')">OK</button>
    </div>
  `,
})
export class NgModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="container-xl">
      <div class="table-responsive">
        <div class="table-wrapper">
          <div class="table-title">
            <div class="row">
              <div class="col-sm-6">
                <h4><b>Manage Employees</b></h4>
              </div>
              <div class="col-sm-6">
                <button class="btn btn-success" (click)="AddEmployee()">
                  <i class="fas fa-plus-circle"></i><span> ADD</span>
                </button>
              </div>
            </div>
          </div>
          <table class="table table-striped table-hover table-bordered table-content">
            <thead>
              <tr class="center-align">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let employee of employeeList" class="center-align">
                <td>{{ employee.firstName }}</td>
                <td>{{ employee.lastName }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ employee.address }}</td>
                <td>{{ employee.phone }}</td>
                <td>
                  <a href="#" [routerLink]="['/ViewEmployee/', employee.id]" class="btn">
                    <i class="fas fa-eye view"></i>
                  </a>
                  <a href="#" [routerLink]="['/EditEmployee/', employee.id]" class="btn">
                    <i class="fa fa-edit edit"></i>
                  </a>
                  <button type="button" (click)="deleteEmployeeConfirmation(employee)" class="btn">
                    <i class="fas fa-trash-alt delete"></i>
                  </button>
                </td>
              </tr>
              <tr>
                <td *ngIf="employeeList.length == 0" colspan="6">No Employee Found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  closeResult = '';
  employeeList: any = [];
  
  constructor(private router: Router, private modalService: NgbModal, private toastr: ToastrService, private local: LocalServiceService) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  async getAllEmployee() {
    this.local.getEmployees.bind(
      (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData) {
            this.employeeList = resultData;
          }
        }
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.employeeList = [];
            }
          }
        }
      }
    );
  }

  AddEmployee() {
    this.router.navigate(['AddEmployee']);
  }

  deleteEmployeeConfirmation(employee: any) {
    this.modalService.open(MODALS['deleteModal'], {
      ariaLabelledBy: 'modal-basic-title',
    }).result.then(
      (result) => {
        this.deleteEmployee(employee);
      },
      (reason) => {}
    );
  }

  deleteEmployee(employee: any) {
    this.local.deleteEmployee(employee.id).subscribe(
      (data: any) => {
        if (data != null && data.body != null) {
          var resultData = data.body;
          if (resultData != null && resultData.isSuccess) {
            this.toastr.success(resultData.message);
            this.getAllEmployee();
          }
        }
      },
      (error: any) => {}
    );
  }
}
