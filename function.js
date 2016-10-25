var titleInput = $('#titleInput');
var bodyInput = $('#bodyInput');
var saveButton = $('#saveButton');
var ideaSection = $('#ideaSection');

$(document).ready (function() {
  function Idea(title, body, quality, id) {
    this.title = title;
    this.body = body;
    this.quality = quality || "swill";
    this.id = id || Date.now();
  }

  Idea.prototype.toHTML = function() {
    return (`
      <li class="idea-card" id=${this.id}>
        <header>
          <h3>${this.title}</h3>
          <button class="destroy-button"><img src="Images/delete-hover.svg"/></button>
        </header>
        <p class="body">${this.body}</p>
        <footer>
          <button id="upvote" class="upvote"><img src="Images/upvote-hover.svg"/></button>
          <button id="downvote" class="downvote"><img src="Images/downvote-hover.svg"/></button>
          <p class="quality">quality:<span>${this.quality}</span></p>
        </footer>
      </li>
      `);
    };

  Idea.prototype.remove = function(id) {
    ideaBoss.remove(this.id);
  };

  Idea.prototype.upvote = function() {
    var quality = this.quality;
    if (quality === 'swill') {
      this.quality = 'plausible';
    } else if (quality === 'plausible') {
      this.quality = 'genius';
    }
    ideaBoss.store();
  };

  Idea.prototype.downvote = function() {
    var quality = this.quality;
    if (quality === 'genius') {
      this.quality = 'plausible';
    } else if (quality === 'plausible') {
      this.quality = 'swill';
    }
    ideaBoss.store();
  };

  var ideaBoss = {
    ideaArray: [],
    add: function(title, body) {
      this.ideaArray.push(new Idea(title, body));
      this.store();
    },

    find: function(id) {
      id = parseInt(id);
      return this.ideaArray.find( function(idea) {
        return idea.id === id;
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
          this.ideaArray.push(new Idea(idea.title, idea.body, idea.quality, idea.id));
        }
      }
    },

    remove: function(id) {
      this.ideaArray = this.ideaArray.filter(function(idea) {
        return idea.id !== id;
      });
      this.store();
    }
  }; //end of ideaBoss

  saveButton.on('click', function() {
    addNewIdeaToIdeaBoss();
    clearInputFields();
  });

  bodyInput.on('keyup', function(key) {
    if (key.which === 13) {
      addNewIdeaToIdeaBoss();
      clearInputFields();
    }
  });

  ideaSection.on('click', '.destroy-button, .upvote, .downvote', function() {
    var id = $(this).closest('.idea-card').attr('id');
    var find = ideaBoss.find(id);
    if (this.id === 'upvote') {
      find.upvote();
    } else if (this.id === 'downvote') {
      find.downvote();
    } else find.remove();
  });

  function addNewIdeaToIdeaBoss() {
    ideaBoss.add(titleInput.val(), bodyInput.val());
  }

  function clearInputFields() {
    titleInput.val('');
    bodyInput.val('');
    bodyInput.blur();
  }

ideaBoss.retrieve();
ideaBoss.render();
});
