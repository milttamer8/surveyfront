import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/api.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

import { ColorsService } from '../../../shared/colors/colors.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    // TOASTER
    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

    splineHeight = 280;
    splineData: any;
    splineOptions = {
        series: {
            lines: {
                show: false
            },
            points: {
                show: true,
                radius: 4
            },
            splines: {
                show: true,
                tension: 0.4,
                lineWidth: 1,
                fill: 0.5
            }
        },
        grid: {
            borderColor: '#eee',
            borderWidth: 1,
            hoverable: true,
            backgroundColor: '#fcfcfc'
        },
        tooltip: true,
        tooltipOpts: {
            content: (label, x, y) => { return x + ' : ' + y; }
        },
        xaxis: {
            tickColor: '#fcfcfc',
            mode: 'categories'
        },
        yaxis: {
            min: 0,
            max: 150, // optional: use it for a clear represetation
            tickColor: '#eee',
            // position: ($scope.app.layout.isRTL ? 'right' : 'left'),
            tickFormatter: (v) => {
                return v/* + ' visitors'*/;
            }
        },
        shadowSize: 0
    };

    //customize value
    public sendData: any = {};
    public userpoll_resData: any = {};
    public userPollData: Array<any> = [];
    public userPollCount: number = 0;
    public userPollActive: number = 0;
    public userPollviewNum: number = 0;
    public userpoll_resStatus: any = {};

    public id: string;

    constructor(public colors: ColorsService, public http: HttpClient,  private api: ApiService, public toasterService: ToasterService, private router: Router, private activatedRoute: ActivatedRoute) {
        http.get('assets/server/chart/spline.json').subscribe(data => this.splineData = data);

        this.toaster = {
            type: 'success',
            title: 'Title',
            text: 'Message'
          };
        this.sendData.user_id = localStorage.getItem("user_id");

        this.api.sendApiRequest('polls/userpolldata',this.sendData)
            .subscribe(data => {
                console.log(data);
                this.userpoll_resData = data;
                if (data != null){
                    if (this.userpoll_resData.result_code == "414"){
                        this.userPollData = this.userpoll_resData.data.data;
                        // console.log(this.userPollData);
                        this.userPollCount = this.userPollData.length;
                        var i = 0;
                        for (i = 0; i < this.userPollCount; i++){
                            if (this.userPollData[i].poll_status == "true"){
                                this.userPollActive = this.userPollActive + 1;
                            }
                            this.userPollData[i].poll_resNum = 0;
                            if (this.userPollData[i].user_response != null){
                                this.userPollviewNum = this.userPollviewNum + 1;
                                this.userPollData[i].poll_resNum = this.userPollData[i].user_response.length;
                            }
                        }                        
                    }
                }
            });
    }

    ngOnInit() {

        this.activatedRoute.params
            .subscribe(
                (params: Params) => {
                this.id = params['id'];
                console.log("params",this.id);
                });
        if (this.id != localStorage.getItem('token')){
            this.router.navigateByUrl('/404');
        }
    }

    colorByName(name) {
      return this.colors.byName(name);
    }

    public getActiveStatus(event, item){
        // console.log(item);
        
        this.sendData.poll_id = item.poll_id;
        this.sendData.poll_status = String(event.target.checked);
        
        this.api.sendApiRequest('polls/changestatus',this.sendData)
            .subscribe(data => {
                // console.log(data);
                this.userpoll_resStatus = data;
                if (data != null){
                    if (this.userpoll_resStatus.result_code == "415"){  

                        if (this.sendData.poll_status == "true"){
                            this.userPollActive = this.userPollActive + 1;
                        } 
                        if (this.sendData.poll_status == "false"){
                            this.userPollActive = this.userPollActive - 1;
                        }                        
                    } else if (this.userpoll_resData.result_code == "999"){
                        this.toasterService.pop("warning", "Warning", "Status Does not Changed!");                        
                    }
                }
            });
    }
}
