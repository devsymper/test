<template>
    <div style="background:white!important">
        <div class="mt-2 ml-2 d-flex fs-13 justify-center" style="margin-bottom:-10px">
        </div>
        <v-color-picker 
            class="pa-2"
            :hide-canvas="false"
            hide-inputs
            hide-mode-switch
            :hide-sliders="false"
            mode="hexa"
            v-model="color"
            show-swatches
            :swatches="swatches"
            swatches-max-height="200"
        ></v-color-picker>
         <div class="px-2 d-flex fs-13 justify-center pb-2" >
            <v-btn  v-show="showButton" small class="px-1 ml-1" solo depressed @click="handleSelected">
                Ok
            </v-btn>
            <v-icon size="16" class=" mr-2">mdi-delete-sweep</v-icon>Đặt lại
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: {
            type: String,
            default:"",
        },
        showButton:{
            type: Boolean,
            default: false,
        }
    },
    watch: {
        color(){
            if (!this.showButton) {
                this.$emit('input',this.color);
            }
        },
        value(vl){
            this.color = vl;
        }
    },
    data () {
        return {
            color:'#000000',
            swatches: [
                ['#FF0000', '#AA0000', '#550000','#000000'],
                ['#FFFF00', '#AAAA00', '#555500','#00A0AA'],
                ['#00FF00', '#00AA00', '#005500','#000555'],
                ['#00FFF0', '#00AAAA', '#005555','#0000FF'],
                ['#00FFFF', '#00AAA0', '#005545','#000055']],
            
        }
    },
    methods:{
        handleSelected(){
            this.$emit('input',this.color);
        }
    }
    
}
</script>
<style >
.v-color-picker__swatches{
    margin-bottom:-20px

}
</style>