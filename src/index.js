'use strict';

// d3: 517.34 KB (99.2%)
// <self>: 3.99 KB (0.765%)
// build:prod:: 245kb
// const d3 = require('d3');
//
//
// d3-scale: 101.02 KB (63.2%)
// d3-selection: 28.17 KB (17.6%)
// d3-array: 14.8 KB (9.25%)
// d3-axis: 5.21 KB (3.26%)
// d3-dsv: 4.02 KB (2.51%)
// d3-fetch: 2.55 KB (1.59%)
// <self>: 4.19 KB (2.62%)
// TOTAL: 170.57kb
// <self>: 3.82 KB (2.43%)
//
// build:prod:: 71kb

const d3 = Object.assign(
	{},
	require('d3-selection'),
	require('d3-scale'),
	require('d3-axis'),
	require('d3-format'),
	require('d3-time-format'),
	require('d3-dsv'),
	require('d3-array'),
	require('d3-fetch')
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

// --------------- SCALES ---------------
// Define a linear scale for output geometry
const scales = [];
// Output pixel range of the chartArea <g> grouping. The <g> will be translated by the margin offset
const xRange = [0, chartArea.width];
// Y-Range starts lower down screen then progresses up towards zero for larger domain values
const yRange = [chartArea.height, 0];
scales.push(d3.scaleTime().range(xRange));
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
// TODO: Label axes
const axes = [];
axes.push(d3.axisBottom(scales[0]).tickFormat(d3.timeFormat("%b'%y")));
axes.push(d3.axisLeft(scales[1]).tickFormat(d3.format('$0.2f')));

// --------------- AXES  ---------------
// SVG Selection for Axes
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

// --------------- DATA  ---------------
// Load data, parse it, render it

/**
 * asynccreateChart() render chart and parse data
 *
 * @param {String} csvFile - path to source csv data file
 * @param {Function} rowParser - function for parsing each row of csv data
 * @param {Function} graphBuilder - function used to draw graph after dataset loaded
 *
 * @return {void} Return nothing
 */
async function createChart(csvFile, rowParser, graphBuilder) {
	const dataset = await d3.csv(csvFile, parseRow).catch(err => console.log(err));
	graphBuilder(dataset);
}

/**
 * parseRow() Parsing callback function for coercing data types from CSV
 *
 * @param {Object} data - raw parsed data object from D3 where all fields are strings
 *
 * @return {Object} fields rewritten with correctly coerced data types
 */
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

/**
 * renderGraph() Callback function to operate on returned dataset from D3 and update elements
 *
 * @param {Array} data - Array of Objects parsed from CSV
 *
 * @return {void}
 */
function renderGraph(data) {
	const keys = ['Date', 'Cost ($)', 'Litres', 'Distance'];
	console.log('postParse');
	console.log(data);

	for (let i = 0; i < scales.length; i++) {
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
		.attr('stroke', '#8787df')
		.attr('fill', 'none')
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
}

createChart('data/fuel.csv', parseRow, renderGraph);
