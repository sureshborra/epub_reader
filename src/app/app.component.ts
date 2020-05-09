import { Component } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-EpubReader'; 
  
  constructor(private router: Router) {}
 
  ngAfterContentInit(){   
    this.router.events.subscribe((val) => {
      if (val instanceof ActivationEnd) { 
        if( val.snapshot.component['name'] !="ReaderComponent" && document.getElementsByClassName("epub-container")[0]){
          document.getElementsByClassName("epub-container")[0].remove();
          }
      }
  });    
  }

}
