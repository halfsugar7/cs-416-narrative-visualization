var currentSlide = 0;
// var currentYear_global = 2001;

const colorMapping = {
  'USA': '#1f77b4',  // Blue
  'China': '#ff7f0e',  // Orange
  'India': '#2ca02c',  // Green
  'Brazil': '#d62728',  // Red
  'Germany': '#9467bd',  // Purple
  'UK': '#8c564b',  // Brown
  'France': '#e377c2',  // Pink
  'Italy': '#7f7f7f',  // Gray
  'Canada': '#bcbd22',  // Olive
  'Australia': '#17becf'  // Cyan
  // Add more countries and colors as needed
};

var minGDP = 987;
var maxGDP = 62795;



function projectSolarScatterPlot(currentYear) {
  console.log("currentYear:", currentYear);
  const margin = { top: 10, right: 30, bottom: 50, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  var minEnergy = 100;
  var maxEnergy = 1170;
  var myColor = d3.scaleOrdinal().domain(["USA", "China", "India", "Brazil", "Germany", "UK", "France", "Italy", "Canada", "Australia"]).range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
  const svg = d3.select("#scatterplot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Load both CSV files
  Promise.all([
    d3.csv("data/filtered_GDP_per_capita.csv"),
    d3.csv("data/global_renewable_energy_production.csv")
  ]).then(([gdpData, energyData]) => {
    // Filter GDP data by currentYear
    console.log("currentYear:", currentYear);
    gdpData = gdpData.filter(d => +d.Year === currentYear);
    gdpData.forEach(d => {
      d.Year = +d.Year;
      d.GDPperCapita = +d.GDPperCapita;
    });
    
    // Prepare energy data
    energyData.forEach(d => {
      d.Year = +d.Year;
      d.SolarEnergy = +d.SolarEnergy;
      d.WindEnergy = +d.WindEnergy;
      d.HydroEnergy = +d.HydroEnergy;
    });

    // Merge datasets based on Year and Country
    const mergedData = gdpData.map(gdpItem => {
      const energyItem = energyData.find(e => e.Country === gdpItem.Country && e.Year === gdpItem.Year);
      return {
        ...gdpItem,
        ...energyItem
      };
    }); // Filter out any data without SolarEnergy

    console.log("Merged Data:", mergedData);

    // Add X axis for GDP per Capita
    const x = d3.scaleLog().base(10).domain([minGDP, maxGDP]).range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("GDP per Capita");

    // Add Y axis for Solar Energy
    const y = d3.scaleLog().base(10).domain([minEnergy, maxEnergy]).range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text("Solar Energy");

    // Add a scale for bubble size
    const z = d3.scaleSqrt()
      .domain([0, d3.max(mergedData, d => d.SolarEnergy)])
      .range([2, 20]);

    // Add dots
    svg.append('g')
      .selectAll("circle")
      .data(mergedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.GDPperCapita))
      .attr("cy", d => y(d.SolarEnergy))
      .attr("r", d => z(d.SolarEnergy))
      .attr('fill', d => myColor(d))
      .attr("opacity", 0.7);

    // Add labels
    svg.selectAll("text.label")
      .data(mergedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.GDPperCapita) + z(d.SolarEnergy) * 1.02)  // Adjust x position
      .attr("y", d => y(d.SolarEnergy) - z(d.SolarEnergy) * 1.02)  // Adjust y position
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text(d => d['Country Code'])  // Use country code
      .style("font-size", "10px")
      .style("fill", "black");
  }).catch(error => {
    console.error("Error loading data:", error); // Log errors if data loading fails
  });
}



// Summary for Domain Settings
// Here are the suggested domains for each type:

// Solar Energy:

// d3.scaleLinear().domain([0, 1166.7])
// Wind Energy:

// d3.scaleLinear().domain([118.7, 1482.9])
// Hydro Energy:

// d3.scaleLinear().domain([217.1, 1975.6])
// Total Renewable Energy:

// d3.scaleLinear().domain([1095.9, 4628.2])