<template>
     <v-dialog
        v-model="isShow"
        width="90%"
        >
        <v-card
        height="100%"
        >
            <v-card-title class="headline">Bảng tổng hợp control</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
                
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            

            <v-btn
                color="green darken-1"
                text
                right
                @click="hideDialog"
            >
                Đóng
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
</template>
<script>

export default {
    props:{
       
    },
    computed:{
        sAllControl(){ 
            return this.$store.state.document.editor.allControl;
        }
    },
    data(){
        return{
            isShow:false
        }
    },
    methods:{
        
        showDialog(){
            this.isShow = true
        },
        hideDialog(){
            this.isShow = false
        },
       
        
    }
}
</script>   
<style scoped>
    .s-all-control-option{
        height: 90%;
    }
</style>