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
const xScale = d3.scaleLinear().range([chartArea.x, chartArea.width + chartArea.x]);

// Y-Range starts lower down screen then progresses up towards zero for larger domain values
const yScale = d3.scaleLinear().range([chartArea.height + chartArea.y, chartArea.y]);

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

		xScale.domain([
			d3.min(data, d => {
				return d[keys[0]];
			}),
			d3.max(data, d => {
				return d[keys[0]];
			})
		]);

		yScale.domain([
			d3.min(data, d => {
				return d[keys[1]];
			}),
			d3.max(data, d => {
				return d[keys[1]];
			})
		]);
		console.log(svg);
		svgChartArea
			.selectAll('circle')
			.data(data, function(d) {
				return d[keys[0]];
			})
			.enter()
			.append('circle')
			.attr('r', 3)
			.attr('fill', '#df8787')
			.attr('cx', function(d) {
				return xScale(d[keys[0]]);
			})
			.attr('cy', function(d) {
				return yScale(d[keys[1]]);
			})
			.attr('data-x', function(d) {
				return d[keys[0]];
			})
			.attr('data-y', function(d) {
				return d[keys[1]];
			});
	});
