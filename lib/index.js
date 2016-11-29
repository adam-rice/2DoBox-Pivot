$ = require('jquery');

var titleInput = $('#task-title');
var bodyInput = $('#task-body');
var saveButton = $('#save-btn');
var taskSection = $('#task-section');
var search = $('#search');

$(document).ready (function() {
  function Task(title, body, quality, id) {
    this.title = title;
    this.body = body;
    this.quality = quality || "swill";
    this.id = id || Date.now();
  }

  Task.prototype.toHTML = function() {
    return (`
      <li class="task-card" id=${this.id}>
        <header class="bottom-header">
          <button class="destroy-btn"></button>
          <h3 contenteditable="true">${this.title}</h3>
        </header>
        <p class="card-body" contenteditable="true">${this.body}</p>
        <footer>
          <button id="upvote" class="upvote-btn"></button>
          <button id="downvote" class="downvote-btn"></button>
          <h4 class="quality">
            quality:<span class="quality-change"> ${this.quality}</span>
          </h4>
        </footer>
      </li>
      `);
    };

  Task.prototype.remove = function(id) {
    taskManager.remove(this.id);
  };

  Task.prototype.upvote = function() {
    var quality = this.quality;
    if (quality === 'swill') {
      this.quality = 'plausible';
      } else if (quality === 'plausible') {
      this.quality = 'genius';
    }
    taskManager.store();
  };

  Task.prototype.downvote = function() {
    var quality = this.quality;
    if (quality === 'genius') {
      this.quality = 'plausible';
      } else if (quality === 'plausible') {
      this.quality = 'swill';
    }
    taskManager.store();
  };

  Task.prototype.saveNewTitle = function (target) {
    this.title = target;
    taskManager.store();
  };

  Task.prototype.saveNewBody = function (target) {
    this.body = target;
    taskManager.store();
  };

  var taskManager = {
    taskArray: [],
    add: function(title, body) {
      this.taskArray.push(new Task(title, body));
      this.store();
    },

    find: function(id) {
      id = parseInt(id);
      return this.taskArray.find( function(task) {
        return task.id === id;
      });
    },

    render: function () {
      taskSection.html('');
      for (var i = 0; i < this.taskArray.length; i++) {
        var task = this.taskArray[i];
        taskSection.prepend(task.toHTML());
      }
    },

    store: function() {
      localStorage.setItem('tasks', JSON.stringify(this.taskArray));
      this.render();
    },

    retrieve: function() {
      var retrievedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (retrievedTasks) {
        for (i = 0; i < retrievedTasks.length; i++) {
          var task = retrievedTasks[i];
          this.taskArray.push(new Task(task.title, task.body, task.quality, task.id));
        }
      }
    },

    remove: function(id) {
      this.taskArray = this.taskArray.filter(function(task) {
        return task.id !== id;
      });
      this.store();
    }
  }; //end of taskManager

  saveButton.on('click', function() {
    addNewTaskToTaskManager();
    clearInputFields();
  });

  bodyInput.on('keyup', function(key) {
    var title = titleInput.val();
    var body = bodyInput.val();
    if (key.which === 13) {
      if (title === "" || body === "") {
        return false;
        } else {
        addNewTaskToTaskManager();
        clearInputFields();
      }
    }
  });

  taskSection.on('click', '.destroy-btn, .upvote-btn, .downvote-btn', function() {
    var id = $(this).closest('.task-card').attr('id');
    var find = taskManager.find(id);
    if (this.id === 'upvote') {
      find.upvote();
      } else if (this.id === 'downvote') {
      find.downvote();
    } else find.remove();
  });

  taskSection.on('keydown click', 'h3, p', function(key) {
    var id = $(this).closest('.task-card').attr('id');
    $(this).addClass('changing-innertext');
    if (key.which === 13) {
      replaceNodeText($(this), id);
    }
  });

  taskSection.on('blur', 'h3, p', function() {
    var id = $(this).closest('.task-card').attr('id');
     $(this).removeClass('changing-innertext');
     replaceNodeText($(this), id);
  });

  search.on("keyup", function() {
    var search = $(this).val();
    $('h3:contains(' + search + ')').closest('.task-card').show();
    $('h3:not(:contains(' + search + '))').closest('.task-card').hide();
    $('p:contains(' + search + ')').closest('.task-card').show();
  });

  titleInput.keyup( function() {
    enableSave();
  });

  bodyInput.keyup( function ()  {
    enableSave();
  });

  function enableSave() {
    var title = titleInput.val();
    var body = bodyInput.val();
    if (title === "" || body === "") {
      saveButton.attr('disabled', true);
      } else if (title !== "" && body !== "") {
      saveButton.attr('disabled', false);
    }
  }

  function addNewTaskToTaskManager() {
    taskManager.add(titleInput.val(), bodyInput.val());
  }

  function clearInputFields() {
    titleInput.val('');
    bodyInput.val('');
    bodyInput.blur();
    saveButton.attr('disabled', true);
  }

  function replaceNodeText(selector, id) {
    if (event.target.nodeName === 'H3') {
      var newTitle = selector.closest('h3').text();
      taskManager.find(id).saveNewTitle(newTitle);
      } else if (event.target.nodeName === 'P') {
      var newBody = selector.closest('p').text();
      taskManager.find(id).saveNewBody(newBody);
    }
  }

taskManager.retrieve();
taskManager.render();
});
