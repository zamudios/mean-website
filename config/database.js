const crypto = require('crypto');                   // Node api 
crypto.randomBytes(256).toString('hex');

module.exports = {                                  // Export file
    uri: 'mongodb://localhost:27017/' + this.db,    
    secret: crypto,                                 // Screte code or encryption; Token used to decrypt info...
    db: 'mean-website'                              // Database name.
}