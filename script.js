// Function to generate unique IDs for todos
function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  // Initialize the todo list array to store todos.
  let todos = [];
  
  // Function to fetch todos from local storage.
  function fetchTodosFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      todos = JSON.parse(storedTodos);
    }
  }
  
  // Function to save todos to local storage.
  function saveTodosToLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }


// Activity logs
const activityLogs = [];

// Function to add a log to activityLogs
function addLog(action, taskId, subtaskId = null) {
  const log = {
    timestamp: new Date(),
    action,
    taskId,
    subtaskId
  };
  activityLogs.push(log);
}

// Function to display activity logs
function displayActivityLogs() {
  const logsContainer = document.getElementById('activityLogs');
  logsContainer.innerHTML = ''; // Clear previous logs

  activityLogs.forEach(log => {
    const logItem = document.createElement('div');
    logItem.classList.add('log-item');

    const logTimestamp = document.createElement('span');
    logTimestamp.textContent = log.timestamp.toLocaleString();
    logItem.appendChild(logTimestamp);

    let logMessage;
    switch (log.action) {
      case 'addTodo':
        logMessage = `Todo added: ${log.taskId}`;
        break;
      case 'deleteTodo':
        logMessage = `Todo deleted: ${log.taskId}`;
        break;
      case 'editTodo':
        logMessage = `Todo edited: ${log.taskId}`;
        break;
      case 'addSubtask':
        logMessage = `Subtask added to Todo: ${log.taskId} - ${log.subtaskId}`;
        break;
      case 'deleteSubtask':
        logMessage = `Subtask deleted from Todo: ${log.taskId} - ${log.subtaskId}`;
        break;
      case 'editSubtask':
        logMessage = `Subtask edited: ${log.taskId} - ${log.subtaskId}`;
        break;
      case 'toggleCompletion':
        logMessage = `Todo/Subtask completion changed: ${log.taskId} - ${log.subtaskId}`;
        break;
      default:
        logMessage = 'Unknown action';
    }

    const logContent = document.createElement('span');
    logContent.textContent = logMessage;
    logItem.appendChild(logContent);

    logsContainer.appendChild(logItem);
  });
}

// Function to toggle display of activity logs
function toggleActivityLogs() {
    const logsContainer = document.getElementById('activityLogs');
    const logsButton = document.querySelector('.activity-logs button');
    const displayStyle = logsContainer.style.display;
  
    if (displayStyle === 'none') {
      logsContainer.style.display = 'block';
      logsButton.textContent = 'Hide Activity Logs';
      displayActivityLogs(); // Refresh logs when shown
    } else {
      logsContainer.style.display = 'none';
      logsButton.textContent = 'View Activity Logs';
    }
  }

  // Function to parse the due date from user input
