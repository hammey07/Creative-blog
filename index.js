var express = require('express');
var path = require('path');

var hbs = require('express-handlebars');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator'); //validates forms
var createObjectURL = require('create-object-url');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan'); // Logs the requests to the console
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'handlebars');


// Set up the session middleware
app.use(session({
    secret: 'justasehhjjkyffdcret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public"));


// Set up the passport middleware 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

// Middleware for flash messages 
app.use(flash()); //initialise the flash middleware  (allows temporary messages)


var config = require('./config');
var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.port,
    database: config.database.db
});

connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected to the database ...');
});

app.use(express.static("images"));
app.use(express.static("node_modules/bootstrap/dist"));
//Express Validator Middleware for Form Valid   ation
app.use(expressValidator());
app.use(bodyParser.urlencoded({
    extended: true
}));


//------------------------------------------------ METHODS ARE LISTED BELOW ------------------------------------------------


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

function sessionlayoutChange(req,res){
    if (req.user) {
    app.engine('handlebars', hbs({
    defaultLayout: 'members',
    layoutsDir: __dirname + '/views/layouts/'
}));
}
else if (!req.user){
    app.engine('handlebars', hbs({
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/'
}));
}

}

function renderBloglistOnBlogsPage(req, res) {
    var bloglist = [];
    connection.query("SELECT * FROM blogs", function (err, result, fields) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {

            bloglist.push({
                blog_id: result[i].blog_id,
                blog_title: result[i].blog_title,
                blog_publish_date: result[i].blog_publish_date,
                author_name: result[i].author_name,
                blog_image: result[i].blog_image,
                blog_description: result[i].blog_description,
                blog_author_id: result[i].blog_author_id
            });
        }
    });
    if (req.user) {
        res.render('blogs', {
            pagetitle: 'Griffith Bloggers',
            content: 'Create a new blog?',
            blog: bloglist
        });
    } else {
        res.render('blogs', {
            pagetitle: 'Griffith Bloggers',
            blog: bloglist
        });
    }
}
    



function renderBloglistOnProfilePage(req, res) {
    connection.query("SELECT * FROM blogs", function (err, result, fields) {
        if (err) throw err;
        var blogsCreatedByLoggedInUser = [];

        for (var i = 0; i < result.length; i++) {
            if (req.user.id == result[i].author_id) {
                blogsCreatedByLoggedInUser.push(result[i]);
            }
        }
        res.render('profile', {
            pagetitle: 'Griffith Bloggers',
            content: 'Your listed blogs',
            blog: blogsCreatedByLoggedInUser,
            user: req.user //req.user is set by passport
        });
    });
}

function renderBloglistOnHomePage(req, res) {
    bloglist = [];
    connection.query("SELECT * FROM blogs", function (err, result, fields) {
        if (err) throw err;
        for (var i = 0; i < result.length; i++) {

            bloglist.push({
                blog_id: result[i].blog_id,
                blog_title: result[i].blog_title,
                blog_publish_date: result[i].blog_publish_date,
                author_name: result[i].author_name,
                blog_image: result[i].blog_image,
                blog_description: result[i].blog_description,
                blog_author_id: result[i].blog_author_id

            });
        }

        var bloglistWith10only = [];
        var i = 0;
        for (i = 0; i < 10; i++) {
            bloglistWith10only[i] = bloglist[i];

        }

        res.render('home', {
            pagetitle: 'Griffith Bloggers',
            blog: bloglistWith10only

        });
    });

}

//------------------------------------------------ END OF METHOD LIST ------------------------------------------------


app.get('/', function (req, res) {
    sessionlayoutChange(req,res);
    renderBloglistOnHomePage(req, res);
});

app.get('/signup', function (req, res) {
    res.render('signup', {
        message: req.flash('signupMessage')
    });
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

app.get('/login', function (req, res) {
    res.render('login', {
        message: req.flash('loginMessage')
    });

});

app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    if (req.body.remember) {
        req.session.cookie.maxAge = 1000 * 60 * 3; // remember for 3 min
    } else {
        req.session.cookie.expires = false;
    }
    res.redirect('/');
});

app.get('/profile', isLoggedIn, function (req, res) {
    sessionlayoutChange(req,res);
    renderBloglistOnProfilePage(req, res);
});

app.get('/logout', function (req, res) {
    req.logout(); // provided by passport and remove the req.user property and clear the login session (if any)
    res.redirect('/');
})

