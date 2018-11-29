import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';
import * as moment from "moment";

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  tabElement: any;
  postsTab = false;
  followingTab = false;
  followersTab = false;
  posts = [];
  following = [];
  followers = [];
  user: any;
  name: any;

  constructor(private route: ActivatedRoute, private usersService: UsersService) {}

  ngOnInit() {
    this.postsTab = true;
    const tabs = document.querySelector('.tabs');
    M.Tabs.init(tabs, {});
    this.tabElement = document.querySelector('.nav-content');

    this.route.params.subscribe(params => {
      this.name = params.name;
      this.getUserData(this.name);
    });
  }

  ngAfterViewInit(): void {
    this.tabElement.style.display = 'none';
  }

  getUserData(name) {
    this.usersService.getUserByName(name).subscribe(
      data => {
        this.user = data.result;
        this.posts = data.result.posts.reverse();
        this.followers = data.result.followers;
        this.following = data.result.following;
      },
      error1 => console.log(error1)
    );
  }

  changeTab(value) {
    if (value === 'posts') {
      this.postsTab = true;
      this.followersTab = false;
      this.followingTab = false;
    } else if (value === 'followers') {
      this.postsTab = false;
      this.followersTab = true;
      this.followingTab = false;
    } else {
      this.postsTab = false;
      this.followersTab = false;
      this.followingTab = true;
    }
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
