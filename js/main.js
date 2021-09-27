

Vue.component('modal',{
template: '#modal-template',
props: ['currentindex','currentname'],
methods: {
    eliminar_current: function () 
    {     
      this.$emit('eliminar_current')    
    }
}


});

const procesos = { template: '<procesos></procesos>' };
const clousersSet = { template: '<clousersSet></clousersSet>' };
const Logs = { template: '<logs></logs>' };
const clouserConfig = { template: '<clouserConfig></clouserConfig>' };
const Jobs = { template: '<jobs></jobs>' };

const routes = [
  { path: '/procesos', component: procesos },
  { path: '/clouser', component: clousersSet },
  { path: '/logs', component: Logs },
  { path: '/clouserConfig', component: clouserConfig },
  { path: '/Jobs', component: Jobs }
];

const router = new VueRouter({ routes });


const store = new Vuex.Store({
    state: {
      months:  ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December" ],
        plans: [
            {text:"Choose your option", value: 0}
           ,{text: "Semanal" , value: 1}
           ,{text: "Mensual" , value: 2}
           ,{text: "Quincenal" , value: 3}
           ],           
           procesos: [],
           DataDatesClouser:[], 
           processValue:[],
           ListJobs: [],
           ListExecuted: [],
           RulesText: [
            v => !!v   || 'Name is required',
            v => v.length  <= 75 || 'Name must be less than 75 characters',
          ],
          RulesTextDesc: [
            v => !!v  || 'Description is required',
            v => v.length  <= 100 || 'Description must be less than 100 characters',
          ],
          //urlAPi: "http://localhost:65324",
          urlAPi: "http://cnddosdobis:8587",         
          error: false,
          errorMesaje: "",
          loading: false,
          actionName: "",
          mostrarNotification: false,
          SuccessNotification: false,
          TextNotification: "",
          txtInsertCorrect: "record inserted correctly",
          txtErrorChangeDatabase: "Unexpected error",
          txtDeleteCorrect: "record deleted correctly",
          txtUpdateCorrect: "record updated correctly",
          Logs: [],
          series: [],
          labels:[],
          pieok: false,
          chartOptions: {
            chart: {
              width: 380,
              type: 'pie',
            },
            labels:[],                      
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
          },
          interval: 0,
          value: 0  

    },
    mutations: { 
   
        initialprocessPush(state,_dataProcess)
        {
      
          _dataProcess.data.forEach( function (element){
            var currentProcess = {
              ProcesoID: element.ProcesoID,
              Nombre: element.Nombre,
              Descripcion:element.Descripcion,
              PlanFechaEjecucionID: element.PlanFechaEjecucionID,               
              GuidRelacional: element.GuidRelacional
            };
  
           state.procesos.push(currentProcess)
  
            });  
        },  
        generateMensajeNotification(state,objeto)
        {
          
          let success = objeto.success; 
          let textVal = objeto.textVal;          
          state.mostrarNotification = true;
          state.SuccessNotification = success;
          state.TextNotification = textVal;
          
          this.interval = setInterval(() => {
            if (this.value === 100) {
              state.mostrarNotification = false;
            }
            this.value += 25
          }, 1000);
        

          if(success)  
          store.commit('agregarLocalStorage')

         
          
          
        },  
    async  insertar_bd_process(state,currentProcess)
      {       
        //console.log(JSON.stringify(currentProcess));        
        let res = await axios.post(state.urlAPi + '/procesos/post', currentProcess)
        .then(response => {        
          currentProcess.ProcesoID = response.data.ProcesoID;
          currentProcess.GuidRelacional = response.data.GuidRelacional;
          
          store.state.procesos.push(currentProcess);
          store.dispatch('generateAllNotifications',{success: true, textVal : state.txtInsertCorrect} )
        })
        .catch(error => store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false);   
        
       
        
       
      },
      async actualizar_bd(state,currentProcess)
      {       
         
        state.loading = true;        
        let res = await axios.put(state.urlAPi + '/procesos/put?id=' + currentProcess.ProcesoID, currentProcess)
        .then(response => store.dispatch('generateAllNotifications',{success: true, textVal : state.txtUpdateCorrect}) )
        .catch(error => store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false);     
      },
      async Eliminar_bd(state,id_process)
      {        
        let res = await axios.delete(state.urlAPi + '/procesos/delete?id=' + id_process)
        .then(response => 
          {
    
          let indexCurrent = state.procesos.findIndex((x) => x.ProcesoID == id_process);
          state.procesos.splice(indexCurrent,1);         
          store.dispatch('generateAllNotifications',{success: true, textVal : state.txtDeleteCorrect})
        })
        .catch(error =>  store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false); 
       
      },
      generateError(state,error){
        state.error = true;
        state.errorMesaje = error;
      },

      getListLog(state){
        axios
        .get(state.urlAPi + '/logs/getall')
        .then(response =>  state.Logs = response.data)
        .catch(error => store.commit('generateError',error)  )
        .finally(() => state.loading = false)
      },    
     async getPie(state){
        await axios        
        .get(state.urlAPi + '/logs/getPie')
        .then(response => 
          {     
            state.series = response.data.Values;
            state.labels = response.data.Labes;
        
          })
        .catch(error => store.commit('generateError',error)  )
        .finally(() => state.loading = false)
      },

      initialDataProcess(state,response)
      {

        /*var _procesos = localStorage.getItem('procesos');
        var _dataProcess = response.data;
        if(_procesos == null)
        {         
          if(_dataProcess.length > 0)
          {
           store.commit('initialprocessPush',response);           
          }
          localStorage.setItem("procesos",JSON.stringify(state.procesos));
        }
        else
        {   
          if(_procesos.length != _dataProcess.length )
          {
            store.commit('initialprocessPush',response); 
            localStorage.setItem("procesos",JSON.stringify(state.procesos));
          }
          state.procesos = JSON.parse(localStorage.getItem('procesos'));
        }
        store.commit('InsertProcessValue',response);*/
        store.commit('initialprocessPush',response);
        store.commit('InsertProcessValue',response)
        
      },
      InsertProcessValue(state,response)
      {
        response.data.forEach( function (element)
        {
            let currentProcess = {text:element.Nombre, value: element.ProcesoID};           
            state.processValue.push(currentProcess);
        });  
      },

      initialDataLogsPie(state,response)
      {
       state.series = response;

      }
      ,
      agregarLocalStorage : function (state) 
        {
          
            localStorage.setItem("procesos",JSON.stringify(state.procesos));
        },
    
        async  insertar_procesoCierre(state,currentData)
      {       
        //console.log(JSON.stringify(currentProcess));        
        let res = await axios.post(state.urlAPi + '/procesoCierres/post', currentData)
        .then(response => 
          { 
          state.DataDatesClouser.push(...response.data);
          store.dispatch('generateAllNotifications',{success: true, textVal : state.txtInsertCorrect} )
        }  )
        .catch(error => store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false);        
      },

      async actualizar_procesoCierre(state,currentData)
      {       
         
        state.loading = true;        
        let res = await axios.put(state.urlAPi + '/procesoCierres/put?id=' + currentData.ID, currentData)
        .then(response => store.dispatch('generateAllNotifications',{success: true, textVal : state.txtUpdateCorrect}) )
        .catch(error => store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false);     
      },
      async Eliminar_procesoCierre(state,id) 
      {        
        let res = await axios.delete(state.urlAPi + '/procesoCierres/delete?id=' + id)
        .then(response => 
          {    
          let indexCurrent = state.DataDatesClouser.findIndex((x) => x.ID == id);
          state.DataDatesClouser.splice(indexCurrent,1);         
          store.dispatch('generateAllNotifications',{success: true, textVal : state.txtDeleteCorrect})
        })
        .catch(error =>  store.commit('generateMensajeNotification',{success: false, textVal : state.txtErrorChangeDatabase + error}  )  )
        .finally(() => state.loading = false); 
       
      },
      async deleteExecutedJob(state,item)
      {
        let id = state.ListExecuted.findIndex((x) => x.ID == item.name);
        state.ListExecuted.splice(id,1);  
      }
    
  }
  ,actions:
  {
    initialDataProcess(context,response)
    {
      store.state.loading = true;
      context.commit('initialDataProcess',response)     
    },
    initialDataLogsPie(context,response)
    {     
      context.commit('initialDataLogsPie',response)   
    },
    
    insertar_bd(context,currentProcess)
    {
      store.state.loading = true;
      //store.state.actionName = actionName;
      
      context.commit(store.state.actionName,currentProcess);  

      
    },
    generateAllNotifications(context,currentProcess){
      context.commit('generateMensajeNotification',currentProcess);      
    },
    getLogs(context){
      context.commit('getListLog');
      //context.commit('getPie'); 

    },

    InsertLogs(context,logs)
    {  
       var urlAPi  = store.state.urlAPi;
      //console.log(JSON.stringify(currentProcess));
   
      //int[] processId,string[] dates_to_From,string dateExecute
      let res =  axios.post(urlAPi + '/logs/postClouser',logs)
      .then(response => {  
        //console.log(response);              
        store.state.Logs.push(response); 
        store.dispatch('generateAllNotifications',{success: true, textVal : store.state.txtInsertCorrect})      
      })
      .catch(error => context.commit('generateMensajeNotification',{success: false, textVal : store.state.txtErrorChangeDatabase + error}  )  )
      .finally(() => store.state.loading = false);
    },

    getDatesClouser()
    {
      axios
      .get(store.state.urlAPi + '/procesoCierres/getall')
      .then(response =>  store.state.DataDatesClouser = response.data)
      .catch(error => store.commit('generateError',error)  )
      .finally(() => store.state.loading = false)
      
    },
    insertar_procesoCierre(context,response)
    {     
      context.commit('insertar_procesoCierre',response);
    },

    getListJobs()
    {
      axios
      .get(store.state.urlAPi + '/jobs/getall')
      .then(response =>   store.state.ListJobs = response.data )
      .catch(error => store.commit('generateError',error)  )
      .finally(() => store.state.loading = false)
      
    },
     ExecuteJob(context,job)
    {      
      var urlAPi  = store.state.urlAPi;     
      let res =  axios.post(urlAPi + '/jobs/post',job)
      .then(response => 
      {         
        store.dispatch('generateAllNotifications',{success: true, textVal : "The current job: " + job.name + " was executed correctly"  });
        
      
      })
      .catch(error => context.commit('generateMensajeNotification',{success: false, textVal : store.state.txtErrorChangeDatabase + error}  )  )
      .finally(() => {store.state.loading = false
        context.commit('deleteExecutedJob',job);
      });
    }

  }
  
 
})



const App = {
    template: '#app-template',
computed: {   
    insertado: function () 
    {        
        return this.insertar;
    }   
   
}


  }

 new Vue({
    
    vuetify: new Vuetify(),
    router,      
    render: h => h(App),
    store:store,   
  mounted () {  
    let url = store.state.urlAPi;         
    axios
      .get(url + '/procesos/getall')
      .then(response =>store.dispatch('initialDataProcess',response))
      .catch(error => store.commit('generateError',error)  )
      .finally(() => store.state.loading = false);     
     
      axios        
      .get(url + '/logs/getPie')
      .then(response => 
        {   
          store.dispatch('initialDataLogsPie',response.data.Values)         
        })
      .catch(error => store.commit('generateError',error)  )
      .finally(() => store.state.loading = false)
  }
}).$mount('#app');

