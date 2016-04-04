
import {   inject, singleton } from 'aurelia-dependency-injection';
import {dummyDataGenerator} from './data/dummyDataGenerator';
//import {   TestData } from "./data/testData";
import {GraphData} from "../resources/graphData";
import {GridData} from "../resources/gridData";
import {   AppRouter } from 'aurelia-router';

import {Person} from './Person';
import lodash from 'lodash';

@inject(GridData, dummyDataGenerator) // AppRouter,GraphData, dummyDataGenerator)
export class Vgridtest {
    //static inject = [dummyDataGenerator];
    //estData={};
 
    myCollection = [];
    myCurrentEntity = {};
    myCollection1 = [];
    myCurrentEntity1 = {};
    myCollection2 = [];
    myCurrentEntity2 = {};
    gridData = [];
    /********************************************************************
     * Constructor
     *****************router*****element**********************************************/
    constructor(GridData, dummyDataGenerator) {//router,GraphData,GridData){  // dummyDataGenerator) {
        //constructor(router) {
        // this.graphData = graphData;
 
        // this.myCollection = GridData.rowData.rows;
        //  this.collectionLength = this.myCollection.length;
 
        //this if just for giving us some data this.dummyDataGenerator.prototype
        this.dummyDataGenerator = dummyDataGenerator;
        this.dummyDataGenerator.generateData(100, (data) => {
            
            this.newdata = [];
            let ct=0;
            lodash.forEach(data, (key, value) => {
                if (typeof key === 'object') {
                    //    return new Person(key);
                    let p = new Person(key);
                    this.newdata.push(p);
                    if (ct===0)   this.myCurrentEntity = p;// newdata[0];
                     ct ++;
                    return p
                  
                    //lodash.assignIn({ 'link': 'www.gtz' }, key);  
                }
                //return new Person(key);
                //newdata return key;
            });
            
            this.myCollection = this.newdata;//data;
            this.collectionLength = this.myCollection.length;
            this.myCollection1 = this.newdata;
            this.collectionLength1 = this.myCollection1.length;
            
        });

    }

    popup() {
        $('#modal1').openModal();
    }


    popup2() {
        this.myCollection2 = [
            { index: 1, name: 'john', country: 'usa', email: 'jj@g.com', color: 'red' },
            { index: 2, name: 'tom', country: 'usa', email: 'jj@g.com', color: 'green' },
            { index: 3, name: 'dick', country: 'usa', email: 'jj@g.com', color: 'blue' },
            { index: 4, name: 'harry', country: 'usa', email: 'jj@g.com', color: 'black' },
            { index: 5, name: 'bob', country: 'usa', email: 'jj@g.com', color: 'white' },
        ];
        this.collectionLength2 = this.myCollection2.length;

        this.myCurrentEntity2 = {};
        $('#modal2').openModal();
    }
  
    //http://tutaurelia.net/2016/01/10/export-data-to-excel-from-an-aurelia-web-application/
    exportContactsnofilter() {
        this.ctr = 1;
        this.csvContent = "name, country, email ,color\n";
        this.myCollection.forEach(contact => {
            this.ctr++;
            this.csvContent = this.csvContent + '"' + contact.name + '","' + contact.country + '","' + contact.email + '","' + contact.color + '"\n';
        });

        this.csvContent = this.csvContent + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";
        //this.ctr = 1;
        this.export(this.csvContent);
    }
     exportContacts() {
        this.ctr = 1;
        this.csvContent = "name, country, email ,color\n";
        // let ds = this.myGrid.ctx.getGridRows() ;
        //let ds = this.myGrid.ctx.getGridRows() ;
        let row = {};
        let ds = this.myCollection.ctx.getGridRows();
        //this.myCollection.forEach(contact => {
        ds.forEach(contact => {
            this.ctr++;
            row = this.myCollection[contact];
            //  this.csvContent =row + '"'+row + '","' + row+ '","' + row + '","' +row+ '"\n';
            this.csvContent = this.csvContent + '"' + row.name + '","' + row.country + '","' + row.email + '","' + row.color + '"\n';

            // this.csvContent = this.csvContent + '"'+contact.name + '","' + contact.country + '","' + contact.email + '","' + contact.color + '"\n';
        });

        this.csvContent = this.csvContent + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";
        //this.ctr = 1;
        this.export(this.csvContent);
    
    }
    exportContacts2() {
        this.ctr = 1;
        this.csvContent = "name, country, email ,color\n";
        this.myCollection2.forEach(contact => {
            this.ctr++;
            this.csvContent = this.csvContent + '"' + contact.name + '","' + contact.country + '","' + contact.email + '","' + contact.color + '"\n';
        });

        this.csvContent = this.csvContent + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";
        //this.ctr = 1;
        this.export(this.csvContent);
    }
    export(text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', 'contacts.csv');
        pom.style.display = 'none';
        document.body.appendChild(pom);
        pom.click();
        document.body.removeChild(pom);
    }

}



// import {dummyDataGenerator} from './dummyDataGenerator';
// export class Vgridtest {
 
//     constructor(router) {
//     this.message = "Hello About Us!";
//     this.heading2 = '';
 
//     this.isLoading = false;
// // dummyDataGenerator.prototype.generateData(100,myCollection);
//   }
//   myCollection = [
//       {index:1,name:'john',country:'usa',email:'jj@g.com',color:'red'},
//    {index:2,name:'tom',country:'usa',email:'jj@g.com',color:'green'},
//    {index:3,name:'dick',country:'usa',email:'jj@g.com',color:'blue'},
//     {index:4,name:'harry',country:'usa',email:'jj@g.com',color:'black'},
//       {index:5,name:'bob',country:'usa',email:'jj@g.com',color:'white'},
//   ];
//   myCurrentEntity = {};

// }
// import {dummyDataGenerator} from './dummyDataGenerator';

 