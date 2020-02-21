import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import * as _ from 'lodash';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // TOASTER
    toaster: any;
    toasterConfig: any;
    toasterconfig: ToasterConfig = new ToasterConfig({
        positionClass: 'toast-bottom-right',
        showCloseButton: true
    });

    public singleData;
    // public ng2TableData: Array<any> = [{title:"", description:"",createdDate:"", resNumber:""}];
    public ng2TableData: Array<any> = [];

    // ng2Table
    public rows: Array<any> = [];
    public columns: Array<any> = [
        { title: 'Title', name: 'title',className: 'office-header', filtering: { filterString: '', placeholder: 'Filter by title' } },
        { title: 'Description', name: 'description', sort: true, filtering: { filterString: '', placeholder: 'Filter by description' } },
        { title: 'Create date', className: 'text-success', name: 'createdDate',filtering: { filterString: '', placeholder: 'Filter by date' } },
        { title: 'Number of Response', name: 'resNumber', sort: true},
    ];
    public page: number = 1;
    public itemsPerPage: number = 8;
    public maxSize: number = 5;
    public numPages: number = 1;
    public length: number = 0;

    public config: any = {
        paging: true,
        sorting: { columns: this.columns },
        filtering: { filterString: '' },
        className: ['table-striped', 'table-bordered', 'mb-0', 'd-table-fixed']
    };

    //custom
    @ViewChild('opt1', { static: true }) Opt1: any;


    public sendData: any = {};
    public resData: any = {};
    public polltotData: Array<any> = [];
    public cellData: any = {};
    public answerData: any = {};

    @ViewChild('smModal', { static: true }) smModal:any;
    public id: string;

    constructor( public toasterService: ToasterService,private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute) {

        this.toaster = {
            type: 'success',
            title: 'Title',
            text: 'Message'
          };     
            
        this.sendData.user_id = localStorage.getItem("user_id");
        this.answerData.user_id = localStorage.getItem("user_id");

        // ng2Table
        this.api.sendApiRequest('polls/getpoll',this.sendData)
            .subscribe(data => {
                console.log(data); 
                this.resData = data;

                if (data != null)  {
                    this.polltotData = this.resData.data;
                    console.log(this.polltotData);
                    this.length = this.polltotData.length;
                    var i;
                    for (i=0;i<this.length;i++){
                        if (this.polltotData[i].poll_status == "true"){
                            if (this.polltotData[i].user_response != null){
                                this.ng2TableData.push({
                                    title:this.polltotData[i].poll_title,
                                    description:this.polltotData[i].poll_description,
                                    createdDate:this.polltotData[i].poll_date_created, 
                                    resNumber:this.polltotData[i].user_response.length,
                                    poll_id:this.polltotData[i].poll_id,
                                    option1:this.polltotData[i].poll_answers.option1,
                                    option2:this.polltotData[i].poll_answers.option2,
                                    poll_user_id:this.polltotData[i].poll_user_id
                                    });
                            } else {
                                this.ng2TableData.push({
                                    title:this.polltotData[i].poll_title,
                                    description:this.polltotData[i].poll_description,
                                    createdDate:this.polltotData[i].poll_date_created,
                                    resNumber:0,
                                    poll_id:this.polltotData[i].poll_id,
                                    option1:this.polltotData[i].poll_answers.option1,
                                    option2:this.polltotData[i].poll_answers.option2,
                                    poll_user_id:this.polltotData[i].poll_user_id
                                    });
                            }                            
                        }                        
                    }
                    console.log(this.ng2TableData);
                    this.length = this.ng2TableData.length;
                    this.onChangeTable(this.config);
                }                          
            });
    }

    public ngOnInit(): void {

        this.activatedRoute.params
            .subscribe(
                (params: Params) => {
                this.id = params['id'];
                console.log("params",this.id);
                });

        // if (this.id != localStorage.getItem('token')){
        //     this.router.navigateByUrl('/404');
        // }
    }

    public changePage(page: any, data: Array<any> = this.ng2TableData): Array<any> {
        let start = (page.page - 1) * page.itemsPerPage;
        let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
        return data.slice(start, end);
    }

    public changeSort(data: any, config: any): any {
        if (!config.sorting) {
            return data;
        }

        let columns = this.config.sorting.columns || [];
        let columnName: string = void 0;
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {
            if (columns[i].sort !== '' && columns[i].sort !== false) {
                columnName = columns[i].name;
                sort = columns[i].sort;
            }
        }

        if (!columnName) {
            return data;
        }

        // simple sorting
        return data.sort((previous: any, current: any) => {
            if (previous[columnName] > current[columnName]) {
                return sort === 'desc' ? -1 : 1;
            } else if (previous[columnName] < current[columnName]) {
                return sort === 'asc' ? -1 : 1;
            }
            return 0;
        });
    }

    public changeFilter(data: any, config: any): any {

        let filteredData: Array<any> = data;
        this.columns.forEach((column: any) => {
            if (column.filtering) {
                filteredData = filteredData.filter((item: any) => {
                    return item[column.name].match(column.filtering.filterString);
                });
            }
        });

        if (!config.filtering) {
            return filteredData;
        }

        if (config.filtering.columnName) {
            return filteredData.filter((item: any) =>
                item[config.filtering.columnName].match(this.config.filtering.filterString));
        }

        let tempArray: Array<any> = [];
        filteredData.forEach((item: any) => {
            let flag = false;
            this.columns.forEach((column: any) => {
                if (item[column.name].toString().match(this.config.filtering.filterString)) {
                    flag = true;
                }
            });
            if (flag) {
                tempArray.push(item);
            }
        });
        filteredData = tempArray;

        return filteredData;
    }

    public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
        if (config.filtering) {
            (<any>Object).assign(this.config.filtering, config.filtering);
        }

        if (config.sorting) {
            (<any>Object).assign(this.config.sorting, config.sorting);
        }

        let filteredData = this.changeFilter(this.ng2TableData, this.config);
        let sortedData = this.changeSort(filteredData, this.config);
        this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
        this.length = sortedData.length;
    }

    public onCellClick(data: any): any {
        
        console.log(data.row);
        this.cellData = data.row;
        if (this.cellData.poll_user_id != localStorage.getItem("user_id")){
            this.answerData.answer = "option1";
            this.Opt1.nativeElement.checked = true;        
            this.answerData.poll_id = this.cellData.poll_id;
            this.answerData.title = this.cellData.title;
            this.answerData.description = this.cellData.description;
            this.answerData.poll_user_id = this.cellData.poll_user_id;
            this.answerData.email = localStorage.getItem("email");
            this.answerData.experton = localStorage.getItem("experton");
            this.answerData.years = localStorage.getItem("years");
            this.smModal.show();
        } else {
            this.toasterService.pop("error", "Error", "This is your Poll!");
        }    
    }

    public getAnswer(event){
        this.answerData.answer = event.target.value;
    }

    public submitAnswer(){
        this.answerData.date = new Date().toUTCString();
        console.log(this.answerData);

        this.api.sendApiRequest('polls/response',this.answerData)
        .subscribe(data => {
            console.log(data);
            this.resData = data;
            if (data != null){
                if (this.resData.result_code == "417"){
                    this.toasterService.pop("success", `${this.answerData.poll_title}`, "Poll Answer Successfully!");
                } else if (this.resData.result_code == "418"){
                    this.toasterService.pop("success", `${this.answerData.poll_title}`, "Update Answer Successfully!");
                } else {
                    this.toasterService.pop("error", "Error", "Check Connection and Relogin!");
                }
            }            
        });
        this.smModal.hide();
    }
}
