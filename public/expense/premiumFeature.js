 // Define API URLs
const premiumPurchaseURL = `${baseURL}/purchase/premium`;
const updateTransactionStatusURL = `${baseURL}/purchase/updatetrans`;
const getDashboardURL = `${baseURL}/getYour/dashboard/`;

// Function to populate the dashboard data
function getDashboard(data) {
  const featureList = document.getElementById('feature');
  featureList.innerHTML = '';

  data.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${item.username} - ${item.total_cost}`;
    featureList.appendChild(listItem);
  });

  // Show the dashboard title
  const dashboardTitle = document.getElementById('dashboard_list');
  dashboardTitle.style.display = 'block';
}

// Check if the dashboard data is already in localStorage
const dashboardData = JSON.parse(localStorage.getItem('dashboardData'));

if (dashboardData) {
  // If data is available in localStorage, populate the dashboard
  getDashboard(dashboardData);
}

// Handle premium purchase button click
document.getElementById('razor').onclick = async function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const customAuthorizationHeader = `Bearer ${token}`;

  try {
    // Make a GET request to retrieve Razorpay options
    const response = await axios.get(premiumPurchaseURL, {
      headers: { Authorization: customAuthorizationHeader },  withCredentials: true,
    });

     // Process the Razorpay response and handle the payment
    const options = {
      key: response.data.key_id,
      order_id: response.data.order_id,
      handler: async function (response) {

                         await axios.post('http://localhost:3000/purchase/updatetrans/',
                        { order_id: options.order_id,
                         paymentId: response.razorpay_payment_id,
                         status: 'SUCCESS'}   , {
                          headers: { Authorization: customAuthorizationHeader },
                        });
    

        alert('Payment Done');
        window.location.reload();
      },
    };

    // Open Razorpay payment window
    const rzp1 = await new Razorpay(options);
    rzp1.open();

    // Handle payment failure
    rzp1.on('payment.failed', async function (response) {
      await axios.post(updateTransactionStatusURL, {
        order_id: options.order_id,
        paymentId: response.razorpay_payment_id,
        status: 'FAILED',
      }, {
        headers: { Authorization: customAuthorizationHeader },
      });

      console.log(response, 'Payment failed or was canceled.');
      alert('Payment failed or was canceled. Please try again.');
    });
  } catch (error) {
    console.error(error);
  }
};

// Handle dashboard button click
document.getElementById('dashboard').onclick = async function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const customAuthorizationHeader = `MyAuthHeader ${token}`;

  try {
    // Make a GET request to retrieve dashboard data
    const response = await axios.get(getDashboardURL, {
      headers: { Authorization: customAuthorizationHeader },
    });

    // Store the dashboard data in localStorage and populate the dashboard
    localStorage.setItem('dashboardData', JSON.stringify(response.data));
    console.log(response.data);
    getDashboard(response.data);
  } catch (error) {
    console.error(error);
  }
};
