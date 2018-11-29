import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import _ from 'lodash';
import io from 'socket.io-client';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  socket: any;
  users = [];
  loggedInUser: any;
  userArr = [];
  onlineusers = [];

  constructor(private userService: UsersService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getUsers();
    this.getUser();

    this.socket.on('refreshPage', () => {
      this.getUsers();
      this.getUser();
    });
  }

  getUsers() {
    this.userService.getAllUsers().subscribe(data => {
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  getUser() {
    this.userService.getUserById(this.loggedInUser._id).subscribe(data => {
      this.userArr = data.result.following;
    });
  }

  followUser(user) {
    this.userService.followUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  checkInArray(arr, id) {
    const result = _.find(arr, ['userFollowed._id', id]);
    return !!result;
  }
  online(event) {
    this.onlineusers = event;
  }

  checkIfOnline(name) {
    const result = _.indexOf(this.onlineusers, name);
    return result > -1;
  }

  viewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
      this.userService.profileNotifications(user._id).subscribe(
        data => {
          this.socket.emit('refresh', {});
        },
        error1 => console.log(error1)
      );
    }
  }
}
