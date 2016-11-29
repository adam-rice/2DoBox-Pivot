/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

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
	          <button class="destroy-btn"></button>
	          <h3 contenteditable="true">${this.title}</h3>
	        </header>
	        <p class="card-body" contenteditable="true">${this.body}</p>
	        <footer>
	          <button id="upvote" class="upvote-btn"></button>
	          <button id="downvote" class="downvote-btn"></button>
	          <h4 class="quality">
	            quality:<span class="quality-change"> ${this.quality}</span>
	          </h4>
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

	  saveButton.on('click', function() {
	    addNewIdeaToIdeaBoss();
	    clearInputFields();
	  });

	  bodyInput.on('keyup', function(key) {
	    var title = titleInput.val();
	    var body = bodyInput.val();
	    if (key.which === 13) {
	      if (title === "" || body === "") {
	        return false;
	        } else {
	        addNewIdeaToIdeaBoss();
	        clearInputFields();
	      }
	    }
	  });

	  ideaSection.on('click', '.destroy-btn, .upvote-btn, .downvote-btn', function() {
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
	    $(this).addClass('changing-innertext');
	    if (key.which === 13) {
	      replaceNodeText($(this), id);
	    }
	  });

	  ideaSection.on('blur', 'h3, p', function() {
	    var id = $(this).closest('.idea-card').attr('id');
	     $(this).removeClass('changing-innertext');
	     replaceNodeText($(this), id);
	  });

	  search.on("keyup", function() {
	    var search = $(this).val();
	    $('h3:contains(' + search + ')').closest('.idea-card').show();
	    $('h3:not(:contains(' + search + '))').closest('.idea-card').hide();
	    $('p:contains(' + search + ')').closest('.idea-card').show();
	  });

	  titleInput.keyup( function() {
	    enableSave();
	  });

	  bodyInput.keyup( function ()  {
	    enableSave();
	  });

	  function enableSave() {
	    var title = titleInput.val();
	    var body = bodyInput.val();
	    if (title === "" || body === "") {
	      saveButton.attr('disabled', true);
	      } else if (title !== "" && body !== "") {
	      saveButton.attr('disabled', false);
	    }
	  }

	  function addNewIdeaToIdeaBoss() {
	    ideaBoss.add(titleInput.val(), bodyInput.val());
	  }

	  function clearInputFields() {
	    titleInput.val('');
	    bodyInput.val('');
	    bodyInput.blur();
	    saveButton.attr('disabled', true);
	  }

	  function replaceNodeText(selector, id) {
	    if (event.target.nodeName === 'H3') {
	      var newTitle = selector.closest('h3').text();
	      ideaBoss.find(id).saveNewTitle(newTitle);
	      } else if (event.target.nodeName === 'P') {
	      var newBody = selector.closest('p').text();
	      ideaBoss.find(id).saveNewBody(newBody);
	    }
	  }

	ideaBoss.retrieve();
	ideaBoss.render();
	});


/***/ }
/******/ ]);