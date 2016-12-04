/*jshint esversion: 6 */
function Task(title, body, importance, completed, id) {
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
        <button class="upvote">upvote</button><button class="downvote">downvote</button>
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
  showloadMoreBtn();
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
  // taskManager.store();
  // taskManager.render();
  // taskManager.hideCompletedTask();
  // showloadMoreBtn();
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
  // taskManager.store();
  // taskManager.render();
  // taskManager.hideCompletedTask();
  // showloadMoreBtn();
};

Task.prototype.toggleState = function() {
  if (this.completed === false) {
    this.completed = true;
  } else if (this.completed === true) {
    this.completed = false;
  }
  // taskManager.store();
};

Task.prototype.saveNewTitle = function (target) {
  this.title = target;
  // taskManager.store();
  // taskManager.render();
  // taskManager.hideCompletedTask();
};

Task.prototype.saveNewBody = function (target) {
  this.body = target;
  // taskManager.store();
  // taskManager.render();
  // taskManager.hideCompletedTask();
};

module.exports = Task;
