module.exports = function(app, db) {
    app.get('/admin', function(req, res) {
        if (!req.session.username) {
            res.redirect('/login');
            return;
        }
        db.users.find({
            'username': req.session.username
        }, function(err, docs) {
            res.render('admin', {
                'user': req.session.username,
                'skills': docs[0].skills,
                'projects': docs[0].projects
            });
        });
    });

    app.post('/addSkill', function(req, res) {
        if (!req.session.username) {
            res.redirect('/login');
            return;
        }
        db.users.update({
            'username': req.session.username
        }, {
            $push: {
                "skills": {
                    'skill': req.body.skill,
                    'level': req.body.level
                }
            }
        })
        res.redirect('/home')
    });

    app.post('/addProject', function(req, res) {
        if (!req.session.username) {
            res.redirect('/login');
            return;
        }
        db.users.update({
            'username': req.session.username
        }, {
            $push: {
                "projects": {
                    'name': req.body.name,
                    'info': req.body.info,
                    'status': req.body.status,
                    'url': req.body.url,
                    'startDate': req.body.startDate,
                    'endDate': req.body.endDate,
                    'votes': 0
                }
            }
        })
        res.redirect('/home')
    });
    app.get('/vote/:type/:user/:index/:voter', function(req, res) {
        var voteName, projectsObj = [];
        if (!req.session.username) {
            res.redirect('/login');
            return;
        }
        if (req.params.voter != req.session.username) {
            res.redirect('/logout');
            return;
        }

        db.users.find({
            'username': req.params.user
        }, function(err, docs) {
            if (!docs[0]) {
                return;
            }
            projectsObj = docs[0].projects
            voteName = docs[0].projects[req.params.index].name;
            one();
        });

        function one(){
          db.users.find({
              'username': req.params.voter
          }, function(err, docs) {
              var j = false;
              for (var i = 0; i < docs[0].voteList.length; i++) {
                  if (docs[0].voteList[i].user == req.params.user && docs[0].voteList[i].name == voteName) {
                      res.redirect('/home');
                      j = true;
                      return;
                  }
              }
              if (j == false) {
                  con();
              }
          });
        }

        function con() {
            projectsObj[req.params.index].votes += 1;
            // var temp = 'projects.' + req.params.index + ".votes";
            // var temp = {
            //     $inc: {}
            // };
            // temp.$inc['projects.' + req.params.index + ".votes"] = 1;
            // console.log(temp);

            if (req.params.type == 'down') {
                db.users.update({
                    'username': req.params.user
                }, {
                    $inc: {
                        temp: 1
                    },
                    $inc: {
                        'score': -1
                    }
                });
            } else {
              db.users.update({
                'username': req.params.user
              }, {
                $set: {
                  'projects': projectsObj
                }
              });
            }

            db.users.update({
                'username': req.session.username
            }, {
                $push: {
                    voteList: {
                        'user': req.params.user,
                        'name': voteName,
                        'type': req.params.type
                    }
                }
            });
            res.redirect('/view/' + req.params.user)
        }
    });
}