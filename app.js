//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
let posts = [];

mongoose.connect("mongodb://127.0.0.1/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const blogSchema = {
  title: String,
  data: String
};
const Home = mongoose.model("Home", blogSchema);

const About = mongoose.model("About", blogSchema);
const about = new About({
  title: "About",
  data: aboutContent
});

const Contact = mongoose.model("Contact", blogSchema);
const contact = new Contact({
  title: "Contact",
  data: contactContent
});

async function insertdata() {
  const aboutarr = await About.find({});
  if (aboutarr.length === 0) {
    about.save();
    console.log(about.title);
  }
  const contactarr = await Contact.find({});
  if (contactarr.length === 0) {
    contact.save();
    console.log(contact.title);
  }
}
insertdata();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  async function getitems() {
    const allitems = await Home.find({});
    res.render("home", {
      content: allitems.title,
      allposts: allitems
    });
  }
  getitems();
});
app.get("/about", function (req, res) {
  res.render("about", {
    content: aboutContent
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    content: contactContent
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/post/:postname", function (req, res) {
  async function getitems() {
    const allitems = await Home.find({});
    allitems.forEach(function(temp) {
      const reqtitle = _.lowerCase(req.params.postname);
      const storedtitle = _.lowerCase(temp.title);
      if (storedtitle === reqtitle) {
        res.render("post", {
          heading: temp.title,
          data: temp.data
        });
      }
    });
  }
  getitems();
});

app.post("/compose", function (req, res) {

  const blognew = new Home({
    title: req.body.inp,
    data: req.body.inpdata
  });
  blognew.save();

  res.redirect("/");
});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
