Vue.component('clouserConfig',
{
    template: 
`
<div>
<v-alert  :value="mostrarNotification"  :type="typeAlert" border="left" elevation="2"   style="">
{{TextNotification}}
</v-alert>
  <v-container>
  <v-form ref="form" v-model="insertar"  lazy-validation>
    <v-row>
      <v-col cols="12" md="6">
        <v-select  :items="processValue" :disabled="ProcessEnabled" required  v-model="value"  chips label="Process Name">
            
        </v-select>
            
      </v-col>

         <v-col cols="12" md="6"> 
         <v-combobox  v-model="currentDates" v-on:keydown="noAcceptKey" v-bind:multiple="DaysMultiple"  :items="DaysOfMonth" chips outlined clearable label="Days clousers"  prepend-icon="mdi-filter-variant">

         <template v-slot:selection="{ attrs, item, select, selected }">
           <v-chip v-bind="attrs" :input-value="selected"  close  @click="select"  @click:close="remove(item)">
             <strong>{{ item }}</strong>            
           </v-chip>
         </template>
        </v-combobox>
      
      </v-col>
    </v-row>

    <v-btn color="success" :loading="loading" @click="InsertConfig" elevation="2" rounded :disabled="!insertar">{{texto}} 
                <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
     </v-btn> 
     </v-form>

            <v-card class="mt-5">
            <v-card-title> 
            List of Clouser config
             <v-spacer></v-spacer>
              <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table dense  :items-per-page="15" class="elevation-1" :headers="headers" :items="DataDatesClouser" :search="search">
                
            <template v-slot:item.ID_process="{ item }">
                    {{ processName(item.ID_process) }}
                </template>
            <template v-slot:item.Active="{ item,index }">           
            <v-checkbox v-model="item.Active" input-value="item.Active" @click="updateActive(index)"  color="success"  hide-details></v-checkbox>
            </template>
                
    
                <template v-slot:item.action="{ item,index }">
                  <v-icon dark right medium  class="label-primary pointer edit" @click="editar_current(index)">
                    mdi-circle-edit-outline
                  </v-icon>                  
                  <v-icon dark right medium class="label-danger pointer delete" @click="eliminar_current(index,item.nombre)">
                      mdi-minus-circle
                  </v-icon>
                </template>
                Action
            </v-data-table>
        </v-card>
  
  </v-container>
  
  <!-- use the modal component, pass in the prop -->
  <modal v-if="showModal" :currentindex = "currentIndex" :currentname ="currentname" @eliminar_current="eliminar_current(currentIndex,'',true)" @close="showModal = false">
  </modal>
  <v-snackbar color='red'  v-model="valid" :multi-line="true"> {{ text_snack }}
             <template v-slot:action="{ attrs }">
                <v-btn color="white" outlined text v-bind="attrs" @click="valid = false">Close</v-btn>
            </template>
        </v-snackbar>
  </div>
</div>

`,
created: function()
{
  let counter = 1;
  while(counter < 32)
  {
    this.DaysOfMonth.push(counter);
    counter++;
  }
  this.getDatesClouser();
},
computed: 
{
    ...Vuex.mapState(['processValue','loading','DataDatesClouser','mostrarNotification','TextNotification','SuccessNotification']),
    typeAlert()
    {
     return store.state.SuccessNotification ? "success" : "error";
    }
},
data(){
    return{
      value:0,
      currentDates: [],
      DaysOfMonth: [],
      texto: "Add",
      insertar: true,
      search: "",
      headers: [ 
        { text: 'Process Name', value: 'ID_process' },
        { text: 'Day Close', value: 'day_clouser' },
        {text: 'Activate', value: 'Active'},
        { text: 'Action', value: 'action' }
        
      ],
      showModal: false,
      currentIndex: "",
      currentname: "",
      ProcessEnabled: false,
      DaysMultiple: true,
      valid: false,
      text_snack: "you should fill in all fields",
      CurrentActive: null
      
    }
},

methods: {
  ...Vuex.mapActions(['getDatesClouser','insertar_procesoCierre']),
  remove (item) {
    this.currentDates.splice(this.currentDates.indexOf(item), 1)
    this.currentDates = [...this.currentDates]
  },
  noAcceptKey(event){
    event.preventDefault();
  },
  processName(id)
  {
 
    var obj =  store.state.processValue.filter(x => x.value == id);
    
    if(obj.length > 0){
      return obj[0].text;
    }
  },
  limpiarValores: function(todo = false)
        {
            this.value = 0;  
            this.currentDates = [];
            this.ProcessEnabled = false;
            this.DaysMultiple = true;
            this.$refs.form.resetValidation()
            
        },
  InsertConfig(){
   
    if(this.texto == "Editar") 
    {
       var findProcess = store.state.DataDatesClouser[this.currentIndex];          
       findProcess.day_clouser = this.currentDates; 
       store.commit('actualizar_procesoCierre',findProcess);  // Actualizar en la BD
       
       this.limpiarValores();
       this.texto = "Crear"
      
    }else
    {
      if(this.currentDates.length < 1 || this.value == 0)
      {
        this.valid = true;
        return;
      }
      var objNew = 
      {
        ID: 0,
        ID_process: this.value,
        listday_clouser: this.currentDates
      }
      this.insertar_procesoCierre(objNew);
    }

  
  },
  updateActive(index)
  {
    var findProcess = store.state.DataDatesClouser[index];
    store.commit('actualizar_procesoCierre',findProcess);  // Actualizar en la BD    
  },
  eliminar_current: function (index,name,eliminar=false) 
        {
            
            if(eliminar == false){
                this.showModal = true;
                this.currentIndex = index;
                this.currentname = name;
            }
            else{
                
               
                let idProcess = store.state.DataDatesClouser[this.currentIndex].ID;                
                store.commit('Eliminar_procesoCierre',idProcess); // Eliminar en la bd  
                this.showModal = false;
                this.currentIndex = "";
                this.currentname = "";
            }
            
        },
        editar_current : function (index) 
        {    
        this.currentDates = [];
        var objeto = store.state.DataDatesClouser[index];
        this.value = objeto.ID_process;
        this.nombre = objeto.Nombre;
        this.currentDates.push(objeto.day_clouser);    
        this.currentIndex = index;
        this.ProcessEnabled = true;
        this.DaysMultiple = false;
        this.texto = "Editar"
        }

   
}

})