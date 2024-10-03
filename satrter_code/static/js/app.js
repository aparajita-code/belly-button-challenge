// Build the metadata panel
function buildMetadata(sample) {

  //delare the url variable within the function
  let url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"
   
  // use d3 to pull in data and establish variables by object
  d3.json(url).then((data) => {
     console.log(data);
   });        
    
    
    let metaData = data.metadata;
  
    

    // Filter the metadata for the object with the desired sample number
    let resultArray = data.samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
   
    

    // Use d3 to select the panel with id of `#sample-metadata`
     let panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
     panel.html("");

     
     
    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (key in result){
     panel.append("h6").text(`${key.toUpperCase()}: ${result[key]}`)
    };
  };



// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
   let resultArray = samples.filter(sampleObj => sampleObj.id ==sample);
   let result = resultArray[0]
    
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids
    let otu_labels = result.otu_labels
    let sample_values = result.sample_values;
     
    // Build a Bubble Chart
    let bubbleChart = {
      title: "Bacteria Cultures Per Sample",
      margin: {t:30, l:150},
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };
    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, bubbleChart);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}}`).reverse();
    let barData =  [
      {
        y:yticks,
        // Slice and reverse the input data to display correctly
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];
    
    let barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"},
      margin:{t:30, l:150}
    };

     
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    
    let sampleNames = data.names;
        

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    for(let i = 0; i < sampleNames.length; i++) {
      selector.append("option")
      .text(sampleNames[i])
      .property("value", sampleNames[i]);
    };
    
    // Get the first sample from the list
    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample)
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
