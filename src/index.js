'use strict';

console.log('index.js');
const d3 = require('d3');

const margin = { top: 20, right: 30, bottom: 50, left: 40 },
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

const svg = d3
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
