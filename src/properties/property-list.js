import {   ListViewModel  } from '../list-view-model';
import {   inject, singleton } from 'aurelia-dependency-injection';
import {   AppRouter } from 'aurelia-router';
import {   AuthServiceGTZ } from '../services';
import User from '../resources/user';
import {   square, diag, legendtest } from '../resources/user';

// import {   HttpClient } from 'aurelia-http-client'; orig http call
// import {dateFormatterValueConverter} from '../value-converters/date-formatter';
import moment from 'moment';

import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';
// see main import $ from "jquery"; will break bundle if included 

import lodash from 'lodash';
import {   GraphData } from "../resources/graphData";
// import {getBuildings,getBio} from '../Utils/api';

import {api} from '../Utils/api';

@
  inject(AppRouter, HttpClient, AuthServiceGTZ, GraphData)
//@inject(AppRouter, HttpClient, AuthService)

export class PropertyList extends ListViewModel {

  buildings = [];
  loginuserid = 0;//11832; //11902;// al amore  11832; // b sullivan
  heading = 'Project  ';
  heading2 = '';
  isLoading = false; //true;
  filterText = "";
  // tenants = '';
  // departments = '';issue with beta1.2
  completeList = '';
  //floors = ''; issue with beta1.2
  //types = '';issue with beta1.2
  login = '';
  url = '';
  ctx2 = '';
  url2 = '';
  myChartdraw = '';
  data2 = '';
  statusText = '';
  statusTextArchive = '';
  //graphData='';
  showing = false;
  showingStatus = true; // always show this filter // false;
  isDisplayed = false;
  GraphData = {}; // this class replaces import {GraphData} from "../resources/graphData";
  scrollTop = 0;
  scrollEvents = [];
  constructor(router, http, auth) {
    //constructor(router, http, auth,graphData) {
    super('buildings', router);
    //  	this.graphData = graphData;
    //       this.mygraphData = graphData;
    this.statusText = 'turn box off';
    this.statusTextArchive = 'show archive';
    this.mygraphData = GraphData;

    this.auth = auth;
    this.http = http;
    this.router = router;
    if (this.auth.loginuserid === "") {
      // alert('Please login')
      this.loginuserid = 0;// 11832;// brian s
      this.roleid = 3;
      //  this.url = 'http://cm.brookbridgeinc.com:8004/api/buildings/' + this.loginuserid +
      //  '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

    } else {
      this.loginuserid = this.auth.loginuserid; //getUser();
      this.roleid = this.auth.roleid; //getUser();roleid
      //  this.url = 'http://cm.brookbridgeinc.com:8004/api/buildings/' + this.auth
      //  .loginuserid +
      //   '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

    }

  }
 
  
 
  
  //  handleScrollEvent(e) {
  //    console.log('e ',e)
  //     let info = {
  //     //  color: '#'+Math.floor(Math.random()*16777215).toString(16), 
  //      // left: e.target.scrollLeft,
  //       top: e.target.scrollTop
  //     };
    
