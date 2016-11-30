/*jshint esversion: 6 */
$ = require('jquery');

var titleInput = $('#task-title');
var bodyInput = $('#task-body');
var saveButton = $('#save-btn');
var taskSection = $('#task-section');
var search = $('#search');

$(document).ready (function() {
  function Task(title, body, importance, id) {
    this.title = title;
    this.body = body;
    this.importance = importance || "normal";
    this.id = id || Date.now();
  }

  Task.prototype.toHTML = function() {
    return (`
      <li class="task-card" id=${this.id}>
        <header class="bottom-header">
          <button class="destroy-btn">Delete</button>
          <h3 contenteditable="true">${this.title}</h3>
        </header>
        <p class="card-body" contenteditable="true">${this.body}</p>
        <footer>
          <button class="upvote-btn" id="upvote">Upvote</button>
          <button class="downvote-btn" id="downvote">Downvote</button>
          <h4>
            importance:<span class="importance-change"> ${this.importance}</span>
          </h4>
        </footer>
      </li>
      `);
    };

  Task.prototype.remove = function(id) {
    taskManager.remove(this.id);
  };

  Task.prototype.upvote = function() {
    var importance = this.importance;
    // switch(importance) {
    //   case 'critical':
    //     return 'high';
    //   case 'high':
    //     return 'normal';
    //   default:
    //     return 'normal';
    // }
    if (importance === 'none') {
      this.importance = 'low';
    } else if (importance === 'low') {
      this.importance = 'normal';
    } else if (importance === 'normal') {
      this.importance = 'high';
    } else if (importance === 'high') {
      this.importance = 'critical';
    }
    taskManager.store();
  };

  Task.prototype.downvote = function() {
    var importance = this.importance;
    // switch(importance) {
    //   case 'none':
    //     return 'low';
    //   case 'low':
    //     return 'normal';
    //   default:
    //     return 'normal';
    // }
    if (importance === 'critical') {
      this.importance = 'high';
    } else if (importance === 'high') {
      this.importance = 'normal';
    } else if (importance === 'normal') {
      this.importance = 'low';
    } else if (importance === 'low') {
      this.importance = 'none';
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
          this.taskArray.push(new Task(task.title, task.body, task.importance, task.id));
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
    makeNewTask();
  });

  bodyInput.on('keyup', function(key) {
    var title = titleInput.val();
    var body = bodyInput.val();
    if (key.which === 13) {
      if (title === "" || body === "") {
        return false;
        } else {
          makeNewTask();
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

  taskSection.on('blur', 'h3', function() {
    var id = $(this).closest(titleInput).attr('id');
    $(this).removeClass('changing-innertext');
    replaceNodeText($(this), id);
  });

  taskSection.on('blur', 'p', function() {
    var id = $(this).closest(bodyInput).attr('id');
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
    charCounterTitle();
  });

  bodyInput.keyup( function ()  {
    enableSave();
    charCounterBody();
  });

  function enableSave() {
    var title = titleInput.val();
    var body = bodyInput.val();
    var titleCharCount = title.length;
    var bodyCharCount = body.length;
    if (title === "" || body === "" || titleCharCount > 120 || bodyCharCount > 120) {
      saveButton.attr('disabled', true);
    } else if (title !== "" && body !== "" && titleCharCount <=120 && bodyCharCount <=120) {
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

  function charCounterTitle() {
    var title = titleInput.val();
    var $titleCounterDisplay = $('.title-counter-display');
    if (title.length <= 0) {
      $titleCounterDisplay.hide();
    } else {
      $titleCounterDisplay.show().html(title.length+' (max 120)');
    }
  }

  function charCounterBody() {
    var body = bodyInput.val();
    var $bodyCounterDisplay = $('.body-counter-display');
    if (body.length <= 0) {
      $bodyCounterDisplay.hide();
    } else {
      $bodyCounterDisplay.show().html(body.length+' (max 120)');
    }
  }

  function clearCharCounts() {
    var $bodyCounterDisplay = $('.body-counter-display');
    var $titleCounterDisplay = $('.title-counter-display');
    $titleCounterDisplay.html('');
    $bodyCounterDisplay.html('');
  }

  function makeNewTask() {
    addNewTaskToTaskManager();
    clearInputFields();
    clearCharCounts();
  }

taskManager.retrieve();
taskManager.render();
});