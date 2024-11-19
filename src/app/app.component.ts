import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { IndexComponent } from './views/index/index.component';
import { RegistrarComponent } from './views/registrar/registrar.component';
import { LoginComponent } from './views/login/login.component';
import { RecuperarPasswordComponent } from './views/recuperar-password/recuperar-password.component';
import { MensajeEnviadoComponent } from './views/mensaje-enviado/mensaje-enviado.component';
import { EditarPerfilComponent } from './views/editar-perfil/editar-perfil.component';
import { VerProductoComponent } from './views/ver-producto/ver-producto.component';
import { BuscarComponent } from './views/buscar/buscar.component';
import { PreguntasFrecuentesComponent } from './views/preguntas-frecuentes/preguntas-frecuentes.component';
import { TerminosYCondicionesComponent } from './views/terminos-y-condiciones/terminos-y-condiciones.component';
import { PoliticaPrivacidadComponent } from './views/politica-privacidad/politica-privacidad.component';
import { CarritoComponent } from './views/carrito/carrito.component';
import { MisComprasComponent } from './views/mis-compras/mis-compras.component';
import { ProductService } from './services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormularioInicioSesionComponent } from './views/formulario-inicio-sesion/formulario-inicio-sesion.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SweetAlert2Module,
    ReactiveFormsModule,
    HttpClientModule,
    RouterOutlet,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    IndexComponent,
    RegistrarComponent,
    LoginComponent,
    RecuperarPasswordComponent,
    MensajeEnviadoComponent,
    EditarPerfilComponent,
    VerProductoComponent,
    BuscarComponent,
    PreguntasFrecuentesComponent,
    TerminosYCondicionesComponent,
    PoliticaPrivacidadComponent,
    CarritoComponent,
    MisComprasComponent,
    FormularioInicioSesionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // No es necesario cargar productos aquí porque se cargan en el servicio
  }
}