  //     this.scrollEvents.splice(0, 0, info);
  //   }
  
  
  //106
  modalCodeChart(building) {
    //  // console.log('  modalCodeChart ', building.BuildingId, building)
    this.headingModal = building.Address;
    this.isLoading = false;
    // this.url2 = 'http://cm.brookbridgeinc.com:8004/api/propertycharts/' +
    // building.BuildingId +
    // '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

    let response1; let response2;
    let drilldata = '';
    let chartdata = '';
    //  return this.http.get(`${reposUrl}?page=1`)
    // .then(response => response1 = response)
    // .then(() => this.http.get(`${reposUrl}?page=2`)
    // .then(response2 => {
    //   this.repos = response1.content
    //     .concat(response2.content)
    //     .sort((a, b) => b.stargazers_count - a.stargazers_count);
    // });
    
    //   api.prototype.getChartsDrill(building.BuildingId)
    // .then((jsonRes) => {
    //   drilldata = jsonRes.data;
    //   console.log(' drilldata ', drilldata)
    //   api.prototype.getCharts(building.BuildingId)
    //     .then((jsonRes) => {
    //       let chartdata = jsonRes.data;
    
    
    api.getChartsDrill(building.BuildingId)
      .then(jsonRes => response1 = jsonRes)
      .then(() => api.getCharts(building.BuildingId))
      .then(response2 => {
        drilldata = response1.data;
        chartdata = response2.data;

        console.log('chart', chartdata);
        let piedata = []; // piedata=[];
        let pieslice = {};
        let piedatadrilldown = [];
        let drilldownslice = {};

        let drilldownct = 0;
        lodash.forEach(chartdata, function (rec, key) {
          //  console.log('all values are not available from here ', rec,  key)
          if (key === 0) {


            pieslice.name = 'ECB/DOB Open Violations';
            // we tinkk ViolationsECBDOBOpen is reallu kist ecb and mislabled
            pieslice.y = rec.ViolationsECBDOBOpen + rec.ViolationsDOBOpen;
            piedata.push(pieslice);
          }
          pieslice = {};
          drilldownslice = {};
          switch (rec.ParseStatus1) {
            case 'Approved':

              pieslice.name = 'Approved';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Approved';
              // drilldownslice.name = 'Approved';
              drilldownslice.id = 'Approved';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Approved') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Approved total:' + drilldownct;
              break;
            case 'Closed Out':
              pieslice.name = 'Closed Out';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Closed Out';
              drilldownslice.name = 'Closed Out';
              drilldownslice.id = 'Closed Out';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Closed Out') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Closed Out total:' + drilldownct;
              break;
            case 'Disapproved':
              pieslice.name = 'Disapproved';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Disapproved';
              drilldownslice.name = 'Disapproved';
              drilldownslice.id = 'Disapproved';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Disapproved') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Disapproved total:' + drilldownct;
              break;
            case 'Withdrawn':
              pieslice.name = 'Withdrawn';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Withdrawn';
              drilldownslice.name = 'Withdrawn';
              drilldownslice.id = 'Withdrawn';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Withdrawn') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Withdrawn total:' + drilldownct;
              break;
            case 'Permit-entire':
              pieslice.name = 'Permit-entire';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Permit-entire';
              drilldownslice.name = 'Permit-entire';
              drilldownslice.id = 'Permit-entire';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Permit-entire') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Permit-entire total:' + drilldownct;
              break;
            case 'Permit-partial':
              pieslice.name = 'Permit-partial';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Permit-partial';
              drilldownslice.name = 'Permit-partial';
              drilldownslice.id = 'Permit-partial';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Permit-partial') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Permit-partial total:' + drilldownct;
              break;
            case 'Signed-off':
              pieslice.name = 'Signed-off';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Signed-off';
              drilldownslice.name = 'Signed-off';
              drilldownslice.id = 'Signed-off';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Signed-off') {
                  drilldownct += rec.pcount;
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Signed-off total:' + drilldownct;
              break;


            case 'Other':
              pieslice.name = 'Other';//+ rec.Name; //+'('+rec.pcount+')';
              pieslice.y = rec.pcount;
              pieslice.drilldown = 'Other';
              drilldownslice.name = 'Other ';
              drilldownslice.id = 'Other';
              drilldownslice.data = [];
              drilldownct = 0;
              lodash.forEach(drilldata, function (rec, key) {
                if (rec.ParseStatus1 === 'Other') {
                  drilldownslice.data.push([rec.DrillDown, rec.pcount])
                }
              });
              drilldownslice.name = 'Other total:' + drilldownct;
              break;
          }
          piedata.push(pieslice);
          piedatadrilldown.push(drilldownslice);
        });

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
        //let slicename='';
        lodash.forEach(groupListF, function (rec, key) {
          let slicename = rec.name;
          let apos = 0;

          apos = lodash.findIndex(piedata, function (file) {

            return (file.name.trim() === slicename);
          });

          if (apos === -1) {
            pieslice = {};
            pieslice.name = slicename;
            pieslice.y = 0;
            piedata.push(pieslice);
          }

        });
      
        // chart: {
        //   plotBackgroundColor: null,
        //   plotBorderWidth: null,
        //   plotShadow: false,
        //   type: 'pie'
        // },
        // var text = this.renderer.text(
        //   '<div style="color: #212121"' + total+'</div>',
        // this.mygraphData
      
        // .pieChart = {
        let mygraphData = {
          chart: {
            type: 'pie',
            // renderTo: 'container',
            width: 800,
            // borderWidth: 2,
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            events: {
              load: function (event) {
                var total = 0;
                for (var i = 0, len = this.series[0].yData.length; i < len; i++) {

                  if (this.series[0].yData[i] !== undefined) {
                    total += this.series[0].yData[i];
                  }
                }
                var text = this.renderer.text(
                  '<span style="color: red;font-size: 1.6rem; ">' + 'Total:' + total + '</span>',
                  this.plotLeft,
                  this.plotTop - 20
                  ).attr({
                    zIndex: 5
                  }).add()
              }
            }
          },
          title: {
            text: 'Property Charts Source:DOB'
          },
          subtitle: {
            text: 'Click the slices to view source. Source: dob.'
          },
          tooltip: {
            pointFormat: '{series.name}:<b>{point.y} / {point.percentage:.1f}%</b>'
          },
          exporting: {
            enabled: true,

          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            y: 30,
            labelFormat: '{name} ({y})',
            navigation: {
              activeColor: '#3E576F',
              animation: true,
              arrowSize: 12,
              inactiveColor: '#CCC',
              style: {
                fontWeight: 'bold',
                color: '#333',
                fontSize: '12px'
              }
            }
          },


          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: false
              },
              showInLegend: true
            }
            //  ,series: {
            //       dataLabels: {
            //           enabled: true,
            //            format: '{point.name}:<b>{point.y} / {point.percentage:.1f}%</b>'
            //       }
            //   }
          },
          series: [{
            name: "Status",
            colorByPoint: true,
            data: piedata
          }],
          drilldown: {
            series: piedatadrilldown
          }

        };

       

