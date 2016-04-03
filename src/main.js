// import 'bootstrap';
import "jquery";
// import $ from "jquery";
import "Dogfalo/materialize";
import config from './authConfig';
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    
    
    .plugin('aurelia-animator-css')
    .plugin('aurelia-auth', (baseConfig)=>{
         baseConfig.configure(config);
    })
    
    .developmentLogging();

  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  aurelia.start().then(a => a.setRoot());
}
