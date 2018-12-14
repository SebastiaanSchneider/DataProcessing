// Name: Sebastiaan Schneider
// Student Number: 10554769

// Set up the various elements on the page
d3.select("head").append("title").text("D3 Scatterplot");
d3.select("body").append("p").text("This graph represents the relationship between the percentage of women in the field of science within a country, and the consumer happiness in that country");
var svg = d3.select("body").append("svg");
var countryMenu = d3.select("body").append("div");
var timeMenu = d3.select("body").append("div");
d3.select("body").append("p").text("Some data may be missing!").style("color", "red");
d3.select("body").append("p").text("Sources:");
d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015");
d3.select("body").append("p").text("http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015");
d3.select("body").append("footer").text("Made by Sebastiaan Schneider, student number: 10554769");


// The following initialize a number of set variables used later on:
// Size of the svg
var width = 800;
var height = 450;

// Gives the svg element its attributes
svg.attr("width", width).attr("height", height);
svg.append("rect").attr("width", "100%").attr("height", "100%")
  .attr("fill", "66a61e").attr("opacity", 0.75);

// Margins within which the actual chart will go
var margin = {top: height * 0.05, bottom: height * 0.1,
              left: width* 0.075, right: width * 0.1};

// Size of the chart
var chartWidth = width - margin.left - margin.right * 1.75;
var chartHeight = height - margin.top - margin.bottom;

// Global variable that links the legend and the cirlce elements through color
var choice = "all";

// Global variables that hold the dataset. timeData currently is not used,
// but it seemed like it might be useful to have
var countryData = {};
var timeData = {};

// Saves the address and data requests
var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015";
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015";
var requests = [d3.json(womenInScience), d3.json(consConf)];


// Adds functionality to the dropdown bar for the countries
countryMenu.on('change', function(){

  // selects the country choice
  itemOne = d3.select(this)
          .select("select")
          .property("value");

  // selects the time choice
  itemTwo = timeMenu.select("select")
            .property("value");

  // Gets the data for the entered choices
  items = dataList(itemOne, itemTwo);

  // Removes the contents of the svg
  cleanGraph();

  // Draws the new contents for the svg
  drawPlot(items);

  // Adds the legend
  if (itemOne === "all"){
    choice = "all";
    drawLegend(Object.keys(countryData));
  }
  else{
    choice = "not";
    drawLegend(Object.keys(timeData));
  }
});


// Adds functionality to the dropdown bar for the countries, following the
// same logic as the one above
timeMenu.on('change', function(){

  itemOne = countryMenu.select("select")
            .property("value");

  itemTwo = d3.select(this)
            .select("select")
            .property("value");


  items = dataList(itemOne, itemTwo);
  cleanGraph();
  drawPlot(items);
  if (itemOne === "all"){
    choice = "all";
    drawLegend(Object.keys(countryData));
  }
  else{
    choice = "not";
    drawLegend(Object.keys(timeData));
  }
});


// Activates the initial chart once the data has been received
Promise.all(requests).then(function(response) {

  // Transforms the data into useful objects
  dataOne = transformResponse(response[0]);
  dataTwo = transformResponse(response[1]);

  // Combines the data into one useable object
  totalData = combineResponse(dataOne, dataTwo);

  // Adjusts the "view" of the data, which mainly influences initial setup
  countryData = totalData[0];
  timeData = totalData[1];

  // Creates the arrays that will be passed into the dropdown menus
  menuOne = Object.keys(countryData);
  menuOne.unshift("all");
  menuTwo = Object.keys(timeData);
  menuTwo.unshift("all");

  // Saves the settings for the initial setup
  set = dataList("all", "all");

  // Draws the chart
  drawPlot(set);
  drawLegend(Object.keys(countryData));

  // Adds items to the dropdown menus
  createMenus(menuOne, menuTwo);
})
// Intercepts any errors
.catch(function(e){
  throw(e);
});


// This is the initial data interpreter, returning values from the JSON that
// was returned from the accessed website
function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

// Even een pijnpuntje:
// Van deze volgende regel heb ik een klein stukje weg moeten
// halen om de code werkend te krijgen voor beide JSON's.
// Het heeft me enorm lang geduurd om deze code te verwerken en
// die oplossing te vinden, waar ik alsnog weinig van heb
// geleerd, wat dus erg frustrerend was...
                let tempString = string.split(":");
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            };
        });
    });

    // return the finished product!
    return dataArray;
};


