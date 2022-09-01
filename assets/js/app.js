const PRECIO_PAN = 2200
const PRECIO_CARBON = 2800

new Mutable({
  el: '#app',
    data () {
      return {
        cantHombres: 0,
        cantMujeres: 0,
        cantNinos: 0,
        presupuestoNombre: '',
        presupuestoSeleccionado: {
          name: '',
          type: '',
          food: '',
          alternative: '',
          embutido: null,
          precioCarne: null,
          precioEmbutido: null
        },
        presupuestos: [
          {
            name: 'Poco',
            type: 'Sólo choripán',
            food: 'chorizos',
            alternative: 'Salchichas.',
            embutido: null,
            precioCarne: 0,
            precioEmbutido: 4100
          },
          {
            name: 'Medio',
            type: 'Sobrecostilla y choripán',
            food: 'Sobrecostilla',
            alternative: 'Pulpa de cerdo, Abastero, Punta picana y Asado carnicero',
            embutido: 'chorizos',
            precioCarne: 8200,
            precioEmbutido: 4100
          },
          {
            name: 'Harto',
            type: 'Lomo vetado y buena longaniza',
            food: 'Lomo vetado',
            alternative: 'Lomo liso, Punta de ganso y Tapa barriga',
            embutido: 'longaniza',
            precioCarne: 12500,
            precioEmbutido: 5900
          }
        ],
        debeMostrarResultados: false,
      }
    },
    computed: {
      comensales: {
        get() {
          return this.callMethod('getComensales', [])
        }
      },
      totalInvitados: {
        get() {
          return this.get('comensales').ninos + this.get('comensales').mujeres  + this.get('comensales').hombres
        }
      },
      cantidadCarne: {
        get() {
          return this.callMethod('round', [this.get('comensales').ninos * 0.2 + this.get('comensales').mujeres * 0.25 + this.get('comensales').hombres * 0.35])
        }
      },
      cantidadEmbutido: {
        get() {
          return this.callMethod('round', [this.get('comensales').ninos * 0.05 + this.get('comensales').mujeres * 0.05 + this.get('comensales').hombres * 0.1])
        }
      },
      cantidadPan: {
        get() {
          return this.callMethod('round', [(this.get('comensales').ninos * 1 + this.get('comensales').mujeres * 1 + this.get('comensales').hombres * 2) / 2])
        }
      },
      cantidadCarbon: {
        get() {
          return this.callMethod('round', [(this.get('cantidadCarne') + this.get('cantidadEmbutido')) * 3 / 5])
        }
      },
      cantidadAdultos: {
        get() {
          return this.callMethod('round', [this.get('comensales').mujeres + this.get('comensales').hombres])
        }
      },
      precioTotal: {
        get() {
          const pan = this.get('cantidadPan') / 10 * PRECIO_PAN
          const carbon =  this.get('cantidadCarbon') * PRECIO_CARBON 
          const carne = this.get('cantidadCarne') * this.get('presupuestoSeleccionado').precioCarne
          const embutido = this.get('cantidadEmbutido') * this.get('presupuestoSeleccionado').precioEmbutido

          return this.callMethod('round', [carne + embutido + carbon + pan])
        }
      },
      precioCadaUno: {
        get() {
          return this.callMethod('round', [this.get('precioTotal') / this.get('cantidadAdultos')])
        }
      },
    },
    methods: {
      getPresupuestoSeleccionado() {
        const presupuesto = this.get('presupuestos').find((e) => e.name === this.get('presupuestoNombre'))
        this.set('presupuestoSeleccionado', presupuesto)
        this.get('presupuestoSeleccionado').name && this.get('precioTotal') > 0 ? this.set('debeMostrarResultados', true) : this.set('debeMostrarResultados', false)
      },
      round(value) {
        if (!value) {
          return 0
        }
        return Math.round(value * 100) / 100
        // return parseInt(value).toLocaleString('es-ES')
      },
      getComensales() {
        return {
          ninos: this.callMethod('getNumeroAntiTroll', [this.get('cantNinos')]),
          mujeres: this.callMethod('getNumeroAntiTroll', [this.get('cantMujeres')]),
          hombres: this.callMethod('getNumeroAntiTroll', [this.get('cantHombres')])
        }        
      },
      getNumeroAntiTroll(prop) {
        let num

        if (isNaN(prop) || !(typeof prop === 'number' && prop % 1 === 0)) {
          num = 0
        }
        num = prop && prop > 0 && prop <= 999999 ? parseInt(prop) : 0
        return isNaN(num) ? 0 : num
      },
      monetyze(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },
    }
})
