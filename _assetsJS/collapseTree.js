/**
 * Created by jjenkins on 9/23/2016.
 */

define(['d3','jquery','bootstrap'],function (d3,$,bootstrap) {

    //high as I can get the variable without it being global
    'use strict';

    //set and reset my array
    //this uses closures to protect the array content
 var config = function() {
     var dataToCompareArray = [],
         bodyDomArray = [];

     //data to be push or reset into above array
     function dataPusher(dataToArray){
     if(dataToArray!= undefined) {
         dataToCompareArray.push(dataToArray);
     }
         return dataToCompareArray;
     }

     function dataReset() {
         dataToCompareArray = [];
     }

     //data to push for the body comparison dom elems
     function bodyDomPusher(bodyDomToArray){
         if(bodyDomToArray!= undefined) {
             bodyDomArray.push(bodyDomToArray);
         }
         return bodyDomArray;
     }

     function bodyDomReset() {
         bodyDomArray = [];
     }



     return {
         dataPusher: dataPusher,
         dataReset: dataReset,
         bodyDomPusher: bodyDomPusher,
         bodyDomReset:bodyDomReset

     }

 };
//reference to the config object
 var configuration = config();



    var treeData = [
        {
            "name": "Top Level",
            "parent": "null",
            "Dashboard":"www.d3js.com",
            "cfg1":"foobar.com",
            "cfg2":"foobar.com",
            "cfg3":"foobar.com",
            "docs":"foobar.com",
            "UserManuals":"foobar.com",
            "children": [
                {
                    "name": "Level 2: A",
                    "parent": "Top Level",
                    "Dashboard":"www.d3js.com",
                    "cfg1":"foobar.com",
                    "cfg2":"foobar.com",
                    "cfg3":"foobar.com",
                    "docs":"foobar.com",
                    "UserManuals":"foobar.com",
                    "children": [
                        {
                            "name": "Son of A",
                            "parent": "Level 2: A",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com",
                            "children": [
                                {
                                    "name": "Grandchild of A",
                                    "parent": "Level 3: A",
                                    "Dashboard":"www.d3js.com",
                                    "cfg1":"foobar.com",
                                    "cfg2":"foobar.com",
                                    "cfg3":"foobar.com",
                                    "docs":"foobar.com",
                                    "UserManuals":"foobar.com",
                                    "children": [
                                        {
                                            "name": "Great Grandchild of A",
                                            "parent": "Level 4: A",
                                            "Dashboard":"www.d3js.com",
                                            "cfg1":"foobar.com",
                                            "cfg2":"foobar.com",
                                            "cfg3":"foobar.com",
                                            "docs":"foobar.com",
                                            "UserManuals":"foobar.com"
                                        }
                                    ]
                                }
                                ]
                        },
                        {
                            "name": "Daughter of A",
                            "parent": "Level 2: A",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com"
                        }
                    ]
                },
                {
                    "name": "Level 2: B",
                    "parent": "Top Level",
                    "Dashboard":"www.d3js.com",
                    "cfg1":"foobar.com",
                    "cfg2":"foobar.com",
                    "cfg3":"foobar.com",
                    "docs":"foobar.com",
                    "UserManuals":"foobar.com",
                    "children": [
                        {
                            "name": "Son of B",
                            "parent": "Level 2: B",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com"
                        },
                        {
                            "name": "Daughter of B",
                            "parent": "Level 2: B",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com"
                        }
                    ]

                },
                {
                    "name": "Level 2: C",
                    "parent": "Top Level",
                    "Dashboard":"www.d3js.com",
                    "cfg1":"foobar.com",
                    "cfg2":"foobar.com",
                    "cfg3":"foobar.com",
                    "docs":"foobar.com",
                    "UserManuals":"foobar.com",
                    "children": [
                        {
                            "name": "Son of C",
                            "parent": "Level 2: C",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com"
                        },
                        {
                            "name": "Daughter of C",
                            "parent": "Level 2: C",
                            "Dashboard":"www.d3js.com",
                            "cfg1":"foobar.com",
                            "cfg2":"foobar.com",
                            "cfg3":"foobar.com",
                            "docs":"foobar.com",
                            "UserManuals":"foobar.com"
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
                div.html(d.name+ " " + d.url + " " + "Out Value ") //playing around with passing data
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
            }).on("contextmenu",  click)
            .on("click",function (d) {//onlcick function that activates the hyperlink
                d3.event.stopPropagation();
                comparisonModal(d);

            });//capture left click then call the click function




        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
        //for custom nodes try this
        // nodeEnter.append("path")
        //     .style("stroke", "black")
        //     .style("fill", "white")
        //     .attr("d", d3.svg.symbol()
        //         .size(200)
        //         .type(function(d) { if
        //         (d.value >= 9) { return "cross"; } else if
        //         (d.value <= 9) { return "diamond";}
        //         }));


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
            .data(links, function(d) {
                return d.target.id;
            });

        //select everything with the class of link
        var colorNum = 0;
        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("fill", "none") // sets the fill to none
            .attr("stroke", function (l) {
                colorNum++;
                if(colorNum<=2){
                    return "green";
                }
                if(colorNum<=8 && colorNum>2){
                    return "yellow";
                }
                if(colorNum>8){
                    return "red";
                }

            })
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

    /**
     * function that handles my right click resize the data
     * @param d
     */
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

    /**
     * Builds the comparison modal
     * @param datas the data that is to be queried and compared\
     * todo fix button links to other places
     */
    function comparisonModal(datas){


        //if the compare button is click added unbind to insure only clicks once
        $('#myModalTitle').text(datas.name);
        //allows for appending the links to the modal use a for loop
        //sort the json data on the modal
        if(datas.Dashboard!=undefined){
            //get the link to the dashboard and the name from the key

            $('#myModalBody').append("<button type='button' href='"+datas.Dashboard+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-dashboard pull-right'></i>"+Object.keys(datas)[2]+"</button>");
        }
        if(datas.cfg1!=undefined){
            //get the link to the dashboard and the name from the key
            $('#myModalBody').append("<button type='button' href='"+datas.cfg1+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-cog pull-right'></i> "+Object.keys(datas)[3]+"</button>");
        }
        if(datas.cfg2!=undefined){
            //get the link to the dashboard and the name from the key
            $('#myModalBody').append("<button type='button' href='"+datas.cfg2+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-send pull-right'></i> "+Object.keys(datas)[4]+"</button>");
        }
        if(datas.cfg3!=undefined){
            //get the link to the dashboard and the name from the key
            $('#myModalBody').append("<button type='button' href='"+datas.cfg3+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-stats pull-right'></i> "+Object.keys(datas)[5]+"</button>");
        }
        if(datas.docs!=undefined){
            //get the link to the dashboard and the name from the key
            $('#myModalBody').append("<button type='button' href='"+datas.docs+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-paperclip pull-right'></i> "+Object.keys(datas)[6]+"</button>");
        }
        if(datas.UserManuals!=undefined){
            //get the link to the dashboard and the name from the key
            $('#myModalBody').append("<button type='button' href='"+datas.UserManuals+"' class='btn btn-custom btnNav'><i class='glyphicon glyphicon-open-file pull-right'></i> "+Object.keys(datas)[7]+"</button>");
        }




        //show the modal that we can link from and add data to
        $('#myModal').modal('show');


        $('#addToCompare').off().click(function (e) {
            //remove the hidden class
            e.preventDefault();
            e.stopPropagation();
            if($("#compareBox" ).hasClass( "hidden" )){
                $("#compareBox").removeClass("hidden");
            }

            //if not in the array add it to the array
            if(!(configuration.dataPusher().includes(datas))){
                configuration.dataPusher(datas);
                $("#dataToCompare").append("<span class='label label-success'>"+datas.name+"</span>");
            }

            //if button to compare data is clicked hide the modal and reset the modal body
            $('#myModal').modal('hide');

        });

        //event listeners for modal
        //if the reset compare button is clicked
        /**
         * Resets the array and the dom elements
         */
        $('#resetToCompare').off().click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $("#dataToCompare").html("");
            $("#compareBox").addClass("hidden");
            configuration.dataReset();



        });

        /**
         * Event listener for running the comparison on the dom elem and data
         * do the comparison of the arrays here bro
         */
        $('#runComparison').off().click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            //set the title text
            $('#tableModalTitle').text("Comparison Table");
            //append a # sign to left head to show the numbers
            $('#tableModal_tableHead').append("<tr class='comparisonTableHead'> <th>#</th></tr>");
            //using spread syntax because of uknown amount of arguments
            //append the dom with the body of the table row of body data
            var data = configuration.dataPusher(),
                bodyDom;
            for (var i = 0; i < data.length; i++) {

                //create the compare data
                //append the header with the name of data to be compared
                $('.comparisonTableHead').append("<th>"+data[i].name+"</th>");
                //itterate to get the data for the point
                //todo get the reference to the data the will be compared from the json file then subscribe to that data and return a javascript object that holds the multiple arrays of data
              console.log(data[i].name);
                //todo create the amount of body tags that will need to fill with data
                // for (var i = 0; i < data[i].length; i++) {
                //     //create the table body with unique class names
                //     bodyDom = 'tbody_row_'+i;
                //     $('#tableModal_tableBody').append("<tr class='" + bodyDom + "' ><td scope='row'>" + i + "</td></tr>");
                //     //get an array of my body dom class elems to be used later
                //     configuration.bodyDomPusher(bodyDom);
                // }

            }
            //run the data comparison algorithim
            compareData(data);
        });

        //todo get the array of point data and compare the data to populate the dom with
        function compareData(dataToCompare){


            var bodyDomElem =  configuration.bodyDomPusher();

            //data to iterate over
            // for (var i = 0; i < array1.length; i++) {
            //     for (var j = 0; j < array2.length; j++) {
            //         if (array1[i] == array2[j]) {
            //             $('.'+bodyDom+i).append("<td>"+array1[i]+"</td>");
            //         }
            //     }
            // }


            //show the modal
            $('#tableModal').modal('show');
            //reset the comparison list
            $('#resetToCompare').click();
        }



        $("#myModal").on('hidden.bs.modal', function () {
            $('#myModalBody').html("");
        });

        $("#tableModal").on('hidden.bs.modal', function () {
            $('#tableModal_tableBody').html("");
            $('#tableModal_tableHead').html("");
        });
    }






});
