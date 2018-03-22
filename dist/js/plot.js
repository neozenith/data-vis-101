'use strict';

console.log('BULLSHIT');

var margin = { top: 20, right: 30, bottom: 50, left: 40 },
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// Define a linear scale for output geometry

// append the svg object to the body of the page
var svg = d3
	.select('#chart')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.csv('data/fuel.csv', function(error, data) {
	if (error) console.error(error);
	console.log(data);
});

function type(d) {
	d.value = +d.value; // coerce to number
	return d;
}
