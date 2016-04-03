import {   inject, singleton } from 'aurelia-dependency-injection';
import {   AppRouter } from 'aurelia-router';
import {   AuthServiceGTZ } from '../services';
import lodash from 'lodash';
import moment from 'moment';
import User from '../resources/user';
import {api} from '../Utils/api';
@
    inject(AppRouter, AuthServiceGTZ)
export class Tenant {
 statusTextArchive = '';
    constructor(router, auth) {
console.log('tenant auth ',auth)
        this.auth = auth;
        this.loginuserid = this.auth.loginuserid; //getUser();
         this.roleid = this.auth.roleid; //getUser();roleid
    this.statusTextArchive = 'show archive';
   

        this.router = router;
  
  //   console.log(' tenant this.loginuserid ', this.loginuserid)
                   
        // http://10.1.110.203:8005/api/posts
        // this.message = "Hello World!";
        // this.http = http;
    }


    // modalCode() {
    //     //console.log('  building.BuildingId ', building.BuildingId, building)

    //     this.headingModal = 'Test Modal ' + modalno;





    //     $('#modal1').openModal();



    // }

  checkArchive() {

    if (this.statusTextArchive === 'show archve') {
      this.statusTextArchive = 'hide archve';

      lodash.forEach(this.filings, function (rec, key) {
        if (rec.JobStatus === 'Archived') {
        }
      })

    } else {
      this.statusTextArchive = 'show archve';
      lodash.forEach(this.filings, function (rec, key) {
        if (rec.JobStatus !== 'Archived') {
        }
      })
    }
  }
 editrpt(list) {
     console.log('   jsonRes.list ', list);
    this.list = list;
    this.proj = list.ProjectId;
   if ( this.proj!==undefined){
    return api.getFillings(this.proj)
      .then((jsonRes) => {
        this.filings = jsonRes.data;
console.log('   jsonRes.data ', jsonRes.data);


        $('#modal3').openModal();
      });
   }
  }

 editProjDocs(list) {
    this.list = list;
    this.proj = list.ProjectId;
    //  this.url = 'http://cm.brookbridgeinc.com:8004/api/projdocs/' + this.proj + '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.heading2 = ' ' + list.Address + ' / ' + list.BCSNumber;
    ////  console.log('   url ', this.url);
    //return this.http.get(this.url).then(response => {
    //  this.docs = response.content.data;
    
    return api.getprojDocs(this.proj)
      .then((jsonRes) => {
        this.docs = jsonRes.data;

        $('#modal3docs').openModal(); //modal2
      });

  }


    activate() {
      //  let checkauth = this.loggedin;
        // this blows up
        // return this.http.get(this.urlall).then(response => {
       
        // return    api.prototype.getlistTags(this.newstype).then((jsonRes) => {
       
        let groupListF = [
            { name: 'Approved', ct: 0 },
            { name: "Closed Out", ct: 0 },
            { name: 'Disapproved', ct: 0 },
            { name: 'Other', ct: 0 },
            { name: 'Permit-entire', ct: 0 },
            { name: 'Permit-partial', ct: 0 },
            { name: 'Signed-off', ct: 0 },
            { name: 'Withdrawn', ct: 0 }
        ];
        return api.getStatusTeneant(this.loginuserid).then((jsonRes) => {

 console.log('groupList ',this.loginuserid,jsonRes.data)
           

            this.isLoading = false;
            let groupList = jsonRes.data;
            lodash.forEach(groupList, function (rec, key) {
                if (rec.ParseStatus1 === 'Approved') {
                    groupListF[0].ct = rec.count;
                }
                if (rec.ParseStatus1 === 'Closed Out') {
                    groupListF[1].ct = rec.count;
                }
                if (rec.ParseStatus1 === 'Disapproved') {
                    groupListF[2].ct = rec.count;
                }


                if (rec.ParseStatus1 === 'Permit-entire') {
                    groupListF[3].ct = rec.count;
                }
                if (rec.ParseStatus1 === 'Permit-partial') {
                    groupListF[4].ct = rec.count;
                }
                if (rec.ParseStatus1 === 'Signed-off') {
                    groupListF[5].ct = rec.count;
                }
                if (rec.ParseStatus1 === 'Withdrawn') {
                    groupListF[6].ct = rec.count;
                }
                if (rec.ParseStatus1 === '-na-') {
                    groupListF[7].ct = rec.count;
                }
            })
            this.FixedGroup = groupListF;

        //   this.headingModal = building.BuildingId + '/' + building.Address;
        //   this.head = building.Address;//response.content.data[0];
         
         
         
            this.isLoading = false;

            this.lists = lodash.sortByOrder(groupList, 'ProjectId', true); // BCSNumber ProjectStatus
            let cdata = this.lists;

            //let completeList = groupList;


            let deptstf = lodash.uniq(cdata, function (dept) {

                dept.tf = true
                return dept.ProjectStatusId
            });
            this.defaultdepts = deptstf;
            this.departments = deptstf;

            this.completeList = groupList;//completeList;
//alert('in')
          //  $('#modal101').openModal();
        });
    }

}