const selectedLocationDisplay = document.querySelector("#selectedLocationDisplay");
const locationBox = document.querySelector("#locationBox");
const selectedLocationText = document.querySelector("#selectedLocationText");
const gpsButton = document.querySelector("#gpsButton");
const searchInput = document.querySelector(".search-input");
const locationMenu = document.querySelector("#locationMenu");

const localities = [
"Vijay Nagar",
"Agrawal Nagar",
"Annapurna Nagar",
"Anoop Nagar",
"Anurag Nagar",
"Ashish Nagar",
"Balaji Vihar",
"Bangali Chouraha",
"Bengali Square",
"Bhawarkuan",
"Bhicholi Mardana",
"Bhuri Tekri",
"Bicholi Hapsi",
"Bombay Hospital Service Road",
"Chhavni",
"Chameli Devi Nagar",
"Chhawni",
"Chhoti Gwaltoli",
"Geeta Bhawan",
"Goyal Nagar",
"Jawahar Marg",
"Kalani Nagar",
"Kalindi Kunj",
"Kanadia Main Road",
"Kanadia Road",
"Khatiwala Tank",
"Khajrana",
"Khajrana Main Road",
"Krishna Pura",
"Lig Colony",
"Limbodi",
"Lokmanya Nagar",
"LIG Square",
"M.G. Road (MG Road)",
"Mahalaxmi Nagar",
"Mahalaxmi Nagar Colony",
"Mahesh Nagar",
"Manikbagh",
"Manishpuri",
"Manorama Ganj",
"Musakhedi",
"Nanda Nagar",
"Navlakha",
"Nehru Nagar",
"New Rani Bagh",
"Nipania",
"Niranjanpur",
"Old Palasia",
"Pardesipura",
"Patnipura",
"Pipliya Kumar",
"Pipaliyahana",
"Pipliyapala Regional Park Road",
"RNT Marg",
"Raj Mohalla",
"Rajendra Nagar",
"Rajwada",
"Rau",
"Rau Pithampur Road",
"Sarafa Bazaar",
"Sapna Sangeeta",
"Scheme No. 54",
"Scheme No. 71",
"Scheme No. 74-C",
"Scheme No. 78",
"Scheme No. 94",
"Scheme No. 114",
"Scheme No. 114 Part I",
"Scheme No. 114 Part II",
"Shalimar Township",
"Shree Nagar Extension",
"Shri Nagar",
"Silicon City",
"Snehlata Ganj",
"Sudama Nagar",
"Sukhlia",
"Sukhdev Nagar",
"Sukhliya",
"Sukhlia-Simar",
"Sudarshan Nagar",
"Telephone Nagar",
"Tilak Nagar",
"Vaibhav Nagar",
"Vaishali Nagar",
];

function showLocationBox() {
  locationBox.style.display = "block";
  searchInput.value = ""; // Clear search input when the location box opens
  searchInput.focus();
}

function hideLocationBox() {
  locationBox.style.display = "none";
}

function updateSelectedLocation(locationName) {
  selectedLocationText.textContent = locationName;
}

selectedLocationDisplay.addEventListener("click", function () {
  showLocationBox();
});

gpsButton.addEventListener("click", function () {
  if (locationBox.style.display === "none") {
    hideLocationBox();
    return;
  }

  gpsButton.disabled = true;
  detectLocationText();
});

function detectLocationText() {
  const textToType = "Detecting Location...";
  let index = 0;
  selectedLocationText.textContent = ""; // Clear the text before starting the typewriter effect

  function typeWriter() {
    if (index < textToType.length) {
      selectedLocationText.textContent += textToType.charAt(index);
      index++;
      setTimeout(typeWriter, 100);
    } else {
      index = 0;
      getCurrentPosition();
    }
  }

  typeWriter();
}

function getCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getMapboxLocation(latitude, longitude);
      },
      function (error) {
        enableGpsButton();
        alert("Error getting your location. Please try again later.");
        console.error(error);
      }
    );
  } else {
    enableGpsButton();
    alert("Geolocation is not supported by your browser.");
  }
}

function enableGpsButton() {
  gpsButton.disabled = false;
}

// new one 
function showLocationBox() {
  locationBox.style.display = "block";
  searchInput.value = ""; // Clear search input when the location box opens
  searchInput.focus();
}

function hideLocationBox() {
  locationBox.style.display = "none";
}

function updateSelectedLocation(locationName) {
  selectedLocationText.textContent = locationName;
}

function detectLocation() {
  if (navigator.geolocation) {
    gpsButton.disabled = true;
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getMapboxLocation(latitude, longitude);
      },
      function (error) {
        enableGpsButton();
        alert("Error getting your location. Please try again later.");
        console.error(error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function enableGpsButton() {
  gpsButton.disabled = false;
}
// ne wnkksj

function getMapboxLocation(latitude, longitude) {
  const mapboxAccessToken = "pk.eyJ1Ijoic2hpdmFtMTUwMyIsImEiOiJjbGt2c3V2bTQwOGk0M2psdzEzZHZhdjR0In0.m9JIlbT4E6xreGubcL8F0w";
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxAccessToken}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const locationName = data.features[0].text;
      updateSelectedLocation(locationName);
      hideLocationBox();
      enableGpsButton();
    })
    .catch((error) => {
      enableGpsButton();
      alert("Error fetching location details. Please try again later.");
      console.error(error);
    });
}

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let hasMatchingLocation = false;
  locationMenu.innerHTML = "";

  localities.forEach((locality) => {
    if (locality.toLowerCase().includes(searchTerm)) {
      const listItem = document.createElement("li");
      listItem.classList.add("location-menu-item");
      listItem.textContent = locality;
      listItem.addEventListener("click", function () {
        selectedLocationText.textContent = listItem.textContent;
        hideLocationBox();
      });
      locationMenu.appendChild(listItem);
      hasMatchingLocation = true;
    }
  });

  locationMenu.style.display = hasMatchingLocation ? "block" : "none";
});

// Add an event listener to the document body for click events
document.body.addEventListener("click", function (event) {
  const locationBoxArea = document.querySelector(".location");

  // Check if the clicked element is inside the location box
  if (!locationBoxArea.contains(event.target)) {
    hideLocationBox(); // Hide the location box if clicked outside
  }
});


// Other functions and event listeners remain the same...