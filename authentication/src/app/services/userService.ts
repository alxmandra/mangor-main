import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { createApi } from 'effector';
import $token from 'store/Token';

const { setToken } = createApi($token, {
    setToken: (newToken, setToken: string) => (setToken)
});

@Injectable({
    providedIn: "any"
})


export class UserService {
    deleteUser(_id: string) {
        return this.http!.delete(
            `${this.API_URL}users`,
            {
                headers: this.privateHeaders,
                withCredentials: true,
                body: { _id }
            }
        )
    }
    API_URL = `/usersStore/`;
    private auth_token = ''
    private headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Access-Control-Allow-Origin', '*')
        .set('Cache', 'no-cache')

    get privateHeaders() {
        return new HttpHeaders()
            .set('content-type', 'application/json')
            .set('Access-Control-Allow-Origin', '*')
            .set('Cache', 'no-cache')
            .set('Authorization', `Bearer ${localStorage.getItem("token")}`);

    }
    private http: HttpClient = inject(HttpClient)
    constructor() {
    }
    requestOptions = { headers: this.headers };

    logInUser(username: string, password: string) {
        return this.http!.post(
            `${this.API_URL}login`,
            {
                username,
                password
            },
            this.requestOptions
        )
            .pipe(map(
                (resp: any) => {
                    this.auth_token = resp.token;
                    this.headers = new HttpHeaders()
                        .set('content-type', 'application/json')
                        .set('Access-Control-Allow-Origin', '*')
                        .set('Cache', 'no-cache')
                    setToken(`Bearer ${this.auth_token}`)
                    const event = new CustomEvent('mangor::authentication', { detail: resp });
                    window.dispatchEvent(event);
                    return resp;
                }
            ))
    }

    signupUser(username: string, firstName: string, lastName: string, email: string, password: string) {
        return this.http!.post(`${this.API_URL}signup`, {
            username,
            firstName,
            lastName,
            email,
            password
        }, { headers: this.headers })
    }
    getUsers() {
        return this.http!.get(
            `${this.API_URL}users`,
            {
                headers: this.privateHeaders, withCredentials: true
            }
        )
    }
}
