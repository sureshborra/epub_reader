import { Component, OnInit, ViewChild, TemplateRef,AfterViewChecked, ElementRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import { NavItem } from 'epubjs/types/navigation';
import { EbooksEpubService } from '../ebooks-epub.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})

export class ReaderComponent implements OnInit {
  @ViewChild('expiredModal') expiredModal: TemplateRef<any>;
  @ViewChild('blockedModal') blockedModal: TemplateRef<any>;
  bookTitle = '';
  chapterTitle = '';
  book: Book;
  rendition: Rendition;
  chapters: NavItem[];
  navOpen: Boolean;
  currentChapter: any;
  sessionId: string;
  pollInterval: any;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  
  constructor(
    private currentRoute: ActivatedRoute,
    private epubService: EbooksEpubService,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        clearInterval(this.pollInterval);
      }
    });
  }

  ngOnInit() {
    this.book = this.epubService.getBook(this.currentRoute.snapshot.params.id);
    if(  this.book &&   this.book.loaded.metadata){
    this.book.loaded.metadata.then(meta => {
      this.bookTitle = meta.title;
    });
    this.storeChapters();
    this.navOpen = false;

    //scroll     
   this.rendition = this.book.renderTo(document.body, { manager: "continuous",
   flow: "scrolled",
   width: "90%" ,height:"100%"  }); 
    //scroll end  
     this.rendition.display(); 
      this.rendition.on('rendered', section => {
      this.currentChapter = this.book.navigation.get(section.href);
      this.chapterTitle = this.currentChapter ? this.currentChapter.label : '';
    });
    this.epubService.get_page.subscribe(page => {     
    if(page){
      this.go_page(page)
    }       
    });
  }
  }
 
  showNext() {
    this.rendition.next();
  }
  showPrev() {
    this.rendition.prev();
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  onSubscribeClick() { 
    this.router.navigate(['/library']);
  }

  displayChapter(chapter: any) {
    this.currentChapter = chapter;
    this.rendition.display(chapter);    
  }

   private storeChapters() {
    this.book.loaded.navigation.then(navigation => {
      this.chapters = navigation.toc;
      this.currentChapter = this.chapters[4];
   
    });
  }
  
go_page(pg){
   this.rendition.display(pg);

  //  this.rendition.on('relocated', (location) => {
  //   const pages = this.book.locations.locationFromCfi(location.start.cfi);
  //   console.log(location,location.start.cfi)
  //   });
    

  }
}
