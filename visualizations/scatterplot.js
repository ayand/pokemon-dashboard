var width = 475;
var padding = 45;

var scatterX = d3.scaleLinear().range([padding, width - padding])
var scatterY = d3.scaleLinear().range([width - padding, padding])

var scatterPlot = d3.select(".statScatter")
    .append("svg")
    .attr("width", width)
    .attr("height", (width + 20));

function zoom() {
    d3.select(this).attr("transform", d3.event.transform)
    var scatterDots = scatterPlot.selectAll(".scatterDot")

    scatterDots.attr("r", function() {
        return (2 / d3.event.transform.k);
    })
}

scatterPlot.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 10)
    .attr("ry", 10)
    .attr("width", width)
    .attr("height", (width + 20))
    .attr("fill", "white");

d3.json("pokemon.json", function(data) {
    var transformedData = data.map(function(d) {
        var result =  {
            "id": d.id,
            "name": d.forme,
            "type1": d.type1,
            "type2": d.type2,
            "offense_factor": (d.attack + d.spattack),
            "defense_factor": (d.defense + d.spdefense)
        }
        //console.log(result);
        return result;
    })
    var maxOffense = d3.max(transformedData, function(d) {
        //console.log(d["offense_factor"]);
        return d["offense_factor"];
    })

    var maxDefense = d3.max(transformedData, function(d) {
        return d["defense_factor"];
    })

    var maxStat = Math.max(maxOffense, maxDefense);
    console.log("MAX STAT: " + maxStat);
    scatterX.domain([0, maxStat]);
    scatterY.domain([0, maxStat]);

    var zoomArea = scatterPlot.append("g")
        .call(d3.zoom().scaleExtent([1, 50]).translateExtent([[padding, padding], [(width - padding), (width - padding)]]).on("zoom", zoom))

    var dot = zoomArea.selectAll(".scatterDot")
        .data(transformedData);

    dot.enter().append("circle")
        .attr("class", "scatterDot")
        .attr("r", 2)
        .attr("cx", function(d) {
            //console.log(d["offense_factor"])
            //console.log(scatterX(d.offense_factor))
            return scatterX(d["offense_factor"]);
        })
        .attr("cy", function(d) {
            return scatterY(d["defense_factor"]);
        })
        .attr("fill", "#115B2A")
        .style("opacity", 0.5)
        .style("cursor", "pointer")
        .on("mouseover", function(d) {
            console.log(d.name);
            d3.selectAll(".bar")
                .transition()
                .duration(1000)
                .style("opacity", function(bar) {
                    return (bar.type === d.type1 || bar.type === d.type2) ? 1 : 0;
                })

            d3.selectAll(".scatterDot")
                .transition()
                .duration(1000)
                .style("opacity", function(aDot) {
                    return (aDot.id === d.id) ? 0.5 : 0.1;
                })
        })
        .on("mouseout", function(d) {
            d3.selectAll(".bar")
                .transition()
                .duration(1000)
                .style("opacity", function(bar) {
                    if (selectedType != null) {
                        return (bar.type == selectedType) ? 1 : 0.2;
                    }
                    return 1;
                });

            d3.selectAll(".scatterDot")
                .transition()
                .duration(1000)
                .style("opacity", 0.5)
        });

    var equalLineData = [
        { "x": 0, "y": 0 },
        { "x": maxStat, "y": maxStat }
    ]

    var lineFunction = d3.line()
        .x(function(d) { return scatterX(d.x) })
        .y(function(d) { return scatterY(d.y) })
        /*.x(function(d) { return scatterX(d.x) })
        .y(function(d) { return scatterY(d.y) })*/

    zoomArea.append("path")
        .attr("d", lineFunction(equalLineData))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");

    var scatterXAxis = d3.axisBottom(scatterX);
    var scatterYAxis = d3.axisLeft(scatterY);

    zoomArea.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + (width - padding) + ")")
        .call(scatterXAxis)


    zoomArea.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (padding) + ", 0)")
        .call(scatterYAxis);

    zoomArea.append("text")
      .attr("transform", "translate(" + (width/2) + " ," +
          (width - 10) + ")")
      .style("text-anchor", "middle")
      .text("Offense Factor");

    zoomArea.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (width / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Defense Factor");
});
