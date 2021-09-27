Vue.component('header-content',
{
    template: 
    `
    <div>
   
    <v-card>
   
    <v-toolbar flat color="blue lighten-5">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>

      <v-toolbar-title>{{tabs}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

      <template v-slot:extension>
        <v-tabs
          v-model="tabs"
          fixed-tabs
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab to = '/procesos' class="primary--text">            
            <span><v-icon>mdi-file-table-box</v-icon>  Process</span>           
          </v-tab>

          <v-tab to = '/clouser' class="primary--text">
          <span><v-icon>mdi-note-plus</v-icon>set clouser</span>
          </v-tab>

          <v-tab to = '/Logs' class="primary--text">
          <span><v-icon>mdi-format-list-bulleted</v-icon> Logs</span>
          </v-tab>

          <v-tab to = '/clouserConfig' class="primary--text">
          <span><v-icon> mdi-wrench</v-icon>Config clouser </span>
          </v-tab>

          <v-tab to = '/jobs' class="primary--text">
          <span><v-icon> mdi-arrow-down-bold-box-outline</v-icon>Run job </span>
          </v-tab>
          
        </v-tabs>
      </template>
    </v-toolbar>
   
    <v-tabs-items v-model="tabs">
      <v-tab-item>
        <v-card flat>
          <v-card-text v-text=""> </v-card-text>
        </v-card>
      </v-tab-item>
     
   
    </v-tabs-items>
  </v-card>

  
  </div>
  
    `,
    data(){
        return {         
            tabs: null
        }
    }


     
})