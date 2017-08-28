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

var legend = d3.select(".legend")
    .append("svg")
    .attr("width", 250)
    .attr("height", 475)

legend.append("rect")
    .attr("width", 250)
    .attr("height", 475)
    .attr("x", 0)
    .attr("y", 0)
    .attr("rx", 15)
    .attr("ry", 15)
    .attr("fill", "white")
    .attr("stroke", "#00CC66")
    .style("stroke-width", 3);

var legendRow = legend.selectAll(".legendRow")
    .data(types)
    .enter().append("g")
    .attr("class", "legendRow")
    .attr("transform", function(d, i) {
        return "translate(0, " + (i * 25) + ")";
    })

legendRow.append("circle")
    .attr("cx", 20)
    .attr("cy", 20)
    .attr("r", 10)
    .attr("fill", function(d) {
        return colorKey[d];
    })


legendRow.append("text")
    .attr("x", 45)
    .attr("y", 25)
    .text(function(d) {
        return d;
    })
    .attr("class", "typeLabel")
    .style("text-anchor", "start")
    .style("font-size", 16);
