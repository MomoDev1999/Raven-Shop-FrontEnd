// RecuperarPasswordComponent.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css'],
})
export class RecuperarPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  enviarRecuperacion() {
    if (this.email) {
      // Lógica para enviar el correo de recuperación
      console.log('Correo de recuperación enviado a:', this.email);
      // Redirigir a la página de mensaje enviado
      this.router.navigate(['/mensaje-enviado']);
    } else {
      console.log('Por favor, ingrese un correo electrónico válido.');
    }
  }
}
