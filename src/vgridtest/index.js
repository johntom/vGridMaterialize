/* 
notes
config="current-entity.bind:myCurrentEntity; collection.bind:myCollection;grid-context.bind:grid1">
config="current-entity.bind:myCurrentEntity2; collection.bind:myCollection2;grid-context.bind:grid2">

index.js under conllection add the grid1 & 2

myCollection = [];
 myCurrentEntity = {};
 myCollection2 = [];
 myCurrentEntity2 = {};
 gridData=[];
 grid1 = {};
 grid2 ={};


in the call to pupup force the grid to redraw by calling the redraw function
popup () {
         $('#modal1').openModal();
         this.grid1.ctx.redrawGrid();
   }

*/
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
    grid1 = {};
    grid2 = {};
    grid3 = {};
 
    
    
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
            let ct = 0;
            lodash.forEach(data, (key, value) => {
                if (typeof key === 'object') {
                    //    return new Person(key);
                    let p = new Person(key);
                    this.newdata.push(p);
                    if (ct === 0) this.myCurrentEntity = p;
                    ct++;
                    return p
                    //lodash.assignIn({ 'link': 'www.gtz' }, key);  
                }
                //return new Person(key);
                //newdata return key;
            });

            // grid1
            this.myCollection = this.newdata;//data;
            this.collectionLength = this.myCollection.length;
            // grid2 (modal1)
            this.myCollection1 = this.newdata;
            this.collectionLength1 = this.myCollection1.length;
            // grid3 (modal2)
            this.myCollection2 = this.newdata;
            this.collectionLength2 = this.myCollection2.length;
        });

    }

    popup() {
        $('#modal1').openModal();
        this.grid2.ctx.redrawGrid();
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
        this.grid3.ctx.redrawGrid();
    }
  
    //http://tutaurelia.net/2016/01/10/export-data-to-excel-from-an-aurelia-web-application/
    // exportContactsnofilter() {
    //     this.ctr = 1;
    //     this.csvContent = "name, country, email ,color\n";
    //     this.myCollection.forEach(contact => {
    //         this.ctr++;
    //         this.csvContent = this.csvContent + '"' + contact.name + '","' + contact.country + '","' + contact.email + '","' + contact.color + '"\n';
    //     });

    //     this.csvContent = this.csvContent + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";
    //     //this.ctr = 1;
    //     this.export(this.csvContent);
    // }
    exportContacts() {
        this.ctr = 1;
        this.csvContent = "name, country, email ,color\n";
        let row = {};
        let ds = this.grid2.ctx.getGridRows(); //this.myCollection1.ctx.getGridRows();
        ds.forEach(contact => {
            this.ctr++;
            row = this.myCollection1[contact];
            this.csvContent = this.csvContent + '"' + row.name + '","' + row.country + '","' + row.email + '","' + row.color + '"\n';
        });
        this.csvContent = this.csvContent + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";
        this.export(this.csvContent);

    }
    exportContacts2() {
        this.ctr = 1;
        this.csvContent = "name, country, email ,color\n";
        let row = {};
        let ds = this.grid3.ctx.getGridRows();

        ds.forEach(contact => {
            this.ctr++;
            row = this.myCollection2[contact];
            this.csvContent = this.csvContent + '"' + row.name + '","' + row.country + '","' + row.email + '","' + row.color + '"\n';

        });
        this.csvContent = this.csvContent2 + "COUNT,=ROWS(A2:A" + this.ctr + ") \n";

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

 