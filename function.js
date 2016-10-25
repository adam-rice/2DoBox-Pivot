var titleInput = $('#titleInput');
var bodyInput = $('#bodyInput');
var saveButton = $('#saveButton');
var bottomPanel = $('#bottomPanel');
var ideaSection = $('#ideaSection');

$(document).ready (function() {

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
    };

  Idea.prototype.remove = function(id) {
    id = parseInt(id);
    ideaBoss.remove(this.id);
  };

  var ideaBoss = {
    ideaArray: [],
    add: function (title, body) {
      this.ideaArray.push(new Idea(titleInput.val(), bodyInput.val()));
      this.store();
    },

    find: function(id) {
      id = parseInt(id);
      return this.ideaArray.find( function (idea) {
        return idea.id !== id;
      });
    },

    render: function () {
      ideaSection.html('');
      for (var i = 0; i < this.ideaArray.length; i++) {
        var idea = this.ideaArray[i];
        ideaSection.prepend(idea.toHTML());
      }
    },

    store: function() {
      localStorage.setItem('ideas', JSON.stringify(this.ideaArray));
      this.render();
    },

    retrieve: function() {
      var retrievedIdeas = JSON.parse(localStorage.getItem('ideas'));
      if (retrievedIdeas) {
        for (var i = 0; i < retrievedIdeas.length; i++) {
          var idea = retrievedIdeas[i];
          this.ideaArray.push(new Idea(this.title, this.body, this.quality, this.id));
        }
      }
    },

    remove: function(id) {
      // idTwo = parseInt(id);
      this.ideaArray = this.ideaArray.filter(function (idea) {
        return idea.id !== id;
      });
      this.store();
    }
  };

  ideaBoss.retrieve();
  ideaBoss.render();

});
