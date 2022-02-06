import React, { useRef, useEffect } from 'react';
import { select, extent, scaleLinear, scaleOrdinal, axisBottom, axisLeft, line, curveNatural, max } from 'd3';

const Linechart = ({data, useResizeObserver, dimensions, casesYAttribute, getLabel, allGroups, allColors}) => {

  const svgRef = useRef(null);

  const wrapperRef = useRef();
  const newDimensions = useResizeObserver(wrapperRef);

  const { height, margin } = dimensions;
  
  useEffect(() => {
    
    if (!newDimensions) return;
    
    const svgWidth = newDimensions.width - margin.right - margin.left;
    const svgHeight = height - margin.top - margin.bottom;

    const casesXValue = d => d.id;
    const casesYValue = d => d[`${casesYAttribute}`]; 

    const casesXScale = scaleLinear()
      .domain(extent(data, casesXValue))
      .range([0, svgWidth])
      
    const casesYScale = scaleLinear()
      .domain([0, max(data, casesYValue)])
      // .domain(extent(data, casesYValue))
      .range([svgHeight, 0])

    let myGroups;
    let myColors;

    if (casesYAttribute === 'gesamt') {
      myGroups = allGroups.slice(1);
      myColors = ['#003f97'];
    } else {
      myGroups = [`${casesYAttribute}`];
      myColors = [allColors[allGroups.indexOf(casesYAttribute)]]
    }      

    // color palette
    const colors = scaleOrdinal()
      .domain(myGroups)
      .range(myColors)

    const yAxisLabel = getLabel(casesYAttribute)
      
    const svgEl = select(svgRef.current);

    // clear svg before adding new elements
    svgEl.selectAll('*').remove();

    // define inner canvas
    const svg = svgEl.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)

    // add x-axis
    const xAxis = axisBottom(casesXScale)
      .ticks(10)
      .tickFormat(value => {
        const cwValue = data[value-1].kw.toString();
        const splittedString = cwValue.split('.');
        const year = parseInt(splittedString[0]);
        const calendarWeek = parseInt(splittedString[1]);
        const niceDate = `KW ${calendarWeek}/${year}`;
        return niceDate;
      })
      .tickSize(-height + margin.bottom + margin.top)
      .tickPadding(10)
    
    const xAxisGroup = svg
      .append('g')
      .attr("class", "chart-x-axis")
      .attr('transform', `translate(0, ${height - margin.bottom - margin.top})`)
      .call(xAxis)
      
    xAxisGroup
      .select('.domain')
      .remove()
      
    xAxisGroup
      .selectAll('line')
      .attr('stroke', '#d3d3d3')

    xAxisGroup
      .selectAll('text')
      .attr('opacity', 0.5)
      .attr('color', '#222222')
      .attr('font-size', '0.75rem')

    // x-axis label
    svg
      .append("text")             
      .attr("transform",`translate(${newDimensions.width / 2}, ${height - margin.bottom})`)
      .style("text-anchor", "end")
      .text("Kalenderwoche des Jahres")
      .style("font-size", '1.1rem')
      .style("color", '#222222')

    // add y-axis
    const yAxis = axisLeft(casesYScale)
      .ticks(5)
      .tickSize(-newDimensions.width + margin.right + margin.left)
      .tickFormat(value => {
        const newValue = value === 0 ? 0 : `${value / 1000} T`;
        return newValue
      })
    
    const yAxisGroup = svg
      .append('g')
      .call(yAxis)
    
    yAxisGroup
      .select('.domain')
      .remove()

    yAxisGroup
      .selectAll('line')
      .attr('stroke', '#d3d3d3')
  
    yAxisGroup
      .selectAll('text')
      .attr('opacity', 0.5)
      .attr('color', '#222222')
      .attr('font-size', '0.75rem')

    // y-axis label
    svg
      .append("text")
      .attr("transform",`translate(${-margin.right},${((height) / 2 - margin.top)
         }) rotate(-90)`)
      .style("text-anchor", "middle")
      .text(`Corona-Fallzahlen: ${yAxisLabel}`)
      .style("font-size", '1.1rem')
      .style("color", '#222222')

    // add data line
    const chartLine = line()
      .x(d => casesXScale(casesXValue(d)))
      .y(d => casesYScale(casesYValue(d)))
      .curve(curveNatural)

    svg.selectAll('.line')
      .data(data)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d,i) => colors(d[i-1]))
      .attr('stroke-width', 3)
      .attr('d', d => chartLine(data))

  }, [data, casesYAttribute, newDimensions]);

  return (
    <div ref={wrapperRef} className="svg-container linechart">
      <svg ref={svgRef} height={height}></svg>
    </div>
  )
}

export default Linechart;