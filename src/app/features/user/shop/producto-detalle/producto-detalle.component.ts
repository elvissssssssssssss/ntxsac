import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoServices } from '../../../../services/producto.services';

import { Product } from '../../../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../user/auth/services/auth.service';
import { CartService } from '../../../user/cart/services/cart.service';
import { CartItem } from '../../cart/models/cart.model';

@Component({
  
  selector: 'app-producto-detalle',
   standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './producto-detalle.component.html',
  styleUrl: './producto-detalle.component.css'
})
export class ProductoDetalleComponent  implements OnInit {
  producto!: Product;
  tallaSeleccionada: string = '';
  cantidadSeleccionada: number = 1;
  
  
  cantidadesDisponibles: number[] = [];

constructor(
  private route: ActivatedRoute,
  private productoService: ProductoServices,
  private cartService: CartService,
  private authService: AuthService, 
    private router: Router // 👈 Agregado aquí
) {}


 ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.productoService.getProductoPorId(+id).subscribe({
      next: (producto) => {
        this.producto = producto;
        const maxCantidad = Math.min(producto.stock, 2);
        this.cantidadesDisponibles = Array.from({ length: maxCantidad }, (_, i) => i + 1);
      },
      error: err => console.error('Error al obtener producto:', err)
    });
  }
}


  getImageUrl(path: string): string {
    return path.includes('wwwroot')
      ? 'http://localhost:5295/' + path.replace(/^wwwroot[\\/]+/, '').replace(/\\/g, '/')
      : 'http://localhost:5295/' + path;
  }

 agregarAlCarrito(): void {
  if (!this.authService.isLoggedIn()) {
  alert('Debes iniciar sesión para agregar productos al carrito.');
  this.router.navigate(['/auth/login']); // 🔁 redirigir al login
  return;
}


  const user = this.authService.getUser();
  if (!user || !user.id) {
    alert('No se pudo obtener el usuario.');
    return;
  }

  if (!this.tallaSeleccionada) {
    alert('Por favor, selecciona una talla.');
    return;
  }

  const item: CartItem = {
    userId: user.id,
    productId: this.producto.id,
    talla: this.tallaSeleccionada,
    quantity: this.cantidadSeleccionada
  };

 this.cartService.agregarAlCarrito(item).subscribe({
  next: () => {
    
    this.router.navigate(['/carrito']); // 🔁 Redirige al carrito
  },

    error: err => {
      console.error('Error al agregar al carrito:', err);
      alert('Hubo un error al agregar al carrito.');
    }
  });
}

}
