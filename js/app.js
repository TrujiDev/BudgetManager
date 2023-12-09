const form = document.querySelector('#add-expense');
const expenseList = document.querySelector('#expenses ul');

eventListeners();

function eventListeners() {
	document.addEventListener('DOMContentLoaded', askBudget);
	form.addEventListener('submit', addExpense);
}

/**
 * Represents a budget with its remaining amount and expenses.
 * @class
 */
class Budget {
	/**
	 * Represents a BudgetManager object.
	 * @constructor
	 * @param {number} budget - The initial budget value.
	 */
	constructor(budget) {
		this.budget = Number(budget);
		this.remaining = Number(budget);
		this.expenses = [];
	}

	/**
	 * Adds a new expense to the expenses array and calculates the remaining budget.
	 * @param {object} expense - The expense to be added.
	 */
	newExpense(expense) {
		this.expenses = [...this.expenses, expense];
		this.calculateRemaining();
	}

	/**
	 * Calculates the remaining budget by subtracting the total spent amount from the budget.
	 */
	calculateRemaining() {
		const spent = this.expenses.reduce(
			(total, expense) => total + expense.quantity,
			0
		);

		this.remaining = this.budget - spent;
	}

	/**
	 * Deletes an expense from the expenses array based on the provided id.
	 * @param {number} id - The id of the expense to be deleted.
	 */
	deleteExpense(id) {
		this.expenses = this.expenses.filter(expense => expense.id !== id);
		this.calculateRemaining();
	}
}

/**
 * Represents the UI class for managing the user interface of the budget manager application.
 */
class UI {
	/**
	 * Inserts the budget and remaining values into the DOM.
	 *
	 * @param {Object} quantity - The budget and remaining values.
	 * @param {number} quantity.budget - The total budget.
	 * @param {number} quantity.remaining - The remaining budget.
	 */
	insertBudget(quantity) {
		const { budget, remaining } = quantity;

		document.querySelector('#total').textContent = budget;
		document.querySelector('#remaining').textContent = remaining;
	}

	/**
	 * Displays an alert message on the screen.
	 * @param {string} message - The message to be displayed.
	 * @param {string} type - The type of the alert ('error' or 'success').
	 */
	showAlert(message, type) {
		const messageBox = document.createElement('div');
		messageBox.classList.add('text-center', 'alert');

		if (type === 'error') {
			messageBox.classList.add('alert-danger');
		} else {
			messageBox.classList.add('alert-success');
		}

		messageBox.textContent = message;

		document.querySelector('.primary').insertBefore(messageBox, form);

		setTimeout(() => {
			messageBox.remove();
		}, 3000);
	}

	/**
	 * Renders the list of expenses on the UI.
	 *
	 * @param {Array} expenses - The array of expenses to be displayed.
	 */
	showExpenses(expenses) {
		this.cleanHTML();

		expenses.forEach(expense => {
			const { nameExpense, quantity, id } = expense;

			const newExpense = document.createElement('LI');
			newExpense.className =
				'list-group-item d-flex justify-content-between align-items-center';
			newExpense.dataset.id = id;
			newExpense.innerHTML = `${nameExpense} <span class="badge badge-primary badge-pill">$ ${quantity}</span>`;

			const deleteBtn = document.createElement('button');
			deleteBtn.classList.add('btn', 'btn-danger', 'delete-expense');
			deleteBtn.innerHTML = 'Delete &times;';
			deleteBtn.onclick = () => {
				deleteExpense(id);
			};
			newExpense.appendChild(deleteBtn);

			expenseList.appendChild(newExpense);
		});
	}

	/**
	 * Updates the remaining budget and checks if it exceeds the budget limit.
	 * @param {number} remaining - The updated remaining budget.
	 */
	updateRemaining(remaining) {
		document.querySelector('#remaining').textContent = remaining;
		this.checkBudget({ budget: budget.remaining, remaining });
	}

	/**
	 * Checks the budget and updates the UI accordingly.
	 * @param {Object} budgetObj - The budget object containing the budget and remaining amount.
	 */
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

		if (remaining <= 0) {
			this.showAlert('Budget is over', 'error');
			form.querySelector('button[type="submit"]').disabled = true;
		}
	}

	/**
	 * Removes all child elements from the expenseList element, effectively cleaning the HTML.
	 */
	cleanHTML() {
		while (expenseList.firstChild) {
			expenseList.removeChild(expenseList.firstChild);
		}
	}
}

const ui = new UI();
let budget;

/**
 * Prompts the user for their budget and initializes the Budget object.
 */
function askBudget() {
	const userBudget = prompt('What is your budget?');

	if (
		userBudget === null ||
		userBudget === '' ||
		isNaN(userBudget) ||
		userBudget <= 0
	) {
		window.location.reload();
	}

	budget = new Budget(userBudget);

	ui.insertBudget(budget);
}

/**
 * Adds an expense to the budget manager.
 * @param {Event} event - The event object.
 * @returns {void}
 */
function addExpense(event) {
	event.preventDefault();

	const nameExpense = document.querySelector('#expense').value;
	const quantity = Number(document.querySelector('#quantity').value);

	if (nameExpense === '' || quantity === '') {
		ui.showAlert('Please fill all fields', 'error');
		return;
	} else if (quantity <= 0 || isNaN(quantity)) {
		ui.showAlert('Quantity is not valid', 'error');
		return;
	}

	const expense = {
		nameExpense,
		quantity,
		id: Date.now(),
	};

	budget.newExpense(expense);

	ui.showAlert('Expense added successfully');

	const { expenses, remaining } = budget;
	ui.showExpenses(expenses);
	ui.updateRemaining(remaining);
	ui.checkBudget(budget);

	form.reset();
}

/**
 * Deletes an expense from the budget.
 * @param {string} id - The ID of the expense to be deleted.
 */
function deleteExpense(id) {
	budget.deleteExpense(id);

	const { expenses, remaining } = budget;
	ui.showExpenses(expenses);
	ui.updateRemaining(remaining);
	ui.checkBudget(budget);
}
