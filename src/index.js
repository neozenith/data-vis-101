'use strict';

// d3: 517.34 KB (99.2%)
// <self>: 3.99 KB (0.765%)
// build:prod:: 245kb
// const d3 = require('d3');
//
// d3-scale: 115.82 KB (73.7%)
// d3-selection: 28.17 KB (17.9%)
// d3-axis: 5.21 KB (3.32%)
// d3-dsv: 4.02 KB (2.56%)
// TOTAL: 153.22kb
// <self>: 3.82 KB (2.43%)
//
// build:prod:: 64.4kb
const d3 = Object.assign(
	{},
	require('d3-selection'),
	require('d3-scale'),
	require('d3-axis'),
	require('d3-dsv')
);

const margin = { top: 50, right: 50, bottom: 50, left: 50 },
	width = 960,
	height = 500;

const chartArea = {
	x: margin.left,
	y: margin.top,
	width: width - margin.left - margin.right,
	height: height - margin.top - margin.bottom
};

function parseRow(data) {
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
}
function renderGraph(data) {
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

		// Update SVG element with latest axes object since referenced scales changed
		svgAxes[i].call(axes[i]);
	}

	// TODO: refactor multiple series
	// Series 1
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

	// Series 2
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
}

// --------------- SCALES ---------------
// Define a linear scale for output geometry
const scales = [];
// Output pixel range of the chartArea <g> grouping. The <g> will be translated by the margin offset
const xRange = [0, chartArea.width];
// Y-Range starts lower down screen then progresses up towards zero for larger domain values
const yRange = [chartArea.height, 0];
scales.push(d3.scaleLinear().range(xRange));

scales.push(d3.scaleLinear().range(yRange));
scales.push(d3.scaleLinear().range(yRange));

// --------------- CHART  ---------------
const svg = d3
	.select('#chart')
	.append('svg')
	.attr('viewBox', '0 0 ' + width + ' ' + height);

const svgChartArea = svg
	.append('g')
	.attr('id', 'chartArea')
	.attr('transform', 'translate(' + chartArea.x + ',' + chartArea.y + ')');

// Axes constructor objects
const axes = [];
axes.push(d3.axisBottom(scales[0]));
axes.push(d3.axisLeft(scales[1]));
axes.push(d3.axisRight(scales[2]));

// --------------- AXES  ---------------
// SVG Selection for Axes
// TODO: Format axes with titles, dates, currency
const svgAxes = [];
svgAxes.push(
	svg
		.append('g')
		.call(axes[0])
		.attr('transform', `translate(${chartArea.x}, ${chartArea.height + chartArea.y})`)
);
svgAxes.push(
	svg
		.append('g')
		.call(axes[1])
		.attr('transform', `translate(${chartArea.x}, ${chartArea.y})`)
);
svgAxes.push(
	svg
		.append('g')
		.call(axes[2])
		.attr('transform', `translate(${chartArea.width + chartArea.x}, ${chartArea.y})`)
);

// --------------- DATA  ---------------
// Load data, parse it, render it
d3.csv('data/fuel.csv', parseRow).then(renderGraph);
