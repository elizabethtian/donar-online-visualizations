/* 
 *  Donar Online Data Visualization
 *
 *
 *  Utilizes the d3 library for visualizations.
 *  
 *  Created by Elizabeth Tian, 2016
**/

//variables
var dataset;
var n = 3,
	  m = 12

//Width and height
var w = 700;
var h = 500;

//make svg
d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//more variables
var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//x-scale for month
var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);

//y-scale for amount
var y = d3.scaleLinear()
    .rangeRound([height, 0]);

//color scale for stacks
var z = d3.scaleOrdinal()
    .range(["#3D9AEF", "#122B42", "#EF3D3D"]);

//read in data
d3.csv("bar.csv", function(error, data) {
	if (error) throw error;
	dataset = data;


  yStackMax = d3.max(dataset, function(d) {
        var next = d.Total.replace(/\./g,"");
        var next2 = next.replace(/\,/g,".");
        var next3 = next2.replace(/\$/g,"");
        var number = Number(next3);
      return number; 
    });
	// set domains based on data
	x.domain(dataset.map(function(d) { return d.Month; }));
  y.domain([0, yStackMax]).nice();
  z.domain(dataset.columns.slice(1));

  	//create the stack for 2015
	var stack = d3.stack()
	  .keys(["Once", "Recur", "Recurring"].reverse())
	  .value(function(d, i) {
		var next = d[i].replace(/\./g,"");
        var next2 = next.replace(/\,/g,".");
        var next3 = next2.replace(/\$/g,"");
        var number = Number(next3);
        return number;
	  })(dataset);

	// 2013 new stack
  	var stack3 = d3.stack()
  	  .keys(["Once3", "Recur3", "Recurring3"].reverse())
  	  .value(function(d, i) {
  	  var next = d[i].replace(/\./g,"");
  	      var next2 = next.replace(/\,/g,".");
  	      var next3 = next2.replace(/\$/g,"");
  	      var number = Number(next3);
  	      return number;
  	  })(dataset);

    // 2014 new stack
  	var stack2 = d3.stack()
  	  .keys(["Once2", "Recur2", "Recurring2"].reverse())
  	  .value(function(d, i) {
  	  var next = d[i].replace(/\./g,"");
  	      var next2 = next.replace(/\,/g,".");
  	      var next3 = next2.replace(/\$/g,"");
  	      var number = Number(next3);
  	      return number;
  	  })(dataset);

  	// 2016 new stack
  	var stack4 = d3.stack()
  	  .keys(["Once4", "Recur4", "Recurring4"].reverse())
  	  .value(function(d, i) {
  	  var next = d[i].replace(/\./g,"");
  	      var next2 = next.replace(/\,/g,".");
  	      var next3 = next2.replace(/\$/g,"");
  	      var number = Number(next3);
  	      return number;
  	  })(dataset);

  	// create bars
  	var group = g.selectAll(".group")
      .data(stack)
      .enter().append("g")
        .attr("class", "group")
        .attr("fill", function(d) { 
          return z(d.index);
        });
      
    var rect = group.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) { return x(d.data.Month); })
        .attr("width", x.bandwidth())
	    .attr("y", height)
    	.attr("height", 0)
    
    rect.transition()
        .duration(800)
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });

    g.append("g")
      .attr("class", "axis-x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis-y")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Donations");

  	var legend = g.selectAll(".legend")
  	  .data([{name: "Por única vez", index: 2},{name: "Recurrentes (Nuevos)", index:1}, {name:"Recurrencia",index:0}])
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
  	    .attr("fill", function(d) { return z(d.index)});
	
  	legend.append("text")
  	    .attr("x", 40)
  	    .attr("y", 9)
  	    .attr("dy", ".35em")
  	    .attr("text-anchor", "start")
  	    .text(function(d) { return d.name; });

	d3.selectAll("input").on("change", change);

	// var timeout = setTimeout(function() {
	//   d3.select("input[value=\"grouped\"]").property("checked", true).each(change);
	// }, 2000);

	function change() {
	  // clearTimeout(timeout);
	  if (this.value === "grouped") {
	  	transitionGrouped();
	  }
	  else if (this.value === "stacked") {
	  	transitionStacked();
	  }
	  else if (this.value === "2013") {
	    year(stack3);
	    if(d3.select("#group")._groups[0][0].checked)
	      transitionGrouped();
	  }
	  else if (this.value === "2014") {
	    year(stack2);
	    if(d3.select("#group")._groups[0][0].checked)
	      transitionGrouped();
	  }
	  else if (this.value === "2015") {
	    year(stack);
	    if(d3.select("#group")._groups[0][0].checked)
	      transitionGrouped();
	  }
	  else if (this.value === "2016") {
	    year(stack4);
	    if(d3.select("#group")._groups[0][0].checked)
	      transitionGrouped();
	  }
	}

	function year(yearStack) {
	    g.selectAll(".group")
	      .remove();
	    group = g.selectAll(".group")
	      .data(yearStack)
	      .enter().append("g")
	        .attr("class", "group")
	        .attr("fill", function(d) {
	          return z(d.index);
	        });
	      
	    rect = group.selectAll("rect")
	      .data(function(d) { return d; })
	      .enter().append("rect")
	        .attr("x", function(d) { return x(d.data.Month); })
	        .attr("width", x.bandwidth())
	      .attr("y", height)
	      .attr("height", 0)
	    
	    rect.transition()
	        .duration(800)
	        .delay(function(d, i) { return i * 10; })
	        .attr("y", function(d) { return y(d[1]); })
	        .attr("height", function(d) { return y(d[0]) - y(d[1]); });

	}

	function transitionGrouped() {
	  rect.transition()
	      .duration(500)
	      .delay(function(d, i) { 
	      	return i * 10;
	      })
	      .attr("x", function(d, i, j) { 
          var index = group.data().indexOf(d3.select(this.parentNode).datum());
	      	return x(d.data.Month) + x.bandwidth()/n * index;
	      })
	      .attr("width", x.bandwidth() / n)
	    .transition()
	      .attr("y", function(d) { 
          var num = d[1] - d[0];
          return y(d[1] - d[0]); 
        })
	      .attr("height", function(d) { return height - y(d[1] - d[0]); });
	}

	function transitionStacked() {
	  rect.transition()
	      .duration(500)
	      .delay(function(d, i) { return i * 10; })
          .attr("y", function(d) { 
            return y(d[1]);
          })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
	    .transition()
          .attr("x", function(d) { return x(d.data.Month); })
          .attr("width", x.bandwidth())
	}

});


