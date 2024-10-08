import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/globa-constants';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm:any = FormGroup;
  responseMessage:any;
  


  constructor(private formBulider:FormBuilder, 
    private userService:UserService , 
    private ngxService:NgxUiLoaderService,
    public dialogRef:MatDialogRef<ForgotPasswordComponent> ,
    private snackbarService:SnackbarService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBulider.group({
      email:[null,[Validators.required , Validators.pattern(GlobalConstants.emailRegex)]]
    });
  }

  handleSubmit(){
    this.ngxService.start();
    var formData = this.forgotPasswordForm.value;
    var data = {
      email:formData.email
    }
    
    this.userService.forgotPassword(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,"");
    },(error: { error: { message: any; }; })=>{
      this.ngxService.stop();
      console.log(error)

      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage , "error");
    })
     
  }
}
