import { Component, OnInit } from '@angular/core';
import { MisComprasService, Compra } from '../../services/mis-compras.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-compras.component.html',
  styleUrls: ['./mis-compras.component.css'],
})
export class MisComprasComponent implements OnInit {
  compras: Compra[] = [];

  constructor(private misComprasService: MisComprasService) {}

  ngOnInit(): void {
    const personaId = localStorage.getItem('loggedUserId');
    if (!personaId) {
      Swal.fire({
        icon: 'warning',
        title: 'No estás logueado',
        text: 'Inicia sesión para ver tus compras.',
      });
      return;
    }

    this.misComprasService.getMisCompras(Number(personaId)).subscribe(
      (data) => {
        this.compras = data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al cargar tus compras.',
        });
      }
    );
  }
}
