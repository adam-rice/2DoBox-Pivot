/*jshint esversion: 6 */
$ = require('jquery');

var titleInput = $('#task-title');
var bodyInput = $('#task-body');
var saveBtn = $('#save-btn');
var taskSection = $('#task-section');
var filterSection = $('#filters');
var search = $('#search');
var loadMoreBtn = $('#load-more');

  function Task(title, body, importance, id, completed) {
    this.title = title;
    this.body = body;
    this.importance = importance || "normal";
    this.id = id || Date.now();
    this.completed = completed || false;
  }

  Task.prototype.toHTML = function() {
    let completed = this.completed;
    if (completed === true) {
      completed = 'strikethrough';
    }
    return (`
      <li class="task-card ${this.completed}" id=${this.id}>
        <header class="bottom-header">
          <button class="destroy">Delete</button>
          <button class="complete">Complete</button>
          <h3 contenteditable="true" class="${completed} ${this.completed}">${this.title}</h3>
        </header>
        <p contenteditable="true" class="card-body ${completed} ${this.completed}">${this.body}</p>
        <footer>
          <button class="upvote">upvote</button><button class="downvote">downvote</button>
          <h4>
            importance:<span class="importance-change"> ${this.importance}</span>
          </h4>
        </footer>
      </li>
      `);
    };

  Task.prototype.remove = function(id) {
    taskManager.remove(this.id);
    taskManager.hideCompletedTask();
  };

  Task.prototype.upvote = function() {
    var importance = this.importance;
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
    taskManager.render();
    taskManager.hideCompletedTask();
  };

  Task.prototype.downvote = function() {
    var importance = this.importance;
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
    taskManager.render();
    taskManager.hideCompletedTask();
  };

  Task.prototype.toggleState = function() {
    if (this.completed === false) {
      this.completed = true;
    } else if (this.completed === true) {
      this.completed = false;
    }
    taskManager.store();
  };

  Task.prototype.saveNewTitle = function (target) {
    this.title = target;
    taskManager.store();
    taskManager.render();
    taskManager.hideCompletedTask();
  };

  Task.prototype.saveNewBody = function (target) {
    this.body = target;
    taskManager.store();
    taskManager.render();
    taskManager.hideCompletedTask();
  };

  var taskManager = {
    taskArray: [],
    completedTaskArray: [],
    add: function(title, body) {
      this.taskArray.push(new Task(title, body));
      this.store();
      this.render();
      this.hideCompletedTask();
    },

    addCompletedTaskToArray: function(title, body) {
      this.completedTaskArray.push(new Task(title, body));
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

    // renderOnlyTen: function() {
    //   taskSection.html('');
    //   var subset = this.taskArray.concat().reverse().slice(0, 10);
    //   for (var i = 9; i >= 0; i++) {
    //     var task = subset[i];
    //     taskSection.prepend(task.toHTML());
    //   }
    // },

    renderOnlyTen: function () {
      taskSection.html('');
      this.taskArray = this.taskArray.concat().reverse().slice(0, 10);
      for (var i = 0; i < this.taskArray.length; i++) {
        task = this.taskArray[i];
        taskSection.prepend(task.toHTML());
      }
    },

    store: function() {
      localStorage.setItem('tasks', JSON.stringify(this.taskArray));
      // this.render();
    },

    retrieve: function() {
      var retrievedTasks = JSON.parse(localStorage.getItem('tasks'));
      if (retrievedTasks) {
        for (i = 0; i < retrievedTasks.length; i++) {
          var task = retrievedTasks[i];
          this.taskArray.push(new Task(task.title, task.body, task.importance, task.id, task.completed));
        }
      }
    },

    remove: function(id) {
      this.taskArray = this.taskArray.filter(function(task) {
        return task.id !== id;
      });
      this.store();
      this.render();
    },

    hideCompletedTask: function() {
      for (var i = 0; i < this.taskArray.length; i++) {
        var task = this.taskArray[i];
        if (task.completed === true) {
          $('.true').hide();
        }
      }
    },

    showCompletedTasks: function() {
      for (var i = 0; i < this.taskArray.length; i++) {
        var task = this.taskArray[i];
        if (task.completed === true) {
          taskSection.prepend(task.toHTML());
          // $(this).closest('.complete').hide();
        }
      }
    }
  }; //end of taskManager

  saveBtn.on('click', function() {
    makeNewTask();
    taskManager.renderOnlyTen();
  });

  filterSection.on('click', '#complete-btn-filter', function() {
    taskManager.showCompletedTasks();
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

  loadMoreBtn.on('click', function() {
    taskManager.render();
    loadMoreBtn.hide();
  });

  taskSection.on('click', '.destroy, .upvote, .downvote, .complete', function() {
    var id = $(this).attr('class');
    var card = $(this).closest('.task-card').attr('id');
    var find = taskManager.find(card);
    if (id === 'upvote') {
      find.upvote();
    } else if (id === 'downvote') {
      find.downvote();
    } else if (id === 'complete') {
      find.toggleState();
      $(this).closest('.false').addClass('strikethrough');
      taskManager.addCompletedTaskToArray();
      console.log(taskManager.completedTaskArray.length);
      $(this).hide();
    } else if (id === 'destroy') {
      find.remove();
    }
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
      saveBtn.attr('disabled', true);
    } else if (title !== "" && body !== "" && titleCharCount <=120 && bodyCharCount <=120) {
      saveBtn.attr('disabled', false);
    }
  }

  function addNewTaskToTaskManager() {
    taskManager.add(titleInput.val(), bodyInput.val());
  }

  // function hideCompleteBtn(task) {
  //   debugger
  //   if (task.completed === true) {
  //     $('.complete-btn').hide();
  //   }
  // }

  // function showCompleteBtn(task) {
  //   if (task.completed === false) {
  //     $(this).closest('.complete-btn').show();
  //   }
  // }

  function clearInputFields() {
    titleInput.val('');
    bodyInput.val('');
    bodyInput.blur();
    saveBtn.attr('disabled', true);
  }

  function replaceNodeText(selector, id) {
    var newText = taskManager.find(id);
    if (event.target.nodeName === 'H3') {
      var newTitle = selector.closest('h3').text();
      newText.saveNewTitle(newTitle);
      } else if (event.target.nodeName === 'P') {
      var newBody = selector.closest('p').text();
      newText.saveNewBody(newBody);
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
  taskManager.renderOnlyTen();
  taskManager.hideCompletedTask();
