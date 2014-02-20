// app/routes.js
//var mongoose = require( 'mongoose' );
//var Store    = mongoose.model( 'Store' );

var Books = require('../app/models/book');
var User = require('../app/models/user');
var Item = require('../app/models/item');
var Order = require('../app/models/order');


module.exports = function (app, passport) {

    // check out
    app.post('/done', isLoggedIn, function (req, res) {

        //try to add to item database

        User.findById(req.user, function (err, shopper) {

            //get new order
            var order = new Order();
            order.transactionDate = new Date();
            order.shopper_id = req.user.id;
            order.shopper_fn = req.param('firstName');
            order.shopper_ln = req.param('lastName');
            order.shopper_add = req.param('address');
            order.shopper_phone = req.param('phone');
            order.shopper_email = req.param('email');
            order.shopper_CC_Number = req.param('CCNo');
            order.shopper_CC_Exp_Month = req.param('CCExpiresMonth');
            order.shopper_CC_Exp_Year = req.param('CCExpiresYear');
            order.items.push(req.param('items'));
            order.save();

            // get total
            Item.aggregate([
                { $group: {
                    _id: '$buyer_id',
                    total: { $sum: '$price'}
                }}
            ], function (err, result) {
                    if (err) {
                        //console.error(err);
                    } else {

                        //console.log(result[0]['total']);
                        order.total = result[0]['total'];
                        order.save();
                        console.log(order.total);
                    }

                }
            );

            //remove checked out book from database item
            Item.remove({buyer_id: req.user.id}).exec();

        });

        res.redirect('/store');

    });

    app.get('/checkout', isLoggedIn, function (req, res) {

        Item.find({"buyer_id": req.user.id}, function (err, item) {
            res.render('checkout.ejs', {
                item: item,
                user: req.user
            });
        });


    });


    //delete an item from cart
    app.get('/destroy/:id', function (req, res, next) {

        Item.remove({buyer_id: req.user.id}, {book_id: req.params.id}).exec();
        res.redirect('/store');

    });


    // add item to chart
    app.post('/cart', isLoggedIn, function (req, res) {

        //try to add to item database
        Books.findById(req.param('addBookID'), function (err, current_book) {

            var item          = new Item();
            item.price        = current_book.proice;
            item.quantity     = "1";
            item.price        = current_book.price;
            item.modifiedDate = new Date(),
            item.buyer_id     = req.user.id,
            item.book_id      = req.param('addBookID');
            item.book_author  = current_book.author;
            item.book_title   = current_book.title;

            // save the user
            item.save();

        });

        res.redirect('/store');

    });

    app.get('/viewcart', isLoggedIn, function (req, res) {

        //res.render('cart.ejs', {
        //    user : req.user // get the user out of session and pass to template
        //});
        ////try to sum the total price

        Item.aggregate([
            { $group: {
                _id: '$buyer_id',
                total: { $sum: '$price'}
            }}
        ], function (err, result) {
                if (err) {
                    //console.error(err);
                } else {

                    //console.log(result[0]['total']);
                }
            }
        );


        Item.find({"buyer_id": req.user.id}, function (err, item, total) {
            res.render('cart.ejs', {
                item: item,
                user: req.user
            });
        });


    });


    //routes product page
    app.get('/product/:id', isLoggedIn, function (req, res) {

        Books.find({"_id": req.params.id}, function (err, store_book) {
            if (err) {
            }
            ;
            res.render('product.ejs', {
                user: req.user,
                books: store_book[0]
            });
        });
    });


    // =====================================
    // Book Store SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/store', isLoggedIn, function (req, res) {
        Books.find({language: 'English'}, function (err, store_books) {
            if (err) {
            }
            ;
            res.render('store.ejs', {
                user: req.user,
                books: store_books
            });
        });
    });


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function (req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/store', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/store', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =========================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function (req, res) {
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


