import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  commentsArr = [];
  socket: any;
  post: string;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.toolbarElement.style.display = 'none';
    this.postId = this.route.snapshot.paramMap.get('id');
    this.init();
    this.getPost();
    this.socket.on('refreshPage', data => {
      this.getPost();
    });
  }

  init() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  // ngAfterViewInit(): void {
  //
  // }

  addComment() {
    this.postService.addComment(this.postId, this.commentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {});
      this.commentForm.reset();
    });
  }

  getPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data.post.post;
      this.commentsArr = data.post.comments.reverse();
    });
  }
  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
