var geolib = require("geolib");

var testPoly = {
        "type": "LineString",
        "coordinates": [
          [
            -6.416015625,
            46.98025235521883
          ],
          [
            -18.017578125,
            51.83577752045248
          ],
          [
            -19.072265625,
            58.12431960569377
          ],
          [
            -10.37109375,
            61.52269494598358
          ],
          [
            3.1640625,
            62.552856958572896
          ],
          [
            8.349609375,
            56.511017504952136
          ],
          [
            5.009765625,
            50.0077390146369
          ]
        ]
      };
var testPoint = {
        "type": "Point",
        "coordinates": [
          -4.130859375,
          55.87531083569679
        ]
      };

var pointFalse = {
        "type": "Point",
        "coordinates": [
          12.568359375,
          57.61010702068388
        ]
      };
var pointToStupidFormat = function(point){
	return {latitude: point.coordinates[1], longitude: point.coordinates[0]};
}

var polygonToStupidFormat = function(polygon){
	var polArray = [];
	for (var i = 0; i < polygon.coordinates.length; i++){
		polArray.push({latitude: polygon.coordinates[i][1], longitude: polygon.coordinates[i][0]})
	}
	return polArray;
}

var pointInPolygon = function(point, polygon){
	var point = pointToStupidFormat(point);
	var polygon = polygonToStupidFormat(polygon);
	console.log(getBoundingBox(polygon));
	return geolib.isPointInside(point, polygon);
}

var getGroupedCoordinates = function(polygon){
	var group = {lats:[], lons:[]};
	for (var i = 0; i < polygon.length; i++){
		group.lats.push(polygon[i].latitude);
		group.lons.push(polygon[i].longitude);
	}
	return group;
}

var getBoundingBox = function(polygon){
	var grouped = getGroupedCoordinates(polygon);
	var N = Math.max.apply(null, grouped.lats);
	var S = Math.min.apply(null, grouped.lats);
	var E = Math.max.apply(null, grouped.lons);
	var W = Math.min.apply(null, grouped.lons);
	return {"N": N, "S": S, "E": E, "W": W};
}

var genPointCloud = function(polygon, granularity){
	var polygon = polygonInStupidFormat(polygon);
	var boundingBox = getBoundingBox(polygon);
	var latPointer = boundingBox.N;
	var lonPointer = boundingBox.W;
	var pointCloud = [];
	while (latPointer >= boundingBox.S){
		while(lonPointer < boundingBox.E){
			if(isPointInside({latitude: latPointer, longitude: lonPointer}, polygon)){

			}
		}
	}
}
pointInPolygon(pointFalse, testPoly);