app.post('/add', function (req, res) {
    req.assert('blog_title', 'Title for blog is required').notEmpty();
    req.assert('author_name', 'Your Name is required').notEmpty();
    req.assert('blog_publish_date', 'Please enter valid published date').notEmpty();
    req.assert('blog_image', 'Please enter a valid image URL').notEmpty();
    req.assert('blog_description', 'Please enter Description for blog').notEmpty();
    var errors = req.validationErrors();
    if (!errors) { //No errors were 	found.
        var blog_member = {
            blog_title: req.sanitize('blog_title').escape().trim(),
            author_name: req.sanitize('author_name').escape().trim(),
            blog_publish_date: req.sanitize('blog_publish_date').escape().trim(),
            blog_image: req.sanitize('blog_image').escape().trim(),
            blog_description: req.sanitize('blog_description').escape().trim(),
            blog_author_id: req.user.id
        }

        connection.query('INSERT into blogs (blog_title,author_name,blog_publish_date,blog_image,blog_description,author_id) VALUES ("' + blog_member.blog_title + '","' + blog_member.author_name + '","' + blog_member.blog_publish_date + '","' + blog_member.blog_image + '","' + blog_member.blog_description + '","' + blog_member.blog_author_id + '")',
            function (err, result) {
                if (err) throw err;
                console.log("Message from MySQL Server : " + result.message);
            });
        // Later we will use flash messages to display messages to the user.
        res.redirect(303, '/thank-you');
    } else { //Display errors 
        var errorMsg = ''
        errors.forEach(function (error) {
            errorMsg += error.msg + '<br>'
        })
        res.render('add', {
            errorMsg: errorMsg,
            firstname: req.body.author_name,
            // surname: req.body.surname
        })
    }
});

app.get('/blogs', function (req, res) {
    sessionlayoutChange(req,res);
    bloglist = [];
    bloglist.length = 0;
    renderBloglistOnBlogsPage(req, res);

});

app.get('/show/:id', function (req, res) {
    sessionlayoutChange(req,res);
    var errorMsg = "";
    // Make the id safe
    var id = req.sanitize('id').escape().trim();
    connection.query('select * from blogs where blog_id=?', id, function (error, results, fields) {
        if (error) {
            console.log("Error on / " + error); //Better to write to error log
            errorMsg = "Apologies, we were unable to retrieve blog details. Return to the <a href='/'> homepage </a> and choose a blog. ";
        } else {
            var numRows = results.length;
            if (numRows === 0) {
                errorMsg = "There are no details in the database for blog id " + [req.params.id] + ". please return to the <a href='/'>homepage</a> and choose a blog.";
            }
        }

        if (!req.user) {
            res.render('show', {
                errorMsg: errorMsg,
                bloglist: results[0]
            });

        } else if (req.user.id == results[0].author_id) {
            res.render('show', {
                errorMsg: errorMsg,
                button1: 'Update',
                button2: 'Delete',
                bloglist: results[0]
            });
        } else {
            res.render('show', {
                errorMsg: errorMsg,
                bloglist: results[0]

            });
        }
    });
});

app.get('/createNewBlog', function (req, res) {
    sessionlayoutChange(req,res);
    res.render('createNewBlog', {
        pagetitle: 'Griffith Bloggers'
    });
});

app.get('/update/:id', function (req, res) {
    sessionlayoutChange(req,res);
    var errorMsg = "";
    var id = req.sanitize('id').escape().trim();
    connection.query('select * from blogs where blog_id=?', id, function (error, results, fields) {
        //console.log("blog_id =" + id + )
        if (error) {
            console.log("Error on /update " + error); //Better to write to error log 
            errorMsg = "Apologies, we were unable to retrieve blogs details from the database.  If this problem persists please contact an Admin.  <br/><a href='/'> Homepage </a>";
            res.render('update', {
                errorMsg: errorMsg
            });
        } else {
            var numRows = results.length;
            if (numRows === 0) {
                errorMsg = "There are no details in the database for blogger id " + [req.params.id] + ". Please return to the <a href='/'>homepage</a> and choose a blog.";
                res.render('update', {
                    errorMsg: errorMsg
                });
            } else {
                res.render('update', {
                    errorMsg: errorMsg,
                    blog: results[0]
                });
            }
        }
    });

});

