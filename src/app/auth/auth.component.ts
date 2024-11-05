import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IUser, SupabaseService} from '../services/supabase.service';
import {Router} from "@angular/router";


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  authForm: FormGroup;
  errorMessage: string = '';
  loading: boolean;
  user: IUser;

  constructor(private router: Router, private fb: FormBuilder, private supabaseService: SupabaseService) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.loading = false;
    this.user = {} as IUser;
  }


  public onSubmit(): void {
    this.loading = true;
    const { email, password } = this.authForm.value;
    this.supabaseService.signIn(email, password)
      .then((isAuthenticated: boolean) => {
        this.loading = false;
        if (isAuthenticated) {
          this.router.navigate(['/game']);  // Редірект лише при успішній авторизації
        } else {
          alert('incorrect data')
        }
      })
      .catch((error) => {
        this.loading = false;
        console.error('Error during sign-in:', error);
      });

  }

}
