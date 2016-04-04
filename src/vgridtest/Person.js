export class Person {  
  constructor(data){
    Object.assign(this, data);
   this.link = 'www.gtz.com/'+data.name;
  //  this.link ='  <a target="_blank" class="btn btn-default" href.bind="www.gtz.com">Contact</a>';
  ///  console.log(  this.link)
   // this.creditScore = 500;
  }
  
}