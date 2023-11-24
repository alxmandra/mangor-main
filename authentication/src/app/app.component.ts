import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/userService';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [UserService, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-node-express';
}
