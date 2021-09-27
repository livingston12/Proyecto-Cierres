Vue.component('error',
{

template: //html
`<div>

<v-card class="mx-auto" color="#EF5350" dark   elevation="2"  shaped>
    <v-card-title>        
        <v-icon large left >
        mdi-cancel
        </v-icon>
        <h4>an error has ocurred in the application </h4>    
    </v-card-title>
    <v-card-text>
        <h3>{{errorMesaje}} </h3>
    </v-card-text>
</v-card>

</div>
`,
computed: {
    ...Vuex.mapState(['errorMesaje'])
}
})
