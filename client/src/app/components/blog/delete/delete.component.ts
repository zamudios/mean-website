import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../services/blog.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {

  message;
  messageClass;
  blog;
  url;
  valid = false;
  processing = false;

  constructor(
    private blogService: BlogService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.url = this.activatedRoute.snapshot.params;
    this.blogService.getPost(this.url.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;

      } else {
        this.blog = {
          title: data.blog.title,
          body: data.blog.body,
          author: data.blog.author,
          date: data.blog.date
        }
        this.valid = true;
      }
    });
  }

  delete() {
    this.processing = true;
    this.blogService.delete(this.url.id).subscribe(data => {
      console.log('TEST');
      if (!data.success) {
        this.messageClass = 'alert alert-danger';
        this.message = data.message;
      } else {
        this.messageClass = 'alert alert-success';
        this.message = data.message;
        setTimeout(() => {
          this.router.navigate(['/blog']);
        },2000);
      }
    });
  }

}
