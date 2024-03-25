 // Define API URLs
const baseURL = 'http://44.198.130.123:3000';
const reportURL = `${baseURL}/get/report`;
const downloadURL = `${baseURL}/get/expense/download`;
const downloadLinkURL = `${baseURL}/get/expense/downloadlink`;
const premiumPurchaseURL = `${baseURL}/purchase/premium`;
const updateTransactionStatusURL = `${baseURL}/purchase/updatetransactionstatus`;
const getDashboardURL = `${baseURL}/getYour/dashboard/`;

// Event listener for form submission
async function showReport(event) {
  event.preventDefault();

  // Get the selected start and end dates
  const startDate = new Date(document.getElementById('start_date').value);
  const endDate = new Date(document.getElementById('end_date').value);

  // Get the error message element
  const dateError = document.getElementById('date_error');

  // Validate the dates.
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
    dateError.textContent = 'Please select valid start and end dates.';
    return; // Stop further processing
  }

  // Clear any previous error message
  dateError.textContent = '';

  // Create an object to store start and end dates
  const dateRange = {
    startDate: startDate,
    endDate: endDate,
  };

  // Display report elements
  document.getElementById('allReport').style.display = 'block';
  document.getElementById('download').style.display = 'block';

  // Get and set token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('User is not authenticated.');
    return;
  }

  // Include token in the request headers
  const authorizationHeader = `MyAuthHeader ${token}`;

  try {
    // Send a POST request to get the report
    const response = await axios.post(reportURL, dateRange, {
      headers: { Authorization: authorizationHeader },
    });

    const expenseData = response.data.expenseData;
    const isPremium = response.data.ispremium;

    // Display the report table
    getReportTable(expenseData, isPremium);
  } catch (err) {
    console.error(err);
  }
}

// Function to populate and display the report table
async function getReportTable(response, isPremium) {
  try {
    const reportData = response;
    localStorage.setItem('expenseData', JSON.stringify(reportData));

    const reportContainer = document.getElementById('report');
    reportContainer.innerHTML = ''; // Clear the list before populating

    reportData.forEach((report) => {
      const row = createReportTableRow(report);
      reportContainer.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

// Function to create a table row for the report
function createReportTableRow(response) {
  const description = response.des;
  const category = response.category;
  const income = response.Income;
  const expense = response.Amount;

  const tr = document.createElement('tr');

  const td0 = tr.appendChild(document.createElement('td'));
  const td1 = tr.appendChild(document.createElement('td'));
  const td2 = tr.appendChild(document.createElement('td'));
  const td3 = tr.appendChild(document.createElement('td'));
  const td4 = tr.appendChild(document.createElement('td'));

  td0.innerHTML = "date";
  td1.innerHTML = description;
  td2.innerHTML = category;
  td3.innerHTML = income;
  td4.innerHTML = expense;

  return tr;
}

// Function to handle download button click
async function download(event) {
  event.preventDefault();

  const token = localStorage.getItem('token');
  if (token) {
    // If the token exists in localStorage, include it in the request headers Set the custom authorization header
    const customAuthorizationHeader = `MyAuthHeader ${token}`;

    try {
      // Send a GET request to download expenses
      const response = await axios.get(downloadURL, {
        headers: { Authorization: customAuthorizationHeader },
      });

      if (response.status === 200) {
        // Trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = response.data.fileURL;
        downloadLink.download = 'myexpenses.csv';
        downloadLink.click();
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log('Download error:', err);
    }
  } else {
    // Handle the case where the token is not found in localStorage
    console.log('Token not found in localStorage');
  }
}

// Event listener for page load
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (token) {
    const customAuthorizationHeader = `MyAuthHeader ${token}`;
    axios.get(downloadLinkURL, { headers: { Authorization: customAuthorizationHeader } })
      .then((response) => {
        console.log(response.data.Link_Data);
        // showResponse(response)
      })
      .catch((err) => console.log(err));
  } else {
    // Handle the case where the token is not found in localStorage
    console.log('Token not found in localStorage');
  }
});

// Function to display download links
function showResponse(response) {
  const myList = document.getElementById('myList'); // Get the ordered list element by its ID

  for (const link of response) {
    const x = document.createElement('LI'); // Create a new list item element
    const a = document.createElement('A'); // Create a new anchor element
    console.log(link.downloadlink)
    a.href = link.downloadlink;
    a.textContent = link.downloadlink;
    a.target = '_blank'; // Open the link in a new tab

    x.appendChild(a); // Append the anchor element to the list item element
    myList.appendChild(x); // Append the list item element to the ordered list element
  }
}

// Define pagination variables
let currentPage = 1; // Current page
const itemsPerPage = 2; // Number of items to display per page

// Function to fetch download links based on the page
async function fetchDownloadLinks(page, itemsPerPage) {
  const token = localStorage.getItem('token');
  if (token) {
    const customAuthorizationHeader = `MyAuthHeader ${token}`;
    try {
      const response = await axios.get(`${downloadLinkURL}?page=${page}&perPage=${itemsPerPage}`, {
        headers: { Authorization: customAuthorizationHeader },
      });

      //  console.log(response.data.download)
      showResponse(response.data.download);
    } catch (err) {
      console.log(err);
    }
  } else {
    console.log('Token not found in localStorage');
  }
}

// Event listener for "Next Page" button
document.getElementById('nextPageButton').addEventListener('click', () => {
  currentPage++;
  fetchDownloadLinks(currentPage, itemsPerPage);
});

// Event listener for "Previous Page" button
document.getElementById('prevPageButton').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchDownloadLinks(currentPage, itemsPerPage);
  }
});

// Initial fetch on page load
fetchDownloadLinks(currentPage, itemsPerPage);
