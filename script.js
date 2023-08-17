        const taskInput = document.getElementById('taskInput');
        const addButton = document.getElementById('addButton');
        const taskList = document.getElementById('taskList');

        // event listener 4 button to handle adding tasks
        addButton.addEventListener('click', function () {
            // Create new task
            const taskItem = document.createElement('li'); 
            taskItem.innerText = taskInput.value;

            // Add the new task 
            taskList.appendChild(taskItem);
            taskInput.value = '';
        });
