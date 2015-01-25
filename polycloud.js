var commander = require("commander");
var polycloud = require("./");

commander.command('cloud [filename] [outfilename]')
  .description('Converts a GeoJSON polygon to a point cloud')
  .action(function(filename, outfilename){
  	var pc = new polycloud();
  	var outfilename = outfilename || "out/polygon.json"
  	var JSONfile = require("./" + filename);
  	var geoJSON = pc.genPointCloud(JSONfile, 20);
  	pc.saveToFile(geoJSON, outfilename);
});

commander.parse(process.argv);