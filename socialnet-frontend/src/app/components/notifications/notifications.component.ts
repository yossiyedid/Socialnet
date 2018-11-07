import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  socket: any;

  user: any;
  notifications = [];

  constructor(private tokenService: TokenService, private usersService: UsersService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUser();
    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  getUser() {
    return this.usersService.getUserByName(this.user.username).subscribe(data => {
      this.notifications = data.result.notifications.reverse();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  markNotification(data) {
    this.usersService.markNotification(data._id).subscribe(value => {
      this.socket.emit('refresh', {});
    });
  }

  deleteNotification(data) {
    this.usersService.markNotification(data._id, true).subscribe(value => {
      this.socket.emit('refresh', {});
    });
  }
}
