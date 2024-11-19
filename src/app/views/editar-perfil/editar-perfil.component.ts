import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent implements OnInit {
  username: string = '';
  phone: string = '';
  firstName: string = ''; // Nombre corregido para coincidir con el backend
  lastName: string = ''; // Corregido
  dateOfBirth: string = ''; // Corregido
  email: string = '';
  address: string = '';
  passwordActual: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  loggedUser: any = null;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    if (this.isBrowser()) {
      const loggedUsername = localStorage.getItem('loggedUser');
      if (loggedUsername) {
        this.loginService.getUsers().subscribe((response) => {
          const users = response.content; // Asegurar que accedemos a la lista de usuarios
          this.loggedUser = users.find(
            (user: any) => user.user === loggedUsername
          );
          if (this.loggedUser) {
            this.loadUserData();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo encontrar el usuario en la base de datos.',
            });
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo encontrar el usuario en localStorage.',
        });
      }
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  loadUserData() {
    if (this.loggedUser) {
      this.username = this.loggedUser.user;
      this.phone = this.loggedUser.phone;
      this.firstName = this.loggedUser.firstName;
      this.lastName = this.loggedUser.lastName;
      this.dateOfBirth = this.loggedUser.dateOfBirth;
      this.email = this.loggedUser.email;
      this.address = this.loggedUser.address;
    }
  }

  validarEditar(): boolean {
    if (!this.isFormValid()) {
      return false;
    }

    if (this.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return false;
    }

    this.passwordMismatch = false;
    this.updateUserProfile();
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
      !this.firstName ||
      !this.lastName ||
      !this.dateOfBirth ||
      !this.email ||
      !this.address ||
      !this.passwordActual ||
      !this.password ||
      !this.confirmPassword
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son requeridos.',
      });
      return false;
    }

    if (!this.isPhoneValid()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El número de teléfono debe tener 8 dígitos.',
      });
      return false;
    }

    if (!this.isEmailValid()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El correo electrónico no es válido.',
      });
      return false;
    }

    if (!this.isPasswordValid()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 6 caracteres.',
      });
      return false;
    }

    return true;
  }

  updateUserProfile() {
    const updatedUser = {
      user: this.username,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      address: this.address,
      password: this.password,
    };

    if (this.loggedUser) {
      const userId = this.loggedUser.id;
      this.loginService.updateUser(userId, updatedUser).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Perfil editado correctamente.',
          });
        },
        () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al editar el perfil.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo encontrar el ID del usuario para actualizar.',
      });
    }
  }
}
