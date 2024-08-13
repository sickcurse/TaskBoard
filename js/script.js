const dayjs = require('dayjs')
//import dayjs from 'dayjs' // ES 2015
dayjs().format()
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"))  || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    if (nextId === null) {
        nextId = 1;
    } else {
        nextId += 1;
    }

    localStorage.setItem('nextId', JSON.stringify(nextId));

    return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const $taskCard = $('<div>', {
        class: 'card task-card my-3 shadow-sm',
        'data-task-id': task.id,
        draggable: true
    });

    const $cardHeader = $('<div>', {
        class: 'card-header d-flex justify-content-between align-items-center bg-primary text-white'
    }).append(
        $('<span>', { class: 'h5 mb-0', text: task.title }),
        $('<button>', {
            class: 'btn-close text-white',
            click: handleDeleteTask,
            'data-task-id': task.id,
            title: 'Delete Task'
        })
    );

    const $cardBody = $('<div>', { class: 'card-body' });
    const $cardDescription = $('<p>', { class: 'card-text', text: task.description });
    const $cardDueDate = $('<p>', { class: 'card-text fw-bold', text: `Due: ${task.dueDate}` });

    $cardBody.append($cardDescription, $cardDueDate);

    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');
    if (now.isSame(taskDueDate, 'day')) {
        $taskCard.addClass('bg-warning text-dark');
    } else if (now.isAfter(taskDueDate)) {
        $taskCard.addClass('bg-danger text-white');
        $cardDueDate.addClass('text-light');
    }

    $taskCard.append($cardHeader, $cardBody);

    $taskCard.on('dragstart', function (event) {
        event.originalEvent.dataTransfer.setData('text/plain', task.id);
    });

    return $taskCard;
}


function renderTaskList() {
  
    if (!taskList) {
        taskList = [];
    }

   
    const todoList = $('#todo-cards');
    todoList.empty();

    const inProgressList = $('#in-progress-cards');
    inProgressList.empty();

    const doneList = $('#done-cards');
    doneList.empty();

   
    for (let task of taskList) {
        if (task.status === 'To Do') {
            todoList.append(createTaskCard(task));
        } else if (task.status === 'In Progress') {
            inProgressList.append(createTaskCard(task));
        } else if (task.status === 'Done') {
            doneList.append(createTaskCard(task));
        }
    }

    
    $('.task-card').draggable({
        opacity: 0.7,
        zIndex: 100,
    
        helper: function (e) {
        
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                maxWidth: original.outerWidth(),
            });
        },
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
