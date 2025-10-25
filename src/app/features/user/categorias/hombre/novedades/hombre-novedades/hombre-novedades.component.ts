// hombre-novedades.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoServices } from '../../../../../../services/producto.services';
import { Product } from '../../../../../../../app/core/models/product.model';

import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-mujer-novedades',
    standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './hombre-novedades.component.html',
  styleUrl: './hombre-novedades.component.css'
})
export class HombreNovedadescomponent implements OnInit {
  productos: Product[] = [];
  productosFiltrados: Product[] = [];
  
  // Datos para filtros
  marcas: string[] = [];
  colores: string[] = [];
  tallas: string[] = [];
  
  // Filtros seleccionados
  marcasSeleccionadas: string[] = [];
  coloresSeleccionados: string[] = [];
  tallasSeleccionadas: string[] = [];
  
  menuVisible = false;

  constructor(private productoService: ProductoServices) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getProductosPorCategoria('hombre_novedades').subscribe({ //aqui los 3 tienen que estar igual en create ts y edit ts
      next: res => {
        console.log('Productos cargados:', res.data); // Para debugging
        this.productos = res.data;
        this.productosFiltrados = [...this.productos];
        this.cargarFiltros();
      },
      error: err => {
        console.error('Error al cargar productos:', err);
        // Mostrar mensaje de error al usuario
      }
    });
  }

  cargarFiltros(): void {
    // Extraer valores únicos para los filtros
    this.marcas = [...new Set(this.productos.map(p => p.marca).filter(m => m))];
    this.colores = [...new Set(this.productos.map(p => p.color).filter(c => c))];
    this.tallas = [...new Set(this.productos.map(p => p.talla).filter(t => t))];
  }

  onFiltroChange(tipo: string, valor: string, event: any): void {
    const isChecked = event.target.checked;
    
    switch(tipo) {
      case 'marca':
        if (isChecked) {
          this.marcasSeleccionadas.push(valor);
        } else {
          this.marcasSeleccionadas = this.marcasSeleccionadas.filter(m => m !== valor);
        }
        break;
      case 'color':
        if (isChecked) {
          this.coloresSeleccionados.push(valor);
        } else {
          this.coloresSeleccionados = this.coloresSeleccionados.filter(c => c !== valor);
        }
        break;
      case 'talla':
        if (isChecked) {
          this.tallasSeleccionadas.push(valor);
        } else {
          this.tallasSeleccionadas = this.tallasSeleccionadas.filter(t => t !== valor);
        }
        break;
    }
    
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(producto => {
      const cumpleMarca = this.marcasSeleccionadas.length === 0 || 
                         this.marcasSeleccionadas.includes(producto.marca);
      const cumpleColor = this.coloresSeleccionados.length === 0 || 
                         this.coloresSeleccionados.includes(producto.color);
      const cumpleTalla = this.tallasSeleccionadas.length === 0 || 
                         this.tallasSeleccionadas.includes(producto.talla);
      
      return cumpleMarca && cumpleColor && cumpleTalla;
    });
  }

  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }

  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath || imagePath.trim() === '') {
      return '/assets/images/no-image.png';
    }
   
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
     
    // Normalizar separadores y quitar 'wwwroot\' si existe
    const cleanedPath = imagePath
      .replace(/^wwwroot[\\/]+/, '') // quita wwwroot/ o wwwroot\
      .replace(/\\/g, '/'); // reemplaza \ por /
   
    return `http://localhost:5295/${cleanedPath}`;
  }

calcularDescuento(precioAntes: number, precioAhora: number): number {
  const descuento = ((precioAntes - precioAhora) / precioAntes) * 100;
  return Math.round(descuento); // o Math.floor/ceil según prefieras
}


  // Método para verificar si hay productos
  hayProductos(): boolean {
    return this.productosFiltrados.length > 0;
  }

  // Método para obtener el mensaje cuando no hay productos
  getMensajeNoProductos(): string {
    if (this.productos.length === 0) {
      return 'No hay productos disponibles en esta categoría.';
    } else if (this.productosFiltrados.length === 0) {
      return 'No se encontraron productos con los filtros seleccionados.';
    }
    return '';
  }
}