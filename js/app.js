const form = document.querySelector('#add-expense');
const expenseList = document.querySelector('#expenses ul');

eventListeners();

function eventListeners() {
	document.addEventListener('DOMContentLoaded', askBudget);
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
