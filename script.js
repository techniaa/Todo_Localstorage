document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach((task) => renderTask(task));

    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim();
        if (taskText === "") return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = "";
    });

    function renderTask(task) {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.className = "flex justify-between items-center bg-gray-700 text-white rounded-lg px-3 py-2";

        li.innerHTML = `
            <span id="item-text-${task.id}" class="${task.completed ? 'line-through' : ''}">${task.text}</span>
            <div class="space-x-2">
                <button class="bg-pink-800 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg edit-btn">Edit</button>
                <button class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg delete-btn">Delete</button>
            </div>
        `;


        li.querySelector('span').addEventListener('click', () => {
            task.completed = !task.completed;
            li.querySelector('span').classList.toggle('line-through');
            saveTasks();
        });

  
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const span = document.getElementById(`item-text-${task.id}`);
            const oldValue = span.innerText;

            span.outerHTML = `
                <input id="edit-input-${task.id}" type="text" value="${oldValue}" 
                    class="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                <button class="bg-green-500 text-white px-2 py-1 rounded save-btn">Save</button>
            `;

            li.querySelector('.save-btn').addEventListener('click', () => {
                const input = document.getElementById(`edit-input-${task.id}`);
                task.text = input.value;
                saveTasks();
                li.querySelector('.save-btn').remove();
                input.outerHTML = `<span id="item-text-${task.id}">${task.text}</span>`;
            });
        });

       
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTasks();
        });

        todoList.appendChild(li);
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
