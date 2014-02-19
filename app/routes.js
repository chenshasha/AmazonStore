// app/routes.js
//var mongoose = require( 'mongoose' );
//var Store    = mongoose.model( 'Store' );

var Books           = require('../app/models/book');
var User            = require('../app/models/user');
var Item            = require('../app/models/item');


module.exports = function(app, passport) {

    //delete an item from cart
    app.get(  '/destroy/:id', function ( req, res, next ){

        console.log(req.user.id);
        console.log(req.params.id);
        Item.remove({buyer_id: req.user.id},{book_id: req.params.id}).exec();
        res.redirect('/store');

    });


        //user.local.cart.remove({"id": req.params.id},function(req, res) {
        //    res.render('cart.ejs', {
        //        user : req.user // get the user out of session and pass to template
        //    });

        //});

        //user.find( {local:{cart:{$elemMatch: {id : req.params.id}}}}, function ( err, item ){
        //    console.log(item);
            //item.remove( function ( err, item ){
            //    if( err ) return next( err );

            //    res.redirect( '/viewcart' );
            //});
        //});


    // add item to chart
    app.post(  '/cart', isLoggedIn, function(req, res) {

        //try to add to item database

        var current_user = req.user;
        var current_book = Books.findById(req.param('addBookID'));
        var item = new Item();
        item.quantity = "1";
        item.modifiedDate = new Date(),
        item.buyer_id = req.user.id,
        item.book_id  = req.param('addBookID');
        item.status   = "incart";

        // save the user
        item.save();

        User.findById(req.user.id,function(err, result){
            result.local.cart.push({
                id: req.param('addBookID'),
                quantity: "1"
            })
            result.save();
        });

        res.redirect('/store');


    });
    app.get(  '/viewcart', isLoggedIn, function(req, res) {

        //res.render('cart.ejs', {
        //    user : req.user // get the user out of session and pass to template
        //});

        Item.find({"buyer_id" : req.user.id}, function(err, item){
            res.render('cart.ejs',{
                item  : item,
                user  : req.user
            });
        });

    });



    //routes product page
    app.get(  '/product/:id', isLoggedIn, function(req, res) {

        Books.find({"_id" : req.params.id}, function(err, store_book){
            if(err) { };
            res.render('product.ejs',{
                user  : req.user,
                books : store_book[0]
            });
        });
    });


    // =====================================
    // Book Store SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/store', isLoggedIn, function(req, res) {
        Books.find({language: 'English'}, function(err, store_books){
            if(err) { };
            res.render('store.ejs',{
                user  : req.user,
                books : store_books
            });
        });
    });




	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/store', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/store', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


