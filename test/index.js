var assert = require('chai').assert;
var Task = require('../exercises/task');

describe('Task', function() {

  it('should be a function', function() {
    assert.isFunction(Task);
  });

  it('should instantiate our good friend, Task', function() {
    var task = new Task();
    assert.isObject(task);
  });

  it('should have a title', function() {
     var task = new Task('Whale');
     assert.equal(task.title, 'Whale');
  });

  it('should have a body', function() {
    var task = new Task('Whale', 'Is blue.');
    assert.equal(task.body, 'Is blue.');
  });

  it('should have a default importance of "normal"', function()  {
    var task = new Task('Whale', 'Is blue.');
    assert.equal(task.importance, 'normal');
  });

  it('should accept an importance if indicated', function()  {
    var task = new Task('Whale', 'Is blue.', 'genius');
    assert.equal(task.importance, 'genius');
  });

  it('should have a default id of Date.now()', function()  {
    var task = new Task('Whale', 'Is blue.');
    assert.equal(task.id, Date.now());
  });

  it('should accept an id if provided', function()  {
    var idea = new Task('Whale', 'Is blue.', 'genius', false, '556677');
    assert.equal(idea.id, '556677');
  });

  it('should have a default completed status of false', function()  {
    var task = new Task('Whale', 'Is blue.');
    assert.equal(task.completed, false);
  });

  it('should accept a new completed status if indicated', function()  {
    var task = new Task('Whale', 'Is blue.', 'genius', true);
    assert.equal(task.completed, true);
  });

  it('toHTML should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.toHTML);
  });

  it('completedToHTML should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.completedToHTML);
  });

  it('remove should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.remove);
  });

  it('upvote should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.upvote);
  });

  it('should up the importance if upvote is called', function () {
    var idea = new Task('Whale', 'Is blue.', 'normal');
    idea.upvote();
    assert.equal(idea.importance, 'high');
    idea.upvote();
    assert.equal(idea.importance, 'critical');
    idea.upvote();
    assert.equal(idea.importance, 'critical');
  });

  it('downvote should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.downvote);
  });

  it('should down the importance if downvote is called', function () {
    var idea = new Task('Whale', 'Is blue.', 'normal');
    idea.downvote();
    assert.equal(idea.importance, 'low');
    idea.downvote();
    assert.equal(idea.importance, 'none');
    idea.downvote();
    assert.equal(idea.importance, 'none');
  });

  it('saveNewTitle should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.saveNewTitle);
  });

  it('should replace the title if saveNewTitle is called', function() {
    var idea = new Task('Whale');
    idea.saveNewTitle('Squid');
    assert.equal(idea.title, 'Squid');
  });

  it('saveNewBody should be a function', function() {
    var idea = new Task();
    assert.isFunction(idea.saveNewBody);
  });

  it('should replace the body if saveNewBody is called', function() {
    var idea = new Task('Whale', 'Is blue.');
    idea.saveNewBody('Likes to swim.');
    assert.equal(idea.body, 'Likes to swim.');
  });

});
