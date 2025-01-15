// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (!nextId) {
        nextId = 1;
      }
      const currentId = nextId;
      nextId++;
      localStorage.setItem("nextId", JSON.stringify(nextId));
      return currentId;
    }

// Todo: create a function to create a task card
function createTaskCard(task) {
    return $(`
        <div class="task-card" data-id="${task.id}">
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p><strong>Due:</strong> ${task.dueDate}</p>
          <button class="delete-task-btn">Delete</button>
        </div>
      `).draggable({
        revert: "invalid",
        stack: ".task-card",
        cursor: "move"
      });
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear existing tasks
  $(".lane").empty();

  // Check if taskList exists, otherwise initialize it
  if (!taskList) {
    taskList = [];
  }

  // Loop through tasks and render each one
  taskList.forEach(task => {
    let $taskCard = createTaskCard(task);
    $(`#${task.status}-lane`).append($taskCard);
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    // Get input values
    let title = $("#task-title").val().trim();
    let description = $("#task-desc").val().trim();
    let dueDate = $("#task-due").val();
    let status = "todo"; // Default status for new tasks
  
    if (title && dueDate) {
      // Create a new task object
      let newTask = {
        id: generateTaskId(),
        title,
        description,
        dueDate,
        status
      };
  
      // Add the new task to the task list
      taskList.push(newTask);
  
      // Update localStorage
      localStorage.setItem("tasks", JSON.stringify(taskList));
  
      // Render the updated task list
      renderTaskList();
  
      // Clear input fields
      $("#task-form")[0].reset();
    } else {
      alert("Please fill in the title and due date.");
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    let taskId = $(event.target).closest(".task-card").data("id");

    // Filter out the task to be deleted
    taskList = taskList.filter(task => task.id !== taskId);
  
    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));
  
    // Render the updated task list
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
