import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  socket: any;
  topPosts: Array<any> = [];
  user: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.allPosts();
    this.user = this.tokenService.getPayload();
    this.socket.on('refreshPage', data => {
      this.allPosts();
    });
  }

  allPosts() {
    this.postService.getAllPosts().subscribe(
      data => {
        this.topPosts = data.top;
      },
      error1 => {
        if (error1.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postService.addLike(post).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  checkInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
