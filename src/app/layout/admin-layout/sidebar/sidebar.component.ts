import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Menu } from '../../../core/models/menu.model';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
// ...existing code...
export class SidebarComponent {
  menus: Menu[] = [
    {

      
      icon: 'fas fa-tachometer-alt', 
      title: 'Dashboard',
               grupo: 'Dashboard',
      children: [
         { title: 'dashboaard', link: '/admin/dashboard' }
        
      ]
    },
    
    {
      icon: 'fas fa-columns',
      title: 'GESTION',
      grupo: 'g_mantenimiento',
      children: [
        { title: 'Productos', link: 'mantenimiento/producto' },
     
      ]
    },
    {
      icon: 'fas fa-users ',
      title: 'clientes',
      grupo: 'g_ventas',
      children: [
        { title: 'Lista de clientes', link: '/admin/clientes' },
       

      ]
    },
   

    {
      icon: 'fas fa-shopping-cart ',
      title: 'ventas',
      grupo: 'ventas',
      children: [
        { title: 'ordenes', link: '/admin/ventas' },
        { title: 'Envios', link: '/admin/enivioAdmin' },
      
      ]
    }
    ,
   

    {
  icon: 'fas fa-headset',
  title: 'Atención al Cliente',
  grupo: 'atencion-cliente',
  children: [
    { title: 'Consultas', link: '/admin/atencionClienteadmin' },
    { title: 'Reclamos', link: '/admin/reclamos' },
  ]
}

  ];
}
// ...existing code...