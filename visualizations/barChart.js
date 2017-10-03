var selectedType = null;

var width = 475;
var padding = 45;
var types = ['Normal', 'Fire', 'Fighting', 'Water', 'Flying', 'Grass',
    'Poison', 'Electric', 'Ground', 'Psychic', 'Rock', 'Ice', 'Bug', 'Dragon',
    'Ghost', 'Dark', 'Steel', 'Fairy'];

types.sort(function(a, b) {
    return (a > b) ? 1 : -1
})

var colorKey = {
    "Normal": "#C4BEAE",
    "Fire": "#EC993B",
    "Fighting": "#A12C2C",
    "Water": "#2993DA",
    "Flying": "#BAADDE",
    "Grass": "#5DC04E",
    "Poison": "#9328DA",
    "Electric": "#FFDE35",
    "Ground": "#DFB980",
    "Psychic": "#FF007F",
    "Rock": "#87632C",
    "Ice": "#99FFFF",
    "Bug": "#9DC148",
    "Dragon": "#6600CC",
    "Ghost": "#60447C",
    "Dark": "#5C4638",
    "Steel": "#A0A0A0",
    "Fairy": "#FFCCFF"
}

var counts = [];

for (var i = 0; i < types.length; i++) {
    counts.push({
        "type": types[i],
        "count": 0
    });
}

var barTip = d3.tip().attr('class', 'd3-tip')
    .html(function(d) {
      return "<strong>" + d["type"] + ":</strong><br>Count: " + d["count"];
    });

var barX = d3.scaleBand().range([padding, width - padding])
var barY = d3.scaleLinear().range([width - padding, padding])
barX.domain(types);

d3.json("pokemon.json", function(data) {
    for (var i = 0; i < data.length; i++) {
        var firstType = counts.filter(function(d) {
            return d["type"] == data[i]["type1"];
        });
        var secondType = counts.filter(function(d) {
            return d["type"] == data[i]["type2"];
        })
        firstType[0]["count"] += 1
        if (secondType.length != 0) {
            secondType[0]["count"] += 1
        }
    }
    /*counts.forEach(function(d) {
        console.log(d.count);
    })*/

    var maxCount = d3.max(counts, function(d) {
        return d.count;
    });

    barY.domain([0, maxCount]);
    var xAxis = d3.axisBottom(barX);
    var yAxis = d3.axisLeft(barY);
    //yAxis.tickValues([0, maxCount]);

    var barGraph = d3.select(".barChart")
        .append("svg")
        .attr("width", width)
        .attr("height", (width + 20))

    barGraph.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr("width", width)
        .attr("height", (width + 20))
        .attr("fill", "white");

    barGraph.call(barTip);

    var bars = barGraph.selectAll(".bar")
        .data(counts);

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return barX(d.type);
        })
        .attr("y", function(d) {
            console.log(d["type"] + ": " + d["count"]);
            return barY(d.count);
        })
        .attr("width", barX.bandwidth())
        .attr("height", function(d) {
            return (width - padding) - barY(d.count);
        })
        .attr("fill", function(d) {
            return colorKey[d["type"]]
            //return "black";
        })
        .style("cursor", "pointer")
        .on("click", function(d) {
            console.log("clicking")
            if (selectedType != d.type) {
              selectedType = d.type;
              d3.selectAll(".scatterDot")
                .style("display", function(dot) {
                    return (dot.type1 == d.type || dot.type2 == d.type) ? 'block' : 'none';
                })

              d3.selectAll(".bar")
                .transition()
                .duration(1000)
                .style("opacity", function(bar) {
                    return (bar == d) ? 1 : 0.2;
                })
            } else {
              selectedType = null;

              d3.selectAll(".scatterDot")
                .style("display", "block")

              d3.selectAll(".bar")
                .transition()
                .duration(1000)
                .style("opacity", 1)
            }

          })
          .on("mouseover", barTip.show)
          .on("mouseout", barTip.hide);

        barGraph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + (width - padding) + ")")
            .call(xAxis)
          .selectAll("text")
          .attr("x", -10)
          .attr("y", -2)
          //.attr("transform", "translate(0, " + padding + ")")
          .attr("transform", "rotate(270)")
          .attr("dy", ".35em")
          .style("text-anchor", "end");

        barGraph.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (padding) + ", 0)")
            .call(yAxis);
})
