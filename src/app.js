export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: 'users',         name: 'users',        moduleId: 'users',        nav: true, title: 'Github Users' },
      { route: 'child-router',  name: 'child-router', moduleId: 'child-router', nav: true, title: 'Child Router' },
       {
          route: [ 'vgridtest'],
          moduleId: 'vgridtest/index',
          nav: true,
          title: 'vGrid'
        },
     
        
     {
          route: [ 'properties'],
          moduleId: 'properties/properties-section',
          nav: true,
          title: 'Properties',
          auth: true 
        },
    ]);

    this.router = router;
  }
}
