// src/Plot.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Plot = ({ data }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous elements

    const width = 500;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Set up scales
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.x)]) // X domain
      .range([margin.left, width - margin.right]); // X range

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.y)]) // Y domain
      .range([height - margin.bottom, margin.top]); // Y range (inverted)

    // Add circles for each data point
    svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', 'steelblue');

    // Add X axis
    const xAxis = d3.axisBottom(xScale);
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    // Add Y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(yAxis);

    // Add X axis label
    svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height - margin.bottom + 25)
      .text(''); // Replace with your label

    // Add Y axis label
    svg.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${margin.left - 30}, ${height / 2}) rotate(-90)`)
      .text(''); // Replace with your label

  }, [data]);

  return <svg ref={svgRef} width={500} height={500}></svg>;
};

export default Plot;
