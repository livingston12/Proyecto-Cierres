Vue.component('logs',
{
    template:

    `
<div>
    <div v-if="!error">
    <v-row>
        <v-col > 
            <div id="chart">
                <apexchart  type="pie" width="600" :options="chartOptions" :series="getseries"></apexchart>
            </div>
        </v-col>
    </v-row>  

        <v-card >
            <v-card-title>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table dense :items-per-page="15" class="elevation-1" :headers="headers" :items="Logs" :search="search">
                <template v-slot:item.EstatusDelProceso="{ item }">
                    <v-chip small :color="getColor(item.EstatusDelProceso)" dark>
                    <v-avatar left>
                    <v-icon>{{ myIcon(item.EstatusDelProceso)}}</v-icon>
                  </v-avatar>                 
                        <label>{{ mystate(item.EstatusDelProceso) }}</label>
                    </v-chip>
                </template>
                <template v-slot:item.FechaEjecucion="{ item }">                                   
                        {{ dateCoverter(item.FechaEjecucion) }}
                </template>
                <template v-slot:item.FechaDesde="{ item }">                                   
                        {{ dateCoverter(item.FechaDesde) }}
                </template>
                <template v-slot:item.FechaHasta="{ item }">                                   
                        {{ dateCoverter(item.FechaHasta) }}
                </template>

            </v-data-table>
        </v-card>
        
    </div>
    <error v-else></error>
</div>
    `,
    data () {
        return {
          search: '',         
          headers: [          
            { text: 'Logs ID', align: 'start',  value: 'LogsID' },            
            { text: 'Proceso Nombre', value: 'ProcesoNombre' },
            { text: 'Fecha Ejecucion', value: 'FechaEjecucion' },
            { text: 'Fecha Desde', value: 'FechaDesde' },
            { text: 'Fecha Hasta', value: 'FechaHasta' },
            { text: 'Estatus Del Proceso', value: 'EstatusDelProceso' }
          ],
          
          iconEstatus:"",
                   
          series: [30],
             chartOptions: {
            chart: {
              width: 380,
              type: 'pie',
            },
            colors: ['#4caf50', '#ff9800', '#E65100', '#B71C1C'],
            labels: ['Total completed','Total no completed','Total processing','Total errors'] ,
            
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          }
           
        }
    },   
  
    
computed: 
{
  ...Vuex.mapState(['Logs','error','urlAPi','months']),
  getseries(){
      return store.state.series;
  }
  
},

methods:{   
    ...Vuex.mapActions(['getLogs']),
    getColor (EstatusDelProceso) {
        //console.log(EstatusDelProceso);
       return EstatusDelProceso == 1  ? "green" : "#E65100";
      },
      mystate(EstatusDelProceso)
      {
        return EstatusDelProceso == 1 ? "Completed" : "Procesing";
      },
    myIcon(EstatusDelProceso)
    {
        return EstatusDelProceso == 1 ? "mdi-checkbox-marked-circle" : " mdi-wrench";
    },
    dateCoverter(strfecha)
    {
        var fechaSplit = strfecha.split('-');
        var monthInt = parseInt(fechaSplit[1]) - 1;
        var year = fechaSplit[0];
        var month = this.months[monthInt];
        var dia = fechaSplit[2].substring(0,2);  
        return dia + "-" + month + "-" + year;
    },         

      updateChart(serie) {      
        
        store.state.series = serie;
        
    } 
},

created: function () 
{
    
    //this.getPie();  
    this.getLogs();   
},
updated: function()
{   
    //this.updateChart( this.series);

},
components: {
    apexchart:  VueApexCharts 
  }



})