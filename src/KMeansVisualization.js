import React, { useEffect } from 'react';
import * as d3 from 'd3';

const KMeansVisualization = ({ dataset, centroids, clusters, onPointClick, handleSvgClick }) => {
  const svgWidth = 600;
  const svgHeight = 400;
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const draw = () => {
    const svg = d3.select('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    svg.selectAll('*').remove(); // Clear previous elements

    // Create a group element and apply margins
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales based on the dataset
    const xScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.x) - 10, d3.max(dataset, d => d.x) + 10])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(dataset, d => d.y) - 10, d3.max(dataset, d => d.y) + 10])
      .range([height, 0]);

    // Draw data points
    g.selectAll('circle.data-point')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', (d, i) => {
        const clusterIndex = clusters[i];
        return clusterIndex === undefined ? 'black' : d3.schemeCategory10[clusterIndex % 10];
      })
      .on('click', (event, d) => onPointClick(d)); // Use the passed handler

    // Draw centroids as X shapes
    const size = 8; // Half of the line length for the X
    g.selectAll('g.centroid')
      .data(centroids)
      .enter()
      .append('g')
      .attr('class', 'centroid')
      .each(function(d) {
        d3.select(this)
          .append('line')
          .attr('x1', xScale(d.x) - size)
          .attr('y1', yScale(d.y) - size)
          .attr('x2', xScale(d.x) + size)
          .attr('y2', yScale(d.y) + size)
          .attr('stroke', 'black')
          .attr('stroke-width', 2);

        d3.select(this)
          .append('line')
          .attr('x1', xScale(d.x) - size)
          .attr('y1', yScale(d.y) + size)
          .attr('x2', xScale(d.x) + size)
          .attr('y2', yScale(d.y) - size)
          .attr('stroke', 'black')
          .attr('stroke-width', 2);
      });

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append the x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`) // Move the x-axis to the bottom
      .call(xAxis)
      .append('text')
      .attr('fill', 'black')
      .attr('x', width / 2)
      .attr('y', 35) // Position the text below the x-axis
      .attr('text-anchor', 'middle')
      .text('X Axis');

    // Append the y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .append('text')
      .attr('fill', 'black')
      .attr('transform', 'rotate(-90)') // Rotate the text for the y-axis
      .attr('x', -height / 2)
      .attr('y', -35) // Position the text to the left of the y-axis
      .attr('text-anchor', 'middle')
      .text('Y Axis');
  };

  useEffect(() => {
    draw(); // Call draw whenever dataset, centroids, or clusters change
  }, [dataset, centroids, clusters]);

  return (
    <svg onClick={handleSvgClick}>
      {/* D3 visualization will be rendered here */}
    </svg>
  );
};

export default KMeansVisualization;
