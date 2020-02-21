import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { ApiService } from 'src/app/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-createpoll',
  templateUrl: './createpoll.component.html',
  styleUrls: ['./createpoll.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreatepollComponent implements OnInit {

  //table
  rowsFilter = [];
  temp = [];
  columns = [
      { prop: 'name' },
      { name: 'Company' },
      { name: 'Gender' }
  ];

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @ViewChild('myTable', { static: true }) tableExp: any;

  // TOASTER
  toaster: any;
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
      positionClass: 'toast-bottom-right',
      showCloseButton: true
  });

  //custom

  public id: string;

  public newPollData: any = {};
  public titleEmpty_isHidden: Boolean = true;
  public descriptionEmpty_isHidden: Boolean = true;
  public option1Empty_isHidden: Boolean = true;
  public option2Empty_isHidden: Boolean = true;
  public option_isHidden: Boolean = true;

  public resData: any = {};
  //crud pan
  @ViewChild('titleInput', { static: true }) titleInput: any;
  @ViewChild('descriptionInput', { static: true }) descriptionInput: any;
  @ViewChild('defaultOpt', { static: true }) defaultOpt :any;
  @ViewChild('customOpt', { static: true }) customOpt: any;


  //table
  public sendData: any = {};
  public userPollData: Array<any> = [];
  public userPollSelected: any = {};
  public userDelIndex: number = 0;

  

  constructor(public toasterService: ToasterService, private api: ApiService, private router: Router, private activatedRoute: ActivatedRoute) { 
    this.toaster = {
      type: 'success',
      title: 'Title',
      text: 'Message'
    };

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
    this.configValue();
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

  public configValue(){
    this.newPollData.option1 = "Yes";
    this.newPollData.option2 = "No";
    this.newPollData.user_email = localStorage.getItem("email");
    this.newPollData.user_id = localStorage.getItem("user_id");
    this.newPollData.answerType = "default";
    this.newPollData.poll_id = "";
    this.userPollSelected.poll_answers = {"option1":"", "option2":""};
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

  public createPoll() {
    
    if (this.newPollData.title == "" || this.newPollData.title == undefined){
      this.titleEmpty_isHidden = false;
      this.descriptionEmpty_isHidden = true;
      return;
    }
    this.titleEmpty_isHidden = true;

    if (this.newPollData.description == "" || this.newPollData.description == undefined){
      this.descriptionEmpty_isHidden = false;
      return;
    }
    this.descriptionEmpty_isHidden = true;

    if (this.newPollData.answerType == "custom"){

      if (this.newPollData.option1 == "" || this.newPollData.option1 == undefined){
        this.option1Empty_isHidden = false;
        return;
      }
      this.option1Empty_isHidden = true;

      if (this.newPollData.option2 == "" || this.newPollData.option2 == undefined){
        this.option2Empty_isHidden = false;
        return;
      }
      this.option2Empty_isHidden = true;
    }
    this.newPollData.dateCreated = new Date().toUTCString();
    console.log(this.newPollData);

    this.api.sendApiRequest('pollcrud/create',this.newPollData)
      .subscribe(data => {
        console.log(data);
        this.resData = data;
        if (data != null){
          if (this.resData.result_code == "411"){
            this.toasterService.pop("success", "Success", "Poll created Successfully!");
            this.newPollData.poll_id = this.resData.data;
            this.userDelIndex = this.userPollData.length;
            this.userPollData.push({
              poll_id:this.resData.data,
              title:this.newPollData.title,
              description:this.newPollData.description,
              poll_answers:{"option1":this.newPollData.option1, "option2":this.newPollData.option2},
              date:this.newPollData.dateCreated,
              poll_status:"false",
              poll_response:undefined,
              poll_answerType:this.newPollData.answerType
            });

            this.temp = this.userPollData;
            this.rowsFilter = this.userPollData;
            this.table.rows = this.userPollData;
            
          } else if (this.resData.result_code == "412"){
            this.toasterService.pop("warning", "Warning", "Poll already existed!");
          }
        }                
      });
  }

  public getAnswerType(event){
    this.newPollData.answerType = event.target.value;
    if (this.newPollData.answerType == "default"){
      this.option_isHidden = true;
      this.newPollData.option1 = "Yes";
      this.newPollData.option2 = "No";
    } else if (this.newPollData.answerType == "custom"){
      this.option_isHidden = false;
      this.newPollData.option1 = "";
      this.newPollData.option2 = "";
      this.option1Empty_isHidden = true;
      this.option2Empty_isHidden = true;
    }
  }

  public getTitle(event){    
    this.newPollData.title = event.target.value;
    this.titleEmpty_isHidden = true;
  }

  public getDescription(event){
    this.newPollData.description = event.target.value;
    this.descriptionEmpty_isHidden = true;
  }

  public getOption1(event){
    this.newPollData.option1 = event.target.value;
    this.option1Empty_isHidden = true;
  }

  public getOption2(event){
    this.newPollData.option2 = event.target.value;
    this.option2Empty_isHidden = true;
  }

  public deletePoll(){

    console.log(this.userDelIndex);
    
    this.api.sendApiRequest('pollcrud/delete',this.newPollData)
      .subscribe(data => {
        console.log(data);
        this.resData = data;
        if (data != null){
          if (this.resData.result_code == "420"){
            this.toasterService.pop("success", "Success", "Poll Deleted Successfully!");
            //delete data from table
            if (this.userDelIndex > -1){
              this.userPollData.splice(this.userDelIndex, 1);
              this.userPollSelected = {};
              this.titleInput.nativeElement.value = "";
              this.descriptionInput.nativeElement.value = "";
            }
            this.newPollData = {};
            this.configValue();
            this.table.rows = this.userPollData;

            
          } else if (this.resData.result_code == "413"){
            this.toasterService.pop("warning", "Warning", "Poll does not exist!");
          }
        }
      });

  }

  public updatePoll(){
    if (this.newPollData.title == "" || this.newPollData.title == undefined){
      this.titleEmpty_isHidden = false;
      this.descriptionEmpty_isHidden = true;
      return;
    }
    this.titleEmpty_isHidden = true;

    if (this.newPollData.description == "" || this.newPollData.description == undefined){
      this.descriptionEmpty_isHidden = false;
      return;
    }
    this.descriptionEmpty_isHidden = true;

    if (this.newPollData.answerType == "custom"){

      if (this.newPollData.option1 == "" || this.newPollData.option1 == undefined){
        this.option1Empty_isHidden = false;
        return;
      }
      this.option1Empty_isHidden = true;

      if (this.newPollData.option2 == "" || this.newPollData.option2 == undefined){
        this.option2Empty_isHidden = false;
        return;
      }
      this.option2Empty_isHidden = true;
    }
    this.newPollData.dateCreated = new Date().toUTCString();
    console.log(this.newPollData);
    this.api.sendApiRequest('pollcrud/update',this.newPollData)
      .subscribe(data => {
        console.log(data);
        this.resData = data;
        if (data != null){
          if (this.resData.result_code == "419"){
            this.toasterService.pop("success", "Success", "Poll updated Successfully!");    

            // this.userPollData.push({
            //   poll_id:this.resData.data,
            //   title:this.newPollData.title,
            //   description:this.newPollData.description,
            //   poll_answers:{"option1":this.newPollData.option1, "option2":this.newPollData.option2},
            //   date:this.newPollData.dateCreated,
            //   poll_status:"false",
            //   poll_response:undefined,
            //   poll_answerType:this.newPollData.answerType
            // });
            
            this.userPollData[this.userDelIndex] = {
              poll_id:this.resData.data,
              title:this.newPollData.title,
              description:this.newPollData.description,
              poll_answers:{"option1":this.newPollData.option1, "option2":this.newPollData.option2},
              date:this.newPollData.dateCreated,
              poll_status:"false",
              poll_response:undefined,
              poll_answerType:this.newPollData.answerType
            }
            this.temp = this.userPollData;
            this.rowsFilter = this.userPollData;
            this.table.rows = this.userPollData;

          } else if (this.resData.result_code == "412"){
            this.toasterService.pop("warning", "Warning", "Poll already existed!");
          } else if (this.resData.result_code == "413"){
            this.toasterService.pop("warning", "Warning", "Check the poll again!");
          }
        }                
      });     
      
  }

  public onActivate(event){
    if (event.type == "click"){
      this.userPollSelected = event.row;
      //get seleted number
      this.userDelIndex = this.userPollData.indexOf(this.userPollSelected);
      console.log(this.userPollSelected);
      
      if (this.userPollSelected.poll_answerType == "default"){
        this.defaultOpt.nativeElement.checked = true;
        this.option_isHidden = true;
        this.newPollData.answerType = "default";
        this.newPollData.option1 = "Yes";
        this.newPollData.option2 = "No";
        this.newPollData.title = this.userPollSelected.title;
        this.newPollData.description = this.userPollSelected.description;
        this.newPollData.poll_id = this.userPollSelected.poll_id;
        this.newPollData.user_email = localStorage.getItem("email");
        this.newPollData.user_id = localStorage.getItem("user_id");


      } else if (this.userPollSelected.poll_answerType == "custom"){
        this.customOpt.nativeElement.checked = true;
        this.option_isHidden = false;
        this.newPollData.answerType = "custom";
        this.newPollData.option1 = this.userPollSelected.poll_answers.option1;
        this.newPollData.option2 = this.userPollSelected.poll_answers.option2;
        this.newPollData.title = this.userPollSelected.title;
        this.newPollData.description = this.userPollSelected.description;
        this.newPollData.poll_id = this.userPollSelected.poll_id;
        this.newPollData.user_email = localStorage.getItem("email");
        this.newPollData.user_id = localStorage.getItem("user_id");


      }
    }
  }




}
