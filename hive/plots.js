

var nodes = [];
var links = [];
var node_types = ["source", "sink", "hub"];
var width = 1000,
height = 550,
innerRadius = 10,
outerRadius = 150;

var axis1,links1,nodes1,labels1;

var nodesByType;
var sourceScale, sinkScale, hubScale;
var sourceRange, sinkRange, hubRange;
var sourcedegreeRange, sinkdegreeRange,hubdegreeRange;

var angle = d3.scale.ordinal().domain(d3.range(4)).rangePoints([0, 2 * Math.PI]),
radius = d3.scale.linear().domain([0,100]).range([innerRadius, outerRadius]),
color = d3.scale.category10().domain(d3.range(20));

var click = 0;

var svg = d3.select("#graph").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + (-250) + "," + 10 + ")");



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
    .attr("fill", "#FF4073")
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

      console.log(minValue);
      var maxValue=d3.max(nodeSet.values,function(d,i){
        return d.name;
      })


      var maxDegree=d3.max(nodeSet.values,function(d,i){
        return d.degree;
      })

      var length = nodeSet.values.length;

      var key = nodeSet.key; 

      if(key == "source")
        {  sourceScale = {"min":minValue,"max":maxValue};
      sourceRange = {"min":10, "max":(length)}; 
      sourcedegreeRange = {"max":maxDegree};
 
    }

      else if (key == "hub")
        {  hubScale = {"min":minValue,"max":maxValue};
      hubRange = {"min":10, "max":(length)};
      hubdegreeRange = {"max":maxDegree};
    }

      else if (key == "sink")
      {
        sinkScale = {"min":minValue,"max":maxValue};
        sinkRange = {"min":10, "max":(length)};
        sinkdegreeRange = {"max":maxDegree};

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

  var hive1 = svg.append("g")
               .attr("transform", "translate(" + (1000) + "," + 400 + ")");
 



  click++;
  if(click == 1)
  { 

    

  


     axis1 = hive1.selectAll(".axis")
    .data(nodesByType)
    .enter().append("line")
    .attr("class", "axis")
    .attr("transform", function(d) { return "rotate(" + determine_angle(d.key) + ")"; })
    .attr("x1", radius(-2))
    .attr("x2",radius(0))
    .attr("stroke", "grey")
    .attr("x2", function(d) { return d['values'].length + 2; })
    


    labels1 = hive1.selectAll("text")
    .data(nodesByType)
    .enter().append("text")
    .attr("transform", function(d) { return "rotate(" + determine_angle(d.key) + ")"; })
    .attr("x", function(d) { return d['values'].length + 10; })
    .attr("y",  2)
    .attr("dy", ".35em")
    .text(function(d) { return d.key; })
    .style("font-size","9px");


    $( "#content p" ).fadeOut();
    $( "#content p" ).html('In the above example, the nodes will be distributed among the three axes depending upon if they are source nodes, sink nodes or hubs! Also they will be ordered according to their unique name!');
    $( "#content p" ).fadeIn();
    $( "#content a" ).html('Go On!');


  }

  if(click == 2)
  {


    
  var earlier_nodes = document.getElementsByClassName('nodes');
  console.log(earlier_nodes);
  console.log(earlier_nodes[0]['childNodes'][1]['cx']);






    nodes1 = hive1.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function(d,i){return earlier_nodes[0]['childNodes'][i]['cx']['baseVal']['value']-1000;})
    .attr("cy", function(d,i){return earlier_nodes[0]['childNodes'][i]['cy']['baseVal']['value']-390;})
    .attr("r", 3)
    .style("fill","#FF4073")
    .style("stroke","#740A27")
    .style("stroke-width","0.1px");




 
    // var nodes1 = hive1.selectAll(".node")
    // .data(nodes)
    // .enter().append("circle")
    // .attr("class", "node")
    // .attr("transform", function(d) { return "rotate(" + (determine_angle(d.type)) + ")"; })
    // .attr("cx", 0)
    // .attr("r", 3)
    // .style("fill","#FF4073")
    // .style("stroke","#740A27")
    // .style("stroke-width","0.1px");

    nodes1.transition()
             .duration(3000)
             .attr("transform", function(d) { return "rotate(" + (determine_angle(d.type)) + ")"; })
             .attr('cx',0)
             .attr('cy',0);

       nodes1.transition()
             .duration(3000)
             .attr("transform", function(d) { return "rotate(" + (determine_angle(d.type)) + ")"; })
             .attr('cx',function(d) {return calculateScale(d,1); })
             .attr('cy',0);

    $( "#content p" ).fadeOut();
    $( "#content p" ).html('Once the nodes are distributed and ordered, the edges are drawn as arcs in between them');
    $( "#content p" ).fadeIn();
    $( "#content a" ).html('Draw the arcs!');
         


  }




  if(click == 3)
  {

  links1 =  hive1.selectAll(".link")
    .data(links)
  .enter().append("path")
    .attr("class", "link")
    .attr("d", d3.hive.link()
    .angle(function(d) { return determine_angle2(d); })
    .radius(10))
    .style("stroke", "grey");

  links1.transition()
           .duration(1500)
           .attr("class", "link")
    .attr("d", d3.hive.link()
    .angle(function(d) { return determine_angle2(d); })
    .radius(function(d) { return calculateScale(d,1); }))
    .style("stroke", "grey");


    $( "#content p" ).fadeOut();
    $( "#content p" ).html('Voila! Our Hive Plot is plotted! This representation makes it so much easier to read the above graph! We can easily find out that there is just one sink node in this entire represenatation!');
    $( "#content p" ).fadeIn();
    $( "#content a" ).html('Cool! Now What! ');
         



 }

 if(click == 4)
 {


   
    $( "#content p" ).fadeOut();
    $( "#content p" ).html('We can also normalize the axis lengths in order to easily compare the nodes and connections in between axes!');
    $( "#content p" ).fadeIn();
    $( "#content a" ).html('Normalize it!');





 }

  if(click == 5)
  {



    

    axis1.transition()
    .duration(1500)  
    .attr("x1", radius.range()[0])
    .attr("x2",radius.range()[1]);


    console.log(nodes1);

    nodes1.transition()
    .duration(1500)  
    .attr('cx',function(d){return calculateScale(d,2);});

     
    links1.transition()
    .duration(1500)
    .attr("class", "link")
    .attr("d", d3.hive.link()
    .angle(function(d) { return determine_angle2(d); })
    .radius(function(d) { return calculateScale(d,2); }))
    .style("stroke", "grey");


 
    labels1.transition()
      .duration(1500)
      .attr("x", function(d) { return radius.range()[1] + 10; });


  $( "#content p" ).fadeOut();
    $( "#content p" ).html('There are other ways we can chose to encode networks using Hive Plots as well');
    $( "#content p" ).fadeIn();
   
    $( "#content a" ).html('What are these ways?');

      


  }


  if(click == 6)
  {
      
    $( "#content a" ).attr("href","#application");


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

 function calculateScale(node,click){

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




      var newradius ;

      if(click == 1)
        newradius = d3.scale.linear().domain([scale.min,scale.max]).range([range.min,range.max]);
      else if(click == 2)
       { 
         if(node.name==1)
         {  
            newradius = d3.scale.linear().domain([0,1]).range([innerRadius,outerRadius]);
          }
          else
          {
          newradius = d3.scale.linear().domain([scale.min,scale.max]).range([innerRadius,outerRadius]);
        }
      }
      
      return newradius(node.name);



    }

    



