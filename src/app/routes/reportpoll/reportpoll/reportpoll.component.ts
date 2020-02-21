import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/api.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-reportpoll',
  templateUrl: './reportpoll.component.html',
  styleUrls: ['./reportpoll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReportpollComponent implements OnInit {

    rowsFilter = [];
    temp = [];
    columns = [
        { prop: 'name' },
        { name: 'Company' },
        { name: 'Gender' }
    ];

    @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
    @ViewChild('myTable', { static: true }) tableExp: any;

    // PIE
    // -----------------------------------
    pieData = [{
        'label': 'Option1',
        'color': '#4acab4',
        'data': 80
        }, {
            'label': 'Option2',
            'color': '#ff8153',
            'data': 40
        }, {
            'label': 'I do not understand',
            'color': '#ffea88',
            'data': 90
        }];
    pieOptions = {
        series: {
            pie: {
                show: true,
                innerRadius: 0,
                label: {
                    show: true,
                    radius: 0.8,
                    formatter: function(label, series) {
                        return '<div class="flot-pie-label">' +
                            // label + ' : ' +
                            Math.round(series.percent) +
                            '%</div>';
                    },
                    background: {
                        opacity: 0.8,
                        color: '#222'
                    }
                }
            }
        }
    };

    // LINE
    // -----------------------------------
    lineData: any;
    lineOptions = {
        series: {
            lines: {
                show: true,
                fill: 0.01
            },
            points: {
                show: true,
                radius: 4
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
            content: function(label, x, y) { return x + ' : ' + y; }
        },
        xaxis: {
            tickColor: '#eee',
            mode: 'categories'
        },
        yaxis: {
            // position: ($scope.app.layout.isRTL ? 'right' : 'left'),
            tickColor: '#eee'
        },
        shadowSize: 0
    };

    //customize values

    public id: string;

    //poll get from database
    public sendData: any = {};
    public resData: any = {};
    public userPollData: Array<any> = [];
    public userPollSelected: any = {};
    public responseSelected: any = {};
    public pollAnswers: any = {};
    public selectedGraph_isHidden: Boolean = true;
    public selectedDetails_isHidden: Boolean = true;
    public resNumber1: number = 0;
    public resNumber2: number = 0;
    public resNumber3: number = 0;


    //poll graph

    constructor(private api: ApiService,public http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute) { 
        this.http.get('assets/server/chart/line.json').subscribe(data => this.lineData = data);
        this.sendData.user_id = localStorage.getItem("user_id");

        this.api.sendApiRequest('polls/userpolldata',this.sendData)
            .subscribe(data => {
                // console.log(data);
                this.resData = data;
                if (data != null){                  
                    this.resData = this.resData.data.data;
                    console.log(this.resData);
                    var i = 0;
                    for (i=0; i<this.resData.length; i++){
                        this.userPollData.push({
                            poll_id:this.resData[i].poll_id,
                            title:this.resData[i].poll_title,
                            description:this.resData[i].poll_description,
                            poll_answers:this.resData[i].poll_answers,
                            date:this.resData[i].poll_date_created,
                            poll_status:this.resData[i].poll_status,
                            poll_response:this.resData[i].user_response,
                            poll_answerType:this.resData[i].poll_answertype
                        });
                    }
                    this.temp = this.userPollData;
                    this.rowsFilter = this.userPollData;   
                }                
            });
    }

    ngOnInit() {
        this.pollAnswers.option1 = "Yes";
        this.pollAnswers.option2 = "No";

        this.activatedRoute.params
        .subscribe(
            (params: Params) => {
            this.id = params['id'];
            console.log("params",this.id);
            });
        if (this.id != localStorage.getItem("token")){
            this.router.navigateByUrl('/404');
        }
    }

    public updateFilter(event) {
        const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function(d) {
            return d.title.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rowsFilter = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    onActivate(event) {
        if (event.type == "click"){
            this.userPollSelected = event.row;
            this.pollAnswers = this.userPollSelected.poll_answers;
            console.log('Activate Event', this.userPollSelected);
            var i = 0;
            this.selectedDetails_isHidden = false;
            this.selectedGraph_isHidden = true;
            this.resNumber1 = 0;
            this.resNumber2 = 0;
            this.resNumber3 = 0;
            if (this.userPollSelected.poll_response != null){
                this.selectedGraph_isHidden = false;
                
                for (i=0;i<this.userPollSelected.poll_response.length;i++){                    
                    if (this.userPollSelected.poll_response[i].answer == "option1"){
                        this.resNumber1 = this.resNumber1 + 1;
                    } else if (this.userPollSelected.poll_response[i].answer == "option2"){
                        this.resNumber2 = this.resNumber2 + 1;
                    } else{
                        this.resNumber3 = this.resNumber2 + 1;
                    }
                }
                this.pieData = [{
                    'label': 'Option1',
                    'color': '#4acab4',
                    'data': this.resNumber1
                    }, {
                        'label': 'Option2',
                        'color': '#ffea88',
                        'data': this.resNumber2
                    }, {
                        'label': 'I do not understand',
                        'color': '#ff8153',
                        'data': this.resNumber3
                    }];
            }
            
        }
    }
}