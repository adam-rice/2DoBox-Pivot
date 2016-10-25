var titleInput = $('#titleInput');
var bodyInput = $('#bodyInput');
var saveButton = $('#saveButton');
var bottomPanel = $('#bottomPanel');
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
          <button class="upvote"><img src="Images/upvote-hover.svg"/></button>
          <button class="downvote"><img src="Images/downvote-hover.svg"/></button>
          <p class="quality">quality:<span>swill</span></p>
        </footer>
      </li>
      `);
    };

  Idea.prototype.remove = function(id) {
    ideaBoss.remove(this.id);
  };

  var ideaBoss = {
    ideaArray: [],
    add: function (title, body) {
      this.ideaArray.push(new Idea(title, body));
      this.store();
    },

    find: function(id) {
      id = parseInt(id);
      return this.ideaArray.find( function (idea) {
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
      this.ideaArray = this.ideaArray.filter(function (idea) {
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

  function addNewIdeaToIdeaBoss () {
    ideaBoss.add(titleInput.val(), bodyInput.val());
  }

  function clearInputFields() {
    titleInput.val('');
    bodyInput.val('');
  }

  ideaSection.on('click', '.destroy-button', function () {
    // var id = $(this).closest('.idea-card').attr('id');
    var find = ideaBoss.find(id);
    find.remove();
    if (this.id === '.destroy-button') {
      debugger;
    }
  });




  ideaBoss.retrieve();
  ideaBoss.render();

});
