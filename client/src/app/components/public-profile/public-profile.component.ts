import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private activatedRouter: ActivatedRoute,
    private blogService: BlogService,
    private formBuilder: FormBuilder
  ) { }

  url;
  username;
  email;
  collection;
  message;
  messageClass;
  found = false;

  processing = false;
  commentForm;
  newPost = false;
  newComment = [];
  enabledComments = [];

  ngOnInit() {
    this.url = this.activatedRouter.snapshot.params;
    this.authService.publicProfile(this.url.username).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.username = data.user.username;
        this.email = data.user.email;
        this.found = true;
        this.getPosts();
      }
    });

    this.createComment();
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

  enableComment() {
    this.commentForm.get('comment').enable();
  }

  disableComment() {
    this.commentForm.get('comment').disable();
  }

  postComment(id) {
    this.disableComment(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.blogService.comment(id, comment).subscribe(data => {
      console.log(data)
      this.getPosts(); // Refresh all blogs to reflect the new comment
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

  getPosts() {
    this.blogService.userPosts(this.username).subscribe( data =>{
      if (!data) {

      } else {
        this.collection = data.blogs;
      }
    });
  }

}