function getDueDate(dueDateInput) {
    const currentDate = new Date();
  
    // Check if the input contains "tomorrow"
    if (dueDateInput.toLowerCase().includes('tomorrow')) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Extract date and time information from the input
    const dateMatch = dueDateInput.match(/(\d{1,2}(st|nd|rd|th)?\s+[A-Za-z]+(\s+\d{2,4})?)/);
    const timeMatch = dueDateInput.match(/(\d{1,2}:\d{2}\s?[AaPp][Mm])/);
  
    // Combine date and time information
    let dateString = '';
    if (dateMatch) {
      dateString += dateMatch[1];
    } else {
      // If no specific date mentioned, use the current date
      dateString += currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (timeMatch) {
      dateString += ' ' + timeMatch[1];
    }
  
    // Convert the parsed date and time to a Date object
    const dueDate = new Date(dateString);
    return isNaN(dueDate) ? null : dueDate;
  }


  // Function to add a new todo
  function addTodo() {
    const todoText = document.getElementById('todoText').value.trim();
    const dueDate = document.getElementById('dueDate').value.trim();
    const priority = document.getElementById('priority').value.trim();
    const category = document.getElementById('category').value.trim();
    const subtasks=[]
    const tags = document.getElementById('tags').value
      .split(',')
      .map(tag => tag.trim());
  
    if (todoText === '') {
      return;
    }
    let duedate1;
    if(dueDate){
        duedate1 = getDueDate(dueDate);
    }
    const newTodo = {
      id: generateUniqueId(),
      todoText: todoText,
      dueDate: duedate1,
      priority: priority,
      
      category: category,
      subtasks: subtasks,
      tags: tags,
      isCompleted: false,
      reminder: null,
    };
  
    todos.push(newTodo);
    document.getElementById('todoText').value='';
    document.getElementById('dueDate').value='';
    document.getElementById('category').value='';
    document.getElementById('tags').value='';
    saveTodosToLocalStorage();
    displayTodos();
    addLog('addTodo', todoText);
    checkReminders();
  }
  
   // Function to toggle todo completion status
   function toggleTodoCompletion(todoId) {
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
      todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;
      saveTodosToLocalStorage();
      displayTodos();
    }
  }
  
  // Function to edit a todo
  function editTodo(todoId) {
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
      const updatedTodoText = prompt('Enter updated todo:', todos[todoIndex].todoText);
      if (updatedTodoText !== null) {
        todos[todoIndex].todoText = updatedTodoText.trim();
        saveTodosToLocalStorage();
        displayTodos();
        addLog('addTodo', todos[todoIndex].todoText);
        checkReminders();
      }
    }
  }
  
  // Function to delete a todo
  function deleteTodo(todoId) {
    todos = todos.filter(todo => todo.id !== todoId);
    saveTodosToLocalStorage();
    displayTodos();
  }
  

  // Function to display todos
  function displayTodos() {
    const todoListContainer = document.getElementById('todoList');
    todoListContainer.innerHTML = '';
  
    todos.forEach(todo => {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      if (todo.isCompleted) {
        todoItem.classList.add('completed');
      }
  
      const todoTextElement = document.createElement('span');
      todoTextElement.textContent = todo.todoText;
      todoItem.appendChild(todoTextElement);


      // Display flex-direction: column for each main task
        todoItem.style.display = 'flex';
        todoItem.style.flexDirection = 'column';

    //   adding subtask
    // Add Subtask button
    const addSubtaskButton = document.createElement('button');
    addSubtaskButton.textContent = 'Add Subtask';
    addSubtaskButton.onclick = () => {
      const subtaskText = prompt('Enter subtask:');
      const priority = prompt('Enter priority:');
      if (subtaskText !== null && subtaskText.trim() !== '' && priority !== null) {
        addSubtaskToTodo(todo.id, subtaskText, priority);
      }
    };
    todoItem.appendChild(addSubtaskButton);
    if(todo.subtasks.length>0){

        // Show/hide subtasks option
      const toggleSubtasksButton = document.createElement('button');
      toggleSubtasksButton.textContent = todo.showSubtasks ? 'Hide Subtasks' : 'Show Subtasks';
      toggleSubtasksButton.onclick = () => toggleSubtasksDisplay(todo.id);
      todoItem.appendChild(toggleSubtasksButton);

     

      if(todo.showSubtasks){

        const subtasksList=document.createElement('ul');
        subtasksList.className='subtask-list';
        todo.subtasks.forEach(subtask=>{
            console.log("display",subtask);
            const subtaskItem=document.createElement('li');
            subtaskItem.className='subtask-item';
            if(subtask.isCompleted){
                subtaskItem.classList.add('completed');
            }

            const subtaskTextElement=document.createElement('span');
            subtaskTextElement.textContent=subtask.subtaskText;
            subtaskItem.appendChild(subtaskTextElement);

            const subtaskPriorityElement = document.createElement('span');
            subtaskPriorityElement.textContent = `Priority: ${subtask.priority}`;
            subtaskItem.appendChild(subtaskPriorityElement);

            // const subtaskActionsContainer=document.createElement('div');
            // subtaskActionsContainer.className='actions';

            const substaskCompleteButton= document.createElement('button');
            substaskCompleteButton.textContent=subtask.isCompleted ? 'Undone':'Done';
            substaskCompleteButton.onclick=() => toggleSubtaskCompletion(todo.id,subtask.id);
            // subtaskActionsContainer.appendChild(substaskCompleteButton);
            subtaskItem.appendChild(substaskCompleteButton);

            const subtaskEditButton=document.createElement('button');
            subtaskEditButton.textContent='Edit';
            subtaskEditButton.onclick = () => {
                const updatedSubtaskText = prompt('Enter updated subtask:', subtask.subtaskText);
                const updatedPriority = prompt('Enter updated priority:', subtask.priority);
                if (updatedSubtaskText !== null && updatedSubtaskText.trim() !== '' && updatedPriority !== null) {
                editSubtask(todo.id, subtask.id, updatedSubtaskText, updatedPriority);
                }
            };

                subtaskItem.appendChild(subtaskEditButton);
            // subtaskActionsContainer.appendChild(subtaskEditButton);

            const subtaskDeleteButton=document.createElement('button');
            subtaskDeleteButton.textContent='Delete';
            subtaskDeleteButton.onclick=()=> deleteSubtask(todo.id,subtask.id);
            // subtaskActionsContainer.appendChild(subtaskDeleteButton);
            subtaskItem.appendChild(subtaskDeleteButton);

            // subtaskItem.appendChild(subtaskActionsContainer);
            subtasksList.appendChild(subtaskItem);
        });
        todoItem.appendChild(subtasksList);
        }
    }

  
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'actions';


      // Create the priority element
        const priorityElement = document.createElement('div');
        priorityElement.textContent = `Priority: ${todo.priority}`;
        todoItem.appendChild(priorityElement);

        // Create the category element
        const categoryElement = document.createElement('div');
        categoryElement.textContent = `Category: ${todo.category}`;
        todoItem.appendChild(categoryElement);
  
      const completeButton = document.createElement('button');
      completeButton.textContent = todo.isCompleted ? 'Undone' : 'Done';
      completeButton.onclick = () => toggleTodoCompletion(todo.id);
      actionsContainer.appendChild(completeButton);
  
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.onclick = () => editTodo(todo.id);
      actionsContainer.appendChild(editButton);
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.onclick = () => deleteTodo(todo.id);
      actionsContainer.appendChild(deleteButton);

      const setReminderButton = document.createElement('button');
      setReminderButton.textContent = 'Set Reminder';
      setReminderButton.addEventListener('click', () => setReminder(todo.id));
      actionsContainer.appendChild(setReminderButton);
  
      todoItem.appendChild(actionsContainer);
      todoListContainer.appendChild(todoItem);
    });
  }
  

  // Function to set a reminder for a todo item
    function setReminder(todoId) {
        const todo = todos.find(item => item.id === todoId);
        if (todo) {
        const reminderDate = prompt("Enter the reminder date '2023-12-31'(YYYY-MM-DD):");
        const reminderTime = prompt("Enter the reminder time '15:30' (3:30 PM)(HH:mm):");
    
        if (reminderDate && reminderTime) {
            const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
            if (!isNaN(reminderDateTime) && reminderDateTime > new Date()) {
            todo.reminder = reminderDateTime;
            alert("Reminder set successfully!");
            } else {
            alert("Invalid date or time. Reminder not set.");
            }
        } else {
            alert("Reminder not set. Please provide both date and time.");
        }
        }
    }

  // Function to check and display reminders
    function checkReminders() {
        const now = new Date();
        const overdueReminders = todos.filter(todo => todo.reminder && todo.reminder <= now);
    
        if (overdueReminders.length > 0) {
        const reminderMessages = overdueReminders.map(todo => `Reminder for "${todo.todoText}"`);
        alert(`${reminderMessages.join('\n')}`);
        }
    }



 
  // Add event listener to the "Add Todo" button
