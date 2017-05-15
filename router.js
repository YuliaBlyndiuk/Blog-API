const express = require('express');
const router = express.Router();

const bodyParser = require ('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create("post1", "post1 content", "Yulia");
BlogPosts.create("post2", "post2 content", "Yulia");
BlogPosts.create("post3", "post3 content", "Yulia");

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
})

router.post('/', jsonParser, (req, res) => {
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

router.put('/:id', jsonParser, (req, res) => {
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


router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log('Deleted blogpost "${req.params.id}"');
	res.status(204).end();
});

module.exports = router;