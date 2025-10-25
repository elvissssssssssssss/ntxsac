import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
;
 import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComprobanteService } from '../../../user/payment/services/comprobante.service';
import { ComprobanteRequest, ComprobanteResponse } from '../../../user/payment/models/comprobante.model';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pago-exitoso',
   standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pago-exitoso.component.html',
  styleUrl: './pago-exitoso.component.css'
})


export class PagoExitosocomponent implements OnInit {
ventaId: number = 0;
datosFactura = {
    ruc: '',
    razonSocial: ''
  };
tipoComprobanteId: number = 1; // 1 = boleta, 2 = factura
tipoComprobante: 'boleta' | 'factura' = 'boleta';

  constructor(
    private comprobanteService: ComprobanteService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}





  
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ventaId = Number(params['ventaId']) || 0;
      console.log('VentaId recibido:', this.ventaId);
    });
  }

  volverAlInicio(): void {
    window.location.href = '/';
  }

emitirFactura(): void {
  if (!this.ventaId || this.ventaId <= 0) {
    alert('Venta inválida. No se puede emitir el comprobante.');
    return;
  }

  const tipoComprobanteId = this.tipoComprobante === 'boleta' ? 1 : 2;

  const payload: any = {
    ventaId: this.ventaId,
    tipoComprobante: tipoComprobanteId,
    numeroForzado: 0
  };

  if (tipoComprobanteId === 2) {
    if (!this.datosFactura.ruc || !this.datosFactura.razonSocial) {
      alert('Para facturas debe ingresar RUC y Razón Social');
      return;
    }
    payload.ruc = this.datosFactura.ruc;
    payload.razonSocial = this.datosFactura.razonSocial;
  }

  this.http.post<any>('https://pusher-backend-elvis.onrender.com/api/Comprobantes/emitir', payload)
    .subscribe({
      next: (res) => {
        console.log('✅ Comprobante emitido:', res);
        if (res?.enlace_pdf) window.open(res.enlace_pdf, '_blank');
      },
      error: (err) => {
        console.error('❌ Error al emitir el comprobante:', err);
        alert('Error al emitir el comprobante. Verifica los datos e intenta nuevamente.');
      }
    });
}

}