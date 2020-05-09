import { Injectable } from '@angular/core';
import { EpubJsRequestUtil } from './reader/EpubJsRequestUtil';
import Epub from 'epubjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AnnotationsModel } from './reader/annotations.datamodel';
import { BehaviorSubject } from 'rxjs'
import {Books} from './books';

const baseAPI = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})

export class EbooksEpubService {
  private requestUtil: EpubJsRequestUtil = new EpubJsRequestUtil();
 

  constructor(private http: HttpClient) { }
 
  //set & get data of observable
  public get_page = new BehaviorSubject(0);
  get_pageData = this.get_page.asObservable();
  set_pageData(pg: any) {
  this.get_page.next(pg);
  }
 
  books = []; book_path ="";
  public getBook(bookId: string) {
  this.books = Books;
    if(bookId){
    const ebook= this.books.filter(x => x.id == bookId );
    if(ebook[0]){
    this.book_path = ebook[0]["path"];
    const epb =  Epub(this.book_path , {
      //   requestMethod: this.requestUtil.request.bind(this)
      });   
      return epb; 
    }
    }  
  }
  public getAnnotations(bookId: string) {
    return this.http.get(baseAPI + '/epub/annotations/' + bookId).pipe(map(res => res as AnnotationsModel));
  }

}