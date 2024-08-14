
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

function generateTaskId() {
 
  nextId = nextId || 1;
  localStorage.setItem('nextId', JSON.stringify(++nextId));
  return nextId;
}

function createTaskCard(task) {
  const taskCard = $('<div>')
    .addClass('card task-card my-3 shadow-sm draggable')
    .attr('data-task-id', task.id);

  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(`Due: ${task.dueDate}`);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id)
    .on('click', handleDeleteTask);


  const now = dayjs();
  const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
  if (taskDueDate.isBefore(now, 'day')) {
    taskCard.addClass('bg-danger text-white'); 
  } else if (taskDueDate.diff(now, 'day') <= 2) {
    taskCard.addClass('bg-warning text-dark'); 
  } else {
    taskCard.addClass('bg-light');
  }


  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);

  return taskCard;
}

function renderTaskList() {
  const todoList = $('#todo-cards').empty();
  const inProgressList = $('#in-progress-cards').empty();
  const doneList = $('#done-cards').empty();

  for (let task of taskList) {
    const taskCard = createTaskCard(task);
    if (task.status === 'to-do') {
      todoList.append(taskCard);
    } else if (task.status === 'in-progress') {
      inProgressList.append(taskCard);
    } else if (task.status === 'done') {
      doneList.append(taskCard);
    }
  }

 
  $('.draggable').draggable({
    revert: 'invalid',
    helper: 'clone',
    start: function () {
      $(this).css('z-index', 1000);
    }
  });


  $('.lane').droppable({
    accept: '.draggable',
    hoverClass: 'lane-hover',
    drop: handleDrop
  });
}

function handleAddTask(event) {
  event.preventDefault();

  const task = {
    id: generateTaskId(),
    title: $('#taskTitle').val(),
    description: $('#taskDescription').val(),
    dueDate: $('#taskDueDate').val(),
    status: 'to-do',
  };

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();


  $('#taskTitle').val('');
  $('#taskDescription').val('');
  $('#taskDueDate').val('');
  $('#formModal').modal('hide');
}


function handleDeleteTask(event) {
  const taskId = $(this).attr('data-task-id');
  taskList = taskList.filter(task => task.id !== parseInt(taskId));
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}


function handleDrop(event, ui) {
  const taskId = ui.draggable.attr('data-task-id');
  const newStatus = event.target.id.replace('-cards', '');

  for (let task of taskList) {
    if (task.id === parseInt(taskId)) {
      task.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
}


$(document).ready(function () {
  renderTaskList();

  $('#taskForm').on('submit', handleAddTask);

  $('#taskDueDate').datepicker({
    dateFormat: 'dd/mm/yy',
    minDate: 0
  });

  $(document).on('click', '.btn-close', handleDeleteTask);
});
