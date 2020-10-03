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
    this.nativeAudio.preloadComplex('intro', 'assets/audios/intro.wav', .2, 1, 0).then(() => {
      this.nativeAudio.loop('intro');
    }).catch(err => {
      alert(err.toString());
    })

    this.nativeAudio.preloadSimple('vai-comecar', 'assets/audios/vai-comecar.wav').catch((err) => {
      alert('Preload simple error: ' + err.toString())
    });
  }


  ngOnChanges() {
    console.log('changes');
  }

  async toQuestion() {
    await this.nativeAudio.play('vai-comecar').catch(err => {
      alert('Houve um erro');
      alert(JSON.stringify(err));
    });
    await this.nativeAudio.stop('intro');
    this.router.navigate(['/', 'question']);
  }

}
