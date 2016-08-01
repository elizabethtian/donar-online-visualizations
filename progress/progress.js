/* 
 *  Donar Online Data Visualization
 *
 *
 *  Utilizes the d3 library for visualizations.
 *  
 *  Created by Elizabeth Tian, 2016
**/

//variables
var dataset,
	w = 760,
	h = 550;

// Chart dimensions.
var margin = {top: 59.5, right: 89.5, bottom: 19.5, left: 39.5},
    width = w - margin.right - margin.left,
    height = h - margin.top - margin.bottom;

function key(d) { return d.name; }

// create svg
var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//scales
var xScale = d3.scaleLinear()
    .rangeRound([0, width])
    .domain([0, 43]);
	// .padding(0.1)
    // .align(0.1);
var yScale = d3.scaleLinear()
	.range([height, 0]);
var zScale = d3.scaleOrdinal()
    .range(["#3D9AEF", "#EF3D3D"]);
var rScale = d3.scaleSqrt()
	.range([5, 80]);

//read in data
d3.csv("progress.csv", function(error, data) {
	if (error) throw error;
	dataset = [{name: "Mensual", data: data},{name: "Historico", data: data}];

	var scaleMax = d3.max(data, function(d) {
	    return toNumber(d.Historico);
	})
	//set domains
	// xScale.domain(data.map(function(d) { return d.Month; }));
	yScale.domain([0, scaleMax]).nice();
	zScale.domain(data.columns.slice(1));
	rScale.domain([0, scaleMax]).nice();

	var line1 = d3.line()
	    .x(function(d, i) {
	    	return xScale(i);
	    })
	    .y(function(d) {
	    	return yScale(toNumber(d.Historico));
	    });

	var line2 = d3.line()
	    .x(function(d, i) {
	    	return xScale(i);
	    })
	    .y(function(d) {
	    	return yScale(toNumber(d.Mensual));
	    });

	svg.append("path")
	    .transition()
	    .duration(5000)
		.attr("d", line1(data))
		.attr("stroke", zScale(0))
		.attr("stroke-width", 4)
        .attr("fill", "none");

    svg.append("path")
	    .transition()
	    .duration(5000)
		.attr("d", line2(data))
		.attr("stroke", zScale(1))
		.attr("stroke-width", 4)
        .attr("fill", "none");

    svg.append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale))
    .append("text")
      .attr("x", width-2)
      .attr("y", 15)
      .attr("text-anchor", "end")
      .attr("fill", "#000")
      .text("Months");

    svg.append("g")
      .attr("class", "axis-y")
      .call(d3.axisLeft(yScale).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", yScale(yScale.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Donations");

    /* Add 'curtain' rectangle to hide entire graph */
	var curtain = svg.append('rect')
	    .attr('x', -1 * width)
	    .attr('y', -1 * height)
	    .attr('height', height-10)
	    .attr('width', width-1)
	    .attr('class', 'curtain')
	    .attr('transform', 'rotate(180)')
	    .style('fill', '#ffffff')

	svg.transition()
	    .duration(10000)
	    .ease(d3.easeLinear)
	  .select('rect.curtain')
	    .attr('width', 0);

  	var legend = svg.selectAll(".legend")
  	  .data([{name: "Acumulado Historico", key: 0},{name: "Acumulado Mensual", key: 1}])
  	  .enter().append("g")
  	    .attr("class", "legend")
  	    .attr("transform", function(d, i) { 
  	    	i += 1;
  	    	return "translate(0," + i * 20 + ")";
  	    })
  	    .style("font", "10px sans-serif");
	
  	legend.append("rect")
  	    .attr("x", 18)
  	    .attr("width", 18)
  	    .attr("height", 18)
  	    .attr("fill", function(d) { return zScale(d.key)});
	
  	legend.append("text")
  	    .attr("x", 40)
  	    .attr("y", 9)
  	    .attr("dy", ".35em")
  	    .attr("text-anchor", "start")
  	    .text(function(d) { return d.name; });

    var focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");
    var focus2 = svg.append("g")
        .attr("class", "focus2")
        .style("display", "none");

    focus.append("circle")
        .attr("r", 4.5);
    focus2.append("circle")
        .attr("r", 4.5);

    focus.append("text")
        .attr("x", 7)
        .attr("font-size", "14px")
        .attr("stroke", "#122B42")
        .attr("dy", "-0.3em");
    focus2.append("text")
        .attr("x", 7)
        .attr("font-size", "14px")
        .attr("stroke", "red")
        .attr("dy", "1em");

    svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); focus2.style("display", null);})
        .on("mouseout", function() { focus.style("display", "none"); focus2.style("display", "none");})
        .on("mousemove", mousemove);
    
    function mousemove() {
  	  	var x0 = xScale.invert(d3.mouse(this)[0]),
      	i = Math.round(x0),
      	d1 = data[i];
      	focus.attr("transform", "translate(" + xScale(i) + "," + yScale(toNumber(d1.Historico)) + ")");
      	focus.select("text").text(d1.Historico);
      	focus2.attr("transform", "translate(" + xScale(i) + "," + yScale(toNumber(d1.Mensual)) + ")");
      	focus2.select("text").text(d1.Mensual);
    }

