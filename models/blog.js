var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;                       // Mongoose schema.

// Validate blog title length.
let titleCheck = (title) => {
    if (!title) {
        return false;
    } else {
        // Check title is of resonable lenght. 
        if (title.length < 1 || title.length > 40) {
            return false;
        } else {
            return true;
        }
    }
};

// Check if title is valid, alphanumeric title.
let validTitle = (title) => {
    if (!title) {
        return false;
    } else {
        // Regular expression that checks the validity of email.
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};

// Test that will be applied to blog title.
// And error message that will be displayed to the user.
const titleValidators = [
    {
        validator: titleCheck, 
        message: 'Title must be at least 1 characters but less than 40.'
    },
    {
        validator: validTitle,
        message: 'Tile must be valid. (no special characters)'
    }
];

// Set blog body length restrictions. 
let bodyCheck = (body) => {
    if (!body) {
        return false;
    } else if (body.length < 10 || body.length > 500) {
        return false;
    } else {
        return true;
    }
};

// Test that will be applied to username.
const bodyValidators = [
    {
        validator: bodyCheck,
        message: 'Blog body must be at least 10 characters but less than 500.'
    }
];

// Set comment length restrictions.
let commentCheck = (password) => {
    if (!comment[0]) {
        return false;
    } else if (comment[0].length < 1 || comment[0].length > 200) {
        return false;
    } else {
        return true;
    }
};

// Test that will be applied to passwords.
const commentValidators = [
    {
        validator: commentCheck,
        message: 'Password must not be empty or no more than 200.'
    }
];

const blogSchema = new Schema ({
    title: { type: String, required: true, validate: titleValidators },
    body: { type: String, required: true, validate: bodyValidators },
    author: { type: String },
    date: { type: Date, default: Date.now() },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    comments: [{
        comment: { type: String, validate: commentValidators },
        author: { type: String },       
    }]
});
 
// Export user model.
module.exports = mongoose.model('Blog', blogSchema);