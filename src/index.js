'use strict';

console.log('index.js');
const d3 = require('d3');

const margin = { top: 20, right: 30, bottom: 50, left: 40 },
	width = 960,
	height = 500;

const chartArea = {
	x: margin.left,
	y: margin.top,
	width: width - margin.left - margin.right,
	height: height - margin.top - margin.bottom
};

// Define a linear scale for output geometry
const scales = [];
scales.push(d3.scaleLinear().range([chartArea.x, chartArea.width + chartArea.x]));

// Y-Range starts lower down screen then progresses up towards zero for larger domain values
scales.push(d3.scaleLinear().range([chartArea.height + chartArea.y, chartArea.y]));
scales.push(d3.scaleLinear().range([chartArea.height + chartArea.y, chartArea.y]));

const svg = d3
	.select('#chart')
	.append('svg')
	.attr('viewBox', '0 0 ' + width + ' ' + height);
const svgChartArea = svg
	.append('g')
	.attr('id', 'chartArea')
	.attr('transform', 'translate(' + chartArea.x + ',' + chartArea.y + ')');

d3
	.csv('data/fuel.csv', function(data) {
		const row = {};

		for (const k in data) {
			switch (k) {
				// FLOATS
				case 'Litres':
				case 'Odometer':
				case 'Days between refuel':
				case 'Distance (K)':
				case '':
					row[k] = parseFloat(data[k]);
					break;
				// CURRENCY
				case 'Cost ($)':
					// Strip out dollar sign and potential thousand separators
					row[k] = Number(data[k].replace(/[$,]/g, ''));
					break;
				// DATES
				case 'Date':
					row[k] = new Date(data[k]).getTime();
					break;
				// STRING - default
				default:
					row[k] = data[k];
					break;
			}
		}

		return row;
	})
	.then(function(data) {
		const keys = ['Date', 'Cost ($)', 'Litres', 'Distance'];
		console.log('postParse');
		console.log(data);

		for (let i = 0; i < 3; i++) {
			scales[i].domain([
				d3.min(data, d => {
					return d[keys[i]];
				}),
				d3.max(data, d => {
					return d[keys[i]];
				})
			]);
		}

		svgChartArea
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('r', 3)
			.attr('fill', '#df8787')
			.attr('cx', function(d) {
				return scales[0](d[keys[0]]);
			})
			.attr('cy', function(d) {
				return scales[1](d[keys[1]]);
			})
			.attr('data-x', function(d) {
				return d[keys[0]];
			})
			.attr('data-y', function(d) {
				return d[keys[1]];
			});

		svgChartArea
			.selectAll('rect')
			.data(data)
			.enter()
			.append('rect')
			.attr('width', 6)
			.attr('height', 6)
			.attr('fill', '#8787df')
			.attr('x', function(d) {
				return scales[0](d[keys[0]]) - 3;
			})
			.attr('y', function(d) {
				return scales[2](d[keys[2]]) - 3;
			})
			.attr('data-x', function(d) {
				return d[keys[0]];
			})
			.attr('data-y', function(d) {
				return d[keys[2]];
			});
	});
