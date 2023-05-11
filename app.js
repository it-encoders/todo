
let todos = [];
let users = [];

const todoList = document.getElementById('todo-list');
const userSelect = document.getElementById('user-todo');
const form = document.querySelector('form');

//Events
document.addEventListener('DOMContentLoaded', initApp);
form.addEventListener('submit', handleSubmit);

function getUserName(userId){
    console.log(userId);
    const user = users.find(u => u.id === userId);
    return user.name;
}

function printTodo({id, userId, title, completed}) {
    const li = document.createElement('li');
    li.className = 'todo-item'; //<li class='todo-item'>
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(userId)}<b></span>`

    const status = document.createElement('input');
    status.type = 'checkbox';
    status.checked = completed;
    status.addEventListener('change', handleTodoChange);

    const close = document.createElement('span');
    close.innerHTML = 'Delete';
    close.className = 'close';
    close.addEventListener('click', handleRemove)

    li.prepend(status);
    li.append(close);

    todoList.prepend(li);
}

function createUserOptions(user) {
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;

    userSelect.append(option);
}

function removeTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);

    const todo = todoList.querySelector(`[data-id='${todoId}']`);

    todo.querySelector('input').removeEventListener('change', handleTodoChange);
    todo.querySelector('.close').removeEventListener('click', handleRemove);

    todo.remove();
}

function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then(values => {
        [todos, users] = values;

        todos.forEach((todo) => printTodo(todo));
        users.forEach((user) => createUserOptions(user));
    });

}

// ==========Events
function handleSubmit(e) {
    e.preventDefault();
    createTodo({
        userId: Number(form.user.value),
        title: form.todo.value,
        completed: false
    })

}

function handleTodoChange() {
    const todoId = this.parentElement.dataset.id;
    const completed = this.checked;

    toggleTodoCompleted(todoId, completed)
}

function handleRemove() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
}

// ================== Async

//! Todos
async function getAllTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//! Users
async function getAllUsers() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users?_limit=5');
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//create 
async function createTodo(todo) {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json'
            },

        })

        const newTodo = await response.json();
        console.log(newTodo);

        printTodo(newTodo);

    } catch (error) {
        console.log(error);
    }
} 

//status
async function toggleTodoCompleted(todoId, completed) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'PATCH',
            body: JSON.stringify({completed}),
            headers: {
                'Content-Type': 'application/json'
            },

        })

        const data = await response.json();
        console.log(data);

        // printTodo(newTodo);

    } catch (error) {
        console.log(error);
    }
} 

async function deleteTodo(todoId) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },

        })

        const data = await response.json();
        console.log(data);

        if(response.ok) {
            removeTodo(todoId);
        }

    } catch (error) {
        console.log(error);
    }
}