const Blog = require('../models/blog');         // Import blog model schemal.
const User = require('../models/user');
const jwt = require('jsonwebtoken');            // Import Web Tokens.
const config = require('../config/database');   // Data base configuration file. 

module.exports = (router) => {
    // Post request for new entries
    router.post('/newBlog', (req, res) => {
        if (!req.body.title) {
            res.json({ success: false, message: 'Title is required.'});
        } else {
            if (!req.body.body) {
                res.json({ success: false, message: 'Body is empty.'});
            } else {
                // Create post entry.
                const blog = new Blog({
                    title: req.body.title,
                    body: req.body.body,
                    author: req.body.author
                });
                // Save post and check for errors
                blog.save((err) => {
                    if (err) {
                        // Validation errors.
                        if (err.errors) {
                            if (err.errors.title) {
                                res.json({ success: false, message: err.errors.title.message });
                            } else if (err.errors.body) {
                                res.json({ success: false, message: err.errors.body.message });
                            } else {
                                res.json({ success: false, message: err.errmsg });
                            }
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else {
                        // successfully posted.
                        res.json({ success: true, message: 'Entry Saved'});
                    }
                });
            }
        }
    });

    router.get('/collection', (req, res) => {
        Blog.find({}, (err, blogs) => {
            if (err) {
                res.json({ success: false, message: err });
            } else {
                if (!blogs) {
                    res.json({ success: false, message: 'Not found.'});
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            } 
        }).sort({'_id': -1});
    });


    router.put('/update', (req, res) => {
        // Check if id was provided
        if (!req.body._id) {
          res.json({ success: false, message: 'ID required.' }); // Return error message
        } else {
          // Check if id exists in database
          Blog.findOne({ _id: req.body._id }, (err, blog) => {
            // Check if id is a valid ID
            if (err) {
              res.json({ success: false, message: 'ID invalid.' }); // Return error message
            } else {
              // Check if id was found in the database
              if (!blog) {
                res.json({ success: false, message: 'Entry not found.' }); // Return error message
              } else {
                // Check who user is that is requesting blog update
                User.findOne({ _id: req.decoded.userId }, (err, user) => {
                  // Check if error was found
                  if (err) {
                    res.json({ success: false, message: err }); // Return error message
                  } else {
                    // Check if user was found in the database
                    if (!user) {
                      res.json({ success: false, message: 'User cannot be authenticated.' }); // Return error message
                    } else {
                      // Check if user logged in the the one requesting to update blog post
                      if (user.username !== blog.author) {
                        res.json({ success: false, message: 'Unable to edit.' }); // Return error message
                      } else {
                        blog.title = req.body.title; // Save latest blog title
                        blog.body = req.body.body; // Save latest body
                        blog.save((err) => {
                          if (err) {
                            if (err.errors) {
                              res.json({ success: false, message: 'Form invalid.' });
                            } else {
                              res.json({ success: false, message: err }); // Return error message
                            }
                          } else {
                            res.json({ success: true, message: 'Updated.' }); // Return success message
                          }
                        });
                      }
                    }
                  }
                });
              }
            }
          });
        }
      });

    router.put('/like', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'ID required.'});
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'ID invalid.'});
                } else if (!blog) {
                    res.json({ success: false, message: 'Not Found'});
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: 'Unable to fulfill request.'});
                        } else if (!user) {
                            res.json({ success: false, message: 'User cannot be authenticated.'});
                        } else {
                            if (user.username !== blog.author) {

                                if (user.likes.includes(blog._id.toString())) {
                                    res.json({ success: false, message: 'Already included in \'likes\'.'});
                                } else {
                                    if (user.dislikes.includes(blog._id.toString())) {
                                        blog.dislikes--;

                                        User.findOneAndUpdate({username: user.username}, {$pull : { dislikes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });
                                        User.findOneAndUpdate({username: user.username}, {$push : { likes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });

                                        blog.likes++;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'});
                                            } else {
                                                res.json({ success: true, message: 'Liked.'});
                                            }
                                        });
                                    } else {
                                        blog.likes++;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'});
                                            } else {
                                                res.json({ success: true, message: 'Liked.'});
                                            }
                                        });

                                        User.findOneAndUpdate({username: user.username}, {$push : { likes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: 'Invalid.'});
                            }
                        }
                    });
                }
            });
        }
    });
    router.put('/dislike', (req, res) => {
        if (!req.body.id) {
            res.json({ success: false, message: 'ID required.'});
        } else {
            Blog.findOne({ _id: req.body.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'ID invalid.'});
                } else if (!blog) {
                    res.json({ success: false, message: 'Not Found'});
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: 'Unable to fulfill request.'});
                        } else if (!user) {
                            res.json({ success: false, message: 'User cannot be authenticated.'});
                        } else {
                            if (user.username !== blog.author) {

                                if (user.dislikes.includes(blog._id.toString())) {
                                    res.json({ success: false, message: 'Already included in \'dislikes\'.'});
                                } else {
                                    if (user.likes.includes(blog._id.toString())) {
                                        blog.likes--;
                                        

                                        User.findOneAndUpdate({username: user.username}, {$pull : { likes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });

                                        User.findOneAndUpdate({username: user.username}, {$push : { dislikes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });

                                        blog.dislikes++;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'});
                                            } else {
                                                res.json({ success: true, message: 'Disliked.'});
                                            }
                                        });
                                    } else {
                                        blog.dislikes++;
                                        blog.save((err) => {
                                            if (err) {
                                                res.json({success: false, message: 'Error.'});
                                            } else {

                                                res.json({success: true, message: 'Disliked.' })
                                            }
                                        });

                                        User.findOneAndUpdate({username: user.username}, {$push : { dislikes: blog._id.toString() }}, (err, doc, res) => {
                                            if (err) {
                                                res.json({ success: false, message: 'Error.'})
                                            }
                                        });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: 'Invalid.'});
                            }
                        }
                    });
                }
            });
        }
    });

    router.get('/userPosts/:username' , (req, res) => {
        if (!req.params.username) {
            res.json({ success: false, message: 'User not found.'});
        } else {
            Blog.find({ author: req.params.username}, (err, blogs) => {
                if (err) {
                    res.json({ success: false, message: err});
                } else if (!blogs) {
                    res.json({ success: false, message: 'Error.'})
                } else {
                    res.json({ success: true, blogs: blogs });
                }
            }).sort({'_id': -1});
        }
    });
    
    router.get('/post/:id',( req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'ID required.'});
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'ID invalid.'});
                } else if (!blog) {
                    res.json({ success: false, message: 'Not found.'});
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err});
                        } else if (!user) {
                            res.json({ success: false, message: 'User cannot be authenticated.'})
                        } else {
                            if (user.username !== blog.author) {
                                res.json({ success: false, message: 'Unable to edit.'});
                            } else {
                                res.json({ success: true, blog: blog});
                            }
                        }
                    });
                }
            });
        }
    });

    router.delete('/delete/:id', (req, res) => {
        if (!req.params.id) {
            res.json({ success: false, message: 'ID required.'});
        } else {
            Blog.findOne({ _id: req.params.id }, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'ID invalid.'});
                } else if (!blog) {
                    res.json({ success: false, message: 'Unable to delete.'});
                } else {
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: err});
                        } else if (!user) {
                            res.json({ success: false, message: 'User cannot be authenticated.'});
                        } else {
                            if (user.username !== blog.author) {
                                res.json({ success: false, message: 'Unable to delete'});
                            } else {
                                blog.remove((err) => {
                                    if (err) {
                                        res.json({ success: false, message: err});
                                    } else {
                                        res.json({ success: true, message: 'Deleted.'})
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
    }); 

    // Route to post comments on post
    router.post('/comment', (req, res) => {
        if (!req.body.comment) {
            res.json({ success: false, message: 'No comment submited.'})
        } else if (!req.body.id) {
            res.json({ success: false, message: 'Cannot find post.'});
        } else {
            // Find post by id to comment on.
            Blog.findOne({ _id: req.body.id}, (err, blog) => {
                if (err) {
                    res.json({ success: false, message: 'Cannot find post.'});
                } else if (!blog) {
                    res.json({ success: false, message: 'Cannot find post.'});
                } else {
                    // Find user that is currently logged in.
                    User.findOne({ _id: req.decoded.userId }, (err, user) => {
                        if (err) {
                            res.json({ success: false, message: 'Error. Something went wrong.'});
                        } else if (!user) {
                            res.json({ success: false, message: 'User not found.'});
                        } else {
                            blog.comments.push({
                                comment: req.body.comment,
                                author: user.username
                            });
                            blog.save((err) => {
                                if (err) {
                                    console.log(err);
                                    res.json({ success: false, message: 'Unable to post comment.'});
                                } else {
                                    res.json({ success: true, message: 'Comment'})
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    return router;
};