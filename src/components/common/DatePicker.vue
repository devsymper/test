<template>
    <v-card class="card-date-picker"
    
    :style="position"
    v-show="isShow">
        <v-date-picker class="date-picker" v-model="date" no-title></v-date-picker>
    </v-card>
</template>
<script>
export default {

    props:{
        position:{
            type:Object,
            default(){
                return {
                    top:0,
                    left:'35px'
                }
            }
        }
        
    },
    created() {
        let thisCpn = this;
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (!$(evt.target).hasClass("input-item-func") && 

                (!$(evt.target).hasClass("card-date-picker") &&
                $(evt.target).closest(".card-date-picker").length == 0)
            ) {
                // thisCpn.closePicker();
            }
        });
    },
    data(){
        return {
            date:null,
            isShow:false,
        }
    },
  
    methods:{
        closePicker() {
            this.isShow = false;
        },
        openPicker(){
            this.isShow = true;
        },
    }
}

</script>
<style scoped>
    .date-picker{
        box-shadow: none;

    }

    .card-date-picker{
        position: absolute;
        z-index: 9999;
    }
    .heading{
        padding: 6px 12px;
    }
</style>