app.post('/update', function (req, res) {
    req.assert('blog_title', 'Title for blog is required').notEmpty();
    req.assert('author_name', 'Your Name is required').notEmpty();
    req.assert('blog_publish_date', 'Please enter valid published date').notEmpty();
    req.assert('blog_image', 'Please upload a valid image').notEmpty();
    req.assert('blog_description', 'Please enter Description for blog').notEmpty();
    var errors = req.validationErrors();
    var errorMsg = "";

    // get the values posted in the form
    var blog_member = {
        blog_title: req.sanitize('blog_title').escape(),
        author_name: req.sanitize('author_name').escape(),
        blog_publish_date: req.sanitize('blog_publish_date').escape(),
        blog_image: req.sanitize('blog_image').escape(),
        blog_description: req.sanitize('blog_description').escape(),
        author_id: req.sanitize('author_id').escape(),
        blog_id: req.sanitize('blog_id').escape()

    }
    if (!errors) { //No errors were found
        var sql = "UPDATE blogs SET blog_title = '" + blog_member.blog_title + "', author_name= '" + blog_member.author_name + "', blog_publish_date= '" + blog_member.blog_publish_date + "', blog_image= '" + blog_member.blog_image + "', blog_description= '" + blog_member.blog_description + "' WHERE blog_id = " + blog_member.blog_id;
        //console.log(sql); // should write to log
        connection.query(sql, function (err, result) {
            //if (err) throw err;
            if (err) {
                console.log("Error on updating blog " + err); //Better to write to error log 
                errorMsg = "Apologies, we were unable to update Blog details.  If this problem persists please contact an Admin.  <br/><a href='/'> Homepage </a>";
                res.render('update', {
                    errorMsg: errorMsg,
                    blog: blog_member
                });
            } else {
                console.log("Message from MySQL Server : " + result.message); // should write to log
                res.redirect(303, '/thank-you');
            }
        });

    } else { //Display errors 
        errors.forEach(function (error) {
            errorMsg += error.msg + '<br />'
        });
        res.render('update', {
            errorMsg: errorMsg,
            blog: blog_member
        });
    }
});

app.get('/delete/:id', function (req, res) {
    sessionlayoutChange(req,res);
    var errorMsg = "";
    var id = req.sanitize('id').escape().trim();
    connection.query('select * from blogs where blog_id=?', id, function (error, results, fields) {
        if (error) {
            console.log("Error getting employee to delete " + error); //Better to write to error log 
            errorMsg = "Apologies, we were unable to retrieve blog details.  If this problem persists please contact an Admin.  <br/><a href='/'> Homepage </a>";
            res.render('/delete', {
                errorMsg: errorMsg
            });
        } else {
            var numRows = results.length;
            if (numRows === 0) {
                errorMsg = "There are no details in the database for blog id " + [req.params.id] + ". Please return to the <a href='/'>homepage</a> and choose a blog.";
                res.render('/delete', {
                    errorMsg: errorMsg
                });
            } else {
                res.render('delete', {
                    errorMsg: errorMsg,
                    bloglist: results[0]
                });
            }
        }
    });

});

app.post('/delete', function (req, res) {
    var id = req.sanitize('id').escape().trim();
    connection.query('DELETE FROM blogs WHERE blog_id=?', [id], function (error, results, fields) {
        if (error) {
            console.log("Error delete blogs " + error); //Better to write to error log 
            errorMsg = "Apologies, we were unable to delete the blog.  If this problem persists please contact an Admin.  <br/><a href='/'> Homepage </a>";
            res.render('delete', {
                errorMsg: errorMsg
            });
        } else {
            res.redirect(303, '/thank-you');
        }
    });
});

app.get('/thank-you', function (req, res) {
    sessionlayoutChange(req,res);
    res.render('thank-you', {
        pagetitle: 'Griffith Bloggers',
        content: 'Thank you! Required task has been completed!'
    });
});


app.get('/aboutus', function (req, res) {
    sessionlayoutChange(req,res);
    res.render('aboutus', {
        pagetitle: 'Griffith Bloggers',
        content: 'We are a global blogging website, multi-platform media and entertainment company. Powered by its own proprietary technology, Griffith is the go-to source for tech, digital culture and entertainment content for its dedicated and influential audience around the globe.'
    });
});

app.get('/contactus', function (req, res) {
    sessionlayoutChange(req,res);
    res.render('contactus', {
        pagetitle: 'Griffith Bloggers'
    });
});

app.use(function (req, res, next) {
    //res.type('text/plain');
    res.status(404);
    res.send('<h1>Error 404! Not Found</h1> <br/><p> Sorry! The page you requested cannot be retrieved at the moment!</p>');
});

app.listen(3000);