/*DOTS HERE
	dot = svg.append("g")
      .attr("class", "dots")
    .selectAll(".dot")
      .data(dataset)
    .enter().append("circle")
      .attr("class", "dot")
      .style("fill", function(d) { return zScale(d); })
      .attr("cx", function(d) {return xScale(0)})
      .attr("cy", function(d) {
			if (d.name === "Mensual") {
				var num = yScale(toNumber(d.data[0].Mensual));
				return num;
	    	}
			else {
				return yScale(toNumber(d.data[0].Historico));
			}      
		})
      .attr("r", function(d) {
			if (d.name === "Mensual") {
				return rScale(toNumber(d.data[0].Mensual));
	    	}
			else {
				return rScale(toNumber(d.data[0].Historico));
			}
		});

	svg.transition()
      .tween("year", tweenYear);

	function tweenYear() {
		for (var i = 0; i < 48; i++) {
			displayYear(i);
		}
	}

	// Updates the display to show the specified year/month.
	function displayYear(month) {
		dot.data(dataset)
		  .transition()
		  .duration(10000)
		  .ease(d3.easeLinear)
		  .attr("cx", function(d) {return xScale(month)})
		  .attr("cy", function(d) {
		  	if (d.name === "Mensual") {
		  		// console.log("M "+toNumber(d.data[month].Mensual));
				return yScale(toNumber(d.data[month].Mensual));
	    	}
			else {
		  		// console.log("H "+yScale(toNumber(d.data[month].Historico)));
				return yScale(toNumber(d.data[month].Historico));
			}
		  })
		  .attr("r", function(d) {
		  	if (d.name === "Mensual") {
				return rScale(toNumber(d.data[month].Mensual));
	    	}
			else {
				return rScale(toNumber(d.data[month].Historico));
			}
		  })
	}

	function position(dot, month) {
	 dot .attr("cx", function(d) {
			console.log(d);
			return xScale(month);
		})
	    .attr("cy", function(d) {
	    	if (d.name === "Mensual") {
	    		console.log("Mensual!" + toNumber(d.data[month].Mensual) + " " + yScale(toNumber(d.data[month].Mensual)));
				return yScale(toNumber(d.data[month].Mensual));
	    	}
			else {
	    		console.log("Historico!" + toNumber(d.data[month].Historico) + " " + yScale(toNumber(d.data[month].Historico)));
				return yScale(toNumber(d.data[month].Historico));
			}
		})
	    .attr("r", 20);
	}*/

});

function toNumber(string) {
	return Number(string.replace(/\./g,"").replace(/\,/g,".").replace(/\$/g,""));
}




