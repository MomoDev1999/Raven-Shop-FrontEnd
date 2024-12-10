// MensajeEnviadoComponent.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mensaje-enviado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensaje-enviado.component.html',
  styleUrls: ['./mensaje-enviado.component.css'],
})
export class MensajeEnviadoComponent {
  codigo: string = '';

  constructor(private router: Router) {}

  validarCodigo() {
    const codigoValido = '12345'; // Código de validación ficticio

    if (this.codigo === codigoValido) {
      console.log('Código validado correctamente');
    } else {
      console.log('Código incorrecto. Por favor, inténtelo nuevamente.');
    }
  }
}
