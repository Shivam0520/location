const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');
const historyList = document.getElementById('historyList');
const serviceList = document.getElementById('serviceList');

// Track history
let history = [];

// Example backend service list (you can replace this with actual data fetched from the backend)
const backendServiceList = [
  'Service 1',
  'Service 2',
  'Service 3',
  'Service 4',
  'Service 5',
  'Service 6',
  'Service 7',
  'Service 8',
  'Service 9',
  'Service 10'
];

searchInput.addEventListener('click', () => {
  renderHistory();
});

searchInput.addEventListener('input', () => {
  updateServiceList();
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  serviceList.innerHTML = '';
  serviceList.style.display = 'none';
  historyList.style.display = 'none';
});

document.addEventListener('click', (event) => {
  if (!event.target.matches('.history-list li') && !event.target.matches('.service-list li') && !event.target.matches('#searchInput')) {
    serviceList.style.display = 'none';
    if (!searchInput.value) {
      historyList.style.display = 'none';
    }
  }
});

function updateServiceList() {
  const searchTerm = searchInput.value.trim();

  // Clear service list
  serviceList.innerHTML = '';

  if (searchTerm.length > 0) {
    // Filter services matching the search term
    const filteredServices = backendServiceList.filter(service => service.toLowerCase().includes(searchTerm.toLowerCase()));

    // Display filtered services
    filteredServices.forEach(service => {
      const serviceItem = document.createElement('li');
      serviceItem.textContent = service;
      serviceItem.addEventListener('click', () => {
        addToHistory(service);
        searchInput.value = service;
        updateServiceList();
      });
      serviceList.appendChild(serviceItem);
    });

    // Show service list container
    serviceList.style.display = 'block';
  } else {
    // Hide service list container
    serviceList.style.display = 'none';
  }
}

function addToHistory(term) {
  // Check if the term already exists in history
  if (history.includes(term)) {
    return;
  }

  // Add term to history
  history.push(term);

  // To keep history length limited to 5, you can change the number as per your requirement
  if (history.length > 3) {
    history.shift();
  }

  // Save history to local storage
  saveHistoryToLocalStorage();
}

function renderHistory() {
  historyList.innerHTML = '';
  // Reverse the history array to display the most recent items first
  const reversedHistory = history.slice().reverse();
  reversedHistory.forEach(hist => {
    const historyItem = document.createElement('li');
    const icon = document.createElement('img');
    icon.src = 'micon.svg'; // Replace 'micon.svg' with the actual path to your icon image
    icon.alt = 'Icon';
    historyItem.appendChild(icon);

    const historyText = document.createElement('span');
    historyText.textContent = hist;
    historyItem.appendChild(historyText);

    historyItem.addEventListener('click', () => {
      searchInput.value = hist;
      updateServiceList();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (event) => {
      event.stopPropagation();
      deleteHistory(hist);
    });

    historyItem.appendChild(deleteButton);
    historyList.appendChild(historyItem);
  });

  // Show history list container
  historyList.style.display = 'block';
}

function deleteHistory(term) {
  const index = history.indexOf(term);
  if (index !== -1) {
    history.splice(index, 1);
    // Save history to local storage
    saveHistoryToLocalStorage();
    // Update history display
    renderHistory();
  }
}

// Function to fetch history from local storage (if any)
function getHistoryFromLocalStorage() {
  const storedHistory = localStorage.getItem('history');
  if (storedHistory) {
    history = JSON.parse(storedHistory);
    renderHistory();
  }
}

// Function to save history to local storage
function saveHistoryToLocalStorage() {
  localStorage.setItem('history', JSON.stringify(history));
}

// Fetch history from local storage (if any)
getHistoryFromLocalStorage();


// New code for admin 


  // Function to open the Service Management page
  function openServiceManagementPage() {
    const serviceManagementPageURL = 'service_management.html';
    window.open(serviceManagementPageURL, 'Service Management', 'width=500,height=600');
  }

  // Function to receive messages from the Service Management page
  function receiveMessage(event) {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'updateServiceList' && data.serviceList) {
        backendServiceList = data.serviceList;
        // Update the service list on the Service Search page
        updateServiceListOnSearchPage();
        // Save the updated service list to local storage
        saveServiceListToLocalStorage();
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Attach the message event listener to receive messages from the Service Management page
  window.addEventListener('message', receiveMessage);

  // Function to fetch the updated service list from local storage and update the Service Search page
  function updateServiceListOnSearchPage() {
    const serviceListElement = document.getElementById('serviceList');
    serviceListElement.innerHTML = '';

    backendServiceList.forEach(serviceData => {
      if (serviceData.isPublic) {
        const serviceItem = document.createElement('li');
        serviceItem.textContent = serviceData.name;
        serviceListElement.appendChild(serviceItem);
      }
    });

    serviceListElement.style.display = 'block';
  }

  // Function to save the service list to local storage on the Service Search page
  function saveServiceListToLocalStorage() {
    localStorage.setItem('backendServiceList', JSON.stringify(backendServiceList));
  }

  // Fetch the stored service list from local storage on page load
  function getStoredServiceListFromLocalStorage() {
    const storedServiceList = localStorage.getItem('backendServiceList');
    if (storedServiceList) {
      backendServiceList = JSON.parse(storedServiceList);
      // Update the service list on the Service Search page
      updateServiceListOnSearchPage();
    }
  }

  // Fetch the stored service list from local storage on page load
  getStoredServiceListFromLocalStorage();

  //

  