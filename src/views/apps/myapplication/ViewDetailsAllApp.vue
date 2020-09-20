<template>
   <div class="view-details-all-app" style="display:flex">
       <div class="header-view-details-all-app">
            <h4 style="flex-grow:1"> Danh sách công việc của tôi </h4>
            <div style="width:500px;display:flex">
                <v-btn
                    class="button-add-task"
                    style="backgound-color:#F7F7F7;margin-8px"
                    >
                    <v-icon left dark style="padding-right:8px">mdi-plus</v-icon>
                    <span style="font:13px roboto"> Tạo task </span>
                </v-btn>

                <v-text-field
                        :label="$t('apps.search')"
                        single-line
                        solo
                        append-icon="mdi-magnify"
                        v-model="searchKey"
                    ></v-text-field>
                <v-icon @click="collapse">mdi-arrow-collapse-up</v-icon>  
                <v-icon @click="changeView">mdi-page-previous-outline</v-icon>  
            </div>
        </div>
       
        <div class="content-view-details-all-app">
            <v-row no-gutters>
                <template v-for="n in 4">
                    <v-col :key="n">
                     <v-expansion-panels
                        accordion 
                        v-model="panel"
                    >
                        <v-expansion-panel
                        >
                        <v-expansion-panel-header>Quarn lis ung dung</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <!-- chi tiet tung app  -->
                           <v-row no-gutters>
                                <template v-for="n in 4">
                                    <v-col :key="n">
                                    <v-card
                                        class="pa-2"
                                        outlined
                                        tile
                                    >
                                        Column
                                    </v-card>
                                    </v-col>
                                    <v-responsive
                                    v-if="n === 2"
                                    :key="`width-${n}`"
                                    width="100%"
                                    ></v-responsive>
                                </template>
                            </v-row>
                        </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                    </v-col>
                    <v-responsive
                    v-if="n === 2"
                    :key="`width-${n}`"
                    width="100%"
                    ></v-responsive>
                </template>
            </v-row>
           
                    
           
        </div>

    </div>
</template>

<script>
export default {
    methods:{
        changeView(){
            this.$store.commit('appConfig/changeTypeView')
        },
        collapse(){
            this.panel = []
        }
    },
    data(){
        return {
             panel: [0,1,2,3],
             searchKey: '',
        }
    }
}
</script>

<style scoped>
.view-details-all-app {
    display: flex;
    flex-direction: column;
}
.view-details-all-app .header-view-details-all-app {
    display: flex;
    margin:8px 16px 8px 8px;
}
.view-details-all-app .content-view-details-all-app{
    width:90%;
    margin-left:auto;
    margin-right:auto;
}
.view-details-all-app h4{
    float: left;
}
.view-details-all-app .button-add-task{
    margin:0px 12px;
    box-shadow: unset;
    height:30px;
    min-width: unset;
    padding:unset;
    width: 110px;

}
.view-details-all-app >>> .button-add-task .v-icon{
     margin:0px 0px 0px 8px;
}
.view-details-all-app >>> .v-input{
   flex:unset

}
.view-details-all-app >>> .v-icon {
    font-size:13px;
    margin:0px 8px;
}
.view-details-all-app >>> .v-input__control{
    min-height:unset;
    width:250px !important;
    min-width:unset;
    height: 30px;
    flex-grow:unset

}
.view-details-all-app >>> .v-input__control .v-input__slot{
    box-shadow: unset !important;
    width:250px;
    background-color: #f7f7f7;
    margin-right:20px
}
.view-details-all-app >>> .v-input__control .v-input__slot label{
    font:13px roboto;
    padding-top:3px
}
.view-details-all-app >>> .v-input__control #input-110{
    font:13px roboto
}
.view-details-all-app >>> .v-input__control .v-text-field__details{
    display: none;
}
</style>