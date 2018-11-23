import {Component, OnInit} from '@angular/core';
import {TokenService} from '../../services/token.service';
import {Router} from '@angular/router';
import * as M from 'materialize-css';
import {UsersService} from '../../services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import {MessageService} from '../../services/message.service';

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
  chatList = [];
  msgNumber = 0;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usersService: UsersService,
    private msgService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online', { room: 'global', user: this.user.username });

    this.getUser();
    this.socket.on('refreshPage', () => {
      this.getUser();
    });
  }

  // ngAfterViewInit() {
  //   this.socket.on('usersOnline', data => {
  //     this.onlineUsers.emit(data);
  //   });
  // }

  getUser() {
    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        // this.imageId = data.result.picId;
     //   this.imageVersion = data.result.picVersion;
        this.notifications = data.result.notifications.reverse();
        this.count = _.filter(this.notifications, ['read', false]);
        this.chatList = data.result.chatList;
        this.checkIfRead(this.chatList);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  checkIfRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const reciver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${reciver.sendername}`) {
        if (reciver.isRead === false && reciver.recivername === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  markAll() {
    this.usersService.markAllAsRead().subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
  }

  goToHome() {
    this.router.navigate(['streams']);
  }

  goToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.msgService.markMessages(this.user.username, name).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  markAllMessages() {
    this.msgService.markAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  messageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY'
    });
  }
}
