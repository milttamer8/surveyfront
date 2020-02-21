import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { ApiService } from 'src/app/api.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InviteComponent implements OnInit {

  //table
  rowsFilter = [];
  temp = [];
  columns = [
      { prop: 'name' },
      { name: 'Company' },
      { name: 'Gender' }
  ];

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;
  @ViewChild('inviteBtn', { static: true }) inviteBtn: any; 
  @ViewChild('rejectBtn', { static: true }) rejectBtn: any; 
  @ViewChild('acceptBtn', { static: true }) acceptBtn: any; 


  // TOASTER
  toaster: any;
  toasterConfig: any;
  toasterconfig: ToasterConfig = new ToasterConfig({
      positionClass: 'toast-bottom-right',
      showCloseButton: true
  });

  //custom
  public resData: any = {};

  //table
  public sendData: any = {};
  public userPollData: Array<any> = [];
  public userPollSelected: any = {};
  public userDelIndex: number = 0;

  //responsers
  public selPollResMembers: any = {};
  public pollResNumber: number = 0;
  public selPollInivteMember: Array<any> = [];

  //invite reception
  public receInviteData: Array<any> = [];
  public receInviteNumber: number = 0;
    
  public id: string;


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
                      poll_answerType:this.resData[i].poll_answertype,
                      poll_user_email:this.resData[i].poll_user_email,
                      poll_user_id:this.resData[i].poll_user_id
                  });
              }
              this.temp = this.userPollData;
              this.rowsFilter = this.userPollData;
          }
      });

      this.api.sendApiRequest('invite/userrecestatus',this.sendData)
      .subscribe(data => {
          console.log(data);
          this.resData = data;
          if (data != null){
              this.resData = this.resData;
              if (this.resData.result_code == "508"){
                  this.receInviteData = this.resData.data;                  
              }
              console.log(this.receInviteData);
              this.receInviteNumber = this.receInviteData.length;
              if (this.receInviteNumber != 0){
                var i = 0;
                for (i=0; i<this.receInviteNumber; i++){
                  if (this.receInviteData[i].invite_status == "Pending"){
                    this.receInviteData[i].btnAccept_isHidden = false;
                    this.receInviteData[i].btnReject_isHidden = false;
                    this.receInviteData[i].btnAcceptVal = "Accept";
                    this.receInviteData[i].btnRejectVal = "Reject";
                  } else if (this.receInviteData[i].invite_status == "Accepted"){
                    this.receInviteData[i].btnReject_isHidden = true;
                    this.receInviteData[i].btnAcceptVal = "Accepted";
                    this.receInviteData[i].btnRejectVal = "No Working";
                  } else {
                    this.receInviteData[i].btnAccept_isHidden = true;
                    this.receInviteData[i].btnAcceptVal = "No Working";
                    this.receInviteData[i].btnRejectVal = "Rejected";
                  }
                }
              }
          }
      });
  }

  ngOnInit() {
    this.selPollResMembers = "";
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

  public onActivate(event){
    if (event.type == "click"){

      this.userPollSelected = event.row;
      //get seleted number
      this.userDelIndex = this.userPollData.indexOf(this.userPollSelected);
      console.log(this.userPollSelected);
      this.selPollResMembers = this.userPollSelected.poll_response;
      // console.log(this.selPollResMembers);
      if (this.selPollResMembers != undefined){
        this.pollResNumber = this.selPollResMembers.length;
        var i = 0;
        console.log("selpoll",this.selPollResMembers);            

        for (i=0; i<this.pollResNumber; i++){
          if (this.selPollResMembers[i].answer == "option1"){
            this.selPollResMembers[i].user_answer = this.userPollSelected.poll_answers.option1;
          } else if (this.selPollResMembers[i].answer == "option2"){
            this.selPollResMembers[i].user_answer = this.userPollSelected.poll_answers.option2;
          } else {
            this.selPollResMembers[i].user_answer = "I don't understand";
          }
        }
        this.sendData.user_id = localStorage.getItem("user_id");
        this.sendData.poll_id = this.userPollSelected.poll_id;
        this.api.sendApiRequest('invite/userstatus',this.sendData)
        .subscribe(data => {
            console.log(data);
            this.resData = data;
            if (this.resData.result_code == "507"){
              this.selPollInivteMember = this.resData.data;
              console.log(this.selPollInivteMember);
              var i = 0;
              var j = 0;
              for (i=0; i<this.selPollResMembers.length; i++){
                for  (j=0; j<this.selPollInivteMember.length; j++){
                  if (this.selPollResMembers[i].user_email == this.selPollInivteMember[j].rece_user_email){
                    this.selPollResMembers[i].invite_status = this.selPollInivteMember[j].invite_status;
                    break;           
                  }
                }
              }            

            }
            for (i=0; i<this.selPollResMembers.length; i++){
              if (this.selPollResMembers[i].invite_status == undefined || this.selPollResMembers[i].invite_status == ""){
                this.selPollResMembers[i].invite_status = "Invite";
              }
            }
        });

      } else {
        this.pollResNumber = 0;
      }      
    }
  }


  public invite(event, item, value){
    console.log(this.inviteBtn);
    console.log(event);
    console.log(item);
    if (value == "Invite"){
      this.sendData.rece_user_id = item.user_id;
      this.sendData.rece_user_email = item.user_email;
      this.sendData.user_id = localStorage.getItem("user_id");
      this.sendData.user_email = localStorage.getItem("email");
      this.sendData.sendDate = new Date().toUTCString();
      this.sendData.poll_id = this.userPollSelected.poll_id;
      this.sendData.poll_title = this.userPollSelected.title;
      this.sendData.poll_description = this.userPollSelected.description;
      this.sendData.poll_answer = item.user_answer;

      this.api.sendApiRequest('invite/send',this.sendData)
        .subscribe(data => {
            console.log(data);
            this.resData = data;
            if (this.resData.result_code == "500"){
              event.target.value = "Pending";
            } else if (this.resData.result_code == "501"){
              //accept
            } else if (this.resData.result_code == "502"){
              //reject
            } else if (this.resData.result_code == "503"){
              //pending
            }
        });
    }
  }

  public accept(event,item,value){
    var i = 0;
    for (i=0; i<this.receInviteNumber; i++){
      if (item.invite_id == this.receInviteData[i].invite_id){
        this.receInviteData[i].btnReject_isHidden = true;
        this.receInviteData[i].btnAccept_isHidden = false;
      }
    }
    console.log(item);
    this.sendData.rece_user_id = item.rece_user_id;
    this.sendData.user_id = item.user_id;
    this.sendData.poll_id = item.poll_id;
    this.sendData.acceptDate = new Date().toUTCString();
    console.log(this.sendData);

    if (value == "Accept"){
      this.api.sendApiRequest('invite/accept',this.sendData)
        .subscribe(data => {
            console.log(data);
            if (data != null){
              this.resData = data;
              if (this.resData.result_code == "505"){
                event.target.value = "Accepted";
              } else if (this.resData.result_code == "501"){
                //accept
              } else if (this.resData.result_code == "502"){
                //reject
              } 
            }            
        });
    }
  }

  public reject(event,item,value){
    var i = 0;
    for (i=0; i<this.receInviteNumber; i++){
      if (item.invite_id == this.receInviteData[i].invite_id){
        this.receInviteData[i].btnReject_isHidden = false;
        this.receInviteData[i].btnAccept_isHidden = true;
      }
    }
    console.log(item);
    this.sendData.rece_user_id = item.rece_user_id;
    this.sendData.user_id = item.user_id;
    this.sendData.poll_id = item.poll_id;
    this.sendData.acceptDate = new Date().toUTCString();
    console.log(this.sendData);

    if (value == "Reject"){
      this.api.sendApiRequest('invite/reject',this.sendData)
        .subscribe(data => {
            console.log(data);
            if (data != null){
              this.resData = data;
              if (this.resData.result_code == "506"){
                event.target.value = "Rejected";
              } else if (this.resData.result_code == "501"){
                //accept
              } else if (this.resData.result_code == "502"){
                //reject
              } 
            }            
        });
    }
  }



}
