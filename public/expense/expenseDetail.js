// Define API URLs
const baseURL = 'http://44.198.130.123:3000';
const premiumPurchaseURL = `${baseURL}/purchase/premium`;
const updateTransactionStatusURL = `${baseURL}/purchase/updatetransactionstatus`;
const getDashboardURL = `${baseURL}/getYour/dashboard/`;

// Function to handle form submission
async function submitForm(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Retrieve data from the form
  const amount = parseFloat(document.getElementById("expenseAmount").value) || 0;
  const income = parseFloat(document.getElementById("incomeAmount").value) || 0;
  const description = document.getElementById("descript").value;
  const category = document.getElementById("Category").value;

  // Get the user's ID from local storage
  const token = localStorage.getItem('token');

  if (!token) {
    // Handle the case where the token is missing or not authenticated
    console.error('User is not authenticated.');
    return;
  }

  // Include the token in the request headers
  const authorizationHeader = `MyAuthHeader ${token}`;

  // Create an object with expense data, including the userId
  const expenseData = { amount, income, description, category };

  try {
    // Send a POST request to add the expense
    const response = await axios.post(`${baseURL}/post/expense`, expenseData, {
      headers: { Authorization: authorizationHeader }
    });

    console.log(response);
    // Reload the page after submitting the form
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

// Function to update UI based on premium status
async function updateUI(response, isPremium) {
  try {
    const premiumButton = document.getElementById('razor');

    if (isPremium) {
      // If the user is premium, hide the button and show premium message
      premiumButton.style.display = 'none';
      document.getElementById('nowP').style.display = 'block';
      document.getElementById('nowP').textContent = 'You are a premium user';
      document.getElementById('dashboard').style.display = 'block';
    } else {
      // If the user is not premium, show the button
      premiumButton.style.display = 'block';
      document.getElementById('nowP').textContent = ''; // Clear the message
      document.getElementById('dashboard').style.display = 'none';
    }

    // Process and display the fetched data
    const expenseList = response;
    localStorage.setItem('expenseData', JSON.stringify(expenseList));
    const myList = document.getElementById('myList');
    myList.innerHTML = '';

    expenseList.forEach((expense) => {
      const listItemElement = createListItemElement(expense);
      myList.appendChild(listItemElement);
    });
  } catch (error) {
    console.error(error);
  }
}

// Function to delete an expense
async function deleteExpense(expenseId, listItemElement) {
  try {
    console.log('Expense deleted:', expenseId);
    await axios.delete(`${baseURL}/user/${expenseId}`);

    // Remove the deleted list item from the UI
    listItemElement.remove();

    // Fetch and update the expense list again
    window.location.reload();
  } catch (error) {
    console.error('Error deleting expense:', error, expenseId);
  }
}

// Function to edit an expense
async function editExpense(expense, listItemElement) {
  const updatedAmount = prompt('Enter updated Amount:', expense.amount);
  const updatedIncome = prompt('Enter updated Income:', expense.income);
  const updatedDescription = prompt('Enter updated description:', expense.description);
  const updatedCategory = prompt('Enter updated category:', expense.category);

  if (updatedAmount !== null && updatedDescription !== null && updatedCategory !== null) {
    const updatedExpenseData = {
      expenseId: expense.id,
      amount: updatedAmount,
      income: updatedIncome,
      description: updatedDescription,
      category: updatedCategory,
    };

    try {
      const response = await axios.post(`${baseURL}/user/edit`, updatedExpenseData);
      console.log('Expense updated:', response.data);

      // Update the expense in the UI
      const updatedExpense = response.data;
      const updatedElement = createListItemElement(updatedExpense);
      listItemElement.replaceWith(updatedElement);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  }
}

// Function to create a list item element for an expense
function createListItemElement(expense) {
  const listItem = document.createElement('LI');
  const textContent = `Amount => ${expense.amount}, Income => ${expense.income}, Description => ${expense.description}, Category => ${expense.category}`;
  const textNode = document.createTextNode(textContent);

  listItem.appendChild(textNode);

  const deleteButton = document.createElement('input');
  deleteButton.type = 'button';
  deleteButton.value = 'Delete';
  deleteButton.className = 'delete-button';
  deleteButton.onclick = () => {
    deleteExpense(expense.id, listItem);
  };
  listItem.appendChild(deleteButton);

  const editButton = document.createElement('input');
  editButton.type = 'button';
  editButton.value = 'Edit';
  editButton.className = 'edit-button';
  editButton.onclick = () => {
    editExpense(expense, listItem);
  };
  listItem.appendChild(editButton);

  return listItem;
}

// Define pagination variables
let currentPage = 1; // Current page
let itemsPerPage = localStorage.getItem('selectedPerPage') || 5; // Number of items to display per page

// Event listener for "Choose Expense Rows Per Page" select change event
document.getElementById('perPage').addEventListener('change', (event) => {
  // Get the selected value
  const selectedValue = event.target.value;

  // Store the selected value in local storage
  localStorage.setItem('selectedPerPage', selectedValue);

  itemsPerPage = parseInt(selectedValue);
  currentPage = 1;

  fetchExpenseData(currentPage, itemsPerPage);
});

// Event listener for "Next Page" button
document.getElementById('nextPageButton').addEventListener('click', () => {
  currentPage++;
  fetchExpenseData(currentPage, itemsPerPage);
});

// Event listener for "Previous Page" button
document.getElementById('prevPageButton').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchExpenseData(currentPage, itemsPerPage);
  }
});

// Initial fetch on page load
fetchExpenseData(currentPage, itemsPerPage);

// Function to fetch expense data based on the page
async function fetchExpenseData(page, itemsPerPage) {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authorizationHeader = `MyAuthHeader ${token}`;
    
    try {
      const response = await axios.get(`${baseURL}/get/expense?page=${page}&perPage=${itemsPerPage}`, {
        headers: { Authorization: authorizationHeader },
      });

      const expenseData = response.data.expenseData;
      const isPremium = response.data.isPremium;
      
      updateUI(expenseData, isPremium);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Token not found in localStorage');
  }
}
