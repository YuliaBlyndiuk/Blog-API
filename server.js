const express = require('express');
const morgan = require('morgan');
const bodyParser = require ('body-parser');

const {BlogPosts} = require('./models');
const jsonParser = bodyParser.json();
const app = express();

//log the http layer
app.use(morgan('common'));

//adding a couple blog posts
BlogPosts.create("post1", "post1 content", "Yulia");
BlogPosts.create("post2", "post2 content", "Yulia");
BlogPosts.create("post3", "post3 content", "Yulia");

//get request
app.get('/blog-posts', (req, res) => {
	res.json(BlogPosts.get());
})

app.post('/blog-posts', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = 'Missing \'${field}\' in request body'
			console.error(message);
			return res.status(400).send(message);
		}
	}

	const blogPost = BlogPosts.create(req.body.title, req.body.content, req.body.author);
    res.status(201).json(blogPost);
});

app.put('/blog-posts/:id', jsonParser, (req, res) => {
	 const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating the blogpost \`${req.params.id}\``);
  const updatedPost = BlogPosts.update({
  	id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedPost);
});


app.delete('/blog-posts/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log('Deleted blogpost "${req.params.id}"');
	res.status(204).end();
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});