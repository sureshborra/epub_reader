import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Books} from '../books';
 
@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  books = Books;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onTitleSelect(event) {
    this.router.navigate(['/reader/' + event]);
  }

}
