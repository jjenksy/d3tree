/**
 * Created by jjenkins on 9/23/2016.
 */

define(['d3','jquery'],function (d3,$) {


    var treeData = [
        {
            "name": "Top Level",
            "parent": "null",
            "link":"www.google.com",
            "children": [
                {
                    "name": "Level 2: A",
                    "parent": "Top Level",
                    "link":"www.d3js.com",
                    "children": [
                        {
                            "name": "Son of A",
                            "parent": "Level 2: A",
                            "link":"www.d3js.com",
                            "children": [
                                {
                                    "name": "Grandchild of A",
                                    "parent": "Level 3: A",
                                    "children": [
                                        {
                                            "name": "Great Grandchild of A",
                                            "parent": "Level 4: A"
                                        }
                                    ]
                                }
                                ]
                        },
                        {
                            "name": "Daughter of A",
                            "parent": "Level 2: A"
                        }
                    ]
                },
                {
                    "name": "Level 2: B",
                    "parent": "Top Level",
                    "children": [
                        {
                            "name": "Son of B",
                            "parent": "Level 2: B"
                        },
                        {
                            "name": "Daughter of B",
                            "parent": "Level 2: B"
                        }
                    ]

                },
                {
                    "name": "Level 2: C",
                    "parent": "Top Level",
                    "children": [
                        {
                            "name": "Son of C",
                            "parent": "Level 2: C"
                        },
                        {
                            "name": "Daughter of C",
                            "parent": "Level 2: C"
                        }
                    ]

                }
            ]
        }
    ];

    // ************** Generate the tree diagram	 *****************
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 500 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    /**
     * Creates a new tree layout with the default settings: the default sort order is null; the default children
     * accessor assumes each input data is an object with a children array; the default separation function uses
     * one node width for siblings, and two node widths for non-siblings; the default size is 1×1.
     */
    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = treeData[0];
    root.x0 = height / 2;
    root.y0 = 0;

    update(root);

    ///same as selecting window.frameElement: Returns the element (such as <iframe> or <object>)
    // in which the window is embedded, or null if the window is top-level.
    d3.select(self.frameElement).style("height", "500px");

    function update(source) {

        // Compute the new tree layout.
        // method reverses an array in place. The first array element becomes the last and the last becomes the first.
        /**
         * Runs the tree layout, returning the array of nodes associated with the specified root node. The tree layout is part of D3's family of hierarchical layouts.
         * These layouts follow the same basic structure: the input argument to the layout is the root node of the hierarchy, and the output return value is an array
         * representing the computed positions of all nodes
         * @type {any}
         */
        var nodes = tree.nodes(root).reverse(),
            /**
             * Given the specified array of nodes, such as those returned by nodes,
             * returns an array of objects representing the links from parent to child for each node.
             * Leaf nodes will not have any links. Each link is an object with two attributes:
                    source - the parent node (as described above).
                    target - the child node.
             */
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Define the div for the tooltip by appending the div to the body
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("mouseover", function(d) {//mouseover for the tooltip information
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.name+ " " + d.url + " " + "Out Value " +fakeData()) //playing around with passing data
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }).on("contextmenu",  click)
            .on("click",function (d) {//onlcick function that activates the hyperlink
                console.log(d.link);//todo add linking when pulled into main program
            });//capture left click then call the click function

        //fake function to proof the passing of data to the tooltip
        function fakeData(){
            var data= setInterval(function () {
                return Math.random * 10;
            },1000);
            return data;
        }
        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeEnter.append("text")
            .attr("x", function(d) { return d.children || d._children ? -13 : 13; })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    // Toggle children on click.
    function click(d) {
        //prevent the default left click window
        d3.event.preventDefault();
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }


});