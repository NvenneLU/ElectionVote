import { Component, AfterViewInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { VoteManagerService } from './vote-manager.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Meta } from '@angular/platform-browser';


// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type':  'application/json',
//     'x-api-key': 'd4e622f7-609d-45e1-a594-402a48f44b6a',
//   })
// };
//
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app';

  @ViewChild('content') content;
  selected: boolean[] = [];
  missing: boolean[] = []
  complete: boolean = false;



  constructor(private manager: VoteManagerService, private renderer: Renderer2, private http: HttpClient, private meta: Meta) {
    manager.getParty(0).subscribe((bool) => {
      this.selected[0] = true;
      this.missing[0] = false;
    });
    manager.getParty(1).subscribe((bool) => {
      this.selected[1] = true;
      this.missing[1] = false;
    });
    manager.getParty(2).subscribe((bool) => {
      this.selected[2] = true;
      this.missing[2] = false;
    });
    manager.getParty(3).subscribe((bool) => {
      this.selected[3] = true;
      this.missing[3] = false;
    });




  }

  ngAfterViewInit() {
    //Shuffle the candidates
    let rows = document.querySelectorAll(".vote-row");
    for(let i = 0; i < rows.length; i++) {
      let allElm = Array.from(rows[i].childNodes);
      let tempElm = Array.from(rows[i].childNodes)
      let shuffled = tempElm.map(() => {
        let random = Math.floor(Math.random() * allElm.length);
        let randElm = allElm[random];
        allElm.splice(random, 1);
        return randElm;
      });
      rows[i].innerHTML = '';
      shuffled.forEach((e) => {
        rows[i].append(e)
      })
    }
  }


  scrollTo(n: string) {
    let elm = document.getElementById(n);
    let topOfElm = elm.offsetTop - 84;
    window.scroll({top: topOfElm, behavior: 'smooth'});
  }

  submit() {
    if(!this.manager.allSelected()) {
      this.calculateMissing();
      return;
    }
    let temp: string[] = this.manager.getSelectedCandidates()
    let hash: HTMLMetaElement = this.meta.getTag('name=userhash');
    // this.http.post<any>('http://api2.laurentian.ca:8080/api/elections', {selected: temp, userhash: hash.content}, httpOptions).subscribe((data) => {
    //   console.log(data);
    // })
    this.http.post<any>('https://my.laurentian.ca/sites/all/custom/SGAPoll/process.php', {selected: temp, userhash: hash.content}, httpOptions).subscribe((data) => {
      console.log(data);
    })

    this.complete = true;
    window.scroll({top: 0, behavior: 'smooth'});
    document.body.style.overflow = 'hidden';


  }

  calculateMissing() {
    for(let i = 0; i < 4; i++) {
      if(!this.manager.getSelected(i)) {
        this.missing[i] = true;
      }
    }
  }



}
