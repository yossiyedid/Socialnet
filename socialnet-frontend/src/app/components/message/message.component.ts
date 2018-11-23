import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { MessageService } from '../../services/message.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';
import { CaretEvent, EmojiEvent, EmojiPickerOptions } from 'ng2-emoji-picker';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, AfterViewInit {
  reciver: string;
  user: any;
  message: string;
  reciverData: any;
  messagesArr = [];
  socket: any;
  typingMessage;
  typing = false;

  public eventMock;
  public eventPosMock;

  public direction =
    Math.random() > 0.5 ? (Math.random() > 0.5 ? 'top' : 'bottom') : Math.random() > 0.5 ? 'right' : 'left';
  public toggled = false;
  public content = ' ';

  private _lastCaretEvent: CaretEvent;

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

    this.socket.on('is_typing', data => {
      if (data.sender === this.reciver) {
        this.typing = true;
      }
    });

    this.socket.on('has_stopped_typing', data => {
      if (data.sender === this.reciver) {
        this.typing = false;
      }
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

  ngAfterViewInit(): void {
    const params = {
      room1: this.user.username,
      room2: this.reciver
    };

    this.socket.emit('join chat', params);
  }
  isTyping() {
    this.socket.emit('start_typing', {
      sender: this.user.username,
      reciver: this.reciver
    });

    if (this.typingMessage) {
      clearTimeout(this.typingMessage);
    }

    this.typingMessage = setTimeout(() => {
      this.socket.emit('stop_typing', {
        sender: this.user.username,
        reciver: this.reciver
      });
    }, 500);
  }

  handleSelection(event: EmojiEvent) {
    this.content =
      this.content.slice(0, this._lastCaretEvent.caretOffset) +
      event.char +
      this.content.slice(this._lastCaretEvent.caretOffset);
    this.eventMock = JSON.stringify(event);
    this.message = this.content;
    this.toggled = !this.toggled;
    this.content = '';
  }

  handleCurrentCaret(event: CaretEvent) {
    this._lastCaretEvent = event;
    this.eventPosMock = `{ caretOffset : ${event.caretOffset}, caretRange: Range{...}, textContent: ${
      event.textContent
    } }`;
  }

  Toggled() {
    this.toggled = !this.toggled;
  }
}
