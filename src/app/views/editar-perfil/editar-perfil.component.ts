import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service'; // Importar el nuevo servicio

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
  firstname: string = '';
  lastname: string = '';
  birthdate: string = '';
  email: string = '';
  address: string = '';
  passwordActual: string = '';
  password: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;
  loggedUser: any = null;

  constructor(private loginService: LoginService) {} // Usar el nuevo servicio

  ngOnInit() {
    if (this.isBrowser()) {
      const loggedUsername = localStorage.getItem('loggedUser');
      if (loggedUsername) {
        this.loginService.getUsers().subscribe((users) => {
          this.loggedUser = users.find(
            (user: any) => user.user === loggedUsername
          );
          console.log(this.loggedUser); // Verificar los datos en la consola
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
      this.username = this.loggedUser.user; // Cambiado a 'user'
      this.phone = this.loggedUser.phone; // Cambiado a 'phone'
      this.firstname = this.loggedUser.name; // Cambiado a 'name'
      this.lastname = this.loggedUser.lastname; // Añadido el campo 'lastname'
      this.birthdate = this.loggedUser.birthdate; // Cambiado a 'birthdate'
      this.email = this.loggedUser.email; // Cambiado a 'email'
      this.address = this.loggedUser.address; // Cambiado a 'address'
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
      !this.firstname ||
      !this.lastname ||
      !this.birthdate ||
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
      name: this.firstname,
      lastname: this.lastname,
      birthdate: this.birthdate,
      email: this.email,
      address: this.address,
      password: this.password,
    };

    if (this.loggedUser) {
      const userId = this.loggedUser.id; // Extraer el ID del usuario
      this.loginService.updateUser(userId, updatedUser).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Perfil editado correctamente.',
          });
        },
        (error) => {
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
