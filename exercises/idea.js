function Idea(title, body, quality, id) {
  this.title = title;
  this.body = body;
  this.quality = quality || "swill";
  this.id = id || Date.now();
}



module.exports = Idea;
