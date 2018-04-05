'use strict';

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
axes.push(
	d3
		.axisRight(scales[2])
		.tickFormat(d3.format('0.1f'))
		.tickPadding(margin.right * 0.5)
);

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
svgAxes.push(
	svg
		.append('g')
		.call(axes[2])
		.attr('transform', `translate(${chartArea.width + chartArea.x}, ${chartArea.y})`)
);

// --------------- DATA  ---------------
// Load data, parse it, render it
async function createChart(csvFile, rowParser, graphBuilder) {
	const dataset = await d3.csv(csvFile, parseRow);
	graphBuilder(dataset);
}
