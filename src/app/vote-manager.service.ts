import { Injectable, EventEmitter } from '@angular/core';

interface VoteEvent {
  id: string;
  multiple: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VoteManagerService {

  party: EventEmitter<any>[] = []
  selected: boolean[] = [];
  selectedCanadidates: any[] = [];

  constructor() {
    for(let i = 0; i < 4; i++) {
      this.selected[i] = false;
      this.party[i] = new EventEmitter<any>();
      this.party[i].subscribe((data: VoteEvent) => {
        this.selected[i] = true;
        if(data.multiple) {
          if(this.selectedCanadidates[i]) {
            if(this.selectedCanadidates[i].includes(data.id)) {
              let index = this.selectedCanadidates[i].indexOf(data.id);
              this.selectedCanadidates[i].splice(index, 1);
            } else {
              let temp: string[] = [data.id, ...this.selectedCanadidates[i]];
              this.selectedCanadidates[i] = temp;
            }
          } else {
            this.selectedCanadidates[i] = [data.id];
          }
        } else {
          this.selectedCanadidates[i] = data.id;
        }
      })
    }
  }

  getParty(n: number) {
    if(n >= 0 && n <= 4) {
      return this.party[n];
    } else {
      return null;
    }
  }

  getSelected(n: number) {
    return this.selected[n];
  }

  getSelectedCandidates() {
    return [].concat.apply([], this.selectedCanadidates);
  }

  allSelected() {
    console.log(this.selected.length);
    for(let i = 0; i < this.selected.length - 1; i++) {
      if(!this.selected[i]) return false;
    }
    return true;
  }
}
