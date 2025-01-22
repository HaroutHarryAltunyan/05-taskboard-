// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const id = nextId;
  nextId += 1;
  return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  // Create the task card container
  const card = $("<div></div>")
    .addClass("task-card card mb-2 p-2") // Add Bootstrap and custom styles
    .attr("data-id", task.id); // Store task ID in the card

  // Create task content elements
  const title = $("<p></p>")
    .addClass("fw-bold mb-1") // Add styles for the title
    .text(task.taskTitle);

  const dueDate = $("<div></div>")
    .addClass("text-muted mb-1") // Add muted text style
    .text(`Due: ${task.taskDueDate}`);

  const description = $("<div></div>")
    .addClass("mb-2") // Add margin for spacing
    .text(task.taskDiscription);

  // Create delete button
  const deleteButton = $("<button></button>")
    .addClass("btn btn-sm btn-danger") // Bootstrap button styles
    .text("Delete")
    .click(() => {
      console.log(`Delete button clicked for task ID: ${task.id}`);
      handleDeleteTask(task.id);
    });

  // Append all elements to the card
  card.append(title, dueDate, description, deleteButton);

  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // Clear all task lanes
  $("#todo-cards, #in-progress-cards, #done-cards").empty();

  // Retrieve task list from localStorage or initialize an empty array
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  // Iterate through each task and append it to the appropriate lane
  taskList.forEach((task) => {
    const taskCard = createTaskCard(task);

    // Append the card to the correct lane based on its status
    const laneSelector = {
      "to-do": "#todo-cards",
      "in-progress": "#in-progress-cards",
      "done": "#done-cards",
    };

    const statusClass = {
      "to-do": "todo-card",
      "in-progress": "inprogress-card",
      "done": "done-card",
    };

    taskCard.addClass(statusClass[task.status] || "").removeClass(
      Object.values(statusClass).filter((cls) => cls !== statusClass[task.status]).join(" ")
    );

    $(laneSelector[task.status]).append(taskCard);
  });

  initializeDragAndDrop();
}

// Function to initialize drag-and-drop functionality
function initializeDragAndDrop() {
  // Make task cards draggable
  $(".task-card").draggable({
    revert: "invalid", // Revert if not dropped on a valid target
    start: function () {
      $(this).addClass("dragging");
    },
    stop: function () {
      $(this).removeClass("dragging");
    },
  });

  // Make lanes droppable
  $(".task-lane").droppable({
    accept: ".task-card",
    drop: function (event, ui) {
      const newStatus = $(this).data("status"); // Get new status from the lane
      const taskId = parseInt(ui.draggable.data("id"), 10); // Get task ID from the card
      handleDrop(taskId, newStatus); // Handle the drop event
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // Prevent the page from refreshing

  // Retrieve input values
  const taskTitle = $("#taskTitle").val().trim();
  const taskDueDate = $("#taskDueDate").val().trim();
  const taskDiscription = $("#taskDiscription").val().trim();

  // Validate input fields
  if (!taskTitle || !taskDueDate || !taskDiscription) {
    alert("All fields are required. Please fill out the form completely.");
    return;
  }

  // Create a new task object
  const newTask = {
    id: generateTaskId(),
    taskTitle,
    taskDueDate,
    taskDiscription,
    status: "to-do",
  };

  // Retrieve the existing task list or initialize an empty array
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  // Add the new task to the task list
  taskList.push(newTask);

  // Save the updated task list and nextId to localStorage
  localStorage.setItem("taskList", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  // Re-render the task list
  renderTaskList();

  // Clear the form fields
  $("#taskTitle").val("");
  $("#taskDueDate").val("");
  $("#taskDiscription").val("");

  console.log("New task added:", newTask);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  // Retrieve task list from localStorage or initialize an empty array
  const taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  console.log("Before deletion:", taskList);

  // Filter the task list to exclude the task with the specified ID
  const updatedTaskList = taskList.filter(task => task.id !== taskId);

  console.log("After deletion:", updatedTaskList);

  // Update the task list in localStorage
  localStorage.setItem("taskList", JSON.stringify(updatedTaskList));

  // Re-render the task list
  renderTaskList();
}

// TODO: Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Retrieve the task list from localStorage
  let taskList = JSON.parse(localStorage.getItem("taskList")) || [];

  // Extract the task ID and new status
  const taskId = ui.draggable.data("id"); // Correctly retrieve task ID from the dragged element
  const newStatus = $(event.target).closest(".lane").attr("id"); // Use closest lane's ID as the new status

  // Find the task by its ID
  const task = taskList.find((task) => task.id == taskId);

  if (task) {
    // Update the task's status
    task.status = newStatus.replace("-cards", ""); // Ensure ID suffix (like "-cards") is removed for status consistency

    // Save the updated task list to localStorage
    localStorage.setItem("taskList", JSON.stringify(taskList));

    // Re-render the task list to reflect changes
    renderTaskList();

    console.log(`Task ID ${taskId} moved to status: ${task.status}`);
  } else {
    console.error(`Task with ID ${taskId} not found.`);
  }
}

function initializeDragAndDrop() {
  // Make task cards draggable
  $(".task-card").draggable({
    revert: "invalid", // Revert to original position if not dropped on a valid target
    start: function () {
      $(this).addClass("dragging");
    },
    stop: function () {
      $(this).removeClass("dragging");
    },
  });

  // Make task lanes droppable
  $(".task-lane").droppable({
    accept: ".task-card", // Only accept task cards
    drop: function (event, ui) {
      handleDrop(event, ui); // Handle the drop event
    },
  });
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList(); // Render the task list on page load

  $("#submit").click(handleAddTask); // Add task button click event
  $("#taskDueDate").datepicker({ changeMonth: true, changeYear: true }); // Initialize datepicker

  // Initialize draggable and droppable after rendering the task list
  $(".task-card").draggable({
    revert: "invalid",
    start: function () {
      $(this).addClass("dragging");
    },
    stop: function () {
      $(this).removeClass("dragging");
    },
  });
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
  $(".task-lane").droppable({
    revert: "invalid",
    accept: ".task-card",
    drop: function (event, ui) {
      const newStatus = $(this).data("status");
      const taskId = ui.draggable.data("id");
      console.log(newStatus);
      handleDrop(taskId, newStatus);
    },
  });
});