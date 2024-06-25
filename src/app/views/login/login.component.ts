import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Añadido FormsModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: boolean = false;

  users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    { username: 'user', password: 'password' },
  ];

  selectedUsername: string = '';
  selectedPassword: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Formulario enviado'); // Para depurar
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log('Formulario válido', username, password); // Para depurar

      const user = this.users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        localStorage.setItem('loggedIn', 'true');
        window.dispatchEvent(new Event('storage'));
        this.router.navigate(['/index']);
      } else {
        this.loginError = true;
        alert('Usuario o contraseña incorrectos.');
      }
    } else {
      if (this.loginForm.controls['username'].invalid) {
        alert('El campo de usuario es obligatorio.');
      }
      if (this.loginForm.controls['password'].invalid) {
        alert('El campo de contraseña es obligatorio.');
      }
      this.loginError = true;
    }
  }
}
