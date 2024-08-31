import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service'; // Importar el nuevo servicio

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
    private loginService: LoginService // Usar el nuevo servicio
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

      this.loginService.loginUser(username, password).subscribe(
        (response) => {
          // Verificar la respuesta del servidor
          if (response && response.success) {
            if (this.isBrowser()) {
              localStorage.setItem('loggedIn', 'true');
              localStorage.setItem('loggedUser', response.user.user); // Cambia según el campo devuelto por tu API
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
        },
        (error) => {
          console.error('Error en la autenticación:', error);
          this.loginError = true;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al intentar iniciar sesión.',
          });
        }
      );
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
