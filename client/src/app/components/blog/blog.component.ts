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
  messageClass;
  message;
  username;
  collection;
  processing = false;
  loading = false;
  newPost = false;
  simple;

  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService
  ) { 
    this.createBlog();
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

  draft() {
    
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
