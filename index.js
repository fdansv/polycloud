#!/usr/bin/env node

var geolib = require("geolib");
var fs = require('fs');

function Polycloud(){

};

Polycloud.prototype = {	
	pointToStupidFormat: function(point){
		return {latitude: point.coordinates[1], longitude: point.coordinates[0]};
	},
	polygonToStupidFormat: function(polygon){
		var polArray = [];
		for (var i = 0; i < polygon.coordinates[0].length; i++){
			polArray.push({latitude: polygon.coordinates[0][i][1], longitude: polygon.coordinates[0][i][0]})
		}
		return polArray;
	},
	pointInPolygon: function(point, polygon){
		return geolib.isPointInside(point, polygon);
	},
	getGroupedCoordinates: function(polygon){
		var group = {lats:[], lons:[]};
		for (var i = 0; i < polygon.length; i++){
			group.lats.push(polygon[i].latitude);
			group.lons.push(polygon[i].longitude);
		}
		return group;
	},
	getBoundingBox: function(polygon){
		var grouped = this.getGroupedCoordinates(polygon);
		var N = Math.max.apply(null, grouped.lats);
		var S = Math.min.apply(null, grouped.lats);
		var E = Math.max.apply(null, grouped.lons);
		var W = Math.min.apply(null, grouped.lons);
		return {"N": N, "S": S, "E": E, "W": W};
	},
	backToSaneFormat: function(pointCloud){
		var geoJSON = {
		  "type": "FeatureCollection",
		  "features": []
		};
		for (var i = 0; i < pointCloud.length; i++){
			var geoPoint = {
		      "type": "Feature",
		      "properties": {},
		      "geometry": {
		        "type": "Point",
		        "coordinates": [
		          pointCloud[i].longitude,
		          pointCloud[i].latitude
		        ]
		      }
		    };
		    geoJSON.features.push(geoPoint);
		}
		return geoJSON;
	},
	saveToFile: function(geojson, _path){
		var path = _path || "out/polygon.json";
		fs.writeFile(path, JSON.stringify(geojson), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        console.log("File saved at " + path);
		    }
		}); 
	},
	genPointCloud: function(_polygon, granularity){
		var polygon = [];
		if (_polygon.type === "MultiPolygon"){
			for (var i = 0; i < _polygon.coordinates.length; i++){
				polygon.push(this.polygonToStupidFormat({coordinates: _polygon.coordinates[i]}));
			}
		}
		else{
			polygon = [this.polygonToStupidFormat(_polygon)];
		}
		var pointCloud = [];
		for (var i = 0; i < polygon.length; i++){
			var boundingBox = this.getBoundingBox(polygon[i]);
			var latIncrement = (Math.abs(boundingBox.S - boundingBox.N)) / granularity;
			var lonIncrement = (Math.abs(boundingBox.W - boundingBox.E)) / granularity;
			var latPointer = boundingBox.N;
			while (latPointer >= boundingBox.S){
				var lonPointer = boundingBox.W;
				while(lonPointer < boundingBox.E){
					var pointInStupidFormat = {latitude: latPointer, longitude: lonPointer};
					if(this.pointInPolygon(pointInStupidFormat, polygon[i])){
						pointCloud.push(pointInStupidFormat);
					}
					lonPointer += lonIncrement;
				}
				latPointer -= latIncrement;
			}
		}
		return this.backToSaneFormat(pointCloud)
	}
}

module.exports = Polycloud;