// This returns an object containing all of the data
function combineResponse(first, second){

  // Saves every item into a country-based object
  countryObj = {};
  first.forEach(function(one){
    if(!countryObj[one.Country]){
      countryObj[one.Country] = {};
    }
    second.forEach(function(two){
      if(one.Country === two.Country && one.time === two.time){
        countryObj[one.Country][one.time] = [one.datapoint, two.datapoint]
      }
    });
  });

  // Saves every item into a time-based object
  timeObj = {};
  first.forEach(function(one){
    if(!timeObj[one.time]){
      timeObj[one.time] = {};
    }
    second.forEach(function(two){
      if(one.Country === two.Country && one.time === two.time){
        timeObj[one.time][one.Country] = [one.datapoint, two.datapoint]
      }
    });
  });

  return [countryObj, timeObj]
};


// Returns items based on the entered choices
function dataList(countri, tyme){

  // This loop is used when all items are entered
  if(countri === "all" && tyme === "all"){
    let list = [];
    for (key of Object.keys(countryData)){
      for (X of Object.keys(countryData[key])){
        item = [countryData[key][X][0], countryData[key][X][1]];
        list.push(item);
      }
    }
    return list;
  }

  // This loop is used when all countries, but a specific year is entered
  else if (countri === "all" && tyme !== "all") {
    let list = [];
    for (key of Object.keys(countryData)){
        for (X of Object.keys(countryData[key])){
          if (X === tyme){
            item = [countryData[key][X][0], countryData[key][X][1]];
            list.push(item);
          }
        }
      }
    return list;
  }

  // This loop is used when all years, but a specific country is entered
  else if (countri !== "all" && tyme === "all") {
    let list = [];
    for (key of Object.keys(countryData)){
      if (key === countri){
        for (X of Object.keys(countryData[key])){
            item = [countryData[key][X][0], countryData[key][X][1]];
            list.push(item);
        }
      }
    }
    return list;
  }

  // This loop is used when both a specific country and a specific year
  // are entered
  else {
    let list = [];
    for (key of Object.keys(countryData)){
      if (key === countri){
        for (X of Object.keys(countryData[key])){
          if (X === tyme){
            item = [countryData[key][X][0], countryData[key][X][1]];
            list.push(item);
          }
        }
      }
    }
    return list;
  }
};


// This draws the dots, axes, and labels
function drawPlot(data){

  // These collect the lowest and highest values for the x and y axes, and
  // adds a little space to the maximum, to ensure the axes are long enough
  minX = d3.min(data, function(d){ return d[0]; });
  maxX = d3.max(data, function(d){ return d[0] + 1; });
  minY = d3.min(data, function(d){ return d[1]; });
  maxY = d3.max(data, function(d){ return d[1] + .4; });

  // Total amount of bars
  amount = data.length;

  // Prepares to calculate the width and height of every bar
  barWidth = chartWidth / amount;
  barHeight = chartHeight / maxX;

  // Creates the scales for placing the bars
  xScale = d3.scaleLinear().domain([minX, maxX])
             .range([margin.left, chartWidth + margin.left]);
  yScale = d3.scaleLinear().domain([minY, maxY])
             .range([chartHeight + margin.top, margin.top]);

  // Creates cirle elements for every item passed in
  dots = svg.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
     .attr("cx", function(d) { return xScale(d[0]); })
     .attr("cy", function(d) { return yScale(d[1]); })
     .attr("r", 5)
     .attr("opacity", 0.75)
     .attr("fill", function(d){
                    item = checkData(d);
                    var color = chooseColor(item);
                    return color;
                   })
     .attr("data-legend", function(d){
                            return d;
                          });

  // Prepares the axes
  xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  yAxis = d3.axisLeft().scale(yScale).tickFormat(d3.format("d"));

  // Places the axes
  svg.append("g").attr("transform", "translate("+
    (xScale(minX) - margin.left - 5) + "," +
    (chartHeight + margin.top + 5) + ")")
    .call(xAxis);
  svg.append("g").attr("transform", "translate("+
    (margin.left - 5) + "," + (yScale(maxY) - margin.top + 5) + ")")
    .call(yAxis);

  // Adds a texts block above the chart
  svg.append("text").attr("transform", "translate(" + (width / 2) + ","
    + (height * 0.05) + ")").style("text-anchor", "middle")
    .text("A comparison of women in science and consumer happiness")
    .attr("fill", "white");

  // Adds a text block along the x axis
  svg.append("text").attr("transform", "translate(" + (width / 2) + ","
    + (height * 0.98) + ")").style("text-anchor", "middle")
    .text("The percentage of women in science").attr("fill", "white");

  // Adds a text block along the y axis
  svg.append("text").attr("transform", "rotate(-90)")
    .attr("y", margin.left / 3).attr("x", 0 - (height / 2))
    .style("text-anchor", "middle").text("Consumer happiness")
    .attr("fill", "white");
};


