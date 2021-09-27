Vue.component('jobs',
{
    template:

    `
   

    <v-card class="mt-5">
    <v-alert  :value="mostrarNotification"  :type="typeAlert" border="left" elevation="2"   style="">
        {{TextNotification}}
    </v-alert>
    <v-card-title> 
    List of Jobs
     <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
    </v-card-title>
    <v-data-table dense  :items-per-page="50" class="elevation-1" :headers="headers" :items="ListJobs" :search="search">

    <template v-slot:item.enabled="{ item,index }">           
    <v-checkbox v-model="item.enabled" input-value="item.enabled" disabled  color="success"  hide-details></v-checkbox>
    </template>       

        <template v-slot:item.action="{ item,index }">
        <v-btn :loading="loadingCurrent(item)" :disabled="loadingCurrent(item)"  rounded small color="success"  @click="Execute(item)" >          
            <v-icon  center dark>
                 mdi-checkbox-marked-circle
            </v-icon>
        </v-btn>
         
        </template>
        <template v-slot:item.serverName="{ item }">                  
                    <v-btn x-small rounded outlined :color="getColor(item.serverName)">
                    {{item.serverName}}
                  </v-btn>
                </template>
    </v-data-table>
</v-card>
    `,
    computed: 
    {
        ...Vuex.mapState(['ListJobs','loading','ListExecuted','mostrarNotification','TextNotification','SuccessNotification']),
        typeAlert()
        {   
            return store.state.SuccessNotification ? "success" : "error";
        }
      
    },
    methods: {
        ...Vuex.mapActions(['getListJobs','ExecuteJob']),
        Execute(item)
        {    
            store.state.ListExecuted.push({ID: item.name});                         
            this.ExecuteJob(item);
        },
        loadingCurrent(item)
        {
         return  this.ListExecuted.length == 0 ? false: this.ListExecuted.filter((x) => x.ID == item.name).length > 0;
        },
        getColor(serverName)
        {
         return serverName == "CNDDOSDOBI01" ? "success" : serverName == "CNDDOSDOBI02" ? "warning" : "primary";
        }
    },
    created: function(){
        this.getListJobs();      
    },
    data() {
        return {
            headers: [ 
                {text: 'Server Name', value: 'serverName'},
                { text: 'Job Name', value: 'name' },
                { text: 'Description', value: 'description' },
                {text: 'Active', value: 'enabled'},          
                { text: 'Execute', value: 'action' }
                
              ],
              search: "",
              loadingInte: false            
        }
    }

});