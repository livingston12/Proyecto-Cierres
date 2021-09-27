Vue.component('procesos',
{
    template: 
    `
    <div v-if = "!error">
  

  <v-alert  :value="mostrarNotification" :type="typeAlert" border="left" elevation="2"   style="">
    {{TextNotification}}
  </v-alert>

        <div>
            <v-form ref="form" v-model="insertar"  lazy-validation >
            <v-row>


                <v-col cols="4" sm="4">
                    <v-select  :items="plans"  :rules="[v => !!v || 'plan is required']" label="Execution Plan" v-model="planID"></v-select>                    
                </v-col>
                <v-col cols="4" sm="4">
                    <v-text-field label="Process name" :rules="getRules"  :counter="75" required hide-details="auto" v-model="nombre"></v-text-field>
                </v-col>
                <v-col  cols="4" sm="4">
                    <v-text-field label="Process Description" hide-details="auto" :rules="getRules" :counter="100" v-model="descripcion"></v-text-field>
                </v-col>

            </v-row> 
            <v-btn color="success" :loading="loading" elevation="2" rounded :disabled="!insertar"  @click="agregarProceso">{{texto}} 
                <v-icon dark right>mdi-checkbox-marked-circle</v-icon>
            </v-btn>         
            </v-form>         


            <v-card class="mt-5">
        <v-card-title> 
        List of processes
         <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table dense  :items-per-page="15" class="elevation-1" :headers="headers" :items="procesos" :search="search">
            
        <template v-slot:item.PlanFechaEjecucionID="{ item }">
                {{ nameplan(item.PlanFechaEjecucionID) }}
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


    </div>
<div/>

    <!-- use the modal component, pass in the prop -->
    <modal v-if="showModal" :currentindex = "currentIndex" :currentname ="currentname" @eliminar_current="eliminar_current(currentIndex,'',true)" @close="showModal = false"></modal>
    </div>

    
    </div>

      <error v-else></error>
    `,
    
    computed: {
      ...Vuex.mapState(['plans','procesos','RulesText','RulesTextDesc','error','loading','actionName','mostrarNotification','TextNotification','SuccessNotification','pieok']),
      getRules(){
        return store.state.RulesText;
      },
      typeAlert()
      {
       return store.state.SuccessNotification ? "success" : "error";
      }
      
    },
    data(){
        return{           
               texto: "Crear",
              insertar: true,             
             titulo_body: "Crear Proceso",      
             processNameError: true,
             planIdError: true,
             descriptionError: true,
             showModal: false,
             currentIndex: "",
             currentname: "",
             nombre: "",
           descripcion: "",
           planID: 0,
           ProcesoID: 0,
           search: "",
           headers: [          
            { text: 'Execution Plan', align: 'start',  value: 'PlanFechaEjecucionID' }, 
            { text: 'Process Name', value: 'Nombre' },
            { text: 'Description', value: 'Descripcion' },
            { text: 'GUID', value: 'GuidRelacional' },
            { text: 'Action', value: 'action' }
            
          ]

          
        }
    },
    methods: {
        ...Vuex.mapMutations(['generateMensajeNotification']), 
        agregarProceso: function()
        {
            this.$refs.form.validate(); // Validar formulario
            store.state.mostrarNotification = false; 
            if(this.texto == "Editar") 
            {
               var findProcess = store.state.procesos[this.currentIndex];
               findProcess.ProcesoID = this.ProcesoID;
               findProcess.Nombre = this.nombre;
               findProcess.Descripcion = this.descripcion;
               findProcess.PlanFechaEjecucionID = this.planID;
                 
               store.commit('actualizar_bd',findProcess);  // Actualizar en la BD

               this.limpiarValores();
               this.texto = "Crear"
            //this.eliminar_current(this.currentIndex,"",true);
            }
            else{
                if (this.nombre == "" || this.descripcion == "" ||  this.planID == 0)                
                    this.insertar = false;  
                else
                   this.insertar = true;
                
                   var findExist = this.procesos.find(x=>x.Nombre == this.nombre);                 
                  
                   if(findExist != null)
                   {
                    this.generateMensajeNotification({success: false, textVal : "This record already exists"});  
                    this.nombre = "";         
                    return;
                   }
                 

                if (this.insertar)
                {                
                 
                    var processNew = {
                        ProcesoID: 0,
                        Nombre: this.nombre,
                        Descripcion: this.descripcion,
                        PlanFechaEjecucionID: this.planID,
                        GuidRelacional: ""
                    };
                    /*store.state.procesos.push(
                        processNew
                    );*/                    
                    store.state.actionName = 'insertar_bd_process'
                    store.dispatch('insertar_bd',processNew); // insertar en la bd           
                    
                    this.limpiarValores();
                    
                }
            }
            //this.agregarLocalStorage(); 
        },
        limpiarValores: function(todo = false)
        {
            this.nombre = "";  
            this.descripcion = "";
            this.planID = 0;
            this.currentIndex = 0;
            this.$refs.form.resetValidation()
            
        },
        nameplan: function (planID) 
        {       
            return   this.plans[planID].text;
            //return this.plans.find((plan)=> plan.value === planID).text;
        },
        errorClass: function (valor) {
            var Valreturn = false; 
            if(valor == 1) // PlanID
            {
                Valreturn =  this.planIdError;
               
            }  
            if(valor == 2) // Name
            {
                Valreturn =  this.processNameError;
            }  
            if(valor == 3) // Description
            {
                Valreturn =  this.descriptionError;
            } 
            
            return Valreturn ? 'label-green' : 'label-danger'
        },
        eliminar_current: function (index,name,eliminar=false) 
        {
            
            if(eliminar == false){
                this.showModal = true;
                this.currentIndex = index;
                this.currentname = name;
            }
            else{
                
                //store.state.procesos.splice(index,1);
                //this.agregarLocalStorage();
                let idProcess = store.state.procesos[this.currentIndex].ProcesoID;                
                store.commit('Eliminar_bd',idProcess); // Eliminar en la bd  
                this.showModal = false;
                this.currentIndex = "";
                this.currentname = "";            
                
            }
            
        },
    
        editar_current : function (index) 
        {    
        var objeto = store.state.procesos[index];
        this.ProcesoID = objeto.ProcesoID;
        this.nombre = objeto.Nombre;
        this.descripcion = objeto.Descripcion;
        this.planID = objeto.PlanFechaEjecucionID;
        this.currentIndex = index;
        this.texto = "Editar"
        }
        
    },
    created: function () 
    {         
        store.state.mostrarNotification = false;  
    }  
})