import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private firebaseService: FirebaseService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Formulario enviado');
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      console.log('Formulario válido', username, password);

      this.firebaseService.getUsers().subscribe((users) => {
        const user = users.find(
          (u) => u.usuario === username && u.password === password
        );
        if (user) {
          if (this.isBrowser()) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('loggedUser', user.usuario);
            window.dispatchEvent(new Event('storage'));
          }
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Has iniciado sesión correctamente.',
          }).then(() => {
            this.router.navigate(['/index']);
          });
        } else {
          this.loginError = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos.',
          });
        }
      });
    } else {
      if (this.loginForm.controls['username'].invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo de usuario es obligatorio.',
        });
      }
      if (this.loginForm.controls['password'].invalid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El campo de contraseña es obligatorio.',
        });
      }
      this.loginError = true;
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
