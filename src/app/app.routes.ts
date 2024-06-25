import { RouterModule, Routes } from '@angular/router';
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
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-password', component: RecuperarPasswordComponent },
  { path: 'mensaje-enviado', component: MensajeEnviadoComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'ver-producto/:id', component: VerProductoComponent },
  { path: 'buscar', component: BuscarComponent },
  { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent },
  { path: 'terminos-y-condiciones', component: TerminosYCondicionesComponent },
  { path: 'politica-privacidad', component: PoliticaPrivacidadComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'mis-compras', component: MisComprasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
