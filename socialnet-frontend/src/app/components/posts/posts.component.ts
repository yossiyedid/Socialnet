import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts: Array<any> = [];

  constructor(private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.allPosts();

    this.socket.on('refreshPage', data => {
      this.allPosts();
    });
  }

  allPosts() {
    this.postService.getAllPosts().subscribe(data => {
      this.posts = data.posts;
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postService.addLike(post).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }
}
