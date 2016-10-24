var titleInput = $('#titleInput');
var bodyInput = $('#bodyInput');
var saveButton = $('#saveButton');
var bottomPanel = $('#bottomPanel');
var ideaSection = $('#ideaSection');

saveButton.on('click', function () {
  ideaSection.prepend(`
    <li class="idea-card">
      <header>
        <h3>${titleInput.val()}</h3>
        <button class="remove-button"><img src="Images/delete-hover.svg"/></button>
      </header>
      <p class="body">${bodyInput.val()}</p>
      <footer>
        <button class="upvote"><img src="Images/upvote-hover.svg"/></button>
        <button class="downvote"><img src="Images/downvote-hover.svg"/></button>
        <p class="quality">quality:<span>swill</span></p>
      </footer>
    </li>
    `);
});

function Idea(title, body, quality, id) {
  this.title = title;
  this.body = body;
  this.quality = quality || "swill";
  this.id = id || Date.now();
}

Idea.prototype.remove = function(id) {
  id = parseInt(id);

};

var ideaBoss = {
  ideaArray: [],
  add: function() {
    this.ideaArray.push(new Idea(titleInput.value, bodyInput.value));
    store();
  },

  find: function(id) {
    id = parseInt(id);
    return this.ideaArray.find( function(idea) {
      return idea.id !== id;
    });
  },

  render: function () {
    ideaSection.html(this.ideaArray.map( function(idea) {
      return idea.toHTML();
      })
    );
  },

  store: function() {
    localStorage.setItem('idea', JSON.stringify(this.idea));
    render();
  },

  retrieve:
};

Idea.prototype.toHTML = function() {
  return (`
    <li class="idea-card">
      <header>
        <h3>${titleInput.val()}</h3>
        <button class="remove-button"><img src="Images/delete-hover.svg"/></button>
      </header>
      <p class="body">${bodyInput.val()}</p>
      <footer>
        <button class="upvote"><img src="Images/upvote-hover.svg"/></button>
        <button class="downvote"><img src="Images/downvote-hover.svg"/></button>
        <p class="quality">quality:<span>swill</span></p>
      </footer>
    </li>
    `);
}

ideaBoss.retrieve();
ideaBoss.render();
