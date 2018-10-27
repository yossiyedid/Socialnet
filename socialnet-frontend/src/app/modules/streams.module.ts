import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StreamsComponent } from '../components/streams/streams.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StreamsComponent],
  exports: [StreamsComponent]
})
export class StreamsModule {}
