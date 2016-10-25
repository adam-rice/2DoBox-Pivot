var titleInput = $('#titleInput');
var bodyInput = $('#bodyInput');
var saveButton = $('#saveButton');
var ideaSection = $('#ideaSection');
var search = $('#search');

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
        <header class="bottom-header">
          <h3 contenteditable="true">${this.title}<button class="destroy-button"></h3>
          </button>
        </header>
        <p class="body" contenteditable="true">${this.body}</p>
        <footer>
          <button id="upvote" class="upvote"></button>
          <button id="downvote" class="downvote"></button>
          <h4 class="quality">quality:<span>${this.quality}</span></h4>
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

  //editable title saved
  Idea.prototype.saveNewTitle = function (target) {
    this.title = target;
    ideaBoss.store();
  };

  //editable body saved
  Idea.prototype.saveNewBody = function (target) {
    this.body = target;
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
        for (i = 0; i < retrievedIdeas.length; i++) {
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

  ideaSection.on('keydown click', 'h3, p', function(key) {
    var id = $(this).closest('.idea-card').attr('id');
    // $(this).addClass('changing-innertext');
    if (key.which === 13) {
      if (event.target.nodeName === 'H3') {
        var newTitle = $(this).closest('h3').text();
        ideaBoss.find(id).saveNewTitle(newTitle);
      } else if (event.target.nodeName === 'P') {
        var newBody = $(this).closest('p').text();
        ideaBoss.find(id).saveNewBody(newBody);
      }
    }
  });

  ideaSection.on('blur', 'h3, p', function(key) {
    var id = $(this).closest('.idea-card').attr('id');
    // $(this).removeClass('changing-innertext');
    if (event.target.nodeName === 'H3') {
      var newTitle = $(this).closest('h3').text();
      ideaBoss.find(id).saveNewTitle(newTitle);
    } else if (event.target.nodeName === 'P') {
      var newBody = $(this).closest('p').text();
      ideaBoss.find(id).saveNewBody(newBody);
    }
  });

  //listener on search for title
  search.on

  //listener on search for body


  function addNewIdeaToIdeaBoss() {
    ideaBoss.add(titleInput.val(), bodyInput.val());
  }

  function clearInputFields() {
    titleInput.val('');
    bodyInput.val('');
    bodyInput.blur();
  }

  // on refactor...
  // function replaceNodeText() {
  //   if (event.target.nodeName === 'H3') {
  //     var newTitle = $(this).closest('h3').text();
  //     ideaBoss.find(id).saveNewTitle(newTitle);
  //   } else if (event.target.nodeName === 'P') {
  //     var newBody = $(this).closest('p').text();
  //     ideaBoss.find(id).saveNewBody(newBody);
  //   }
  // }

ideaBoss.retrieve();
ideaBoss.render();
});
