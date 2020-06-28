import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import{ Location } from '@angular/common';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss']
})
export class DashBoardComponent implements OnInit {
  title='refreshPage';

  step = 0;
  panelOpenState = false;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  isShowing = false;
  

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  constructor(public router: Router, public location: Location) { }

  ngOnInit(): void {
  }
  

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  refresh(): void {
    this.router.navigateByUrl("/", { skipLocationChange: true}).then()
      this.router.navigate([decodeURI(this.location.path())]);
    
  }
}
