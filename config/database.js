const crypto = require('crypto').randomBytes(256).toString('hex'); // Provides cryptographic functionality.

module.exports = {                                  // Export config object.
    uri: 'mongodb://localhost:27017/mean-website',  // Database URI and database name.
    secret: crypto,                                 // Screte code or encryption; Token used to decrypt info...
    db: 'mean-website'                              // Database name.
}