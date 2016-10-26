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
        <button class="destroy-button"></button>
        <h3 contenteditable="true">${this.title}</h3>
        </header>
        <p class="body" contenteditable="true">${this.body}</p>
        <footer>
          <button id="upvote" class="upvote"></button>
          <button id="downvote" class="downvote"></button>
          <h4 class="quality">quality:<span class="quality-change"> ${this.quality}</span></h4>
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

  Idea.prototype.saveNewTitle = function (target) {
    this.title = target;
    ideaBoss.store();
  };

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

module.exports = Idea;
