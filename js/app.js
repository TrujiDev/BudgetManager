const form = document.querySelector('#add-expense');
const expenseList = document.querySelector('#expenses ul');

eventListeners();

function eventListeners() {
	document.addEventListener('DOMContentLoaded', askBudget);
	form.addEventListener('submit', addExpense);
}

class Budget {
	constructor(budget) {
		this.budget = Number(budget);
		this.remaining = Number(budget);
		this.expenses = [];
	}

	newExpense(expense) {
		this.expenses = [...this.expenses, expense];
		this.calculateRemaining();
	}

	calculateRemaining() {
		const spent = this.expenses.reduce(
			(total, expense) => total + expense.quantity,
			0
		);

		this.remaining = this.budget - spent;
	}
}

class UI {
	insertBudget(quantity) {
		const { budget, remaining } = quantity;

		document.querySelector('#total').textContent = budget;
		document.querySelector('#remaining').textContent = remaining;
	}

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

	addExpenseToList(expenses) {
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
			newExpense.appendChild(deleteBtn);

			expenseList.appendChild(newExpense);
		});
	}

	updateRemaining(remaining) {
		document.querySelector('#remaining').textContent = remaining;
	}

	checkBudget(budgetObj) {
		const { budget, remaining } = budgetObj;

		const remainingDiv = document.querySelector('.remaining');

		if ((budget / 4) > remaining) {
			remainingDiv.classList.remove('alert-success', 'alert-warning');
			remainingDiv.classList.add('alert-danger');
		} else if ((budget / 2) > remaining) {
			remainingDiv.classList.remove('alert-success');
			remainingDiv.classList.add('alert-warning');
		}

		if (remaining <= 0) {
			this.showAlert('Budget is over', 'error');
			form.querySelector('button[type="submit"]').disabled = true;
		}
	}

	cleanHTML() {
		while (expenseList.firstChild) {
			expenseList.removeChild(expenseList.firstChild);
		}
	}
}

const ui = new UI();
let budget;

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
	ui.addExpenseToList(expenses);

	ui.updateRemaining(remaining);

	ui.checkBudget(budget);

	form.reset();
}
