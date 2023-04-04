
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("json");
const homeStartingContent = "Welcome to my very first deployed website! I am excited to share with you my passion and interests through this platform. Here, you will find various content that I have curated and created, ranging from articles on my favorite topics, to photos that capture my experiences, and even some personal projects that I have been working on.\n" +
    "\n" +
    "As I embark on this journey of creating and maintaining a website, I hope to learn and grow as a creator and provide you with content that is informative, inspiring, and entertaining. Thank you for taking the time to visit my website, and I hope you enjoy exploring all that it has to offer.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
mongoose.connect("mongodb+srv://10zir:DmonS1ayer@cluster0.pkaypxb.mongodb.net/blogDB?retryWrites=true&w=majority", {useNewUrlParser: true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
    title: String,
    content: String
}
let resdbs = [];
const Post = mongoose.model("Post", postSchema);
app.get("/", function(req, res) {
  Post.find({}).then((resdb) => {
    resdbs = resdb
    res.render("home", {
      startingContent: homeStartingContent,
      posts: resdb
    });
  }).catch((err) => {
    console.log(err)
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save().then(() => {
    res.redirect("/");
  })
});

app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  resdbs.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);
    console.log(storedTitle)
    console.log(post.title)
    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

const PORT = process.env.PORT || 4000;
app.listen(PORT, function() {
  console.log("Server started on port "+ PORT);
});
