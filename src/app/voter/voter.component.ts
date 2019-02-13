import { Component, OnInit, Input, HostListener } from '@angular/core';
import { VoteManagerService } from '../vote-manager.service';

interface VoteEvent {
  id: string;
  multiple: boolean;
}

@Component({
  selector: 'app-voter',
  templateUrl: './voter.component.html',
  styleUrls: ['./voter.component.css']
})
export class VoterComponent implements OnInit {

  @Input() party: number;
  @Input() name: string;
  @Input() candidateID: number;
  @Input() image: string;
  @Input() adjustImg: boolean;
  @Input() multiple: boolean;
  selected: boolean = false;
  modalOpen: boolean = false;

  constructor(private manager: VoteManagerService) {
  }

  ngOnInit() {
    this.manager.getParty(this.party).subscribe((data: VoteEvent) => {if(!data.multiple) {this.selected = false}});
    if(!this.multiple) {
      this.multiple = false;
    }
  }

  select() {
    if(!this.selected) {
      this.manager.getParty(this.party).emit({id: this.candidateID, multiple: this.multiple});
      this.selected = true;
    } else {
      if(this.multiple) {
        this.manager.getParty(this.party).emit({id: this.candidateID, multiple: this.multiple});
        this.selected = false;
      }
    }
  }

  moreInfo() {
    this.modalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if(this.modalOpen) {
      this.modalOpen = false;
      document.body.style.overflow = 'scroll';
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.closeModal();
  }
}