// Draws the legend
function drawLegend(data){

  // Appends a legend element to the svg
  legend = d3.select('svg').append('g');

  // Creates an element for each of the items passed
  legend.selectAll("g")
    .data(data)
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr("width", width * .5)
      .attr("height", height * .5)
      .attr("transform", function(d, i){
                           return "translate(60," + i * 20 + ")";
                         });

  // Adds a little block, colored to match the associated data
  legend.selectAll("legend")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", chartWidth)
      .attr("y", 9)
      .attr("width", 18)
      .attr("height", 18)
      .attr("transform", function(d, i){
                           return "translate(60," + i * 20 + ")";
                         })
      .style("fill", function(d) {
                       return chooseColor(d);
                     });

  // Adds the information text
  legend.selectAll("legend")
    .data(data)
    .enter()
    .append("text")
      .attr("x", chartWidth + 20)
      .attr("y", 18)
      .attr("dy", ".40em")
      .attr("transform", function(d, i){
                           return "translate(60," + i * 20 + ")";
                         })
      .style("text-anchor", "start")
      .style("fill", function(d) {
                       return chooseColor(d);
                     })
      .text(function(d) {
              return d;
            });
};


// Removes all the elements from the svg, making room for the new contents
function cleanGraph(){
  svg.selectAll("g").remove();
  svg.selectAll("circle").remove();
};


// Adds the available options to the dropdown menus
function createMenus(first, second){

  // Adds options for each item in the passed array
	countryMenu.append("select")
	.selectAll("option")
    .data(first)
    .enter()
    .append("option")
      .attr("value", function(d){
          return d;
      })
      .text(function(d){
          return d;
      });

  // Adds options for each item in the passed array
  timeMenu.append("select")
	.selectAll("option")
    .data(second)
    .enter()
    .append("option")
      .attr("value", function(d){ return d; })
      .text(function(d){ return d; });
};


// Links the dots and their data back to the legend items
function checkData(item){

  // If the legend is set to countries, it follows this loop
  if (choice === "all"){
    for (key of Object.keys(countryData)){
      for (X of Object.keys(countryData[key])){
        if (item[0] === countryData[key][X][0] &&
           item[1] === countryData[key][X][1]){
          return key;
        }
      }
    }
  }

  // If not, the legend is set to time, so the item follows this loop
  else{
    for (key of Object.keys(timeData)){
      for (X of Object.keys(timeData[key])){
        if (item[0] === timeData[key][X][0] &&
          item[1] === timeData[key][X][1]){
          return key;
        }
      }
    }
  }
};


// Returns the appropriate color for every item entered
function chooseColor(item){

  // Object for the colors used by countries
  var countryColors = {"France": '#d73027', "Germany": '#f46d43',
    "Korea": '#fdae61', "Netherlands": '#ffffbf', "Portugal": '#74add1',
    "United Kingdom": '#4575b4'};

  // Object for the colors used by years
  var timeColors = colors = {2007: '#d73027', 2008: '#f46d43', 2009: '#fdae61',
    2010: '#fee090', 2011: '#ffffbf', 2012: '#e0f3f8', 2013: '#abd9e9',
    2014: '#4575b4', 2015: '#4575b4'};

  // Checks which type the entered item is, and return a color to match
  if (Object.keys(countryColors).includes(item)){
    return countryColors[item];
  }
  else{
    return timeColors[item];
  }
};
