var width = 375;
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

var x = d3.scaleBand().range([padding, width - padding])
var y = d3.scaleLinear().range([width - padding, padding])
x.domain(types);
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

    y.domain([0, maxCount]);
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    //yAxis.tickValues([0, maxCount]);

    var barGraph = d3.select(".barChart")
        .append("svg")
        .attr("width", width)
        .attr("height", (width + 20))

    barGraph.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", (width + 20))
        .attr("fill", "white")



    var bars = barGraph.selectAll(".bar")
        .data(counts);

    bars.enter().append("rect")
        .attr("x", function(d) {
            return x(d.type);
        })
        .attr("y", function(d) {
            console.log(d["type"] + ": " + d["count"]);
            return y(d.count);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) {
            return (width - padding) - y(d.count);
        })
        .attr("fill", function(d) {
            return colorKey[d["type"]]
            //return "black";
        })
        .style("cursor", "pointer")
        .on("click", function(d) {
            console.log(d.type);
        })

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
