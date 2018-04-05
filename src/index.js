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

// TODO: Refactor this
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

createChart('data/fuel.csv', parseRow, renderGraph);