//   document.getElementById('addTodoButton').addEventListener('click', addTodo());

//subtask section
// Function to add a new subtask to a specific todo
function addSubtaskToTodo(todoId, subtaskText, priority) {
    // console.log(subtaskText);
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
      const subtaskId = generateUniqueId();
      const subtask = {
        id: subtaskId,
        subtaskText: subtaskText.trim(),
        priority: priority.trim(),
        isCompleted: false
      };
    //   console.log(subtaskText.trim());
      todo.subtasks.push(subtask);
      saveTodosToLocalStorage();
      displayTodos();
    }
  }
  
  // Function to toggle the display of subtasks for a specific todo
  function toggleSubtasksDisplay(todoId) {
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
      todo.showSubtasks = !todo.showSubtasks;
      displayTodos();
    }
  }
  
  // Function to mark a subtask as done/undone
function toggleSubtaskCompletion(todoId, subtaskId) {
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
      const subtask = todo.subtasks.find(sub => sub.id === subtaskId);
      if (subtask) {
        subtask.isCompleted = !subtask.isCompleted;
        saveTodosToLocalStorage();
        displayTodos();
      }
    }
  }
  
  // Function to edit a subtask
function editSubtask(todoId, subtaskId, updatedSubtaskText, updatedPriority) {
    console.log(subtaskId);
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
    const subtask = todo.subtasks.find(sub => sub.id === subtaskId);
    if (subtask) {
        subtask.subtaskText = updatedSubtaskText.trim();
        subtask.priority = updatedPriority.trim();
        saveTodosToLocalStorage();
        displayTodos();
    }
    }
}

 // Function to delete a subtask
 function deleteSubtask(todoId, subtaskId) {
    console.log(subtaskId);
    const todo = todos.find(todo => todo.id === todoId);
    if (todo) {
      todo.subtasks = todo.subtasks.filter(sub => sub.id !== subtaskId);
      saveTodosToLocalStorage();
      displayTodos();
    }
  }

