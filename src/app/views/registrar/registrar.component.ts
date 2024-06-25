import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private router: Router) {}

  onSubmit() {
    if (this.isFormValid()) {
      if (this.password !== this.confirmPassword) {
        this.passwordMismatch = true;
        return;
      }

      // Guardar en localStorage
      localStorage.setItem('loggedIn', 'true');
      window.dispatchEvent(new Event('storage'));
      // Redirigir a la página de inicio
      this.router.navigate(['/index']);

      // Limpiar el formulario
      this.resetForm();
      this.passwordMismatch = false;
    } else {
      this.passwordMismatch = false;
      this.showValidationErrors();
    }
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
      errorMessage += 'Teléfono es requerido y debe tener 8 dígitos.\n';
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
    if (!this.confirmPassword) {
      errorMessage += 'Confirmar contraseña es requerida.\n';
    }

    alert(errorMessage);
  }
}
