import React from 'react';
import * as d3 from "d3";

/**
 * Radar chart in d3
 */
export default function Radar({data, options}) {
  setTimeout(() => radarChart("#chartRadar", data, options), 500)
  return <div id="chartRadar" />
}

// Taken from http://bl.ocks.org/nbremer/21746a9668ffdf6d8242, code modified to
// comply with v4 D3 and to make better suit for Monarch's visualisation purposes.
function radarChart(id, data, options) {
  var cfg = {
   w: 600,				//Width of the circle
   h: 600,				//Height of the circle
   margin: {top: 100, right: 100, bottom: 100, left: 100}, //The margins of the SVG
   levels: 3,				//How many levels or inner circles should there be drawn
   maxValue: 0, 			//What is the value that the biggest circle will represent
   labelFactor: 1.15, 	//How much farther than the radius of the outer circle should the labels be placed
   wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
   opacityArea: 0.3, 	//The opacity of the area of the blob
   dotRadius: 3, 			//The size of the colored circles of each blog
   opacityCircles: 0.3, 	//The opacity of the circles of each blob
   strokeWidth: 2, 		//The width of the stroke around each blob
   roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
   color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
  };

  //Put all of the options into a variable called cfg
  if('undefined' !== typeof options){
    for(var i in options){
      if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
    }//for i
  }//if

  //If cfg.color is just a simple array, put it into d3 format.
  if(Array.isArray(cfg.color)) {
    cfg.color = d3.scaleOrdinal(options.color);
  }
  
  //If cfg.color is just a colored string, put it into d3 format.
  if(typeof cfg.color === 'string') {
    cfg.color = d3.scaleOrdinal([options.color]);
  }
  
  //If the supplied maxValue is smaller than the actual one, replace by the max in the data
  var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

  var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
      total = allAxis.length,					//The number of different axes
      radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
      Format = d3.format('.2'),			 	//Percentage formatting
      angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

  //Scale for the radius
  var rScale = d3.scaleLinear()
      .range([0, radius])
      .domain([0, maxValue]);

  /////////////////////////////////////////////////////////
  //////////// Create the container SVG and g /////////////
  /////////////////////////////////////////////////////////

  //Remove whatever chart with the same id/class was present before
  d3.select(id).select("svg").remove();

  //Initiate the radar chart SVG
  var svg = d3.select(id).append("svg")
          .attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
          .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
          .attr("class", "radar"+id);
  //Append a g element		
  var g = svg.append("g")
          .attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

  /////////////////////////////////////////////////////////
  ////////// Glow filter for some extra pizzazz ///////////
  ////////////////////(LARGELY MODIFIED)///////////////////

  //Filter for the outside glow
  var filter = g.append('defs').append('filter').attr('id','glow');
  filter.append('feGaussianBlur').attr('stdDeviation','0.5').attr('result','coloredBlur');

  /////////////////////////////////////////////////////////
  /////////////// Draw the Circular grid //////////////////
  /////////////////////////////////////////////////////////

  //Wrapper for the grid & axes
  var axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid.selectAll(".levels")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", function(d, i){return radius/cfg.levels*d;})
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter" , "url(#glow)");

  //Text indicating at what % each level is
  axisGrid.selectAll(".axisLabel")
     .data(d3.range(1,(cfg.levels+1)).reverse())
     .enter().append("text")
     .attr("class", "axisLabel")
     .attr("x", 4)
     .attr("y", function(d){return -d*radius/cfg.levels;})
     .attr("dy", "0.4em")
     .style("font-size", "10px")
     .attr("fill", "#737373")
     .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");
  //Append the lines
  axis.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
      .attr("class", "line")
      .style("stroke", "white")
      .style("stroke-width", "2px");

  //Append the labels at each axis
  axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
      .text(function(d){return d})
      .call(wrap, cfg.wrapWidth);

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  var radarLine = d3.radialLine()
      .curve(d3.curveLinearClosed)
      .radius(function(d) { return rScale(d.value); })
      .angle(function(d,i) {	return i*angleSlice; });

  if(cfg.roundStrokes) {
      radarLine.curve(d3.curveCatmullRomClosed);
  }

  //Create a wrapper for the blobs	
  var blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper")
      .attr("data-index", function(d, i) { return i; }) // make parent index available from DOM;

  //Append the backgrounds	
  blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr("d", function(d,i) { return radarLine(d); })
      .style("fill", function(d,i) { return cfg.color(i); })
      .style("fill-opacity", cfg.opacityArea)
      .on('mouseover', function (d,i){
          //Dim all blobs
          d3.selectAll(".radarArea")
              .transition().duration(200)
              .style("fill-opacity", 0.1); 
          //Bring back the hovered over blob
          d3.select(this)
              .transition().duration(200)
              .style("fill-opacity", 0.7);	
      })
      .on('mouseout', function(){
          //Bring back all blobs
          d3.selectAll(".radarArea")
              .transition().duration(200)
              .style("fill-opacity", cfg.opacityArea);
      });

  //Create the outlines	
  blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", function(d,i) { return radarLine(d); })
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", function(d,i) { return cfg.color(i); })
      .style("fill", "none")
      .style("filter" , "url(#glow)");		

  //Append the circles
  blobWrapper.selectAll(".radarCircle")
      .data(function(d,i) { return d; })
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
      .style("fill", function(d,i) { 
        return d3.rgb(cfg.color(this.parentNode.getAttribute('data-index'))).darker(1); 
      });

  /////////////////////////////////////////////////////////
  //////// Append invisible circles for tooltip ///////////
  ///////////////////(Tooltip uses div)////////////////////
  
  //Set up the small tooltip for when you hover over a circle
  //Define the div for the tooltip
  var tooltip = d3.select("body").append("div")	
      .attr("class", "tooltip")				
      .style("opacity", 0)
      .style("background", "#fff")
      .style("padding", "4px 8px 4px 8px")
      .style("border", "1px solid #000")
      .style("border-radius","4px");
  
  //Wrapper for the invisible circles on top
  var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarCircleWrapper");

  //Append a set of invisible circles on top for the mouseover pop-up
  blobCircleWrapper.selectAll(".radarInvisibleCircle")
      .data(function(d,i) { return d; })
      .enter().append("circle")
      .attr("class", "radarInvisibleCircle")
      .attr("r", cfg.dotRadius*1.5)
      .attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
      .attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
      .style("fill", "none")
      .style("pointer-events", "all")
      .style("cursor", "pointer")
      .on("mouseover", function(d,i) {
        tooltip.transition()		
          .duration(200)		
          .style("opacity", .9);		
        tooltip.html(Format(d.value))	
          .style("left", (d3.event.pageX) + "px")		
          .style("top", (d3.event.pageY - 28) + "px");	
      })
      .on("mouseout", function(){   
        tooltip.transition()		
          .duration(500)		
          .style("opacity", 0);	
      });

  /////////////////////////////////////////////////////////
  /////////////////// Helper Function /////////////////////
  /////////////////////////////////////////////////////////

  //Taken from http://bl.ocks.org/mbostock/7555321
  //Wraps SVG text	
  function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          wordsArrayLength = words.length,
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.2, // ems
          y = text.attr("y"),
          x = text.attr("x"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
      while (wordsArrayLength--) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }//wrap	
}