// Function to perform the search
function performSearch() {
    const searchQuery = document.getElementById('searchQuery').value.trim();
    if (searchQuery !== '') {
      const exactTodoResults = todos.filter(todo => todo.todoText.toLowerCase() === searchQuery.toLowerCase());
    //   const subtasksResults = todos.filter(todo =>
    //     todo.subtasks?.some(subtask => subtask.subtaskText && subtask.subtaskText.toLowerCase().includes(searchQuery.toLowerCase()))
    // );
        const subtasksResults='';
      const similarWordsResults = todos.filter(todo =>
        todo.todoText.toLowerCase().includes(searchQuery.toLowerCase())
      );
    //   const tagsResults = todos.filter(todo => todo.tags.toLowerCase().includes(searchQuery.toLowerCase()));
  
      const searchResults = exactTodoResults.length > 0 ? exactTodoResults :
        (subtasksResults.length > 0 ? subtasksResults :
        (similarWordsResults.length > 0 ? similarWordsResults : tagsResults));
  
      if (searchResults.length > 0) {
        console.log(searchResults);
        displayFilteredTodos(searchResults);
      } else {
        alert('Nothing found.');
      }
    }
  }


  // Function to filter todos by due date range
  function filterByDueDate(startDate, endDate) {
    if (!startDate || !endDate) {
      return todos;
    }
  
    const filteredTodos = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      return dueDate >= new Date(startDate) && dueDate <= new Date(endDate);
    });
  
    return filteredTodos;
  }
  
  // Function to filter todos by category
  function filterByCategory(category) {
    if (!category) {
      return todos;
    }
  
    const filteredTodos = todos.filter(todo => todo.category.toLowerCase() === category.toLowerCase());
    return filteredTodos;
  }
  
  // Function to filter todos by priority
  function filterByPriority(priority) {
    if (!priority || priority.toLowerCase()==='all') {
      return todos;
    }
  
    const filteredTodos = todos.filter(todo => todo.priority.toLowerCase() === priority.toLowerCase());
    return filteredTodos;
  }


  // Function to sort todos by due date
  function sortByDueDate() {
    const sortedTodos = todos.slice().sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    return sortedTodos;
  }
  
  // Function to sort todos by priority
  function sortByPriority() {
    const sortedTodos = todos.slice().sort((a, b) => {
      const priorityOrder = { 'low': 1, 'medium': 2, 'high': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    return sortedTodos;
  }
 
  
  
  // Function to display filtered and sorted todos
  function displayFilteredTodos(filteredTodos) {
    const todoListContainer = document.getElementById('todoList');
    todoListContainer.innerHTML = '';
    filteredTodos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        if (todo.isCompleted) {
          todoItem.classList.add('completed');
        }
    
        const todoTextElement = document.createElement('span');
        todoTextElement.textContent = todo.todoText;
        todoItem.appendChild(todoTextElement);
  
      //   adding subtask
      // Add Subtask button
      const addSubtaskButton = document.createElement('button');
      addSubtaskButton.textContent = 'Add Subtask';
      addSubtaskButton.onclick = () => {
        const subtaskText = prompt('Enter subtask:');
        const priority = prompt('Enter priority:');
        if (subtaskText !== null && subtaskText.trim() !== '' && priority !== null) {
          addSubtaskToTodo(todo.id, subtaskText, priority);
        }
      };
      todoItem.appendChild(addSubtaskButton);
      if(todo.subtasks.length>0){
  
          // Show/hide subtasks option
        const toggleSubtasksButton = document.createElement('button');
        toggleSubtasksButton.textContent = todo.showSubtasks ? 'Hide Subtasks' : 'Show Subtasks';
        toggleSubtasksButton.onclick = () => toggleSubtasksDisplay(todo.id);
        todoItem.appendChild(toggleSubtasksButton);
  
      //   // Add Subtask button
      //   const addSubtaskButton = document.createElement('button');
      //   addSubtaskButton.textContent = 'Add Subtask';
      //   addSubtaskButton.onclick = () => {
      //     const subtaskText = prompt('Enter subtask:');
      //     const priority = prompt('Enter priority:');
      //     if (subtaskText !== null && subtaskText.trim() !== '' && priority !== null) {
      //       addSubtaskToTodo(todo.id, subtaskText, priority);
      //     }
      //   };
      //   todoItem.appendChild(addSubtaskButton);
  
        if(todo.showSubtasks){
  
          const subtasksList=document.createElement('ul');
          subtasksList.className='subtask-list';
          todo.subtasks.forEach(subtask=>{
              console.log("display",subtask);
              const subtaskItem=document.createElement('li');
              subtaskItem.className='subtask-item';
              if(subtask.isCompleted){
                  subtaskItem.classList.add('completed');
              }
  
              const subtaskTextElement=document.createElement('span');
              subtaskTextElement.textContent=subtask.subtaskText;
              subtaskItem.appendChild(subtaskTextElement);
  
              const subtaskPriorityElement = document.createElement('span');
              subtaskPriorityElement.textContent = `Priority: ${subtask.priority}`;
              subtaskItem.appendChild(subtaskPriorityElement);
  
              // const subtaskActionsContainer=document.createElement('div');
              // subtaskActionsContainer.className='actions';
  
              const substaskCompleteButton= document.createElement('button');
              substaskCompleteButton.textContent=subtask.isCompleted ? 'Undone':'Done';
              substaskCompleteButton.onclick=() => toggleSubtaskCompletion(todo.id,subtask.id);
              // subtaskActionsContainer.appendChild(substaskCompleteButton);
              subtaskItem.appendChild(substaskCompleteButton);
  
              const subtaskEditButton=document.createElement('button');
              subtaskEditButton.textContent='Edit';
              subtaskEditButton.onclick = () => {
                  const updatedSubtaskText = prompt('Enter updated subtask:', subtask.subtaskText);
                  const updatedPriority = prompt('Enter updated priority:', subtask.priority);
                  if (updatedSubtaskText !== null && updatedSubtaskText.trim() !== '' && updatedPriority !== null) {
                  editSubtask(todo.id, subtask.id, updatedSubtaskText, updatedPriority);
                  }
              };
  
                  subtaskItem.appendChild(subtaskEditButton);
              // subtaskActionsContainer.appendChild(subtaskEditButton);
  
              const subtaskDeleteButton=document.createElement('button');
              subtaskDeleteButton.textContent='Delete';
              subtaskDeleteButton.onclick=()=> deleteSubtask(todo.id,subtask.id);
              // subtaskActionsContainer.appendChild(subtaskDeleteButton);
              subtaskItem.appendChild(subtaskDeleteButton);
  
              // subtaskItem.appendChild(subtaskActionsContainer);
              subtasksList.appendChild(subtaskItem);
          });
          todoItem.appendChild(subtasksList);
          }
      }
  
    
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'actions';
    
        const completeButton = document.createElement('button');
        completeButton.textContent = todo.isCompleted ? 'Undone' : 'Done';
        completeButton.onclick = () => toggleTodoCompletion(todo.id);
        actionsContainer.appendChild(completeButton);
    
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTodo(todo.id);
        actionsContainer.appendChild(editButton);
    
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(todo.id);
        actionsContainer.appendChild(deleteButton);
  
        const setReminderButton = document.createElement('button');
        setReminderButton.textContent = 'Set Reminder';
        setReminderButton.addEventListener('click', () => setReminder(todo.id));
        actionsContainer.appendChild(setReminderButton);
    
        todoItem.appendChild(actionsContainer);
        todoListContainer.appendChild(todoItem);
      });
  }
//   viewBacklogs section
  function viewBacklogs() {
    const currentDate = new Date();
  
    const backlogs = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      return !todo.isCompleted && dueDate < currentDate;
    });
    displayFilteredTodos(backlogs);
    if(backlogs.length === 0){
    alert("No task in Backlog")
    }
    // else{
  
    
    // }
  }

   

  
  // Initial setup to fetch todos from local storage and display them and wait to load the complete page
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addTodoButton').addEventListener('click', addTodo);
    document.getElementById('filterButton').addEventListener('click', () => {
      // ... [Code for filtering] ...
      const startDate = document.getElementById('startDateFilter').value;
    const endDate = document.getElementById('endDateFilter').value;
    const category = document.getElementById('categoryFilter').value.trim();
    const priority = document.getElementById('priorityFilter').value.trim();
  
    let filteredTodos = todos;
    filteredTodos = filterByDueDate(startDate, endDate);
    filteredTodos = filterByCategory(category);
    filteredTodos = filterByPriority(priority);
  
    displayFilteredTodos(filteredTodos);
    });
    // ... [Code for sorting] ...
    document.getElementById('sortButton').addEventListener('click', () => {
      
      const sortBy = document.getElementById('sortBy').value;
    console.log(sortBy);
    let sortedTodos = todos;
    if (sortBy === 'dueDate') {
      sortedTodos = sortByDueDate();
    } else if (sortBy === 'priority') {
      sortedTodos = sortByPriority();
    }
  
    displayFilteredTodos(sortedTodos);
    });
    // document.getElementById('viewBacklogsButton').addEventListener('click', viewBacklogs);
    // Add event listener to the "View Backlogs" button
    const viewBacklogsButton = document.getElementById('viewBacklogsButton');
    viewBacklogsButton.addEventListener('click', () => {
    if (viewBacklogsButton.textContent === 'View Backlogs') {
        viewBacklogs();
        viewBacklogsButton.textContent = 'Show All Tasks';
    } else {
        // showAllTasks();
        displayTodos();
        viewBacklogsButton.textContent = 'View Backlogs';
    }
    });
  
    // Initial setup to fetch todos from local storage and display them
    fetchTodosFromLocalStorage();
    displayTodos();  //rerender tasks also use in edit and deletection to rerender it.
  });
//   fetchTodosFromLocalStorage();
//   displayTodos();
  