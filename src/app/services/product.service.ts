import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private products!: Array<Product>;
  constructor(private http:HttpClient) { 
    this.products = [
      {id: UUID.UUID(), name: "comp", price: 6500, promotion:true},
      {id: UUID.UUID(), name: "printer", price: 1200, promotion:false},
      {id: UUID.UUID(), name: "smart phone", price: 2000, promotion:true},
    ];
    for(let i=0; i<10; i++){
      this.products.push({id: UUID.UUID(), name: "comp", price: 6500, promotion:true});
      this.products.push({id: UUID.UUID(), name: "printer", price: 1200, promotion:false});
      this.products.push({id: UUID.UUID(), name: "smart phone", price: 2000, promotion:true});
    }
  }

  public getAllProducts():Observable<Product[]>{
    let rnd = Math.random();
    if(rnd<0.1) return throwError(()=>new Error("Internet connexion error"))
    else return of(this.products);
    //this.http.get('http://127.0.0.1:8080/api/product/products')
  }
  public getPageProducts(page:number,size:number):Observable<PageProduct>{
    let index = page*size;
    let totalPages = ~~(this.products.length / size);
    if(this.products.length % size !=0)
      totalPages++
    let pageProducts = this.products.slice(index,index+size);
    return of({products:pageProducts,page:page,size:size,totalPages:totalPages});  
  }
  public deleteProduct(id: string):Observable<boolean>{
    this.products = this.products.filter(p=>p.id!=id);
    return of(true);
  }
  public setPromotion(id: string): Observable<boolean>{
    let product = this.products.find(p=>p.id==id);
    if(product!=undefined){
      product.promotion=!product?.promotion;
      return of(true)
    }else return throwError(()=> Error("Product not found"));
  }
  public searchProducts(keyword: string, page:number, size: number):Observable<PageProduct>{
    let result = this.products.filter(p=>p.name.includes(keyword));
    let index = page*size;
    let totalPages = ~~(result.length / size);
    if(this.products.length % size !=0)
      totalPages++
    let pageProducts = result.slice(index,index+size);
    return of({products:pageProducts,page:page,size:size,totalPages:totalPages});
  }
  public addNewProduct(product: Product):Observable<Product>{
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }
  public getProduct(id: String):Observable<Product>{
    let product = this.products.find(p=>p.id==id)
    if(product == undefined) return throwError(()=> new Error("Product not found"));
    return of(product);
  }
  getErrorMessage(fieldName:string, error:ValidationErrors){
    if(error['required']){
      return fieldName +" is required";
    }else if(error['minlength']){
      return fieldName+ " should have at least "+error['minlength']['requiredLength']+" characters";
    }else if(error['min']){
      return fieldName+ " should have min value "+error['min']['min'];
    }else return "";
  }
  public updateProduct(product: Product):Observable<Product>{
    this.products = this.products.map(p => (p.id === product.id)?product:p);
    return of(product);
  }
}


