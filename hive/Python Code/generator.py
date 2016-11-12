import igraph
from igraph import *
from sys import version_info
import networkx as nx
import json
from networkx.readwrite import json_graph

n = 500
g = Graph.Barabasi(n,m=1, directed = True)
g.write_gml('500.gml')





