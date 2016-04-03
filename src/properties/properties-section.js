
export class PropertiesSection {
  configureRouter(config, router) {
    config.map([
      { route: '',    moduleId: './property-list', nav: false, title: '' },
       { route: 'tenant', moduleId: './tenant',      nav: false, title: '' }
  
      //{ route: ':id', moduleId: './property',      nav: false, title: '' }
    ]);
  }
}
