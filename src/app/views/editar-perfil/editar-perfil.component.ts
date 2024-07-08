import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import Swal from 'sweetalert2';

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

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    if (this.isBrowser()) {
      const loggedUsername = localStorage.getItem('loggedUser');
      if (loggedUsername) {
        this.firebaseService.getUsers().subscribe((users) => {
          this.loggedUser = users.find(
            (user) => user.usuario === loggedUsername
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
      this.username = this.loggedUser.usuario;
      this.phone = this.loggedUser.telefono;
      this.firstname = this.loggedUser.nombre;
      this.lastname = this.loggedUser.apellido;
      this.birthdate = this.loggedUser.fecha_nacimiento;
      this.email = this.loggedUser.correo;
      this.address = this.loggedUser.direccion;
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
      usuario: this.username,
      telefono: this.phone,
      nombre: this.firstname,
      apellido: this.lastname,
      fecha_nacimiento: this.birthdate,
      correo: this.email,
      direccion: this.address,
      password: this.password,
    };

    if (this.loggedUser) {
      const userId = this.loggedUser.id; // Extraer el ID del usuario
      this.firebaseService.updateUser(userId, updatedUser).subscribe(
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
