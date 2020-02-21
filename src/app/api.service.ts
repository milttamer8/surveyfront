import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';

const BaseUrl = 'http://localhost:3000/api/';
// const BaseUrl = 'http://157.245.120.62:3000/api/';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  setHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'token': `${localStorage.getItem("token")}`
      })
    };
  }

  public sendApiRequest(url, postData) {
    
    const httpOptions =this.setHeaders();
      
    return this.http.post(`${BaseUrl}${url}`,postData, httpOptions);
  }
}
