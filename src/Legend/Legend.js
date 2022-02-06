import { useRef, useEffect } from "react";
import { select } from "d3";

const Legend = ({ useResizeObserver, dimensions, allGroups, allColors }) => {
  const svgRef = useRef(null);

  const wrapperRef = useRef();
  const newDimensions = useResizeObserver(wrapperRef);

  const { width, margin } = dimensions;

  const ageGroups = allGroups.slice(1);
  const ageColors = allColors.slice(1);

  useEffect(() => {
    const svgEl = select(svgRef.current);

    if (!newDimensions) return;

    // clear svg before adding new elements
    svgEl.selectAll("*").remove();

    // define inner canvas
    const svg = svgEl
      .append("g")
      .attr("class", "legend-container")
      .attr("transform", `translate(${margin.left}, ${margin.top - 20})`);

    if (newDimensions.width > 1350) {
      svg
        .selectAll("myColors")
        .data(ageGroups)
        .join("g")
        .attr("class", "legend-group-container")
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", (d, i) => i * 130)
        .attr("y", 10)
        .style("fill", (d, i) => ageColors[i]);

      svg
        .selectAll("myLegendTexts")
        .data(ageGroups)
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 130 + 20)
        .attr("y", 20)
        .text((d) => {
          if (d === "90+") {
            return `${d} Jahre`;
          } else {
            const newString = d.split("_");
            return `${newString[0]}-${newString[1]} Jahre`;
          }
        });
    } else {
      svg
        .selectAll("myColors")
        .data(ageGroups)
        .join("g")
        .attr("class", "legend-group-container")
        .append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("x", (d, i) => {
          if (i === 0 || i === 1 || i === 2 || i === 3 || i === 4) {
            return 20;
          } else {
            return 300;
          }
        })
        .attr("y", (d, i) => {
          if (i === 0 || i === 5) {
            return 30;
          } else if (i === 1 || i === 6) {
            return 60;
          } else if (i === 2 || i === 7) {
            return 90;
          } else if (i === 3 || i === 8) {
            return 120;
          } else if (i === 4 || i === 9) {
            return 150;
          }
        })
        .style("fill", (d, i) => ageColors[i]);

      svg
        .selectAll("myLegendTexts")
        .data(ageGroups)
        .enter()
        .append("text")
        .attr("x", (d, i) => {
          if (i === 0 || i === 1 || i === 2 || i === 3 || i === 4) {
            return 60;
          } else {
            return 340;
          }
        })
        .attr("y", (d, i) => {
          if (i === 0 || i === 5) {
            return 30 + 10;
          } else if (i === 1 || i === 6) {
            return 60 + 10;
          } else if (i === 2 || i === 7) {
            return 90 + 10;
          } else if (i === 3 || i === 8) {
            return 120 + 10;
          } else if (i === 4 || i === 9) {
            return 150 + 10;
          }
        })
        .text((d) => `${d} Jahre`);
    }
  }, [newDimensions]);

  return (
    <div ref={wrapperRef} className="svg-container legend">
      <svg ref={svgRef} width={width}></svg>
    </div>
  );
};

export default Legend;
