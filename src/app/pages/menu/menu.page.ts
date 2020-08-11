import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit, OnChanges {

  constructor(
    private router: Router,
    private nativeAudio: NativeAudio
  ) { 
    console.log('constructor');
  }

  ngOnInit() {
    this.nativeAudio.preloadComplex('intro', 'assets/intro.wav', .2, 1, 0).then(() => {
      this.nativeAudio.loop('intro');
    });

    this.nativeAudio.preloadSimple('vai-comecar', 'assets/vai-comecar.wav')
  }


  ngOnChanges() {
    console.log('changes');
  }

  async toQuestion() {
    this.nativeAudio.stop('intro');
    await this.nativeAudio.play('vai-comercar');
    this.router.navigate(['/', 'question']);
  }

}
