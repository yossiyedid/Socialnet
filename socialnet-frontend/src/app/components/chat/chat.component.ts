import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit , AfterViewInit {
  toolbarElement: any;
  online_users = [];

  constructor() { }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.toolbarElement.style.display = 'none';
  }

  ngAfterViewInit(): void {
    this.toolbarElement.style.display = 'none';
  }

  online(event) {
    this.online_users = event;
  }

}
