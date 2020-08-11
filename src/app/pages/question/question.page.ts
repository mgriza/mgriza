import { Component, OnInit, OnDestroy } from '@angular/core';
import { QuestionsService } from 'src/app/services/questions.service';
import { Question } from 'src/app/dto/question.dto';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage implements OnInit, OnDestroy {

  question: Question;
  timer: number = 10;
  offset: number = 1000;

  mapLiteral = {
    1000: 'MIL REAIS',
    2000: 'DOIS MIL REAIS',
    1000000: 'UM MILHÃO DE REAIS'
  };

  metadata = {
    currentQuestion: 0,
    questionPrize: 1000,
    amount: 0,
  };

  timerID: any;

  constructor(
    private questionService: QuestionsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) { }


  ngOnDestroy(): void {
    if(this.timerID) clearInterval(this.timerID);
  }

  ngOnInit() {
    this.question = this.questionService.questions[0];

    this.timerID = setInterval(async () => {
      if(this.timer === 0) {
        clearInterval(this.timerID);
        const theAlert = await this.alertCtrl.create({
          header: 'Que pena',
          message: 'Seu tempo acabou!',
          buttons: [
            {
              text: 'OK',
              role: 'ok',
              handler: () => {
                this.router.navigate(['/menu'], {replaceUrl: true});
              }
            }
          ]
        });
        theAlert.present();
        return;
      }
      this.timer--;
    }, 1000);
  }

  async answerQuestion(answer: {text: string, right: boolean}) {

    if(answer.right) {
      if(this.metadata.currentQuestion === 15) {
        const theAlert = await this.alertCtrl.create({
          header: 'Parabéns',
          message: 'Você ganhout UM MILHÃO DE REAIS!!!',
          buttons: [
            {
              text: 'OK',
              role: 'ok',
              handler: () => {
                this.router.navigate(['/menu'], {replaceUrl: true});
              }
            }
          ]
        });
        theAlert.present();
        return;
      }

      const loadingDialog = await this.loadingCtrl.create({
        message: 'Carregando...',
      });
      loadingDialog.present();
      this.metadata.currentQuestion++;

      // acumulado é igual ao valor se acertar
      this.metadata.amount = this.metadata.questionPrize;

      // o valor de acerto muda (geralmente duas vezes)
      if(this.metadata.currentQuestion == 5) {
        this.metadata.questionPrize = 10000;
        this.offset = 10000;
      }else if(this.metadata.currentQuestion == 10) {
        this.metadata.questionPrize = 100000;
        this.offset = 100000;
      } else if(this.metadata.currentQuestion == 15) {
        this.metadata.questionPrize = 1000000;
        this.offset = 0;
      }
      else this.metadata.questionPrize += this.offset;


      this.question = this.questionService.questions[this.metadata.currentQuestion];
      loadingDialog.dismiss();
      this.timer = 5;
    }else {

      const title: string = this.metadata.currentQuestion == 15 ? 'PERDEU TUDO' : 'Que pena';
      const body: string = this.metadata.currentQuestion == 15 ? `Você foi bem mas no final perdeu tudo.` : `Você errou. Mas vai levar para casa o prêmio de R$ ${this.metadata.amount/2}`;

      const theAlert = await this.alertCtrl.create({
        header: title,
        message: body,
        buttons: [
          {
            text: 'OK',
            role: 'ok',
            handler: () => {
              this.router.navigate(['/menu'], {replaceUrl: true});
            }
          }
        ]
      });
      theAlert.present();
    }
  }

}
