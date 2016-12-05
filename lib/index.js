/*jshint esversion: 6 */
require('../CSS/reset.scss');
require('../CSS/styles.scss');
$ = require('jquery');
let Task = require('./task');
let taskManager = require('./task');

const titleInput = $('#task-title');
const bodyInput = $('#task-body');
const saveBtn = $('#save-btn');
const taskSection = $('#task-section');
const filterSection = $('#filters');
const search = $('#search');

titleInput.keyup( function() {
  enableSave();
  charCounterTitle();
});

bodyInput.keyup( function () {
  enableSave();
  charCounterBody();
});

saveBtn.on('click', function() {
  makeNewTask();
  taskManager.render();
  titleInput.focus();
  showLoadMoreBtn();
  taskManager.hideCompletedTask();
});

bodyInput.on('keyup', function(key) {
  let title = titleInput.val();
  let body = bodyInput.val();
  if (key.which === 13) {
    if (title === "" || body === "") {
      return false;
    } else {
      makeNewTask();
      showLoadMoreBtn();
    }
  }
});

filterSection.on('click', '#critical, #high, #normal, #low, #none', function() {
  let id = $(this).attr('id');
  taskManager.showTasksFilterSelection(id);
  taskManager.hideCompletedTask();
  hideLoadMoreBtn();
});

filterSection.on('click', '#complete-filter-btn', function() {
  taskManager.hideCompletedTask();
  taskManager.showCompletedTasks();
  hideLoadMoreBtn();
});

filterSection.on('click', '#reset-filter-btn', function() {
  taskSection.html('');
  taskManager.render();
  taskManager.hideCompletedTask();
  $('#load-more').show();
});


$('#load-more').on('click', function() {
  const $loadMoreBtn = $('#load-more');
  if (taskManager.taskArray.length === 0) {
    $loadMoreBtn.html('You don\'t have any 2Dos yet');
  } else if (taskManager.taskArray.length <= 10) {
    $loadMoreBtn.html('You don\'t have any 2Dos hidden');
  } else {
    taskManager.renderAll();
    taskManager.hideCompletedTask();
    hideLoadMoreBtn();
  }
});

taskSection.on('click', '.destroy, .upvote, .downvote, .complete', function() {
  let id = $(this).attr('class');
  let card = $(this).closest('.task-card').attr('id');
  let find = taskManager.find(card);
  if (id === 'upvote') {
    find.upvote();
  } else if (id === 'downvote') {
    find.downvote();
  } else if (id === 'complete') {
    find.toggleState();
    $(this).siblings('.false').addClass('strikethrough');
    $(this).closest('.false').addClass('strikethrough');
    $(this).remove();
  } else if (id === 'destroy') {
    find.remove();
  }
});

taskSection.on('keydown click', 'h3, p', function(key) {
  let id = $(this).closest('.task-card').attr('id');
  $(this).addClass('changing-innertext');
  if (key.which === 13) {
    replaceNodeText($(this), id);
  }
});

search.on("keyup", function() {
  let search = $(this).val();
  $('h3:contains(' + search + ')').closest('.task-card').show();
  $('h3:not(:contains(' + search + '))').closest('.task-card').hide();
  $('p:contains(' + search + ')').closest('.task-card').show();
  taskManager.hideCompletedTask();
});

function enableSave() {
  let title = titleInput.val();
  let body = bodyInput.val();
  let titleCharCount = title.length;
  let bodyCharCount = body.length;
  if (title === "" || body === "" || titleCharCount > 120 || bodyCharCount > 120) {
    saveBtn.attr('disabled', true);
  } else if (title !== "" && body !== "" && titleCharCount <=120 && bodyCharCount <=120) {
    saveBtn.attr('disabled', false);
  }
}

function addNewTaskToTaskManager() {
  taskManager.add(titleInput.val(), bodyInput.val());
}

function clearInputFields() {
  titleInput.val('');
  bodyInput.val('');
  bodyInput.blur();
  saveBtn.attr('disabled', true);
}

function replaceNodeText(selector, id) {
  let newText = taskManager.find(id);
  if (event.target.nodeName === 'H3') {
    let newTitle = selector.closest('h3').text();
    newText.saveNewTitle(newTitle);
    } else if (event.target.nodeName === 'P') {
    let newBody = selector.closest('p').text();
    newText.saveNewBody(newBody);
  }
}

function charCounterTitle() {
  let title = titleInput.val();
  let $titleCounterDisplay = $('.title-counter-display');
  if (title.length <= 0) {
    $titleCounterDisplay.hide();
  } else {
    $titleCounterDisplay.show().html(title.length+' (max 120)');
  }
}

function charCounterBody() {
  let body = bodyInput.val();
  let $bodyCounterDisplay = $('.body-counter-display');
  if (body.length <= 0) {
    $bodyCounterDisplay.hide();
  } else {
    $bodyCounterDisplay.show().html(body.length+' (max 120)');
  }
}

function clearCharCounts() {
  let $bodyCounterDisplay = $('.body-counter-display');
  let $titleCounterDisplay = $('.title-counter-display');
  $titleCounterDisplay.html('');
  $bodyCounterDisplay.html('');
}

function makeNewTask() {
  addNewTaskToTaskManager();
  clearInputFields();
  clearCharCounts();
}

function showLoadMoreBtn() {
  $('#load-more').show();
  $('#load-more').html('Load More...');
}

function hideLoadMoreBtn() {
  $('#load-more').hide();
}

taskManager.retrieve();
taskManager.render();
taskManager.hideCompletedTask();
