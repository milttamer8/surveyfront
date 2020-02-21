import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ApiService } from 'src/app/api.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

    valForm: FormGroup;
    passwordForm: FormGroup;

    //customize value
    public registerData: any = {};
    public resData: any = {};
    public emailExist_isHidden: Boolean = true;

    constructor(public settings: SettingsService, fb: FormBuilder, private api: ApiService, private router: Router) {

        let password = new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9]{6,10}$')]));
        let certainPassword = new FormControl('', [Validators.required, CustomValidators.equalTo(password)]);

        this.passwordForm = fb.group({
            'password': password,
            'confirmPassword': certainPassword
        });

        this.valForm = fb.group({
            'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
            'passwordGroup': this.passwordForm
        });
    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        for (let c in this.passwordForm.controls) {
            this.passwordForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            this.registerData.email = value.email;
            this.registerData.password = value.passwordGroup.password;
            this.registerData.joinDate = new Date().toUTCString();
            console.log('Valid!');
            console.log(value);
            console.log(this.registerData);

            this.api.sendApiRequest('users/signup',this.registerData)
            .subscribe(data => {
                console.log(data);
                this.resData = data;
                if (data != null){
                    if (this.resData.result_code == "105"){
                        this.emailExist_isHidden = false;
                    } else if (this.resData.result_code == "106"){
                        this.router.navigate(['/', 'login']);
                    }
                }                
            });

        }
    }

    ngOnInit() {
        this.registerData.years = "0";
        this.registerData.experton = "Banking Sector";
    }

    //customize function
    public getManagement(event){
        this.registerData.experton = event.target.value;
        console.log(event.target.value);
    }

    public getBanking(event){
        this.registerData.experton = event.target.value;
        console.log(event.target.value);
    }

    public getExperiences(event){
        this.registerData.years = event.target.value;
        console.log(event.target.value);
    }

    public emailChange(event){
        this.emailExist_isHidden = true;
    }

}
