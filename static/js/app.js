// from data.js
var tableData = data;

// YOUR CODE HERE!

var tbody = d3.select("tbody");
var list = d3.select("#filter-out")
var k = 0;

// HTML IDs of input boxes
var filter_inputs = ["datetime", "city", "state", "country", "shape"]
tablizer(data);

// Create table of data reseting table each time function is called. USed for resting and filtering table.
function tablizer(table) {
  tbody.html("");

  table.forEach((sighting) => {
    var row = tbody.append("tr");
      Object.entries(sighting).forEach(([key, value]) => {
        var cell = row.append("td");
          cell.text(value);
    });
  });
};


// Get select filter option's starting value
select_value = d3.select("#selector").property("value")
var ID = `${select_value}_item`
var desc = select_value

// hide filter box of previous filter when deselected, update select value to current (future's previous) value
function hidefilter(previous) {
  document.getElementById(previous).style.display = 'none';
    console.log('Hide:',previous)
    select_value = d3.select("#selector").property("value")
    ID = `${select_value}_item`
    desc = select_value
};

// On change, select HTML calls function and inputs value into filter, showing the filter box with correlating ID
function showfilter(filter) {
  document.getElementById(filter).style.display = "block";
    hidefilter(select_value);
  console.log('Show:',select_value)
};

// When input is detected, make new list item. If it's the first item (k = 0), then also output "Active Filters"
var inputBox = d3.selectAll("input");
inputBox.on("change", lister);

var bouncer = []

function lister(event) {
  var change = d3.event.target.value;
  if (k == 0) {
    var active = `Active Filters:`
    list.append("li").attr("id","active").append("u").text(active);
  };
  var entry = `[&#215] ${desc}: ${change}`;

    // Do not include blank input boxes and if ID is already in use (aka different input in same box) then remove current list item and 
    //input new one with same ID. The bouncer will always check ID's before new entries. Else if input box is cleared, remove correlating list item.
    if (change !== "") {
      if (bouncer.includes(ID) === true) {
        document.getElementById(ID).remove();
        list.append("a").append("li").attr("class","item").attr("id",`${ID}`).attr("value",`${desc}`).html(entry);
        // console.log("no duplicates")
      }
      else {
        list.append("a").append("li").attr("class","item").attr("id",`${ID}`).attr("value",`${desc}`).html(entry);
        bouncer.push(ID)
        console.log(change, bouncer);
        k = 1;
      };
    }
    else if (change == "" && bouncer.includes(ID) === true) {
      document.getElementById(ID).remove();
    };

    // detect when list item is clicked, get its id and text value;
    d3.selectAll(".item").on("click", function() {
      var whiskey = d3.select(this);
      var soda = whiskey.attr("id");
      var rocks = whiskey.text().split(": ")[1];
      var scotch;

      //Get id from input box by matching input value (rocks) to property value, store and pass onto 86.
      filter_inputs.forEach((input) => {
        var value = d3.select(`#${input}`).property("value");
        if (rocks == value) {
          scotch = input;
          // console.log(scotch);
        }
      });
      
      console.log(`Item Remove: ID = ${soda}, Value = ${rocks}, FilterID = ${scotch}`)
      eightysixed(soda, scotch);
    });
};

// When list item is selected, reset input box to null, and remove html for that item
function eightysixed(lastcall, kickout) {
  document.getElementById(lastcall).remove();
  document.getElementById(kickout).value = "";

  //remove item from bouncer array to prevent error for re entering filter
  var barhop = [];
  for (var j = 0; j < bouncer.length; j++) {
    if (bouncer[j] !== lastcall) {
      barhop.push(bouncer[j])
    }
  }
  bouncer = barhop;
  console.log(bouncer)
  activereset();
}

// when bouncer array = 0, when all items have been clicked to be removed, remove "Active Filters" text too.
function activereset() {
  if (bouncer.length == 0) {
    list.html("");
    k = 0;
  }
}


//Reset button clears all filter boxes and resets chart
var resetbutton = d3.select("#reset-btn");
resetbutton.on("click", function() {
  
  //reset lists on click toos
  list.html("")
  k=0;
  bouncer = [];

  filter_inputs.forEach((input) => {
    document.getElementById(input).value = "";
  });

  tablizer(data);
});

// Filter table based on inputs, create array of all inputs. MUST CORRELATE TO ORDER OF INPUTS IN HTML. Convert strings to lower case
var filterbutton = d3.select("#filter-btn");
filterbutton.on("click", function() {
  
  var inputs_all = []

  filter_inputs.forEach((input) => {
    var arr = d3.select(`#${input}`).property("value");
      if (typeof arr === 'string') {
        arr = arr.toLowerCase();
      }
    inputs_all.push(arr);
  });

  console.log(`Filters`, inputs_all) 

  // Reset table if filtered w/ no specified filters by detecting count of blanks ""
  var i = 0
  inputs_all.forEach((detect) => {
    if (detect === "") {
      i = i + 1
    }
  });
  
  if (i == filter_inputs.length) {
    tablizer(data);
  }

  else {
  
  var filteredData = data

  //filter data based on specified filters, skip blank filters.
  for (var j = 0; j < inputs_all.length; j++) {
    if (inputs_all[j] !== "") {
      filteredData = filteredData.filter(x => x[filter_inputs[j]] === inputs_all[j])
    }
  }
 
    tablizer(filteredData);
  } 
});

