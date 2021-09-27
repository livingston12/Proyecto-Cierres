Vue.component('clousersSet',
{
    template:
    `
    <div> 
        <div v-if="!error">

        <v-alert :value="mostrarNotification" dismissible close-text="Close Alert"  :type="typeAlert" border="left" elevation="2"   style="">
            {{TextNotification}}  
        </v-alert>
        <v-form  style='margin-bottom: -40px;'>

        <v-container>
          <v-row>
            <v-col cols="12" md="8">
            <v-select  :items="processValue" required  v-model="value"  chips label="Process Name" multiple>
                <template v-slot:selection="{ item, index }">
                    <v-chip v-if="index === 0">
                        <span>{{ item.text }}</span>
                    </v-chip>
                    <span v-if="index === 1" class="grey--text caption">
                        (+{{ value.length - 1 }} others)
                     </span>
                </template>
            </v-select>
            
            </v-col>
   
            <v-col cols="12" md="4">
            
            <v-menu ref="menu" v-model="menu" :close-on-content-click="false" :return-value.sync="date"
             transition="scale-transition" offset-y  min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field  v-model="date" label="Execution date" class='pt-5' prepend-icon="mdi-calendar" readonly v-bind="attrs"
                v-on="on"></v-text-field>
            </template>
            <v-date-picker medium v-model="date" class='mt-10' no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn> 
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
            </v-col>
            <v-col cols="12" md="4"></v-col>
            <v-col cols="12" md="4">
            <p><h3 class='text text-center pr-12'> date from date to </h3>
            (click in the firt date then click the sencond)</p>
            <v-date-picker v-model="dates" scrollable range>           
            <v-btn color="success" id="btn-addClosuser" @click="AddClouser"  :loading="loading" fab dark small absolute top right>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
            
           
            </v-date-picker>
           
            </v-col>
          </v-row>
        </v-container>       
      </v-form>
        
        <v-card >
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table dense  :items-per-page="15" class="elevation-1" :headers="headers" :items="logFiltered" :search="search">
            
        <template v-slot:item.ProcesoNombre="{ item }">
                {{ strSub(item.ProcesoNombre) }}
            </template>

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
        <v-snackbar color='red'  v-model="valid" :multi-line="true"> {{ text_snack }}
             <template v-slot:action="{ attrs }">
                <v-btn color="white" outlined text v-bind="attrs" @click="valid = false">Close</v-btn>
            </template>
        </v-snackbar>
    
    </div>
    `,
computed: 
{
    ...Vuex.mapState(['error','Logs','months','processValue','loading','mostrarNotification','TextNotification','SuccessNotification',]),
    logFiltered()
    {
        return this.Logs.filter(x=>x.EstatusDelProceso == 0);
    },
    getProcesos(){
        return this.processValue;
    },
    typeAlert()
    {
     return store.state.SuccessNotification ? "success" : "error";
    }
},
data(){
    return {
        search: '',
        headers: [          
            { text: 'Process Name', align: 'start',  value: 'ProcesoNombre' }, 
            { text: 'Execution date', value: 'FechaEjecucion' },
            { text: 'Date From', value: 'FechaDesde' },
            { text: 'Date To', value: 'FechaHasta' },
            { text: 'Estatus Del Proceso', value: 'EstatusDelProceso' }
          ],
          value:[],
          Myprocesos:[] ,
          valid: false,
          dates: [],          
          text_snack: 'you should fill in all fields',
          date: new Date().toISOString().substr(0, 10),
          menu: false,

    }
    
},
methods: {
    ...Vuex.mapActions(['getLogs','InsertLogs']),
    ...Vuex.mapMutations(['generateMensajeNotification']),
    getColor (EstatusDelProceso) {
        //console.log(EstatusDelProceso);
       return EstatusDelProceso == 1  ? "green" : "orange";
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

    strSub(name){
        return name.substr(0,39);
    },
 

    AddClouser()
    {  
      store.state.mostrarNotification = false;  
     if(this.value.length ==0 || this.dates.length ==0)
     {
        this.valid = true;       
     }
     else{ 
        store.state.loading = true;
         this.InsertLogs({processId:this.value,
                           dates_to_From: this.dates,
                           dateExecute: this.date
                         });
         this.value = [];
         this.dates = [];
         this.date = new Date().toISOString().substr(0, 10);
                        
        }        
    }    
},
mounted: function () 
{    
    this.getLogs();
    store.state.mostrarNotification = false; 
}

});