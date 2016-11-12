

var nodes = [];
var links = [];
var node_types = ["source", "sink", "hub"];
var width = 500,
height = 600,
width2 = 500,
height2 = 600,
innerRadius = 10,
outerRadius = 250;

var nodesByType;
var sourceScale, sinkScale, hubScale;
var sourceRange, sinkRange, hubRange;

var angle = d3.scale.ordinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
radius = d3.scale.linear().domain([0,100]).range([innerRadius, outerRadius]),
color = d3.scale.category10().domain(d3.range(20));

var click = 0;

var svg2 = d3.select("#graph2").append("svg")
.attr("width", width2)
.attr("height", height2)
.append("g")
.attr("transform", "translate(" + width2/2 + "," + 450 + ")");



function loadGraph(){



  queue()
  .defer(d3.json, "500.json")
  .await(ready);


  function ready(error, data) {
    nodes = data['nodes'];
    links = data['links'];




    links.forEach(function(link) {

     var source_node, target_node;

     nodes.forEach(function(node) {

      if(node.id == link.source)

        source_node = node;
      else if (node.id == link.target)

       target_node = node;

   });

     link.source = source_node;
     link.target = target_node;

   });





    nodesByType = d3.nest()
    .key(function(d) { return d.type; })
    .sortKeys(d3.ascending)
    .entries(nodes);





    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-0.5))
    .force("center", d3.forceCenter(width / 2, height / 2));

    var svg = d3.select("#graph1").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");


    var link = svg.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter().append("line")
    .attr("stroke","grey")
    .attr("stroke-width","0.3px");


    var node = svg.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data.nodes)
    .enter().append("circle")
    .attr("r", 3)
    .attr("fill", "red")
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

    simulation
    .nodes(data.nodes)
    .on("tick", ticked);

    simulation.force("link")
    .links(data.links);

     
                   console.log("after");
   console.log(nodes);
   console.log(links); 


    document.getElementById("content").style.display = "inline-block";


    nodesByType.forEach(function(nodeSet){

      var minValue=d3.min(nodeSet.values,function(d,i){
        return d.name;
      })
      var maxValue=d3.max(nodeSet.values,function(d,i){
        return d.name;
      })

      var length = nodeSet.values.length;

      var key = nodeSet.key; 

      if(key == "source")
        {  sourceScale = {"min":minValue,"max":maxValue};
      sourceRange = {"min":10, "max":(length)}; }
      else if (key == "hub")
        {  hubScale = {"min":minValue,"max":maxValue};
      hubRange = {"min":10, "max":(length)};}

      else if (key == "sink")
      {
        sinkScale = {"min":minValue,"max":maxValue};
        sinkRange = {"min":10, "max":(length)};

      }





    });




      function ticked() {
      link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

      node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
    }


    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }




  }

}

function loadHive(){




  click++;
  if(click == 1)
  { 

    




    svg2.selectAll(".axis")
    .data(nodesByType)
    .enter().append("line")
    .attr("class", "axis")
    .attr("transform", function(d) { return "rotate(" + determine_angle(d.key) + ")"; })
    .attr("x1", radius(-2))
    .attr("x2",radius(0))
    .attr("x2", function(d) { return d['values'].length + 2; })
    .attr("stroke", "grey");


    svg2.selectAll("text")
    .data(nodesByType)
    .enter().append("text")
    .attr("transform", function(d) { return "rotate(" + determine_angle(d.key) + ")"; })
    .attr("x", function(d) { return d['values'].length + 10; })
    .attr("y",  2)
    .attr("dy", ".35em")
    .text(function(d) { return d.key; })
    .style("font-size","9px");


    $( "#content p" ).fadeOut();
    $( "#content p" ).html('In the above example, the nodes will be distributed among the three axes depending upon if they are source nodes, sink nodes or hubs!');
    $( "#content p" ).fadeIn();
    $( "#content a" ).html('Go On!');


  }

  if(click == 2)
  {







 
    var nodes1 = svg2.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("transform", function(d) { return "rotate(" + (determine_angle(d.type)) + ")"; })
    .attr("cx", 0)
    .attr("r", 3)
    .style("fill","#FF4073")
    .style("stroke","#740A27")
    .style("stroke-width","0.1px");

    nodes1.transition()
             .duration(3000)
             .attr('cx',function(d) {return calculateScale(d); });
         


  }




  if(click == 3)
  {


   

   

   svg2.selectAll(".link")
    .data(links)
  .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.hive.link()
    .angle(function(d) { return determine_angle2(d); })
    .radius(function(d) { return calculateScale(d); }))
    .style("stroke", "grey");

 }









  function determine_angle(type)
  {

    var index;



    if (type == "source")
    {  index = 0; }

    else if (type == "sink")
     { 

      index = 2;
    }
    else
    {  index =  1;

    }

    return degrees(angle(index));
  }

  function determine_angle2(node)
  {

    

    var type = node.type;

    var index;

    if(node.id == 0)
      type = "sink";

    if (type == "source")
      index = 0;
    else if (type == "sink")
    { 
  
      index = 2;
    }
    else
    {
      index =  1;
    }

    return angle(index);
  }





  function degrees(radians) {
    return radians / Math.PI * 180 - 90;


  }


}

 function calculateScale(node){

      var scale,range ;
      if(node.type == "hub")
       { scale = hubScale;
        range = hubRange;
      }
      else if(node.type = "source")
      {
        scale = sourceScale;
        range = sourceRange;
      }
      else if (node.type == "sink")
      {
        scale = sinkScale;
        range = sinkRange;
      }




      var newradius = d3.scale.linear().domain([scale.min,scale.max]).range([range.min,range.max]);


      return newradius(node.name);



    }



