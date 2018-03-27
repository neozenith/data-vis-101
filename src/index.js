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

const yScale = d3.scaleLinear().range([chartArea.height + chartArea.y, chartArea.y]);

const svg = d3
	.select('#chart')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.append('g')
	.attr('id', 'chartArea')
	.attr('transform', 'translate(' + chartArea.x + ',' + chartArea.y + ')');
const svgChartArea = svg.select('#chartArea');
// .select('circle')
// .data(data)
// .enter()
// .append('circle')
// .attr('r', 3),
// .attr('cx', xScale(x))
// .attr('cy', yScale(y));

d3
	.csv('data/fuel.csv', function(data) {
		const row = {};

		console.log(data.keys);
		for (const k in data) {
			console.log(k, data[k]);
			switch (k) {
				case 'Litres':
				case 'Odometer':
				case 'Days between refuel':
				case 'Distance (K)':
				case '':
					row[k] = parseFloat(data[k]);
					break;
				case 'Cost ($)':
					// Strip out dollar sign and potential thousand separators
					row[k] = Number(data[k].replace(/[$,]/g, ''));
					break;
				case 'Date':
					row[k] = new Date(data[k]).getTime();
					break;
				default:
					row[k] = data[k];
					break;
			}
		}

		return row;
	})
	.then(function(data) {
		console.log('postParse');
		console.log(data);

		xScale.domain([
			d3.min(data, d => {
				return d.Date;
			}),
			d3.max(data, d => {
				return d.Date;
			})
		]);

		yScale.domain([
			d3.min(data, d => {
				return d.Litres;
			}),
			d3.max(data, d => {
				return d.Litres;
			})
		]);
	});
