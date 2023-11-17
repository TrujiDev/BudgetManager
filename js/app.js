// Selecting the form and expense list elements from the HTML
const form = document.querySelector('#add-expense');
const expenseList = document.querySelector('#expenses ul');

// Setting up event listeners when the DOM content is loaded
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', askBudget); // When the DOM content is loaded, ask for the budget
    form.addEventListener('submit', addExpense); // When the form is submitted, add the expense
}

// Defining a Budget class to manage budget-related operations
class Budget {
    constructor(budget) {
        this.budget = Number(budget); // Initial budget
        this.remaining = Number(budget); // Remaining budget initialized to the total budget
        this.expenses = []; // Array to store individual expenses
    }

    // Method to add a new expense to the expenses array
    newExpense(expense) {
        this.expenses = [...this.expenses, expense]; // Using the spread operator to create a new array with the existing expenses and the new one
        this.calculateRemaining(); // Recalculate the remaining budget after adding a new expense
    }

    // Method to calculate the remaining budget based on the total budget and expenses
    calculateRemaining() {
        const spent = this.expenses.reduce(
            (total, expense) => total + expense.quantity,
            0
        );

        this.remaining = this.budget - spent;
    }

    // Method to delete an expense from the expenses array
    deleteExpense(id) {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        this.calculateRemaining(); // Recalculate the remaining budget after deleting an expense
    }
}

// Defining a UI class to handle user interface operations
class UI {
    // Method to display the initial budget in the UI
    insertBudget(quantity) {
        const { budget, remaining } = quantity;

        document.querySelector('#total').textContent = budget;
        document.querySelector('#remaining').textContent = remaining;
    }

    // Method to display alert messages in the UI
    showAlert(message, type) {
        // Creating a new div element for the alert message
        const messageBox = document.createElement('div');
        messageBox.classList.add('text-center', 'alert');

        // Adding different classes based on the alert type
        if (type === 'error') {
            messageBox.classList.add('alert-danger');
        } else {
            messageBox.classList.add('alert-success');
        }

        messageBox.textContent = message;

        // Inserting the alert message before the form in the UI
        document.querySelector('.primary').insertBefore(messageBox, form);

        // Setting a timeout to remove the alert message after 3 seconds
        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    // Method to display the list of expenses in the UI
    showExpenses(expenses) {
        this.cleanHTML(); // Clearing the existing list of expenses

        expenses.forEach(expense => {
            const { nameExpense, quantity, id } = expense;

            const newExpense = document.createElement('LI');
            newExpense.className =
                'list-group-item d-flex justify-content-between align-items-center';
            newExpense.dataset.id = id;
            newExpense.innerHTML = `${nameExpense} <span class="badge badge-primary badge-pill">$ ${quantity}</span>`;

            // Creating a delete button for each expense
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-danger', 'delete-expense');
            deleteBtn.innerHTML = 'Delete &times;';
            deleteBtn.onclick = () => {
                deleteExpense(id);
            };
            newExpense.appendChild(deleteBtn);

            // Appending the new expense to the expense list in the UI
            expenseList.appendChild(newExpense);
        });
    }

    // Method to update the remaining budget in the UI
    updateRemaining(remaining) {
        document.querySelector('#remaining').textContent = remaining;
        this.checkBudget({ budget: budget.remaining, remaining });
    }

    // Method to check the budget status and update the UI accordingly
    checkBudget(budgetObj) {
        const { budget, remaining } = budgetObj;

        const remainingDiv = document.querySelector('.remaining');

        if (budget / 4 > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-warning');
            remainingDiv.classList.add('alert-danger');
        } else if (budget / 2 > remaining) {
            remainingDiv.classList.remove('alert-success', 'alert-danger');
            remainingDiv.classList.add('alert-warning');
        } else {
            remainingDiv.classList.remove('alert-danger', 'alert-warning');
            remainingDiv.classList.add('alert-success');
        }

        // Displaying an alert if the remaining budget is zero or negative
        if (remaining <= 0) {
            this.showAlert('Budget is over', 'error');
            form.querySelector('button[type="submit"]').disabled = true;
        }
    }

    // Method to clear the list of expenses in the UI
    cleanHTML() {
        while (expenseList.firstChild) {
            expenseList.removeChild(expenseList.firstChild);
        }
    }
}

// Creating an instance of the UI class
const ui = new UI();
let budget;

// Function to prompt the user for the initial budget
function askBudget() {
    const userBudget = prompt('What is your budget?');

    // If the user cancels or enters an invalid value, reload the page
    if (
        userBudget === null ||
        userBudget === '' ||
        isNaN(userBudget) ||
        userBudget <= 0
    ) {
        window.location.reload();
    }

    // Creating a new Budget instance with the user's budget
    budget = new Budget(userBudget);

    // Displaying the initial budget in the UI
    ui.insertBudget(budget);
}

// Function to add a new expense
function addExpense(event) {
    event.preventDefault();

    // Getting values from the form
    const nameExpense = document.querySelector('#expense').value;
    const quantity = Number(document.querySelector('#quantity').value);

    // Validating the input values
    if (nameExpense === '' || quantity === '') {
        ui.showAlert('Please fill all fields', 'error');
        return;
    } else if (quantity <= 0 || isNaN(quantity)) {
        ui.showAlert('Quantity is not valid', 'error');
        return;
    }

    // Creating a new expense object
    const expense = {
        nameExpense,
        quantity,
        id: Date.now(),
    };

    // Adding the new expense to the budget
    budget.newExpense(expense);

    // Displaying a success alert
    ui.showAlert('Expense added successfully');

    // Updating the UI with the list of expenses and remaining budget
    const { expenses, remaining } = budget;
    ui.showExpenses(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);

    // Resetting the form fields
    form.reset();
}

// Function to delete an expense
function deleteExpense(id) {
    // Deleting the expense from the budget
    budget.deleteExpense(id);

    // Updating the UI with the updated list of expenses and remaining budget
    const { expenses, remaining } = budget;
    ui.showExpenses(expenses);
    ui.updateRemaining(remaining);
    ui.checkBudget(budget);
}
