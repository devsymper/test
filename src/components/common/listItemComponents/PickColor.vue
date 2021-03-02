<template>
    <div style="background:white!important">
        <div class="ml-2 fs-13 pt-2 fw-430">
             <v-icon size="16" class=" mr-1">mdi-format-color-fill</v-icon>
            {{name}}
        </div>
        <!-- <div>
            <v-btn x-small text><i class="mdi mdi-close"></i></v-btn>
        </div> -->
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
            :swatches="swatchesColor"
            swatches-max-height="200"
        ></v-color-picker>
         <div v-if="reset" class="ml-2 d-flex fs-13 justify-center mb-2" >
            <v-icon size="16" class=" mr-2">mdi-delete-sweep</v-icon>Đặt lại
        </div>
         <div v-if="random" style="margin-top:-10px" class="ml-2 d-flex fs-13 justify-center" >
             <v-switch
                v-model="randomColor"
                label="Màu ngẫu nhiên"
            ></v-switch>
        </div>
         <div v-if="showSaveBtn" class="pr-2 d-flex justify-end pb-2">
            <v-btn class="fs-13 fw-400" x-small color="primary" @click="save()">Áp dụng</v-btn>
        </div>
    </div>
</template>
<script>
export default {
  created () {

  },
  methods: {
      save(){
          this.$emit('save',this.randomColor)
      }
  },
  props: {
       value: {
            type: String,
            default:"",
        },
         reset: {
            type: Boolean,
           default:false
        },
         randomColor: {
            type: Boolean,
           default:false
        },
        showSaveBtn: {
            type: Boolean,
           default:false
        },
        random: {
            type: Boolean,
           default:false
        },
        name: {
            type: String,
           default:"Chọn màu"
        },
        swatchesColor:{
            type: Array,
            default(){
                return this.swatches;
            }
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
        color:this.value,
        // randomColor:false,
        swatches: [
            ['#FF0000', '#AA0000', '#550000','#000000'],
            ['#FFFF00', '#AAAA00', '#555500','#00A0AA'],
            ['#00FF00', '#00AA00', '#005500','#000555'],
            ['#00FFF0', '#00AAAA', '#005555','#0000FF'],
            ['#00FFFF', '#00AAA0', '#005545','#000055']],
           
    }
    
}
}
</script>
<style >
.v-color-picker__swatches{
    margin-bottom:-20px

}
</style>