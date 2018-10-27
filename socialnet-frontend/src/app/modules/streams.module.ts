import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostsComponent } from '../components/posts/posts.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StreamsComponent, ToolbarComponent, SideComponent, PostFormComponent, PostsComponent],
  exports: [StreamsComponent, ToolbarComponent],
  providers: [TokenService]
})
export class StreamsModule {}
