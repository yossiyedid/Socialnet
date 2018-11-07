import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  user: any;
  notifications = [];
  socket: any;
  count = [];

  constructor(private tokenService: TokenService, private router: Router, private usersService: UsersService) {
    this.socket = io('http://127.0.0.1:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    const dropDownElement = document.querySelector('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.getUser();
    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  getUser() {
    this.usersService.getUserByName(this.user.username).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse();
        this.count = _.filter(this.notifications, ['read', false]);
      },
      error1 => {
        if (error1.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }
  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }
  goToHome() {
    this.router.navigate(['streams']);
  }

  markAll() {
    this.usersService.markAllAsRead().subscribe(data => {
      console.log(data);
      this.socket.emit('refresh', {});
    });
  }
}
