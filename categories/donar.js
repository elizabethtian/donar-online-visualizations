/* 
 *  Donar Online Data Visualization
 *
 *  JavaScript for the data visualization of Donar Online category data from 2015. Uses packing
 *  to map categories to circles, with the size based on donations.
 *  Includes different views: quantity of donations, amount of donations (in Argentine pesos),
 *  average donation amount per person, and male/female donation percentages.
 *
 *  Utilizes the d3 library for visualizations.
 *  
 *  Created by Elizabeth Tian, 2016
**/

//data
var dataset;
var color = d3.scaleOrdinal(d3.schemeCategory20c);

//Width and height
var w = 1250;
var h = 560;

//make svg
var svg = d3.select("body")
		    .append("svg")
		    .attr("width", w)
		    .attr("height", h);

var pack = d3.pack()
    		   .size([w, h])
    		   .padding(15);

 d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };

//read in data
d3.csv("categories.csv", function(error, data) {
	if (error) throw error;

	dataset = data;

	var root = d3.hierarchy({children: data})
		.sum(function(d) {
			return d.Doncaciones;
		})

	pack(root);

	// make the nodes
	var node = svg.selectAll("g")
		.data(root.children, function(d) { return d.data.Categories;})
		.enter()
		.append("g")
		  .attr("transform", function(d) {
		  	return "translate(" + d.x + "," + d.y + ")";
		  })
		  .attr("class", "node")
    .on('mouseover', function(d, i) {
            d3.select(this).moveToFront();
            var title = d3.select(this).selectAll("text").filter(".title")
                .transition()
                .duration(1250)
                .style('opacity', 1);

            var info = d3.select(this).selectAll("text").selectAll("tspan").filter(".info")
                .transition()
                .duration(1250)
                .style('opacity', 1);

        })
    .on('mouseout', function(d) {
            d3.select(this).selectAll("text")
                .transition()
                .duration(500)
                .ease(d3.easeCubicOut)
                .style("opacity", 0);
    });

	// append circles to the nodes
    node.append("circle")
      .transition()
      .duration(1200)
      .ease(d3.easeCubicOut)
      .attr("id", function(d) {
      	return "node-" + d.data.id;
      })
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d, i) { return color(i); });

    // append title text to the nodes
    node.append("text")
      .text(function(d) {
          return d.data.Categories;
      })
      .attr("pointer-events", "none")
      .attr("class", "title")
      .attr("dy", -20)
      // append info text to nodes
        .append("tspan")
      .text(function(d) {
        return 'Donaciones: ' + d.data.Doncaciones;
      })
      .attr("pointer-events", "none")
      .attr("class", "info")
      .attr("x", 0)
      .attr("dy", 20)
        .append("tspan")
      .text(function(d) {
        return 'Porcentaje: ' + d.data.Porcentaje;
      })
      .attr("pointer-events", "none")
      .attr("class", "info")
      .attr("x", 0)
      .attr("dy", 20);

    //find max "r"
    var max = d3.max(dataset, function(d){ return +d.Doncaciones});
    var inverseScale = d3.scaleLog()
        .base(2)
        .range([0, 75]);
  
    // grow circles on mouseover
    d3.selectAll("circle")
      .on("mouseover", function(d) {
        d3.select(this)
      	  .transition()
      	  .duration(500)
      	  .attr("r", function() {
            if (d.r < 50) { return 75; } 
            else
              { return inverseScale(d.r) }
          });

      })
      .on("mouseout", function(d) {
      	d3.select(this)
      	  .transition()
      	  .duration(500)
      	  .attr("r", d.r);
      });

  // Montos Packing
  d3.selectAll("li").filter("#monto")
      .on('click', function() {

        //hide submenu
        d3.select("#submenu")
          .transition()
          .style("opacity", 0);


        var root2 = d3.hierarchy({children: data})
                      .sum(function(d) {
                          if (d.Montos != undefined) {
                            var next = d.Montos.replace(/\./g,"");
                            var next2 = next.replace(/\,/g,".");
                            var next3 = next2.replace(/\$/g,"");
                            var number = Number(next3);
                        }
                        return number;
                      });

        var pack2 = d3.pack()
           .size([w, h])
           .padding(15);

        
        pack2(root2);

        // remove arcs
        d3.selectAll("path")
          .transition()
          .duration(500)
          .style("opacity", 0)
          .remove();

        // remove the previous text
        d3.selectAll("tspan").remove();

        // change nodes
        var node2 = svg.selectAll("g")
          .data(root2.children, function(d) { return d.data.Categories; })
          
        node2.transition()
            .duration(2000)
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
        
        d3.selectAll("circle")
          .data(root2.children, function(d) { return d.data.Categories; })
            .transition()
            .duration(1000)
            .attr("r", function(d, i) { 
              return d.r;
            });

        d3.selectAll("text").filter(".title")
          .data(root2.children, function(d) { return d.data.Categories; })
          .attr("class", "title")
          .attr("dy", -20);

        
        d3.selectAll("text").append("tspan")
          .text(function(d) {
            return 'Montos: ' + d.data.Montos;
          })
          .attr("pointer-events", "none")
          .attr("class", "info")
          .attr("x", 0)
          .attr("dy", 20)
            .append("tspan")
          .text(function(d) {
            return 'Porcentaje: ' + d.data.Porcentaje2;
          })
          .attr("pointer-events", "none")
          .attr("class", "info")
          .attr("x", 0)
          .attr("dy", 20)

  });

    // Promedio Packing
  d3.selectAll("li").filter("#pro")
      .on('click', function() {

        //hide submenu
        d3.select("#submenu")
          .transition()
          .style("opacity", 0);


        var root2 = d3.hierarchy({children: data})
                      .sum(function(d) {
                          if (d.Promedio != undefined) {
                            var next = d.Promedio.replace(/\,/g,".");
                            var number = Number(next.replace(/\$/g,""));
                        }
                        return number;
                      });

        var pack2 = d3.pack()
           .size([w, h])
           .padding(15);

        
        pack2(root2);

        // remove arcs
        d3.selectAll("path")
          .transition()
          .duration(500)
          .style("opacity", 0)
          .remove();

        // remove the previous text
        d3.selectAll("tspan").remove();

        // change nodes
        var node2 = svg.selectAll("g")
          .data(root2.children, function(d) { return d.data.Categories; })
          
        node2.transition()
            .duration(2000)
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
        
        d3.selectAll("circle")
          .data(root2.children, function(d) { return d.data.Categories; })
            .transition()
            .duration(1000)
            .attr("r", function(d, i) { 
              return d.r;
            });

        d3.selectAll("text").filter(".title")
          .data(root2.children, function(d) { return d.data.Categories; })
          .attr("class", "title")
          .attr("dy", -10);

        d3.selectAll("text").append("tspan")
          .text(function(d) {
            return 'Promedio: ' + d.data.Promedio;
          })
          .attr("pointer-events", "none")
          .attr("class", "info")
          .attr("x", 0)
          .attr("dy", 20);

  });

  // Cantidad Packing
  d3.selectAll("li").filter("#cantidad")
      .on('click', function() {

        // hide submenu
        d3.select("#submenu")
          .transition()
          .style("opacity", 0);


        var root2 = d3.hierarchy({children: data})
                      .sum(function(d) {
                        return d.Doncaciones;
                      });

        var pack2 = d3.pack()
           .size([w, h])
           .padding(15);

        pack2(root2);

        // remove arcs
        d3.selectAll("path")
          .transition()
          .duration(500)
          .style("opacity", 0)
          .remove();

        // change nodes
        var node2 = svg.selectAll("g")
          .data(root2.children, function(d) { return d.data.Categories; })
          
        node2.transition()
            .duration(2000)
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            })
        
        d3.selectAll("circle")
          .data(root2.children, function(d) { return d.data.Categories; })
            .transition()
            .duration(1000)
            .attr("r", function(d, i) { 
              return d.r;
            });

        d3.selectAll("text").filter(".title")
          .data(root2.children, function(d) { return d.data.Categories; })
          .attr("class", "title")
          .attr("dy", -20);

        d3.selectAll("tspan").remove();

          // append new info text to nodes
        d3.selectAll("text")
            .append("tspan")
          .text(function(d) {
            return 'Donaciones: ' + d.data.Doncaciones;
          })
          .attr("pointer-events", "none")
          .attr("class", "info")
          .attr("x", 0)
          .attr("dy", 20)
            .append("tspan")
          .text(function(d) {
            return 'Porcentaje: ' + d.data.Porcentaje;
          })
          .attr("pointer-events", "none")
          .attr("class", "info")
          .attr("x", 0)
          .attr("dy", 20);


  });

  // Homber/Mujer Packing
  d3.selectAll("li").filter("#hm")
      .on('click', function() {
        
        //show submenu
        d3.select("#submenu")
          .transition()
          .style("opacity", 1);

        var root2 = d3.hierarchy({children: data})
                      .sum(function(d) {
                        return d.Doncaciones;
                      });

        var pack2 = d3.pack()
           .size([w, h])
           .padding(15);

        pack2(root2);

        var arcHombre = d3.arc()
         .outerRadius(function (d) {return d.r;})
         .innerRadius(0)
         .startAngle(0)
         .endAngle(function(d, i) {
            //figure out how to repeat
            var midH = d.data.HombresPorcentaje.replace(/\,/g,".");
            var numH = Number(midH.replace(/\%/g,""));
            var angleHombre = numH/100*360;
            return angleHombre*Math.PI/180;
          });

        var arcMujer = d3.arc()
         .outerRadius(function (d) {return d.r;})
         .innerRadius(0)
         .startAngle(function(d) {
            // figure out how to repeat
            var midH = d.data.HombresPorcentaje.replace(/\,/g,".");
            var numH = Number(midH.replace(/\%/g,""));
            var angleHombre = numH/100*360;
            return angleHombre*Math.PI/180;
          })
         .endAngle(function(d) {
            // repeat
            var midH = d.data.HombresPorcentaje.replace(/\,/g,".");
            var numH = Number(midH.replace(/\%/g,""));
            var angleHombre = numH/100*360;
            angleHombre = angleHombre*Math.PI/180;
            var midM = d.data.MujeresPorcentaje.replace(/\,/g,".");
            var numM = Number(midM.replace(/\%/g,""));
            var angleMujer = numM/100*360;
            return angleHombre + angleMujer*Math.PI/180;
         });

        var arcOtro = d3.arc()
          .outerRadius(function (d) {return d.r;} )
          .innerRadius(0)
          .startAngle(function(d) {
            // repeat
            var midH = d.data.HombresPorcentaje.replace(/\,/g,".");
            var numH = Number(midH.replace(/\%/g,""));
            var angleHombre = numH/100*360;
            angleHombre = angleHombre*Math.PI/180;
            var midM = d.data.MujeresPorcentaje.replace(/\,/g,".");
            var numM = Number(midM.replace(/\%/g,""));
            var angleMujer = numM/100*360;
            return angleHombre + angleMujer*Math.PI/180;
          })
          .endAngle(Math.PI*2);

        // change nodes
        var node2 = svg.selectAll("g")
          .data(root2.children, function(d) { return d.data.Categories; });
        
        node2.append("path")
          .attr("d", arcHombre)
          .style("fill", "#bae1ff");

        node2.append("path")
          .attr("d", arcMujer)
          .style("fill", "#ffb3ba");

        node2.append("path")
          .attr("d", arcOtro)
          .style("fill", "#fdfd96");

        node2.transition()
            .duration(2000)
            .attr("transform", function(d) {
              return "translate(" + d.x + "," + d.y + ")";
            });

        d3.selectAll("circle")
          .data(root2.children, function(d) { return d.data.Categories; })
          .attr("r", function(d, i) {
            return d.r;
          });

        d3.selectAll("text").filter(".title")
          .data(root2.children, function(d) { return d.data.Categories; })
          .attr("class", "title")
          .attr("dy", 0)
          .moveToFront();

        d3.selectAll("tspan").remove();

  });


});