import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service'; // Importar el nuevo servicio

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'],
})
export class RegistrarComponent {
  username: string = '';
  phone: string = '';
  firstname: string = '';
  lastname: string = '';
  birthdate: string = '';
  email: string = '';
  address: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  userExistsError: string = '';

  acceptedTerms = false;
  acceptedPromotions = false;

  constructor(
    private router: Router,
    private loginService: LoginService // Usar el nuevo servicio
  ) {}

  onSubmit() {
    if (this.isFormValid()) {
      if (this.password !== this.confirmPassword) {
        this.passwordMismatch = true;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Las contraseñas no coinciden.',
        });
        return;
      }

      const newUser = {
        user: this.username, // Cambiado a 'user'
        phone: this.phone, // Cambiado a 'phone'
        name: this.firstname, // Cambiado a 'name'
        lastname: this.lastname, // Cambiado a 'lastname'
        birthdate: this.birthdate, // Cambiado a 'birthdate'
        email: this.email, // Cambiado a 'email'
        address: this.address, // Cambiado a 'address'
        password: this.password,
      };

      this.loginService.userExists(this.email, this.username).subscribe(
        (response) => {
          if (response.exists) {
            // Verificar si `exists` es true
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El usuario o el correo electrónico ya están registrados.',
            });
          } else {
            this.loginService.addUser(newUser).subscribe(
              (response) => {
                console.log('Usuario agregado con éxito', response);

                // Guardar en localStorage si está en el navegador
                if (this.isBrowser()) {
                  localStorage.setItem('loggedIn', 'true');
                  localStorage.setItem('loggedUser', newUser.user);
                  window.dispatchEvent(new Event('storage'));
                }

                // Redirigir a la página de inicio
                this.router.navigate(['/index']);

                // Limpiar el formulario
                this.resetForm();
                this.passwordMismatch = false;
                this.userExistsError = '';
                Swal.fire({
                  icon: 'success',
                  title: 'Éxito',
                  text: 'Usuario registrado con éxito.',
                });
              },
              (error) => {
                console.error('Error al agregar usuario', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'Ocurrió un error al registrar el usuario.',
                });
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar usuario', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al verificar el usuario.',
          });
        }
      );
    } else {
      this.passwordMismatch = false;
      this.showValidationErrors();
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  isFormValid(): boolean {
    return (
      this.username.length >= 3 &&
      this.isPhoneValid(this.phone) &&
      this.firstname.length > 0 &&
      this.lastname.length > 0 &&
      this.birthdate.length > 0 &&
      this.isEmailValid(this.email) &&
      this.address.length > 0 &&
      this.password.length >= 6
    );
  }

  isPhoneValid(phone: string): boolean {
    return /^[0-9]{8}$/.test(phone);
  }

  isEmailValid(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
  }

  resetForm() {
    this.username = '';
    this.phone = '';
    this.firstname = '';
    this.lastname = '';
    this.birthdate = '';
    this.email = '';
    this.address = '';
    this.password = '';
    this.confirmPassword = '';
  }

  showValidationErrors() {
    let errorMessage = 'Por favor corrija los siguientes errores:\n';

    if (this.username.length < 3) {
      errorMessage +=
        'Usuario es requerido y debe tener al menos 3 caracteres.\n';
    }
    if (!this.isPhoneValid(this.phone)) {
      errorMessage +=
        'Teléfono es requerido y debe tener exactamente 8 dígitos.\n';
    }
    if (!this.firstname) {
      errorMessage += 'Nombre es requerido.\n';
    }
    if (!this.lastname) {
      errorMessage += 'Apellido es requerido.\n';
    }
    if (!this.birthdate) {
      errorMessage += 'Fecha de Nacimiento es requerida.\n';
    }
    if (!this.isEmailValid(this.email)) {
      errorMessage += 'Correo electrónico es requerido y debe ser válido.\n';
    }
    if (!this.address) {
      errorMessage += 'Dirección es requerida.\n';
    }
    if (this.password.length < 6) {
      errorMessage +=
        'Contraseña es requerida y debe tener al menos 6 caracteres.\n';
    }
    if (this.password !== this.confirmPassword) {
      errorMessage +=
        'Confirmar contraseña debe coincidir con la contraseña.\n';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
    });
  }
}
