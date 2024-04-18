document.querySelectorAll("button").forEach((x) => {
  if (x.id === "route" || x.id==="book") {
    return;
  }
  x.addEventListener("click", (event) => {
    selector = `#${x.id}+.dropdown-menu`;
    document.querySelector(selector).classList.toggle("active");
  });
});

let $ = (ele) => document.getElementById(ele);


$('form').addEventListener("submit", (event) => {
    if (!handleSubmit()) {
        event.preventDefault();
    }
})
function addressAutocomplete(containerElement, callback, options) {
  const MIN_ADDRESS_LENGTH = 3;
  const DEBOUNCE_DELAY = 300;

  // create container for input element
  const inputContainerElement = document.createElement("div");
  inputContainerElement.setAttribute("class", "input-container");
  containerElement.appendChild(inputContainerElement);

  // create input element
  const inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  inputContainerElement.appendChild(inputElement);

  // add input field clear button
  const clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = "";
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  inputContainerElement.appendChild(clearButton);

  /* We will call the API with a timeout to prevent unneccessary API activity.*/
  let currentTimeout;

  /* Save the current request promise reject function. To be able to cancel the promise when a new request comes */
  let currentPromiseReject;

  /* Focused item in the autocomplete list. This variable is used to navigate with buttons */
  let focusedItemIndex;

  /* Process a user input: */
  inputElement.addEventListener("input", function (e) {
    const currentValue = this.value;

    /* Close any already open dropdown list */
    closeDropDownList();

    // Cancel previous timeout
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true,
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");

    // Skip empty or short address strings
    if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
      return false;
    }

    /* Call the Address Autocomplete API with a delay */
    currentTimeout = setTimeout(() => {
      currentTimeout = null;

      /* Create a new promise and send geocoding request */
      const promise = new Promise((resolve, reject) => {
        currentPromiseReject = reject;

        // The API Key provided is restricted to JSFiddle website
        // Get your own API Key on https://myprojects.geoapify.com
        const apiKey = "847104cf6c4a438798542c36175206a2";

        var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          currentValue
        )}&format=json&limit=5&apiKey=${apiKey}`;

        fetch(url).then((response) => {
          currentPromiseReject = null;

          // check if the call was successful
          if (response.ok) {
            response.json().then((data) => resolve(data));
          } else {
            response.json().then((data) => reject(data));
          }
        });
      });

      promise.then(
        (data) => {
          // here we get address suggestions
          currentItems = data.results;

          /*create a DIV element that will contain the items (values):*/
          const autocompleteItemsElement = document.createElement("div");
          autocompleteItemsElement.setAttribute("class", "autocomplete-items");
          inputContainerElement.appendChild(autocompleteItemsElement);

          /* For each item in the results */
          data.results.forEach((result, index) => {
            /* Create a DIV element for each element: */
            const itemElement = document.createElement("div");
            /* Set formatted address as item value */
            itemElement.innerHTML = result.formatted;
            autocompleteItemsElement.appendChild(itemElement);

            /* Set the value for the autocomplete text field and notify: */
            itemElement.addEventListener("click", function (e) {
              inputElement.value = currentItems[index].formatted;
              callback(currentItems[index]);
              /* Close the list of autocompleted values: */
              closeDropDownList();
            });
          });
        },
        (err) => {
          if (!err.canceled) {
            console.log(err);
          }
        }
      );
    }, DEBOUNCE_DELAY);
  });

  /* Add support for keyboard navigation */
  inputElement.addEventListener("keydown", function (e) {
    var autocompleteItemsElement = containerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      var itemElements = autocompleteItemsElement.getElementsByTagName("div");
      if (e.keyCode == 40) {
        e.preventDefault();
        /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== itemElements.length - 1
            ? focusedItemIndex + 1
            : 0;
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 38) {
        e.preventDefault();

        /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
        focusedItemIndex =
          focusedItemIndex !== 0
            ? focusedItemIndex - 1
            : (focusedItemIndex = itemElements.length - 1);
        /*and and make the current item more visible:*/
        setActive(itemElements, focusedItemIndex);
      } else if (e.keyCode == 13) {
        /* If the ENTER key is pressed and value as selected, close the list*/
        e.preventDefault();
        if (focusedItemIndex > -1) {
          closeDropDownList();
        }
      }
    } else {
      if (e.keyCode == 40) {
        /* Open dropdown list again */
        var event = document.createEvent("Event");
        event.initEvent("input", true, true);
        inputElement.dispatchEvent(event);
      }
    }
  });

  function setActive(items, index) {
    if (!items || !items.length) return false;

    for (var i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }

    /* Add class "autocomplete-active" to the active element*/
    items[index].classList.add("autocomplete-active");

    // Change input value and notify
    inputElement.value = currentItems[index].formatted;
    callback(currentItems[index]);
  }

  function closeDropDownList() {
    const autocompleteItemsElement = inputContainerElement.querySelector(
      ".autocomplete-items"
    );
    if (autocompleteItemsElement) {
      inputContainerElement.removeChild(autocompleteItemsElement);
    }

    focusedItemIndex = -1;
  }

  function addIcon(buttonElement) {
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("viewBox", "0 0 24 24");
    svgElement.setAttribute("height", "24");

    const iconElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    iconElement.setAttribute(
      "d",
      "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
    );
    iconElement.setAttribute("fill", "currentColor");
    svgElement.appendChild(iconElement);
    buttonElement.appendChild(svgElement);
  }

  /* Close the autocomplete dropdown when the document is clicked. 
      Skip, when a user clicks on the input field */
  document.addEventListener("click", function (e) {
    if (e.target !== inputElement) {
      closeDropDownList();
    } else if (!containerElement.querySelector(".autocomplete-items")) {
      // open dropdown list again
      var event = document.createEvent("Event");
      event.initEvent("input", true, true);
      inputElement.dispatchEvent(event);
    }
  });
}

let sourcelat, sourcelon, destlat, destlon;
let src, dst;

addressAutocomplete(
  document.getElementById("autocomplete-container"),
  (data) => {
    console.log(data);
    if (data) {
      const coordinates = data;
      src = coordinates.address_line1 + " " + coordinates.address_line2;
      sourcelat = coordinates.lat;
      sourcelon = coordinates.lon;
      console.log("Latitude:", sourcelat);
      console.log("Longitude:", sourcelon);
    } else {
      console.log("No location selected.");
    }
  },

  {
    placeholder: "Pick-up location",
  }
);

addressAutocomplete(
  document.getElementById("autocomplete-container1"),
  (data) => {
    console.log(data);
    if (data) {
      const coordinates = data;
      dst = coordinates.address_line1 + " " + coordinates.address_line2;

      destlat = coordinates.lat;
      destlon = coordinates.lon;
      console.log("Latitude:", destlat);
      console.log("Longitude:", destlon);
      enableButton();
    } else {
      console.log("No location selected.");
    }
  },

  {
    placeholder: "Drop-off location",
  }
);

// const myAPIKey = "847104cf6c4a438798542c36175206a2";
// const fromWaypoint = [sourcelat,sourcelon]; // latutude, longitude
// const toWaypoint = [destlat,destlon]; // latitude, longitude
// const url = `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(',')}|${toWaypoint.join(',')}&mode=drive&details=instruction_details&apiKey=${myAPIKey}`;

// fetch(url).then(res => res.json()).then(result => {
//     console.log(result);
// }, error => console.log(err));

// L.geoJSON(routeResult, {
//   style: (feature) => {
//     return {
//       color: "rgba(20, 137, 255, 0.7)",
//       weight: 5
//     };
//   }
// }).bindPopup((layer) => {
//   return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
// }).addTo(map);

const map = L.map("my-map").setView([11.0168, 76.9558], 12);

// The API Key provided is restricted to JSFiddle website
// Get your own API Key on https://myprojects.geoapify.com
const myAPIKey = "847104cf6c4a438798542c36175206a2";

// Retina displays require different mat tiles quality
const isRetina = L.Browser.retina;

const baseUrl =
  "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
const retinaUrl =
  "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

// Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  attribution:
    'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
  apiKey: myAPIKey,
  maxZoom: 20,
  id: "osm-bright",
}).addTo(map);

let displayMap = (event) => {
  document.querySelector(".rides").classList.remove("hide");

  $("from").value = src;
  $("to").value = dst;

  event.preventDefault();
  if (sourcelat && destlat) {
    console.log("Ok");
    //   map = L.map('my-map').setView([11.0168, 76.9558], 12);

    // The API Key provided is restricted to JSFiddle website
    // Get your own API Key on https://myprojects.geoapify.com
    //   myAPIKey = "847104cf6c4a438798542c36175206a2";

    //   // Retina displays require different mat tiles quality
    //   isRetina = L.Browser.retina;

    //   baseUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
    //   retinaUrl = "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

    // Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
    //   L.tileLayer(isRetina ? retinaUrl : baseUrl, {
    //     attribution: 'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | <a href="https://openmaptiles.org/" rel="nofollow" target="_blank">© OpenMapTiles</a> <a href="https://www.openstreetmap.org/copyright" rel="nofollow" target="_blank">© OpenStreetMap</a> contributors',
    //     apiKey: myAPIKey,
    //     maxZoom: 20,
    //     id: 'osm-bright',
    //   }).addTo(map);

    // calculate and display routing:
    // from 38.937165,-77.045590 (1920 Quincy Street Northwest, Washington, DC 20011, United States of America)
    const fromWaypoint = [sourcelat, sourcelon]; // latutude, longitude
    const fromWaypointMarker = L.marker(fromWaypoint).addTo(map).bindPopup(src);

    // to 38.881152,-76.990693 (1125 G Street Southeast, Washington, DC 20003, United States of America)
    const toWaypoint = [destlat, destlon]; // latitude, longitude
    const toWaypointMarker = L.marker(toWaypoint).addTo(map).bindPopup(dst);

    const turnByTurnMarkerStyle = {
      radius: 5,
      fillColor: "#fff",
      color: "#555",
      weight: 1,
      opacity: 1,
      fillOpacity: 1,
    };

    fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(
        ","
      )}|${toWaypoint.join(",")}&mode=drive&apiKey=${myAPIKey}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          // Note! GeoJSON uses [longitude, latutude] format for coordinates
          L.geoJSON(result, {
            style: (feature) => {
              return {
                color: "rgba(20, 137, 255, 0.7)",
                weight: 5,
              };
            },
          })
            .bindPopup((layer) => {
              return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
            })
            .addTo(map);

          // collect all transition positions
          const turnByTurns = [];
          result.features.forEach((feature) =>
            feature.properties.legs.forEach((leg, legIndex) =>
              leg.steps.forEach((step) => {
                const pointFeature = {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates:
                      feature.geometry.coordinates[legIndex][step.from_index],
                  },
                  properties: {
                    instruction: step.instruction.text,
                  },
                };
                turnByTurns.push(pointFeature);
              })
            )
          );

          L.geoJSON(
            {
              type: "FeatureCollection",
              features: turnByTurns,
            },
            {
              pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, turnByTurnMarkerStyle);
              },
            }
          )
            .bindPopup((layer) => {
              return `${layer.feature.properties.instruction}`;
            })
            .addTo(map);
        },
        (error) => console.log(error)
      );
  }

  // distance = (Math.acos(Math.sin(sourcelat) * Math.sin(destlat) + Math.cos(sourcelat) * Math.cos(destlat) * Math.cos(destlon - sourcelon)) * 6471);
  // console.log(distance);

  var from = turf.point([sourcelat, sourcelon]);
  var to = turf.point([destlat, destlon]);

  var distance = turf.distance(from, to);
  console.log(distance);

  displayFare(distance);
};
let enableButton = () => {
  console.log("ok");
  document.getElementById("route").removeAttribute("disabled");
  document.getElementById("route").style.color = "white";
  document.getElementById("route").style.backgroundColor = "black";
};
//    let type = document.querySelector('input[name="ride"]:checked').value;
let autoFare, carFare;
let displayFare = (distance) => {
  autoFare = distance * 6.43;
  carFare = distance * 11.32;
  $("fare-auto").innerHTML = "&#8377; " + Math.round(autoFare,2);
  $("fare-car").innerHTML = "&#8377;" + Math.round(carFare,2);
};

let handleSubmit = () => {
  let type = document.querySelector('input[name="ride"]:checked').value;
//   $("mode").value = type;
  document.getElementsByName("fare")[0].value =
    type == "auto" ? Math.round(autoFare, 2) : Math.round(carFare,2);
    return true;
};
