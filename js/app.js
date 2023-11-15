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

		form.reset();
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

	const expense = document.querySelector('#expense').value;
	const quantity = document.querySelector('#quantity').value;

	if (expense === '' || quantity === '') {
		ui.showAlert('Please fill all fields', 'error');
		return;
	} else if (quantity <= 0 || isNaN(quantity)) {
		ui.showAlert('Quantity is not valid', 'error');
		return;
	}
}
