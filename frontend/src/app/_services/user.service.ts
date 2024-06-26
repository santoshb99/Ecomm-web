import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  PATH_OF_API = "http://localhost:8082"

  requestHeader = new HttpHeaders(
    { 'No-Auth': "True" }
  );

  constructor(private httpClient: HttpClient, private userAuthService: UserAuthService) { }


  public login(loginData: any) {
    return this.httpClient.post(this.PATH_OF_API + "/authenticate", loginData, { headers: this.requestHeader })
  }

  public register(registerData: any){
    return this.httpClient.post(this.PATH_OF_API+"/registerNewUser", registerData);
  }

  public forUser(){
    return this.httpClient.get(this.PATH_OF_API + "/forUser", {
      responseType: "text",
    });
  }

  public forAdmin(){
    return this.httpClient.get(this.PATH_OF_API + "/forAdmin", {
      responseType: "text",
    });
  }

  public roleMatch(allowedRoles: string[]): boolean {
    const userRoles = this.userAuthService.getRoles();

    if (userRoles != null) {
        for (let i = 0; i < userRoles.length; i++) {
            for (let j = 0; j < allowedRoles.length; j++) {
                if (userRoles[i].roleName === allowedRoles[j]) {
                    return true;
                }
            }
        }
    }

    return false;
}

}
