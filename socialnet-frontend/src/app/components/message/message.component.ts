import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  reciver: string;
  user: any;
  message: string;
  reciverData: any;
  messagesArr = [];
  socket: any;

  constructor(
    private tokenService: TokenService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private usersService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.route.params.subscribe(params => {
      this.reciver = params.name;
      this.getUserByUsername(this.reciver);

      this.socket.on('refreshPage', () => {
        this.getUserByUsername(this.reciver);
      });
    });
  }

  getUserByUsername(name) {
    this.usersService.getUserByName(name).subscribe(data => {
      this.reciverData = data.result;

      this.getMessages(this.user._id, data.result._id);
    });
  }

  getMessages(senderId, receiverId) {
    this.messageService.getAllMessages(senderId, receiverId).subscribe(data => {
      this.messagesArr = data.messages.message;
    });
  }

  sendMessage() {
    if (this.message) {
      this.messageService
        .SendMessage(this.user._id, this.reciverData._id, this.reciverData.username, this.message)
        .subscribe(data => {
          this.socket.emit('refresh', {});
          this.message = '';
        });
    }
  }
}
