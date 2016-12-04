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
        <button class="complete">Complete</button>
      </header>
      <p contenteditable="true" class="card-body ${completed} ${this.completed}">${this.body}</p>
      <footer>
        <button class="upvote">upvote</button><button class="downvote">downvote</button>
        <h4>
          importance:<span class="importance-change" tabindex="0"> ${this.importance}</span>
        </h4>
      </footer>
    </li>
    `);
  };

  Task.prototype.completedToHTML = function() {
    return (`
      <li class="task-card ${this.completed}" id=${this.id}>
        <header class="bottom-header">
          <button class="destroy">Delete</button>
          <h3 contenteditable="true" class="strikethrough ${this.completed}">${this.title}</h3>
        </header>
        <p contenteditable="true" class="card-body strikethrough ${this.completed}">${this.body}</p>
        <footer>
          <button class="upvote">upvote</button><button class="downvote">downvote</button>
          <h4>
            importance:<span class="importance-change" tabindex="0"> ${this.importance}</span>
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
  let importance = this.importance;
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
  let importance = this.importance;
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

const taskManager = {
  taskArray: [],
  // completedTaskArray: [],
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
    for (let i = 0; i < this.taskArray.length; i++) {
      let task = this.taskArray[i];
      taskSection.prepend(task.toHTML());
    }
  },

  renderOnlyTen: function () {
    taskSection.html('');
    this.taskArray = this.taskArray.concat().reverse().slice(0, 10);
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

module.exports = Task;
module.exports = taskManager;
