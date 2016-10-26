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
    // ideaBoss.store();
  };

  Idea.prototype.downvote = function() {
    var quality = this.quality;
    if (quality === 'genius') {
      this.quality = 'plausible';
    } else if (quality === 'plausible') {
      this.quality = 'swill';
    }
    // ideaBoss.store();
  };

  Idea.prototype.saveNewTitle = function (target) {
    this.title = target;
    // ideaBoss.store();
  };

  Idea.prototype.saveNewBody = function (target) {
    this.body = target;
    // ideaBoss.store();
  };

module.exports = Idea;
