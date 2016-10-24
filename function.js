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
        <button class="remove-button"><img src="delete-hover.svg"/></button>
      </header>
      <p class="body">${bodyInput.val()}</p>
      <footer>
        <button class="upvote"><img src="upvote-hover.svg"/></button>
        <button class="downvote"><img src="downvote-hover.svg"/></button>
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
