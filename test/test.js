var assert = require('chai').assert;
var Idea = require('../exercises/idea');

describe('Idea', function () {

  it('should be a function', function () {
    assert.isFunction(Idea);
  });

  it('should have a title', function () {
     var idea = new Idea('Whale');
     assert.equal(idea.title, 'Whale');
  });

  it('should have a body', function () {
    var idea = new Idea('Whale', 'Is blue.');
    assert.equal(idea.body, 'Is blue.');
  });

  //it

});
