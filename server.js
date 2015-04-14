// App Requirements
// Express

var express = require('express');
var app = express();

// Templates
var ejs = require("ejs");
app.set("view engine", "ejs");
// BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
// MethodOverride
var MethodOverride = require("method-override");
app.use(MethodOverride('_method'));
// Sqlite3
var sqlite3 = require("sqlite3").verbose();
// Requiring Database
var db = new sqlite3.Database("./db/blog.db");

// Redirect to /posts (Home)
app.get("/", function (req, res) {
	res.redirect("/posts")
});

// Show All The Blog Posts
app.get("/posts", function (req, res) {
	db.all("SELECT * FROM posts;", function (err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
		}
		res.render('index.ejs', {posts: data});
	});
});

// Show Indiv. Blog Post Page
app.get("/post/:id", function (req,res) {
	var id = req.params.id;
	db.get("SELECT * FROM posts WHERE id = ?", id, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
		}
		res.render('show.ejs', {post: data})
	});
});

// Show Creation Page
app.get("/new", function (req, res) {
	res.render("new.ejs");
})

// Show Edit Page
app.get("/post/:id/edit", function (req,res) {
	var id = req.params.id;
  db.get("SELECT * FROM posts WHERE id = ?", id, function (err, data) {
  		if (err) {
  			console.log(err);
  		} else {
  			console.log(data);
  		}
      res.render("edit.ejs",{post: data});
  });
});

// Create a post
app.post("/posts", function (req, res) {
	db.run("INSERT INTO posts (title, author, body, image) VALUES (?, ?, ?, ?);", req.body.title, req.body.author, req.body.body, req.body.image, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Created New Post!");
		}
		res.redirect("/posts");
	});
});

// Update a post
app.put('/update/:id', function(req, res) {
	db.run("UPDATE posts SET title = ?, author = ?, body = ?, image = ? WHERE id = ?;", req.body.title, req.body.author, req.body.body, req.body.image, req.params.id, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Updated Post!");
		}
		res.redirect("/post/" + req.params.id);
	});
});

// Delete Posts
app.delete("/post/:id", function (req, res) {
	db.run("DELETE FROM posts WHERE id = ?;", req.params.id);
	res.redirect("/posts");
});

// Listening On Port 3000
app.listen(3000, function () {
	console.log("Listening on Port 3000")
});