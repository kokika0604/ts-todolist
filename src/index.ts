import {v4 as uuid} from "uuid"

type Task = {
    id: string,
    name: string,
    completedAt: Date | undefined,
    createdAt: Date
};

const list = document.querySelector('#list') as HTMLUListElement;
const input = document.querySelector('#new-task-title') as HTMLInputElement;
const addTaskBtn = document.querySelector('#add-task-btn') as HTMLButtonElement;
const clearTasksBtn = document.querySelector('#clear-tasks-btn') as HTMLButtonElement;

const tasks: Task[] = loadTasks();
tasks.forEach(addTask);

addTaskBtn.addEventListener('click', () => {
    if (input?.value == '' || input?.value == null) {
        return;
    }
    
    const task: Task = {
        id: 'task-' + uuid(),
        name: input.value,
        completedAt: undefined,
        createdAt: new Date()
    };
    addTask(task);
    saveTasks();
});

clearTasksBtn.addEventListener('click', () => {
    list.innerHTML = '';
    tasks.length = 0;
    saveTasks();
});

function loadTasks(): Task[] {
    const taskJson = localStorage.getItem('TASKS');
    if (taskJson === null) {
        return [];
    }
    return JSON.parse(taskJson);
}

function saveTasks() {
    localStorage.setItem('TASKS', JSON.stringify(tasks));
}

function addTask(task: Task) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    const label = document.createElement('label');
    label.append(checkbox, task.name);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.style.marginLeft = '10px';

    const item = document.createElement('li');
    item.id = task.id;
    item.append(label);
    item.append(deleteBtn);

    list?.append(item);
    tasks.push(task);

    input.value = '';

    if (task.completedAt !== undefined) {
        completeTask(task);
    }
    checkbox.addEventListener('click', () => {
        completeTask(task);
        saveTasks();
    });

    deleteBtn.addEventListener('click', () => {
        deleteTask(task);
        saveTasks();
    });
}

function completeTask(task: Task) {
    if (task.completedAt === undefined) {
        task.completedAt = new Date;
    }
    const checkbox = document.querySelector(`#${task.id} input[type="checkbox"]`) as HTMLInputElement;
    checkbox.disabled = true;
    checkbox.checked = true;
}

function deleteTask(task: Task) {
    document.getElementById(task.id)?.remove();
    for (const [i, v] of tasks.entries()) {
        if (v.id === task.id) {
            tasks.splice(i, 1);
            break;
        }
    }
}


