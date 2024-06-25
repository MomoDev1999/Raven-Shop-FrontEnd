import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent {
  username: string = 'sofiaOz';
  phone: string = '12345678';
  firstname: string = 'Sofia';
  lastname: string = 'Olave';
  birthdate: string = '2001-10-13';
  email: string = 'sofiaOz@example.com';
  address: string = 'Calle Principal 123';
  passwordActual: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  validarEditar(): boolean {
    if (!this.isFormValid()) {
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      alert('Las contraseñas no coinciden.');
      return false;
    }

    this.passwordMismatch = false;
    alert('Perfil editado correctamente.');
    return true;
  }

  isPhoneValid(): boolean {
    const phoneRegex = /^[0-9]{8}$/;
    return phoneRegex.test(this.phone);
  }

  isEmailValid(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(this.email);
  }

  isPasswordValid(): boolean {
    return this.password.length >= 6;
  }

  isFormValid(): boolean {
    if (
      !this.username ||
      !this.phone ||
      !this.firstname ||
      !this.lastname ||
      !this.birthdate ||
      !this.email ||
      !this.address ||
      !this.passwordActual ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Todos los campos son requeridos.');
      return false;
    }

    if (!this.isPhoneValid()) {
      alert('El número de teléfono debe tener 8 dígitos.');
      return false;
    }

    if (!this.isEmailValid()) {
      alert('El correo electrónico no es válido.');
      return false;
    }

    if (!this.isPasswordValid()) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    return true;
  }
}
