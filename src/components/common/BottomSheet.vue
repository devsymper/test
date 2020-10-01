<template>
    <v-bottom-sheet hide-overlay  v-model="sheet" persistent :class="{'shadow-sheet':isShadow}">
      <v-sheet class="sym-sheet" :height="height" >
        <slot name="content"></slot>
      </v-sheet>
    </v-bottom-sheet>
</template>
<script>
export default {
    props:{
        height:{
            type:Number,
            default:40
        },
        isShadow:{
            type:Boolean,
            default:true
        },
    },
    data(){
        return{
            sheet: false,
        }
    },
    methods:{
     
        toggle(){
            this.sheet = !this.sheet
        },
        show(){
            this.sheet = true;
        }
    }
}
</script>
<style scoped>
    .close-sheet-btn{
        right: 10px;
        top: 10px;
        position: absolute;
    }
    .sym-sheet{
        position: relative;
    }
    .shadow-sheet{
        box-shadow: var(--symper-box-shadow-top) !important;
    }
</style>