const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('./server');

const should = chai.should();
chai.use(chaiHttp);

describe('blog posts', function(){
	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should list blog posts on GET', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.an('array');
			res.body.length.should.be.at.least(1);
			const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item){
				item.should.be.an('object');
				item.should.include.keys(expectedKeys);
			});
		});
	});

	it('should add a new blog post on POST', function() {
		const newPost = {title: '1', content: '11', author: '111'};
		const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));
		return chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.an('object');
			res.body.should.include.keys('id', 'title', 'content', 'author');
			res.body.id.should.not.be.null;
			res.body.title.should.equal(newPost.title);
        	res.body.content.should.equal(newPost.content);
        	res.body.author.should.equal(newPost.author)
			res.body.should.have.all.keys(expectedKeys);
		});
	});

	it('should update a blog post on PUT', function() {

		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			const updatedPost = Object.assign(res.body[0], {
			title: '2', content: '22', author: '222'
			});
		});

		return chai.request(app)
		.put('/blog-posts/${res.body[0].id}')
		.send(updatedPost)
		.then(function(res) {
		res.should.have.status(204);
		res.should.be.json;
		res.should.be.an('object');
		});
	});

	it('should delete a blog post on DELETE', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
			.delete('/blog-posts/${res.body[0].id');
		})
		.then(function(res) {
			res.should.have.status(204);
		});
	});
});