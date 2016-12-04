/*jshint esversion: 6 */
const assert = require('chai').assert;
const webdriver = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('testing idea box', ()=> {
  let driver;
  beforeEach ( ()=> {
    driver = new webdriver.Builder().forBrowser('chrome').build();
    driver.get('http://localhost:8080');
  });

  afterEach( ()=> {
    driver.quit();
  });

  test.it('should allow Adam and Devin to add a sweet new title and description', ()=> {
    const title = driver.findElement({name: 'name-task-title'});
    const description = driver.findElement({name: 'name-task-body'});

    title.sendKeys('this is our sweet new title').then( ()=> {
      return title.getAttribute('value');
    }).then( (value)=> {
      assert.equal(value, 'this is our sweet new title');
    });

    description.sendKeys('this is our sweet new description').then ( ()=> {
      return description.getAttribute('value');
    }).then( (value)=> {
      assert.equal(value, 'this is our sweet new description');
    });
  });

  test.it('should allow Adam and Devin to to save a new task', ()=> {
    const title = driver.findElement({name: 'name-task-title'});
    const description = driver.findElement({name: 'name-task-body'});
    const saveButton = driver.findElement({name: 'save-button'});

    title.sendKeys('this is our sweet new title');
    description.sendKeys('this is our sweet new description');
    saveButton.click();

    const newTask = driver.findElement({tagName: 'li'}).then( (li)=> {
      return li.getText();
    }).then( (text)=> {
      assert.include(text, 'this is our sweet new title');
      assert.include(text, 'this is our sweet new description');
    });
  });

  test.it('should be a sweet new task with a default importance of normal', ()=> {
    const title = driver.findElement({name: 'name-task-title'});
    const description = driver.findElement({name: 'name-task-body'});
    const saveButton = driver.findElement({name: 'save-button'});

    title.sendKeys('this is our sweet new title');
    description.sendKeys('this is our sweet new description');
    saveButton.click();

    const normalTasks = driver.findElement({name: 'importance'}).then( (importance)=> {
      return importance.getText();
      }).then( (text)=> {
        assert.equal(text, 'normal');
      });
  });

});
