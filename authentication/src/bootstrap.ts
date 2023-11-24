import {
  HttpClientModule
} from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { Routes, provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { InputUserDataFormComponent } from './app/input-user-data-form/input-user-data-form.component';
import { NotFoundComponent } from './app/not-found/not-found.component';
import { UsersTableForm } from './app/components/users-table/users-table-form.component';

import { UserService } from './app/services/userService';
import { MangorDialogComponent } from './app/components/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

const routes: Routes = [
  {
    path: '',
    component: UsersTableForm,
    pathMatch: 'full'
  },
  {
   path: "dialog",
   component: MangorDialogComponent
  },
  {
    path: 'users',
    component: InputUserDataFormComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
bootstrapApplication(AppComponent, {
  providers: [
    MatDialogModule,
    UserService,
    provideRouter(
      routes
    ),

    importProvidersFrom(HttpClientModule),
  ],
});
