import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;
    public loginData: any = {};
    public resData: any = {};
    public emailNotExist_isHidden: Boolean = true;
    public passwordNotMatch_isHidden: Boolean = true;
    public email_before: String;
    public password_before: String;

    @ViewChild('remCheck', { static: true }) remCheck: any;
    @ViewChild('emailInput', { static: true }) emailInput: any;
    @ViewChild('passwordInput', { static: true }) passwordInput: any;

    constructor(public settings: SettingsService, private fb: FormBuilder, private api: ApiService, private router: Router) {

    }

    submitForm($event, value: any) {
        $event.preventDefault();
        console.log($event);
        console.log(value);
        
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }

        if (this.valForm.valid) {
            this.loginData.email = value.email;
            this.loginData.password = value.password;

            if (this.remCheck.nativeElement.checked == true){
                localStorage.setItem("email_before",this.loginData.email);
                localStorage.setItem("password_before",this.loginData.password);
            } else {
                localStorage.setItem("email_before","");
                localStorage.setItem("password_before","");
            }
            
            this.api.sendApiRequest('users/login',this.loginData)
            .subscribe(data => {
                console.log(data);
                this.resData = data; 
                if (data != null){
                    if (this.resData.result_code == "157"){
                        this.emailNotExist_isHidden = false;
                        this.passwordNotMatch_isHidden = true;
                    } else if (this.resData.result_code == "158"){
                        this.emailNotExist_isHidden = true;
                        this.passwordNotMatch_isHidden = false;
                    } else if (this.resData.result_code == "160"){
    
                        localStorage.setItem("token",this.resData.data.token);
                        localStorage.setItem("user_id",this.resData.data.id);
                        localStorage.setItem("experton",this.resData.data.experton);
                        localStorage.setItem("years",this.resData.data.years);
                        localStorage.setItem("email",this.resData.data.email);
                        localStorage.setItem("joinDate",this.resData.data.joinDate);
                        window.location.href = "http://localhost:4200/home/" + `${localStorage.getItem("token")}`;
                        
                        // this.router.navigate(['/home/',`${localStorage.getItem("token")}`]);
                    }
                }                   
            });
        }
    }

    ngOnInit() {
        // localStorage.setItem("token", null);
        // localStorage.setItem("user_id", null);
        // localStorage.setItem("experton", null); 
        // localStorage.setItem("years", null);
        // localStorage.setItem("email", null);
        // localStorage.setItem("joinDate", null);

        localStorage.setItem("token", '');
        localStorage.setItem("user_id", '');
        localStorage.setItem("experton", ''); 
        localStorage.setItem("years", '');
        localStorage.setItem("email", '');
        localStorage.setItem("joinDate", '');
        
        this.email_before = localStorage.getItem("email_before");
        this.password_before = localStorage.getItem("password_before");
        
        this.valForm = this.fb.group({
            'email': [localStorage.getItem("email_before") || '', Validators.compose([Validators.required, CustomValidators.email])],
            'password': [localStorage.getItem("password_before") || '', Validators.required]
        });
    }

    public emailClick(){
        this.passwordNotMatch_isHidden = true;
        this.emailNotExist_isHidden = true;    
    }

    public passwordClick(){
        this.passwordNotMatch_isHidden = true;
        this.emailNotExist_isHidden = true;
    }

}
