/*********************************************
    Mongoose schema: Everything in mongoose starts with a schema. Each schema maps to a mongoDB 
    collection and defines the shape of the documents within the collection.
 ********************************************/
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Schema.ObjectId;
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;                       // Mongoose schema.
const bcrypt = require('bcrypt-nodejs');            // Used to secure user password in database. Hashing.

// Validate user email.
let emailCheck = (email) => {
    if (!email) {
        return false;
    } else {
        // Check email is of resonable lenght. Specially not zero.
        if (email.length < 5 || email.length > 30) {
            return false;
        } else {
            return true;
        }
    }
};

// Check if email is valid, not just a random string.
let validEmail = (email) => {
    if (!email) {
        return false;
    } else {
        // Regular expression that checks the validity of email.
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};

// Test that will be applied to user's emails.
const emailValidators = [
    {
        validator: emailCheck, 
        message: 'Email must be at least 5 characters but less than 30.'
    },
    {
        validator: validEmail,
        message: 'Email must be valid.'
    }
];

// Set username length restrictions. 
let usernameCheck = (username) => {
    if (!username) {
        return false;
    } else if (username.length < 3 || username.length > 15) {
        return false;
    } else {
        return true;
    }
};

// Set username character restrictions.
let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

// Test that will be applied to username.
const usernameValidators = [
    {
        validator: usernameCheck,
        message: 'Username must be at least 3 characters but less than 15.'
    },
    {
        validator: validUsername,
        message: 'Username cannot contain special characters.'
    }
];

// Set password length restrictions.
let passwordCheck = (password) => {
    if (!password) {
        return false;
    } else if (password.length < 8 || password.length > 35) {
        return false;
    } else {
        return true;
    }
};

// Set password character restrictions.
let validPassword = (password) => {
    if (!password) {
        return false;
    } else {
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};

// Test that will be applied to passwords.
const passwordValidators = [
    {
        validator: passwordCheck,
        message: 'Password must be at least 8 characters but no more than 35.'
    },
    {
        validator: validPassword,
        message: 'Must have at least one upercase, lowercase, special character, and number.'
    }
];

let aboutLength = (about) => {
    if (about.length > 250) {
        return false;
    } else {
        return true;
    }
}

const aboutValidators = [
    {
        validator: aboutLength,
        message: 'About section cannot be longer than 250 characters long.'
    }
]

var userSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators }, 
    password: { type: String, required: true, validate: passwordValidators },
    about: { type: String, validate: aboutValidators },
    following: [{ type: String }], 
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    photo: { data: Buffer, contentType: String }
});

// Ecrypt user password.
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        // If the password field is not modified then dont run this middleware.
        return next();
    } else {
        bcrypt.hash(this.password, null, null, (err, hash) => {
            // If there is an error then continue...
            if (err) { return next(err); }
            // Else use the hash for password.
            else { this.password = hash} 
            // Exit the middleware.
            next();
        });
    }
});

// Get password, then compare if the password matches the password in database.
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Export user model.
module.exports = mongoose.model('User', userSchema);