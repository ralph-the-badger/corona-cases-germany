import { useRef, useEffect } from "react";
import {
  extent,
  scaleLinear,
  scaleOrdinal,
  area,
  select,
  stack,
  axisBottom,
  axisLeft,
  pointer,
} from "d3";

const Percentages = ({
  data,
  useResizeObserver,
  dimensions,
  casesYAttribute,
  getLabel,
  allGroups,
  allColors,
}) => {
  const svgRef = useRef(null);

  const wrapperRef = useRef();
  const tooltip = useRef();
  const newDimensions = useResizeObserver(wrapperRef);

  const { height, margin } = dimensions;

  useEffect(() => {
    if (!newDimensions) return;

    const svgWidth = newDimensions.width - margin.right - margin.left;
    const svgHeight = height - margin.top - margin.bottom;

    // transfer data to percentages
    const percentages = data.map((obj) => {
      const object = {
        id: obj.id,
        kw: obj.kw,
        gesamt: (obj.gesamt * 100) / obj.gesamt,
        "90+": (obj["90+"] * 100) / obj.gesamt,
        "80_89": (obj["80_89"] * 100) / obj.gesamt,
        "70_79": (obj["70_79"] * 100) / obj.gesamt,
        "60_69": (obj["60_69"] * 100) / obj.gesamt,
        "50_59": (obj["50_59"] * 100) / obj.gesamt,
        "40_49": (obj["40_49"] * 100) / obj.gesamt,
        "30_39": (obj["30_39"] * 100) / obj.gesamt,
        "20_29": (obj["20_29"] * 100) / obj.gesamt,
        "10_19": (obj["10_19"] * 100) / obj.gesamt,
        "0_9": (obj["0_9"] * 100) / obj.gesamt,
      };
      return object;
    });
    percentages.columns = [
      "id",
      "kw",
      "gesamt",
      "90+",
      "80_89",
      "70_79",
      "60_69",
      "50_59",
      "40_49",
      "30_39",
      "20_29",
      "10_19",
      "0_9",
    ];

    let myGroups;
    let myColors;
    let casesYScale;
    if (casesYAttribute === "gesamt") {
      myGroups = allGroups.slice(1);
      myColors = allColors.slice(1);
      casesYScale = scaleLinear().domain([0, 100]).range([svgHeight, 0]);
    } else {
      myGroups = [`${casesYAttribute}`];
      myColors = [allColors[allGroups.indexOf(casesYAttribute)]];
      casesYScale = scaleLinear().domain([0, 50]).range([svgHeight, 0]);
    }

    const casesXValue = (d) => d.id;

    const casesXScale = scaleLinear()
      .domain(extent(data, casesXValue))
      .range([0, svgWidth]);

    // color palette
    const colors = scaleOrdinal().domain(myGroups).range(myColors);

    const svgEl = select(svgRef.current);

    // clear svg before adding new elements
    svgEl.selectAll("*").remove();

    // define inner canvas
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // add data as area plot
    const mySeries = stack()
      .keys(myGroups)
      .value((d, key) => {
        return d[key];
      })(percentages);

    svg
      .selectAll("mylayers")
      .data(mySeries)
      .join("path")
      .style("fill", (d, i) => colors(d[i - 1]))
      .attr(
        "d",
        area()
          .x((d) => casesXScale(d.data.id))
          .y0((d) => casesYScale(d[0]))
          .y1((d) => casesYScale(d[1]))
      )
      .on("mousemove", handlemousemove)
      .on("mouseout", handlemouseleave);

    // add x-axis
    const xAxis = axisBottom(casesXScale)
      .ticks(10)
      .tickFormat((value) => {
        const cwValue = data[value - 1].kw.toString();
        const splittedString = cwValue.split(".");
        const year = parseInt(splittedString[0]);
        const calendarWeek = parseInt(splittedString[1]);
        const niceDate = `KW ${calendarWeek}/${year}`;
        return niceDate;
      })
      .tickSize(-height + margin.bottom + margin.top)
      .tickPadding(10);

    const xAxisGroup = svg
      .append("g")
      .attr("class", "chart-x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom - margin.top})`)
      .call(xAxis);

    xAxisGroup.select(".domain").remove();

    xAxisGroup.selectAll("line").attr("stroke", "#d3d3d3");

    xAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "#222222")
      .attr("font-size", "0.75rem");

    // x-axis label
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${newDimensions.width / 2}, ${height - margin.bottom})`
      )
      .style("text-anchor", "end")
      .text("Kalenderwoche des Jahres")
      .style("font-size", "1.1rem")
      .style("color", "#222222");

    // add y-axis
    const yAxis = axisLeft(casesYScale)
      .ticks(5)
      .tickSize(-newDimensions.width + margin.right + margin.left)
      .tickFormat((value) => {
        const newValue = value === 0 ? 0 : `${value}%`;
        return newValue;
      });

    const yAxisGroup = svg.append("g").call(yAxis);

    yAxisGroup.select(".domain").remove();

    yAxisGroup.selectAll("line").attr("stroke", "#d3d3d3");

    yAxisGroup
      .selectAll("text")
      .attr("opacity", 0.5)
      .attr("color", "#222222")
      .attr("font-size", "0.75rem");

    // y-axis label
    svg
      .append("text")
      .attr(
        "transform",
        `translate(${-margin.right},${height / 2 - margin.top}) rotate(-90)`
      )
      .style("text-anchor", "middle")
      .text(`Relative Anteile: ${getLabel(casesYAttribute)}`)
      .style("font-size", "1.1rem")
      .style("color", "#222222");

    // tooltip
    const tooltipContainer = select(tooltip.current);
    tooltipContainer
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

    function handlemousemove(event, data) {
      // get age groups according to mouse position in stacked area chart
      const currentXPosition = pointer(event)[0];
      const currentYPosition = pointer(event)[1];
      const xValue = casesXScale.invert(currentXPosition);
      const kw = Math.floor(xValue);
      const d = data[kw];
      if (d) {
        const timestamp = d.data.kw.toString().split(".");
        const kw = timestamp[1];
        const year = timestamp[0];
        const d0 = d[0];
        const d1 = d[1];
        const dResult = d1 - d0;
        const agePercentage = dResult.toFixed(2);
        let ageGroup;
        for (const [key, value] of Object.entries(d.data)) {
          if (value.toFixed(2) === agePercentage) {
            ageGroup = key;
          }
        }
        const newString = ageGroup.split("_");
        let finalString;
        if (newString[0] === "90+") {
          finalString = `KW ${kw}/${year} - ${newString[0]} Jahre: ${agePercentage}%`;
        } else {
          finalString = `KW ${kw}/${year} - ${newString[0]}-${newString[1]} Jahre: ${agePercentage}%`;
        }
        tooltipContainer
          .select("#tooltip")
          .style("opacity", 1)
          .text(finalString);

        select("#tooltip")
          .style("left", currentXPosition + svgWidth / 100 + 35 + "px")
          .style("top", currentYPosition + 200 + svgHeight + "px");
      }
    }

    function handlemouseleave(event) {
      tooltipContainer.select("#tooltip").style("opacity", 0);
    }
  }, [data, casesYAttribute, newDimensions]);

  return (
    <div ref={wrapperRef} className="svg-container areachart">
      <div ref={tooltip}>
        <svg ref={svgRef} height={height}></svg>
      </div>
    </div>
  );
};

export default Percentages;
