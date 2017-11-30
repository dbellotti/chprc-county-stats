var californiaStats = {
  url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT2hW8jxEbaL4RnCeZjxw4e7QzWRtiMTlUo6jOr67dMvEeE-5Q7sC9GMRUVU-NwsC4OsvbCUObQib4M/pub?output=csv",
  svg: document.querySelector("svg > g"),
  countyObjs: document.querySelectorAll("svg > g > g > polygon, svg > g > g > polyline, svg > g > g > path"),
  json: "",
  
  init: function() {
    this._fetch();

    var i = this.countyObjs.length;
    while(i--) {
      this.countyObjs[i].addEventListener("mouseenter", function(e) {
        this.svg.appendChild(e.target).classList.add("hovered");
        this._displayHoveredCountyName(e.target);
        this._appendSelected();
      }.bind(this));
      
      this.countyObjs[i].addEventListener("mouseleave", function(e) {
        this.svg.appendChild(e.target).classList.remove("hovered");
        this._removeHoveredCountyName();
        this._appendSelected();
      }.bind(this));
      
      this.countyObjs[i].addEventListener("click", function(e) {
        this._update(e.target);
      }.bind(this));
    }
  },

  _fetch: function() {
    Papa.parse(this.url, {
      download: true,
      header: true,
      complete: function(results) {
      	console.log("Parsing complete:", results);

        var result = results.data.reduce(function(map, obj) {
          map[obj[""]] = obj;
          delete obj[""];
          return map;
        }, {});

        console.log(result);
        this.json = result;      
        this._colorizeCounties();
      }.bind(this)
    });
  },
  
  _colorizeCounties: function() {
    let totalPopulation = 350141170;
    
    this.countyObjs.forEach(function(e) {
      if ( this.json[e.id]["Population"] ) {
        let lum = 94 - Math.round(this.json[e.id]["Population"] / totalPopulation * 10000);
        e.style.fill = "hsl(20, 100%, " + lum + "%)";
      }
    }.bind(this));
  },

  _displayHoveredCountyName: function(target) {
    let displayElem = document.querySelector("#hovered-county-name");
    this._updateHeader(displayElem, target.id);
  },

  _removeHoveredCountyName: function() {
    let displayElem = document.querySelector("#hovered-county-name");
    displayElem.innerHTML = "";
  },
  
  _update: function(target) {
    let json = this.json[target.id];
    let headerElem = document.querySelector(".info > .info--header > h3");
    let ethnicityElem = document.querySelector("tbody#ethnicity");
    let ageElem = document.querySelector("tbody#age");
    let sexElem = document.querySelector("tbody#sex");
    let transmissionElem = document.querySelector("tbody#transmission-categories");
    let prevalenceElem = document.querySelector("tbody#prevalence");

    this._updateHeader(headerElem, target.id);
    this._updateInfo(ethnicityElem, this._extractAttrs(json, "Race", " - "));
    this._updateInfo(ageElem, this._extractAttrs(json, "Age", " - "));
    this._updateInfo(sexElem, this._extractAttrs(json, "Sex", " - "));
    this._updateInfo(transmissionElem, this._extractAttrs(json, "Transmission Categories", " - "));
    this._updateInfo(prevalenceElem, this._extractAttrs(json, "Prevalence", " - "));

    this._clearPreviousSelection();
    target.classList.add("selected");
    this._appendSelected();
  },
  
  _clearPreviousSelection: function() {
    let selected = document.querySelectorAll(".selected");
    if ( selected.length > 0 ) {
      selected.forEach(function(item) {
        item.classList.remove("selected");
      });
    }
  },
  
  _appendSelected: function() {
    let selected = document.querySelectorAll(".selected");
    if ( selected.length > 0 ) {
      selected.forEach(function(item) {
        this.svg.appendChild(item);
      }.bind(this));
    }
  },
  
  _extractAttrs: function(json, attr, delimeter) {
    let attrs = {};
    
    Object.keys(json).forEach(function(key) {
      let keys = key.split(delimeter);
      
      if ( keys[0] === attr ) {
        let subAttr = keys[1];
        
        attrs[subAttr] = attrs[subAttr] || {};
  
        if ( keys[2] === "Diagnosed" ) {
          attrs[subAttr]["Diagnosed"] = json[key];
        } else if ( keys[2] === "PLWH" ) {
          attrs[subAttr]["PLWH"] = json[key];
        }
      }
    });
    
    console.log("Parsed " + attr + " into: " + JSON.stringify(attrs));
    return attrs;
  },
  
  _updateHeader: function(elem, countyName) {
    elem.innerHTML = countyName + " County";
  },
  
  _updateInfo: function(elem, attrs) {
    let html = "";
    
    Object.keys(attrs).forEach(function(key) {
      html += "<tr>" +
                "<th>" + key + "</th>" +
                "<td>" + attrs[key]["Diagnosed"] + "</td>" +
                "<td>" + attrs[key]["PLWH"] +"</td>" +
              "</tr>";
    });
    
    console.log("Html: " + html);
    
    elem.innerHTML = html;
    return html;
  }

}

californiaStats.init();


