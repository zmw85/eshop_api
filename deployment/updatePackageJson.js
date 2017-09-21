const pio = require('package-json-io');
const moment = require('moment');

const stage = process.argv[0];

if (stage) {
  // read and parse the package.json file in current directory 
  pio.read(function (err, data) {
    
    data.lastDeployed = moment().toLocaleString();
    
    switch(stage.trim().toLowerCase()){
      case "development":
        data.lambdaAliasDevelopVersion = data.lambdaAliasDevelopVersion = (data.lambdaAliasDevelopVersion || 0) + 1;
        break;
      case "production":
        data.lambdaAliasProductionVersion = data.lambdaAliasProductionVersion = (data.lambdaAliasProductionVersion || 0) + 1;
        break;
    }

    // update the package.json file in the current directory with a new license 
    pio.update(data, function (err) {
      if (err) throw err
    })
  });
}