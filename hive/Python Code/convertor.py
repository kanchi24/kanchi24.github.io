import igraph
from igraph import *
from sys import version_info
import networkx as nx
import json
from networkx.readwrite import json_graph

g = nx.read_gml('500.gml')

nodes = g.nodes()

degrees = g.degree(nodes)




print degrees

nx.set_node_attributes(g, 'degree', degrees)

types = {}

for n in g.nodes_iter():
	
	indeg = g.in_degree(n)
	outdeg = g.out_degree(n)
	if(indeg == 0):
		node_type = 'source'
	elif (outdeg == 0):
		node_type = 'sink'
	else:
		node_type = 'hub'
	types[n] = node_type


nx.set_node_attributes(g, 'type',types)

nodenames = {}

for n in g.nodes_iter():
    nodenames[n] = n+1


nx.set_node_attributes(g, 'name',nodenames)




data = json_graph.node_link_data(g)
with open('500.json', 'w') as f:
	json.dump(data, f)
