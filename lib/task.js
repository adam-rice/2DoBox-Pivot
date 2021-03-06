/*jshint esversion: 6 */
$ = require('jquery');

const taskSection = $('#task-section');

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
        <h3 contenteditable="true" class="${completed} ${this.completed}">${this.title}</h3>
        <button class="destroy">Delete</button>
        <button class="complete" name="complete">Complete</button>
      </header>
      <p contenteditable="true" class="card-body ${completed} ${this.completed}">${this.body}</p>
      <footer>
        <button name="upvote" class="upvote">upvote</button><button class="downvote">downvote</button>
        <h4 tabindex="0">
          importance:<span name="importance" class="importance-change" tabindex="0"> ${this.importance}</span>
        </h4>
      </footer>
    </li>
    `);
  };

  Task.prototype.completedToHTML = function() {
    return (`
      <li class="task-card ${this.completed}" id=${this.id}>
        <header class="bottom-header">
          <h3 contenteditable="true" class="strikethrough ${this.completed}">${this.title}</h3>
          <button class="destroy">Delete</button>
        </header>
        <p contenteditable="true" class="card-body strikethrough ${this.completed}">${this.body}</p>
        <footer>
          <button class="upvote">upvote</button><button class="downvote">downvote</button>
          <h4 tabindex="0">
            importance:<span name="importance" class="importance-change" tabindex="0"> ${this.importance}</span>
          </h4>
        </footer>
      </li>
      `);
    };

Task.prototype.remove = function(id) {
  taskManager.remove(this.id);
  taskManager.hideCompletedTask();
  showLoadMoreBtn();
};

Task.prototype.upvote = function() {
  let importance = this.importance;
  switch(importance) {
    case 'none':
      this.importance = 'low';
    break;
    case 'low':
      this.importance = 'normal';
    break;
    case 'normal':
      this.importance = 'high';
    break;
    case 'high':
      this.importance = 'critical';
    break;
    default: 'normal';
  }
  updateTaskSection();
  showLoadMoreBtn();
};

Task.prototype.downvote = function() {
  let importance = this.importance;
  switch(importance) {
    case 'critical':
      this.importance = 'high';
    break;
    case 'high':
      this.importance = 'normal';
    break;
    case 'normal':
      this.importance = 'low';
    break;
    case 'low':
      this.importance = 'none';
    break;
    default: 'normal';
  }
  updateTaskSection();
  showLoadMoreBtn();
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
  updateTaskSection();
};

Task.prototype.saveNewBody = function (target) {
  this.body = target;
  updateTaskSection();
};

const taskManager = {
  taskArray: [],
  add: function(title, body) {
    this.taskArray.push(new Task(title, body));
    this.store();
    this.render();
    this.hideCompletedTask();
  },

  find: function(id) {
    id = parseInt(id);
    return this.taskArray.find( function(task) {
      return task.id === id;
    });
  },

  render: function () {
    taskSection.html('');
    let sliced = this.taskArray.slice();
    if(sliced.length > 10) {
      sliced = sliced.splice(sliced.length-10 , sliced.length-1);
      for (let i = 0; i < sliced.length; i++) {
        let uncompletedTask = sliced[i];
        taskSection.prepend(uncompletedTask.toHTML());
      }
      } else {
      for (let i = 0; i < sliced.length; i++) {
        let uncompletedTask = sliced[i];
        taskSection.prepend(uncompletedTask.toHTML());
      }
    }
  },

  renderAll: function () {
    taskSection.html('');
    for (let i = 0; i < this.taskArray.length; i++) {
    task = this.taskArray[i];
    taskSection.prepend(task.toHTML());
    }
  },

  store: function() {
    localStorage.setItem('tasks', JSON.stringify(this.taskArray));
  },

  retrieve: function() {
    let retrievedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (retrievedTasks) {
      for (i = 0; i < retrievedTasks.length; i++) {
        let task = retrievedTasks[i];
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
    for (let i = 0; i < this.taskArray.length; i++) {
      let task = this.taskArray[i];
      if (task.completed === true) {
        $('.true').hide();
      }
    }
  },

  showCompletedTasks: function() {
    for (let i = 0; i < this.taskArray.length; i++) {
      let task = this.taskArray[i];
      if (task.completed === true) {
        taskSection.prepend(task.completedToHTML());
      }
    }
  },

  showTasksFilterSelection: function(id) {
    taskSection.html('');
    for (let i = 0; i < this.taskArray.length; i++) {
      let task = this.taskArray[i];
      if (task.importance === id) {
        taskSection.prepend(task.toHTML());
      }
    }
  }
}; //end of taskManager

function showLoadMoreBtn() {
  $('#load-more').show();
  $('#load-more').html('Load More...');
}

function updateTaskSection() {
  taskManager.store();
  taskManager.render();
  taskManager.hideCompletedTask();
}

module.exports = Task;
module.exports = taskManager;
