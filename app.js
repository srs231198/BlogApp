var express = require("express");
var methodOverride = require("method-override");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//App Config
mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//Mongoose config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

//mongo model
var Blog = mongoose.model("Blog", blogSchema);

//test creation for model
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//     body: "Just Another testing statement"
// });

//RESTful routes

//main page...redirects to /blogs
app.get("/", function(req, res){
    res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });
    
});

//NEW ROUTE
//page to create new entries
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            //redirect to index page
            res.redirect("/blogs");
        }
    });
    
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
       if(err){
           res.redirect("/blog");
       }
       else{
           res.render("show", {blog: foundBlog});
       }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, UpdatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            //redirect to main page
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//Listen on port 3000
app.listen(3000, function(){
    console.log("Server is running!!!");
});