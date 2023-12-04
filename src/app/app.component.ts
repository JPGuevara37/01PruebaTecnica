// Importa los módulos y clases necesarios
import { Component, OnInit } from '@angular/core';
import { FacturacionService } from './services/facturacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  factura: string = '';
  fecha: string = '';
  total: number = 0;
  detalles: any[] = [];
  productos: any[] = [];
  mostrarModalFactura: boolean = false;
  mostrarModalLinea: boolean = false;
  nuevoDetalle: any = { producto: '', cantidad: 0 };
  nuevaFacturaInfo: any = { numero: '', fecha: new Date() };

  constructor(private facturacionService: FacturacionService) {}

  ngOnInit() {
    //Necesario
  }

  formatearFecha(fecha: Date): string {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return fecha.toLocaleDateString('en-US');
}

  // Métodos que llaman a los servicios y manejan las respuestas
  obtenerFactura(numeroFactura: number, linea?: number) {
    this.facturacionService.obtenerFactura(numeroFactura, linea).subscribe((data: any) => {
      console.log('Respuesta Obtener Factura:', data);
    });
  }

  buscarProductos(producto: string) {
    this.facturacionService.buscarProductos(producto).subscribe(
      (productos: string[]) => {
        this.productos = productos;
      },
      (error) => {
        console.error('Error al buscar productos:', error);
      }
    );
  }

  agregarDetalle(numeroFactura: number, codigoArticulo: string, cantidad: number) {
    
    this.facturacionService.agregarDetalle(parseInt(this.factura), codigoArticulo, cantidad).subscribe((data: any) => {
      const prod = this.productos.find((p) => p.codigoArticulo === codigoArticulo);
      this.detalles.push({
        sku: prod.codigoArticulo,
        producto: prod.descripcion,
        cantidad,
        precio: prod.precio,
        total: prod.precio * cantidad 
      });

      this.total += prod.precio * cantidad ;

      // Reiniciar el nuevo detalle
      this.nuevoDetalle = { producto: '', cantidad: 0 };

      // Cerrar la ventana modal
      this.mostrarModalLinea = false;
    });
  }

  borrarDetalle(detalle:any, index:number) {
      this.facturacionService.obtenerFactura(parseInt(this.factura)).subscribe((data: any) => {
      const detalles =  data.DETALLES;
      const dt = detalles.find( (ds:any) => ds.CODIGO_ARTICULO === detalle.sku);

      this.facturacionService.borrarDetalle(parseInt(this.factura), dt.LINEA).subscribe((data: any) => {
      console.log('Respuesta Borrar Detalle:', data);
      this.total -= dt.PRECIO * dt.CANTIDAD;
      this.detalles.splice(index, 1);
        
      });
    });
  }

  crearFactura(numeroFactura: number, fecha: string) {
    this.facturacionService.crearFactura(numeroFactura, fecha).subscribe((data: any) => {
      console.log('Respuesta Crear Factura:', data);
    });
  }

  agregarFactura() {

      const fechaSeleccionada = this.nuevaFacturaInfo.fecha;

        this.facturacionService.crearFactura(this.nuevaFacturaInfo.numero, this.nuevaFacturaInfo.fecha).subscribe({
      next: (data: any) => {
        console.log('Respuesta Crear Factura:', data);
        
        this.facturacionService.obtenerFactura(this.nuevaFacturaInfo.numero).subscribe({
      next: (data: any) => {
        console.log('Respuesta Obtener Factura:', data);
        this.total = data.FACTURA.TOTAL;
        this.factura = data.FACTURA.NUMERO_FACTURA;
        this.fecha = fechaSeleccionada;
        this.mostrarModalFactura = false;

      },
      error: (error) => {
        console.error('Error al crear factura:', error);
      }
    });
        
      },
      error: (error) => {
        console.error('Error al crear factura:', error);
      }
    });
  }

  calcularTotal() {
    this.total = this.detalles.reduce((sum, detalle) => sum + detalle.total, 0);
  }

  nuevaFactura() {
    this.mostrarModalFactura = true;
  }

  nuevaLinea() {console.log("js;gfksd;0");
    this.mostrarModalLinea = true;
  }

  abrirModal(){
    if(this.productos.length === 0){
      this.facturacionService.buscarProductos("").subscribe({
      next: (data: any) => {
        // Lógica adicional si es necesario
        console.log(data)
        this.productos = data.PRODUCTOS.map( (prod:any) => {
          return { "codigoArticulo": prod.CODIGO_ARTICULO, "descripcion": prod.DESCRIPCION, "precio": prod.PRECIO};
        });
        console.log(this.productos);
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
      }
    })
    }
    
    this.mostrarModalLinea = true;
  }

}
