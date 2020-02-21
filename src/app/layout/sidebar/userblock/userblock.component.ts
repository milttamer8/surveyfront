import { Component, OnInit } from '@angular/core';

import { UserblockService } from './userblock.service';
import { ApiService } from 'src/app/api.service';

@Component({
    selector: 'app-userblock',
    templateUrl: './userblock.component.html',
    styleUrls: ['./userblock.component.scss']
})
export class UserblockComponent implements OnInit {
    user: any;
    user_data: any = {};
    constructor(public userblockService: UserblockService, private api: ApiService) {

        this.user = {
            picture: 'assets/img/user/01.jpg'
        };
        this.user_data.email = localStorage.getItem("email");
        this.user_data.years = localStorage.getItem("years");
        this.user_data.exporton = localStorage.getItem("experton");
        this.user_data.joinDate = localStorage.getItem("joinDate");

    }

    ngOnInit() {
    }

    userBlockIsVisible() {
        return this.userblockService.getVisibility();
    }

}
