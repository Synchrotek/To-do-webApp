const todoformBtn = document.getElementById('todoformBtn');
const newtodo = document.getElementById('newtodo');
const deadlineInput = document.getElementById('deadline');
const prioritySelect = document.getElementById('priority');
const todoListEl = document.getElementById('todo-list');
const sortTodos = document.getElementById('sort-todos');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

showToDo();

todoformBtn.addEventListener('click', (event) => {
    event.preventDefault();

    saveTodo();
    showToDo();

    localStorage.setItem('todos', JSON.stringify(todos));
})

// ------------------------------
const saveTodo = () => {
    const todoValue = newtodo.value;
    const deadlineValue = deadlineInput.value;
    const priorityValue = prioritySelect.value;

    const isEmpty = todoValue === '';
    const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase())

    if (isEmpty) {
        alert("Todo's input is Empty");
        return;
    }
    else if (isDuplicate) {
        alert("This todo is Already present");
        return;
    }

    if (EditTodoId >= 0) {
        todoformBtn.innerHTML = "Add";
        todos = todos.map((todo, index) => ({
            ...todo,
            value: index === EditTodoId ? todoValue : todo.value,
            deadline: index === EditTodoId ? deadlineValue : todo.deadline,
            priority: index === EditTodoId ? priorityValue : todo.priority,
        }));
        EditTodoId = -1;
    } else {
        const todo = {
            value: todoValue,
            deadline: deadlineValue,
            priority: priorityValue,
            checked: false,
        }
        todos.push(todo);
    }

    newtodo.value = '';
    deadlineInput.value = '';
};


// ------------------------------
function showToDo() {
    todoListEl.innerHTML = '';


    todos.forEach((todo, index) => {
        const deadLineTime = calcDeadline(todo.deadline);
        const selectedOptionEl = prioritySelect.querySelector(`option[value="${todo.priority}"]`);
        todoListEl.innerHTML += `
        <div class="todo" id="${index}">
            <i class="${todo.checked ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"
            data-action="check" ></i>
            <p class="${todo.checked ? 'checked' : ''}" data-action="check" >${todo.value}</p>
            <span class="deadline">${deadLineTime}</span>
            <span class="priority-label">${selectedOptionEl.innerText}
            <span class="deadline-2">${deadLineTime}</span>
            </span>
            <i class="fa-solid fa-pen-to-square edit-todo" data-action="edit"></i>
            <i class="fa-solid fa-delete-left" data-action="delete"></i>
        </div>`
    })
};

// ------------------------------
function calcDeadline(deadline) {
    let dateString;
    if (deadline) {
        // The user selected a date
        const date = new Date(deadline);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        dateString = `${day}:${month}:${year}`;
    } else {
        // The user did not select a date
        const today = new Date();
        const day = today.getDate();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        dateString = `${day}:${month}:${year}`;
    }
    return dateString;
};


// ------------------------------
sortTodos.addEventListener('click', () => {
    // Sort tasks by priority and then by deadline
    todos.sort((a, b) => {
        if (a.priority === b.priority) {
            return new Date(a.deadline) - new Date(b.deadline);
        }
        return a.priority.localeCompare(b.priority);
    });

    showToDo();
    localStorage.setItem('todos', JSON.stringify(todos));
})

// ------------------------------
todoListEl.addEventListener('click', (event) => {
    const target = event.target;
    const parentElement = target.parentNode;

    if (parentElement.className !== 'todo') return;

    // Todo Id
    const todo = parentElement;
    const todoId = Number(todo.id);

    // Target Action
    const action = target.dataset.action

    action === 'check' && checkTodo(todoId);
    action === 'edit' && editTodo(todoId);
    action === 'delete' && deleteTodo(todoId);
});


// ------------------------------
const checkTodo = (todoId) => {
    todos = todos.map((todo, index) => ({
        ...todo,
        checked: index === todoId ? !todo.checked : todo.checked,
    }));

    showToDo();
    localStorage.setItem('todos', JSON.stringify(todos));
};

// ------------------------------
const editTodo = (todoId) => {
    todoformBtn.innerHTML = "Edit";
    newtodo.value = todos[todoId].value;
    deadlineInput.value = todos[todoId].deadline;
    prioritySelect.value = todos[todoId].priority;
    EditTodoId = todoId;
};

// ------------------------------
const deleteTodo = (todoId) => {
    todos = todos.filter((todo, index) => index !== todoId);
    EditTodoId = -1;

    showToDo();
    localStorage.setItem('todos', JSON.stringify(todos));
};