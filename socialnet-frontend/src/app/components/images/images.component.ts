import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import { FileUploader } from 'ng2-file-upload';
import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';

const URL = 'http://localhost:3000/api/socialnet/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  user: any;
  selectedFile: any;
  images = [];

  socket: any;

  constructor(private usersService: UsersService, private tokenService: TokenService) {
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
    this.usersService.getUserById(this.user._id).subscribe(
      data => {
        this.images = data.result.images;
      },
      err => console.log(err)
    );
  }

  onFileSelected(event) {
    const file: File = event[0];

    this.readAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => console.log(err));
  }

  upload() {
    if (this.selectedFile) {
      this.usersService.addImage(this.selectedFile).subscribe(
        data => {
          this.socket.emit('refresh', {});
          const filePath = <HTMLInputElement>document.getElementById('filePath');
          filePath.value = '';
        },
        err => console.log(err)
      );
    }
  }

  setProfileImage(image) {
    this.usersService.setDefaultImage(image.imgId, image.imgVersion).subscribe(
      data => {
        this.socket.emit('refresh', {});
      },
      err => console.log(err)
    );
  }

  readAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', event => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });

    return fileValue;
  }
}
