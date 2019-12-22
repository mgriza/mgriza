import { Component, OnInit } from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  loaded: boolean = false;
  logs: string[] = [];

  questionTime: number = 30;
  question = {
    text: 'Quem foi o campeão da copa do mundo de 2002?',
    asnwers: [
      {desc: 'Alemanha', right: false},
      {desc: 'Suécia', right: false},
      {desc: 'França', right: false},
      {desc: 'Brasil', right: true},
    ]
  };
  

  constructor(
    private nativeAudio: NativeAudio,
  ) {}

  ngOnInit() {
    this.nativeAudio.preloadSimple('right', 'assets/certa-resposta.wav');
    this.nativeAudio.preloadSimple('canQuestion', 'assets/posso-perguntar.wav');
    this.nativeAudio.preloadSimple('wrong', 'assets/audios/que-pena.wav');

    this.nativeAudio.preloadComplex('backAudio', 'assets/suspense.wav', .2, 1, 0).then(() => {
      this.nativeAudio.loop('backAudio');
    });
  }

  answerQuestion(answer) {
    this.nativeAudio.play('canQuestion').then(() => {
      if(answer.right) {
        setTimeout(() => this.nativeAudio.play('right'), 1500);
       }else {
        setTimeout(() => this.nativeAudio.play('wrong'), 1500);
       }
    });
  }

}
