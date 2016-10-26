var assert = require('chai').assert;
var Idea = require('../exercises/idea');

describe('Idea', function() {

  it('should be a function', function() {
    assert.isFunction(Idea);
  });

  it('should instantiate our good friend, Idea', function() {
    var idea = new Idea();
    assert.isObject(idea);
  });

  it('should have a title', function() {
     var idea = new Idea('Whale');
     assert.equal(idea.title, 'Whale');
  });

  it('should have a body', function() {
    var idea = new Idea('Whale', 'Is blue.');
    assert.equal(idea.body, 'Is blue.');
  });

  it('should have a default quality of "swill"', function()  {
    var idea = new Idea('Whale', 'Is blue.');
    assert.equal(idea.quality, 'swill');
  });

  it('should accept a quality if indicated', function()  {
    var idea = new Idea('Whale', 'Is blue.', 'genius');
    assert.equal(idea.quality, 'genius');
  });

  it('should have a default id of Date.now()', function()  {
    var idea = new Idea('Whale', 'Is blue.');
    assert.equal(idea.id, Date.now());
  });

  it('should accept an id if provided', function()  {
    var idea = new Idea('Whale', 'Is blue.', 'genius', '556677');
    assert.equal(idea.id, '556677');
  });

  it('toHTML should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.toHTML);
  });

  it('remove should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.remove);
  });

  it('upvote should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.upvote);
  });

  it('should up the quality if upvote is called', function () {
    var idea = new Idea('Whale', 'Is blue.', 'swill');
    idea.upvote();
    assert.equal(idea.quality, 'plausible');
    idea.upvote();
    assert.equal(idea.quality, 'genius');
    idea.upvote();
    assert.equal(idea.quality, 'genius');
  });

  it('downvote should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.downvote);
  });

  it('should down the quality if downvote is called', function () {
    var idea = new Idea('Whale', 'Is blue.', 'genius');
    idea.downvote();
    assert.equal(idea.quality, 'plausible');
    idea.downvote();
    assert.equal(idea.quality, 'swill');
    idea.downvote();
    assert.equal(idea.quality, 'swill');
  });

  it('saveNewTitle should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.saveNewTitle);
  });

  it('should replace the title if saveNewTitle is called', function() {
    var idea = new Idea('Whale');
    idea.saveNewTitle('Squid');
    assert.equal(idea.title, 'Squid');
  });

  it('saveNewBody should be a function', function() {
    var idea = new Idea();
    assert.isFunction(idea.saveNewBody);
  });

  it('should replace the body if saveNewBody is called', function() {
    var idea = new Idea('Whale', 'Is blue.');
    idea.saveNewBody('Likes to swim.');
    assert.equal(idea.body, 'Likes to swim.');
  });

});
