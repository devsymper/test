<template>
    
    <v-dialog
        v-model="isShow"
        width="800"
        >
        <v-card
        height="550"
        >
            <v-card-title class="headline">Soạn công thức</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
               
               
                <formulas-editor ref="scriptEditor"/>

                
            </v-card-text>

                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            

            <v-btn
                color="green darken-1"
                text
                right
                @click="hide"
            >
                Đóng
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
    
</template>
<script>
import FormulasEditor from "./../../../components/common/FormulaEditor.vue"
export default {
    components:{
       "formulas-editor" : FormulasEditor
    },
    computed: {
      editorStore(){ 
          return this.$store.state.document.editor;
      }
    },
    props:{
        formulas:{
            type:String,
            default:''
        }
    },
    watch:{
        formulas(){
            this.$refs.scriptEditor.setValue(this.formulas);
        }
    },
    data(){
        return {
            isShow:false,
        }
    },
   
    methods:{
 
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        }
    },
  
}
</script>
<style scoped>
    
</style>