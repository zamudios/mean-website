import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  form;
  commentForm;
  messageClass;
  message;
  username;
  collection;
  processing = false;
  loading = false;
  newPost = false;
  simple;
  newComment = [];
  enabledComments = [];

  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 
    this.createBlog();
    this.createComment();
  }

  // Blog form.
  blogForm() {
    this.newPost = true;
  }

  createBlog() {
    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(40),
        Validators.minLength(1),
        this.valid
      ])],
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(10),
        // this.valid
      ])]
    });
  }

  createComment() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    });
  }

  valid(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { 'valid': true };
    }
  }

  enableBlogForm() {
    this.form.get('title').enable();
    this.form.get('body').enable();
  }

  disableBlogForm() {
    this.form.get('title').disable();
    this.form.get('body').disable();
  }

  enableComment() {
    this.commentForm.get('comment').enable();
  }

  disableComment() {
    this.commentForm.get('comment').disable();
  }

  // Refresh blog section. Get 'new' blogs from database. 
  refreshBlogs() {
    this.loading = true;
    this.getPostCollection();
    setTimeout(() => {
      this.loading = false;
    },4000)
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
    });
    this.getPostCollection();
  }

  getPostCollection() {
    this.blogService.getPosts().subscribe(data => {
      this.collection = data.blogs;
    });
  }

  goBack() {
    window.location.reload();
  }

  submit() {
    this.processing = true;
    this.disableBlogForm();

    const blog = {
      title : this.form.get('title').value,
      body : this.form.get('body').value,
      author: this.username
    }

    this.blogService.newBlog(blog).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
        this.processing = false;
        this.enableBlogForm();
    
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;

        this.getPostCollection();

        setTimeout(() => {
          this.newPost = false;
          this.processing =false;
          this.message = false;
          this.form.reset();
          this.enableBlogForm();
        }, 2000);
      }
    });
  }

  postComment(id) {
    this.disableComment(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.blogService.comment(id, comment).subscribe(data => {
      console.log(data)
      this.getPostCollection(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableComment(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) {
        this.expand(id); // Expand comments for user on comment submission
      }
    });
  }

  cancelComment(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableComment();
    this.processing = false;
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  draft(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  like(id) {
    this.blogService.like(id).subscribe(data => {
      this.getPostCollection();
    });
  }

  dislike(id) {
   
    this.blogService.dislike(id).subscribe(data => {
      this.getPostCollection();
    });

  }
}