        // this.mygraphDataplot=mygraphData;
        this.changeGraph(mygraphData);//this.changeGraph(this.mygraphData.pieChart);
        $('#modal106').openModal();
      });



    //  this.isLoading = false;
  }




  get canSave() {
    //  console.log('in cs')
    return true; // this.roleid <4 ;
  }

  applyFilter() {
    let filterObject = this.filterObject;
    this.filterObject = {};
    this.filterObject = filterObject;
  }
  edit(building) {
    alert(building.BuildingId);
    this.router.navigate('buildings/' + building.BuildingId); //+'/planner/day/1');

  }



  clear() {
    // alert('clear')
    this.filterText = "";
  }


  editStatus(building) {
    //  alert(cbuilding.BuildingId);
    this.router.navigate('http://www.gtz.com');
  }
  editECB(building) {
    //alert('editECB ' + building.BuildingId);
    let ecb =
      'http://a810-bisweb.nyc.gov/bisweb/ECBQueryByLocationServlet?requestid=1&allbin=' +
      building.Bin;
    this.router.navigate(ecb);
  }
  editDOB(building) {
    let dob =
      'http://a810-bisweb.nyc.gov/bisweb/ECBQueryByLocationServlet?requestid=1&allbin' +
      building.Bin; //=1009745';
    this.router.navigate(dob); //'buildings/' + building.BuildingId); //+'/planner/day/1');
  }

  open(building) {
    alert(building.BuildingId);
    this.router.navigate('buildings/' + building.BuildingId); //+'/planner/day/1');
  }

  // this.url = 'http://cm.brookbridgeinc.com:8004/api/buildings/' + this.loginuserid +'?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

  modalCode(building) {
    //  this is status option modal 101
  
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

      
    // 'Approved'
    // 'Disapproved'
    // 'Closed Out'
    // 'Permit-partial'
    // 'Permit-entire'
    // 'Withdrawn'
    // Z-NA    
    //console.log(' this.groupList ', this.groupList);
    // this.urlg = 'http://cm.brookbridgeinc.com:8004/api/projstatusgroup/' + building.BuildingId + '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.isLoading = false;
    // this.http.get(this.urlg).then(response => {

    //   this.groupList = response.content.data;
    
    api.getStatus(building.BuildingId)
      .then((jsonRes) => {
        this.groupList = jsonRes.data;

        console.log('status groupList ', this.groupList)
        lodash.forEach(this.groupList, function (rec, key) {
      //    console.log('rec ', rec.ParseStatus1, rec.count)
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
      });
    
    
    
    /////////////////////////////////////////////////////////////////
    this.headingModal = building.BuildingId + '/' + building.Address;
    this.head = building.Address;//response.content.data[0];
    this.isLoading = false;
    //this.url = 'http://cm.brookbridgeinc.com:8004/api/projstatusreport/' + building.BuildingId + '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    //  return this.http.get(this.url).then(response => {
  
    let statusdata;
    api.getStatus(building.BuildingId)
      .then((jsonRes) => {
        statusdata = jsonRes.data;
        this.lists = lodash.sortByOrder(statusdata, 'ProjectId', true); // BCSNumber ProjectStatus
        let cdata = this.lists;
           console.log('status cdata ', cdata)
     
        //  _.sortByOrder(users, 'name', false);
        //let cdata = lodash.map(lodash.sortByOrder(response.content.data, ['ProjectId'], ['asc']),lodash.values);
      //  console.log('response.content.data ', cdata)
        // //ProjectStatus asc
        let completeList = statusdata;//response.content.data; // cdata;
  
        // console.log('completeList ', this.completeList)
        // // filter out archived from dept
        // ProjectStatusId=6 is archive but we dont send it now 
        // 12/1/15
        let deptstf = lodash.uniq(cdata, function (dept) {
          // if (dept.ProjectStatusId === 6) {
          //   dept.tf = false
          // } else {
          //   dept.tf = true
          // };
          dept.tf = true
          return dept.ProjectStatusId
        });
        this.defaultdepts = deptstf;
        this.departments = deptstf;
        // this.lists = lodash.remove(cdata, function (tlist) {
        //   return (tlist.ProjectStatusId !== 6)
        // });
        // this.completeList = completeList;
        // this.lists =cdata;
        this.completeList = completeList; 
        //  console.log( ' this.completeList ',this.completeList)
      
        this.myCurrentEntity = {};
       this.myCollection = [
      {index:1,name:'john',country:'usa',email:'jj@g.com',color:'red'},
   {index:2,name:'tom',country:'usa',email:'jj@g.com',color:'green'},
   {index:3,name:'dick',country:'usa',email:'jj@g.com',color:'blue'},
    {index:4,name:'harry',country:'usa',email:'jj@g.com',color:'black'},
      {index:5,name:'bob',country:'usa',email:'jj@g.com',color:'white'},
  ];
 
     this.collectionLength = this.lists.length;
      
        $('#modal101').openModal();
      });
  }




  check(dept) {

    let apos = '';
    apos = lodash.findIndex(this.departments, function (file) {

      return (file.ProjectStatusId === dept);
    });
    if (apos > -1) {
      this.departments[apos].tf = !checked;
    }
  }
  editrpt(list) {
    this.list = list;
    this.proj = list.ProjectId;
    //   this.url = 'http://cm.brookbridgeinc.com:8004/api/filingdetails/' + this.proj +
    //   '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    //  this.heading2 = ' ' + list.Address;
    // return this.http.get(this.url).then(response => {
    //   this.filings = response.content.data;
    return api.getFillings(this.proj)
      .then((jsonRes) => {
        this.filings = jsonRes.data;

        $('#modal3').openModal();
      });
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
  editdrawing(list) {
    this.list = list;
    this.proj = list.DrawingId; //ProjectId;
   
    // this.url = 'http://cm.brookbridgeinc.com:8004/api/propertydocs/' + this.proj +
    // '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    // return this.http.get(this.url).then(response => {
    //   this.docs = response.content.data;
  
    this.heading2 = ' ' + list.TenantName + ' ' + list.Floor + ' ' + list.DrawingType;
    return api.getpropertyDocs(this.proj)
      .then((jsonRes) => {
        this.docs = jsonRes.data;

        $('#modal105').openModal();
      });

  }


  modalCodeRpt(building) {
    this.headingModal = building.BuildingId + '/' + building.Address;
    //this.url = 'http://cm.brookbridgeinc.com:8004/api/projstatus/' + building.BuildingId +
    // '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.isLoading = false;
    // return this.http.get(this.url).then(response => {
    //   this.lists = response.content.data;
    return api.getprojStatus(building.BuildingId)
      .then((jsonRes) => {
        this.lists = jsonRes.data;

        $('#modal3').openModal();
      });
  }

  modalCodeECB(building) {
    ////  console.log('  modalCodeECB ', building.BuildingId, building)
    this.headingModal = building.BuildingId + '/' + building.Address;
    // this.url = 'http://cm.brookbridgeinc.com:8004/api/propviolationsecb/' + building.BuildingId +
    // '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.isLoading = false;
    // return this.http.get(this.url).then(response => {
    //   this.lists = response.content.data;
    return api.getpropViolationsecb(building.BuildingId)
      .then((jsonRes) => {
        this.lists = jsonRes.data;

        $('#modal102').openModal();

      });
  }

  modalCodeDOB(building) {
    // this.headingModal = building.BuildingId + '/' + building.Address;
    this.headingModal = building.Address;
   
   
    // this.url = 'http://cm.brookbridgeinc.com:8004/api/propviolationsdob/' +
    // building.BuildingId +
    // '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.isLoading = false;

    // return this.http.get(this.url).then(response => {
    //   this.lists = response.content.data;
    
    //     array.sort(function(a,b){
    //   // Turn your strings into dates, and then subtract them
    //   // to get a value that is either negative, positive, or zero.
    //   return new Date(b.date) - new Date(a.date);
    // });
    //   this.lists = jsonRes.data.sort((a, b) =>  dateFormatter(b.IssueDate) - dateFormatter(a.IssueDate));

    return api.getpropViolationsdob(building.BuildingId)
      .then((jsonRes) => {
        let dd = jsonRes.data;
      
        // works this.listsV = dd.sort((a, b) =>   moment(b.FileDate).format('YYYYMMDD') -  moment(a.FileDate).format('YYYYMMDD'));
        this.listsV = dd;
         console.log('  status getpropViolationsdob ', this.listsV)
       
        // let dd = moment(this.lists[0].IssueDate).format('YYYYMMDD');
        //   console.log('  this.lists IssueDate', dd  );
        $('#modal103').openModal();

      });
  }

  // <iframe src="http://a810-bisweb.nyc.gov/bisweb/ECBQueryByLocationServlet?requestid=1&allbin=${building.BIN}" width="99%" height="800px"></iframe>
  modalArticle(building) {
    this.headingModal = 'Article ' + building.Address;
    this.building = building;
    $('#modalArticle1').openModal();
  }



  modalCodeDraw(building) {
    ////  console.log('  modalCodeDraw ', building.BuildingId, building)
  
    this.headingModal = building.Address;
    this.selectedTenant = [];
    this.selectedFloor = [];
    this.selectedType = [];
    this.building = building;
    //  this.url = 'http://cm.brookbridgeinc.com:8004/api/findbuildingdocs/' +
    //  building.BuildingId +
    //  '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';
    this.isLoading = true;
    // return this.http.get(this.url).then(response => {

    return api.getBuildingdocs(building.BuildingId)
      .then((jsonRes) => {
        this.lists = jsonRes.data;


        let cdata = lodash.sortByOrder(this.lists, ['TenantName'], ['asc']);
        this.lists = cdata;
        this.completeBuildingList = cdata;


        let sortedTen = lodash.sortByOrder(cdata, ['TenantName'], ['asc']);
        this.tenants = lodash.uniq(sortedTen, true, function (ten) {
          return ten.TenantId
        });

        let sortedFloors = lodash.sortByOrder(cdata, ['Floor'], ['asc']);
        this.floors = lodash.uniq(sortedFloors, true, function (ten) {
          return ten.Floor
        });
        //WorkTypeId
        let sortedTypes = lodash.sortByOrder(cdata, ['DrawingType'], ['asc']);
        this.types = lodash.uniq(sortedTypes, true, function (ten) {
          return ten.WorkTypeId
        });
 
        this.selectedTenant.push(this.tenants[0]); //[];

        //  // // console.log(' modal104 this.selectedTenant ', this.selectedTenant, 'modal104', this.tenants)
        $('#modal104').openModal();
        this.isLoading = false;
this.allTenants= this.tenants;
this.allFloors= this.floors;
this.allTypes= this.types;


      });
  }

  changeCallback(evt) {
    //  // // console.log('evt', evt);
    return true;
    // The selected value will be printed out to the browser console
    //.target.innerText);
    // this.selectedThing=evt.target.innerText;
    //  // // console.log(evt.detail.value);
  }
  // submitForm1(e){ alert("checked: " + document.getElementById("checkbox1").checked);  }
  filterClear(param) {
    this.isLoading = true;
   
        
    lodash.forEach(this.tenants, function (rec, key) {
      (document.getElementById(rec.TenantId).checked = false)
    })
    lodash.forEach(this.floors, function (rec, key) {
      (document.getElementById('F' +rec.DrawingId).checked = false)
    })
    lodash.forEach(this.types, function (rec, key) {
      (document.getElementById('T' + rec.DrawingId).checked = false)

    })
        
     if (param === "2" ){
      this.theRouter.navigate("#");//igate("properties");
     }   
    //  this.completeBuildingList=this.lists ;
 this.lists= this.completeBuildingList; // completeList;
 this.tenants= this.allTenants;
 this.floors=this.allFloors;
 this.types=this.allTypes;

  }

  showFilterPanel() {
    this.showing = !this.showing; //true;
    this.showing ? this.showingFilter = 'Hide Filter Panel' : this.showingFilter = 'Show Filter Panel';
  }


  selecttheTyp(type) {
    let theLists = this.tenantBuildingList;
    let filtLists = [];
    // lodash.forEach(this.floors, function (rec, key) {
    //   if (document.getElementById('F' + rec.DrawingId).checked) {
    //     lodash.forEach(theLists, function (n, key) {
    //       if (n.Floor === rec.Floor) filtLists.push(n);
    //     });
    //   }
    // })
    // if (filtLists.length > 0) {
    //   theLists = filtLists;
    // }
    lodash.forEach(this.types, function (rec, key) {
      if (document.getElementById('T' + rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          if (n.WorkTypeId === rec.WorkTypeId) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      this.lists = filtLists;
    }

  }


  selecttheFloor(floor) {
    let theLists = this.tenantBuildingList;
    let filtLists = [];
    lodash.forEach(this.floors, function (rec, key) {
      if (document.getElementById('F' + rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          if (n.Floor === rec.Floor) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      theLists = filtLists;
    }

   // let sortedFloors = lodash.sortByOrder( this.lists , ['Floor'], ['asc']);
    // this.floors = lodash.uniq(sortedFloors, true, function (ten) {
    //   return ten.Floor
    // });
 
    if (filtLists.length > 0) {

      this.lists = filtLists;
    }
    let sortedTypes = lodash.sortByOrder(this.lists, ['DrawingType'], ['asc']);
    this.types = lodash.uniq(sortedTypes, true, function (ten) {
      return ten.WorkTypeId
    });
  }

  selecttheTenant(ten) {
    this.selectedTenantchosen = ten;
    let theLists = this.completeBuildingList; // completeList;
    let filtLists = [];

    let chosen = this.selectedTenantchosen.TenantId;
    if (chosen !== null) {
      lodash.forEach(theLists, function (rec, key) {
        if (rec.TenantId === chosen) filtLists.push(rec);
      });
    }


    let sortedFloors = lodash.sortByOrder(filtLists, ['Floor'], ['asc']);
    this.floors = lodash.uniq(sortedFloors, true, function (ten) {
      return ten.Floor
    });

    let sortedTypes = lodash.sortByOrder(filtLists, ['DrawingType'], ['asc']);
    this.types = lodash.uniq(sortedTypes, true, function (ten) {
      return ten.WorkTypeId
    });
    if (filtLists.length > 0) {

      this.lists = filtLists;
    }
    this.tenantBuildingList = this.lists;
  
     
  }


  filterFloors() {
    lodash.forEach(this.tenants, function (rec, key) {
     // console.log('rec ', rec.TenantId, rec.TenantName, document.getElementById(rec.TenantId), document.getElementById(rec.TenantId).value, ' checked ', document.getElementById(rec.TenantId).checked, 'key', key);

      if (document.getElementById(rec.TenantId).checked) {
        alert(rec.TenantName + ' ' + key)
      }
      // lodash.forEach(this.floors, function (rec, key) {
      //   (document.getElementById(rec.DrawingId).checked = false)
    })
  }


filterDrawings(){
  
  this.filterDrawingsOrig2()
  
}

  filterDrawingsInuse() {
    let theLists = this.completeBuildingList; // completeList;
    let filtLists = [];
    let reckeys = '';
    
   

    let chosen = this.selectedTenantchosen.TenantId;
    //       if (this.selectedTenantchosen !== null) {
    //            lodash.forEach(theLists, function (rec, key) {
    //     if (rec.TenantId === chosen) filtLists.push(rec);
    //           });
    //         }
    //     if (filtLists.length > 0) {
    //       //    this.lists = lodash.sortByOrder(filtLists, ['TenantName'], ['asc']);
    //       theLists = filtLists;
    //     }
    filtLists = [];
    lodash.forEach(this.floors, function (rec, key) {
      if (document.getElementById('F' + rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          if (n.Floor === rec.Floor) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      theLists = filtLists;
    }

    filtLists = [];
    lodash.forEach(this.types, function (rec, key) {

      // // console.log("rec: " + rec.WorkTypeId, document.getElementById('T' + rec.DrawingId).checked);
      if (document.getElementById('T' + rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          // // console.log(n, key);
          if (n.WorkTypeId === rec.WorkTypeId) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      this.lists = lodash.sortByOrder(filtLists, ['TenantName'], ['asc']);
    } else {
      this.lists = theLists;
    }

  }

  filterDrawingsOrig() {
    //  console.log("checked: " + document.getElementById("checkbox1").checked);
    let theLists = this.completeBuildingList; // completeList;
    let filtLists = [];
    let reckeys = '';
    lodash.forEach(this.tenants, function (rec, key) {
      reckeys += rec.TenantId + ';';

      if (rec.TenantId !== null) {
        if (document.getElementById(rec.TenantId).checked) {
          lodash.forEach(theLists, function (n, key) {
            if (n.TenantId === rec.TenantId) filtLists.push(n);
          });
        }
      }
    })

    if (filtLists.length > 0) {
      //    this.lists = lodash.sortByOrder(filtLists, ['TenantName'], ['asc']);
      theLists = filtLists;
    }
    filtLists = [];
    lodash.forEach(this.floors, function (rec, key) {

      // // console.log("rec: " + rec.Floor, document.getElementById(rec.DrawingId).checked);
      if (document.getElementById(rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          // // console.log(n, key);
          if (n.Floor === rec.Floor) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      theLists = filtLists;
    }

    filtLists = [];
    lodash.forEach(this.types, function (rec, key) {

      // // console.log("rec: " + rec.WorkTypeId, document.getElementById('T' + rec.DrawingId).checked);
      if (document.getElementById('T' + rec.DrawingId).checked) {
        lodash.forEach(theLists, function (n, key) {
          // // console.log(n, key);
          if (n.WorkTypeId === rec.WorkTypeId) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      this.lists = lodash.sortByOrder(filtLists, ['TenantName'], ['asc']);
    } else {
      this.lists = theLists;
    }

  }



  filterDrawingsOrig2(typ,selectedobject) {
//typ 1 2 or 3
// selected object

    let theLists = this.completeBuildingList; // completeList;
    let filtLists = [];
    let reckeys = '';
    let atleast1check;
   let chosen ;

    if (typ===1){
    this.selecttheTenant(selectedobject);
    }
    else
    {  
    // let chosen = selectedobject.TenantId;
    
      lodash.forEach(this.tenants, function (rec, key) {
      if (rec.TenantId !== null) {
        if (document.getElementById(rec.TenantId).checked) {
          chosen = rec.TenantId;
          // lodash.forEach(theLists, function (n, key) {
          //   if (n.TenantId === rec.TenantId) filtLists.push(n);
          // });
        }
      }
      });
   if (chosen !== null) {
      lodash.forEach(theLists, function (rec, key) {
     //console.log(  rec.TenantId, chosen)
        if (rec.TenantId === chosen) {
        atleast1check = 1;
          filtLists.push(rec);
         // console.log('filtLists',filtLists)
        }
      });
    }
    
    
 }
 
 
 



    // we now have all matching tenants
    if (atleast1check === 1) {
      theLists = filtLists;
    }

    atleast1check = 0;
    if (theLists.length > 0) {
      filtLists = [];
      lodash.forEach(this.floors, function (rec, key) {

        // // console.log("rec: " + rec.Floor, document.getElementById(rec.DrawingId).checked);
        if (document.getElementById('F'+rec.DrawingId).checked) {
          lodash.forEach(theLists, function (n, key) {
            // // console.log(n, key);
             atleast1check = 1;
            if (n.Floor === rec.Floor) filtLists.push(n);
          });
        }
      })


    }
    // if (filtLists.length > 0) {
    //   theLists = filtLists;
    // }
    if (atleast1check === 1) {
      theLists = filtLists;
    }

    atleast1check = 0;
    if (theLists.length > 0) {
      filtLists = [];
      lodash.forEach(this.types, function (rec, key) {

        if (document.getElementById('T' + rec.DrawingId).checked) {
         

          lodash.forEach(theLists, function (n, key) {
            if (n.WorkTypeId === rec.WorkTypeId) {
               atleast1check = 1;
              filtLists.push(n);
            }
          });
        }
      })
    }
    if (atleast1check === 1) {
      theLists = filtLists;
    }
   

 this.lists = lodash.sortByOrder(theLists, ['TenantName'], ['asc']);
   
    
  }
  // =====================

  filterStatusClear() {
    this.lists = this.completeList;
    let deptstf = lodash.forEach(this.departments, function (dept) {
      if (dept.ProjectStatusId === 6) {
        dept.tf = false
      } else {
        dept.tf = true
      };
      return dept.ProjectStatusId
    });

    this.departments = deptstf;
  }

  showFilterStatusPanel() {
    this.showingStatus = !this.showingStatus; //true;
    this.showingStatus ? this.showingStatusFilter = 'Hide Filter Panel' : this.showingStatusFilter = 'Show Filter Panel';
  }

  filterStatus() {
    let theLists = this.completeList;
    let filtLists = [];
    lodash.forEach(this.departments, function (rec, key) {
      if (document.getElementById(rec.ProjectStatusId).checked) {
        lodash.forEach(theLists, function (n, key) {
          if (n.ProjectStatusId === rec.ProjectStatusId) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      theLists = filtLists;
    }

    if (filtLists.length > 0) {
      this.lists = lodash.sortByOrder(filtLists, ['TenantName'], ['asc']);
    } else {
      this.lists = theLists;
    }

  }
  // ======================
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

  checkAllStages() {

    if (this.statusText === 'turn box off') {
      this.statusText = 'turn box on';
      this.tf = false;


      lodash.forEach(this.departments, function (dept) {
        (document.getElementById(dept.ProjectStatusId).checked = false)
      })
    } else {
      this.statusText = 'turn box off';

      lodash.forEach(this.departments, function (dept) {
        (document.getElementById(dept.ProjectStatusId).checked = true)
      })
    }

  }

  checkAll() {

    if (this.statusText === 'turn box off') {
      this.statusText = 'turn box on';
      this.tf = false;
      lodash.forEach(this.FixedGroup, function (rec, key) {
        (document.getElementById(rec.name).checked = false)
      })
    } else {
      this.statusText = 'turn box off';
      this.tf = true;
      lodash.forEach(this.FixedGroup, function (rec, key) {
        (document.getElementById(rec.name).checked = true)
      })
    }


  }

  filterStatusReport() {
    let theLists = this.completeList;
    let filtLists = [];
    lodash.forEach(this.FixedGroup, function (rec, key) {
      if (document.getElementById(rec.name).checked) {
        lodash.forEach(theLists, function (n, key) {

          if (n.ParseStatus1 === rec.name) filtLists.push(n);
        });
      }
    })
    if (filtLists.length > 0) {
      theLists = filtLists;
    }

    if (filtLists.length > 0) {
      this.lists = lodash.sortByOrder(filtLists, ['ParseStatus1'], ['asc']);
    } else {
      this.lists = theLists;
    }

  }
  // ======================
  attached() {

    this.isLoading = false;
    this.showing = false;
    this.showingFilter = 'Show Filter Panel';
    //  this.showingStatus = false;
    //  this.showingStatusFilter = 'Show Filter Panel';
    $(document).ready(function () {

      $('.modal-trigger').leanModal(),
      $('ul.tabs').tabs(),

      $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
      }),
      $('.tooltipped').tooltip({
        delay: 50
      }),
      $('select').material_select();
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrain_width: false, // Does not change width of dropdown to that of the activator
        hover: true, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: false // Displays dropdown below the button
      });

    });
    if (this.auth.loginuserid === "") {
      this.url2 =
      'http://cm.brookbridgeinc.com:8004/api/propertycharts/54900?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

    } else {
      // this.loginuserid = this.auth.loginuserid; //getUser();
      // this.roleid = this.auth.roleid; //getUser();roleid
      this.url2 = 'http://cm.brookbridgeinc.com:8004/api/propertycharts/' +
      this.auth.loginuserid +
      '?token=eyJhbGciOiJIUzI1NiJ9.NTNmMTY3NjllZTk5YTBmMDFlYWM0N2Q4.cx_Qv913lp4Q7lj-QsQUJ8w4DdDM16SRv3_BzraUPrc';

    }
  }


  changeGraph(chartOptions) {
    this.chartOptions = chartOptions;
  }

  showChart(chartOptions) {
    this.hiddenChartOptions = chartOptions;
    this.isDisplayed = true;
  }



  //moved to attached to fix progress bar
  activate() {
    this.items = [
      {
        Have: true,
        Need: false

      }];
    let groupListF = [
      { name: 'Approved', ct: 0 },
      { name: "Closed Out", ct: 0 },
      { name: 'Disapproved', ct: 0 },
      { name: 'Permit-entire', ct: 0 },
      { name: 'Permit-partial', ct: 0 },
      { name: 'Signed-off', ct: 0 },
      { name: 'Withdrawn', ct: 0 },
      { name: 'Other', ct: 0 }
    ];

   
    // .sort((a, b) => b.stargazers_count - a.stargazers_count);
    // return this.http.get(this.url).then(response => {
    //   this.buildings = response.content.data;
    //   //  console.log('  this.buildings ', this.buildings)
    //   let datacount = response.content.data.length;
    //   this.heading = this.buildings[0].Owner;
    //   this.loginusername = this.buildings[0].FirstName + ' ' + this.buildings[
    //   0].LastName
    //   this.isLoading = false;
    // });
    
    // getBuildings(this.loginuserid)
    
    // if api is class return api.prototype.getBuildings(this.loginuserid)
     return  api.getBuildings(this.loginuserid)
      .then((jsonRes) => {

        this.buildings = jsonRes.data;
       // console.log('  this.buildings ', this.buildings)
        let datacount = jsonRes.data.length;
        this.heading = this.buildings[0].Owner;
        this.loginusername = this.buildings[0].FirstName + ' ' + this.buildings[0].LastName
        this.isLoading = false;
      })


  }

}
//  <p><b>Landmark </b>${landmark}building.LandMark} ? 'Yes' : 'No'</p>
   
// return lm ? 'Yes' : 'No';// `${this.firstName} ${this.lastName}`;
export class StatusValueConverter {

  toView(value) {

    switch (value) {
      case 1:
        value = 'Final';
        break;
      case 2:
        value = 'Temp';
        break;
      case 3:
        value = 'Not Issued';
        break;
      default:
        value = 'NA ';
    }
   // console.log('val ', value);//,str)
    return value;
  }
}
export class LocationValueConverter {

  toView(value) {

    //console.log('val ', value)
    return value ? 'Yes' : 'No';
  }
}