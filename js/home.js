module.exports = function(app, db) {
	app.get('/view/:username', function(req, res){
		if(!req.session.username){
			res.redirect('/login');
			return;
		}
		db.users.find({
			'username': req.params.username
		}, function(err, docs){
			if(!docs[0]){
				console.log('error Home.js 11')
				res.send('404, User not found.');
				return;
			}
			res.render('home', {
				'user': req.params.username,
				'score': docs[0].score,
				'projects': docs[0].projects,
				'voter': req.session.username,
				'skills': docs[0].skills
			});
		});
	});

	app.get('/home', function(req,res){
		if(!req.session.username){
			res.redirect('/login');
			return;
		} else {
			res.redirect('/view/' + req.session.username)
		}
	});
}