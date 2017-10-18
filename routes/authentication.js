const User = require('../models/user');         // Import user model schemal.
const jwt = require('jsonwebtoken');            // Import Web Tokens.
const config = require('../config/database');   // Data base configuration file. 

module.exports = (router) => {
    // Post request. 
    router.post('/register', (req, res) => {
        // User will provide email, username, and password.
        // Check user has sent necessary information.

        // Did user provide email?
        if (!req.body.email) {
            res.json({ success: false, message: 'You must provide an valid Email address.' });
        } else  {
            // Did user provide username?
            if (!req.body.username) {
                res.json({ success: false, message: 'You must provide a User Name' });
            } else {
                // Did user provide password?
                if (!req.body.password) {
                    res.json({ success: false, message: 'You must provide a password' });
                } else {
                    // Go ahead and create user.
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    
                    // Creating user and error checking.
                    user.save((err) => {
                        if (err) {
                            console.log(err);
                            if (err.code == 11000) {
                                res.json({success: false, message: 'This information is already associated with an existing user.'});
                            } else {
                                if (err.errors && err.errors.email) {
                                    // Error message for invalid email address.
                                    res.json({ success: false, message: err.errors.email.message });
                                } else if (err.errors.username) {
                                    // Error message for invalid username.
                                    res.json({ success: false, message: err.errors.username.message });
                                } else if (err.errors.password) {
                                    // Error message for invalid password.
                                    res.json({ success: false, message: err.errors.password.message });
                                } else{
                                    // Return if error. (Generic error message.)
                                    res.json({ success: false, message: 'Error: Could not create user.', err});
                                }
                            }
                        } else {
                            // Save user.
                            res.json({ success: true, message: 'Success.'});
                        }
                    });
                }
            }
        }
    });

    // Route to check if email is not associated with another account.
    router.get('/checkEmail/:email', (req, res) => {
        // Check if email was provided in parameters
        if (!req.params.email) {
            res.json({
                success: false, message: 'Email was not provided'});
        } else {
            // Search database for email.
            User.findOne({email: req.params.email}, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err});
                } else {
                    if (user) {
                        res.json({ success: false, message: 'Email is already taken' });
                    } else {
                        res.json({ success: true, message: 'Email is available'});
                    }
                }
            })
        }
    });

    // Route to check if username is availbale for registration.
    router.get('/checkUsername/:username', (req, res) => {
        // Check if username was provided in parameters
        if (!req.params.username) {
            res.json({
                success: false, message: 'Email was not provided'});
        } else {
            // Search database for user.
            User.findOne({username: req.params.username}, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err});
                } else {
                    // Check if usernaem was found.
                    if (user) {
                        // Username is taken.
                        res.json({ success: false, message: 'Username is already taken' });
                    } else {
                        // Username is not taken.
                        res.json({ success: true, message: 'Username is available'});
                    }
                }
            });
        }
    });

    router.post('/login', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'No username was provided' });
        } else if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided' });
        } else {
            // Find user with username
            User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    if (!user) {
                        res.json({ success: false, message: 'Username not found.'});
                    } else {
                        // Compare password provided by the user to the one in the database.
                        const validPassword = user.checkPassword(req.body.password);
                        if (!validPassword) {
                            res.json({ success: false, message: 'Password is invalid'});
                        } else {
                            // Create token, encrypt users id, token will expire in 24 hours.
                            // Maintain user session.
                            const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' });
                            res.json({ success: true, message: 'Success', token: token, user: { username: user.username } });
                        }
                    }
                }
            });
        }
    });

    // FUNCTIONS THAT REQUIRE AUTHENTICATION WILL SHOULD BE PLACED PASSED THIS POINT.

    // Middleware to intersept token
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({success: false, message: 'Missing token'});
        } else {
            // Verify token that is valid( i.e. token has not expired )
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Invalid Token: ' + err});
                } else {
                    // Token has passed verification.
                    req.decoded = decoded;
                    next();
                }
            })
        }
    }); 

    router.get('/profile', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'User not found' });
                } else {
                    res.json({ success: true, user: user });
                }
            }
        })
    });

    router.post('', (req, res) => {
        
    });

    router.get('/public/:username', (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'User not found.'});
        } else {
            User.findOne({ username: req.params.username }).select('username email').exec((err, user) => {
                if (err) {
                    res.json({ success: false, message: 'User not found.'});
                } else if (!user) {
                    res.json({ success: false, message: 'User not found.'});
                } else {
                    res.json({ success: true, user: user });
                }
            })
        }
    });

    return router;
}