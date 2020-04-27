<template>
    <v-card id="list-control-autocomplete" class="list-control-autocomplete" style="display:none;">
        <v-text-field
            @input="onSearch($event)"
            @keydown="addControl($event)"
            @keyup="handleKeyUp"
            @focus="handleFocus"
            placeholder="Tìm kiếm"
            class="tf-search-control fs-13"
            outlined
            dense
            hide-selected
            hide-details
            autofocus
            :height="20"
            >
        </v-text-field>
        <v-list>
            <control
            v-for="control in listControl"
            :key="control"
            :type="control"
            @click-item="selectControl"
            />
        </v-list>
    </v-card>
</template>
<script>
import Control from './../items/Control.vue';
export default {
  
    components:{
        'control' : Control,
    },
    data(){
        return {
            listControl:['label','image','qrCode','textInput','richText','number','date','dateTime','time','month','select','documentSelect','phone','email','currency','radio','checkbox','color','percent','user','inputFilter','hidden','table','panel','fileUpload','report','approvalHistory','trackingValue','submit','reset','draf']
        }
    },

    methods:{
        handleKeyUp(event){
            if(event.keyCode == 38){    //up
                let index =  $('#list-control-autocomplete .first-active').index();
                if(index > 0)
                    $('#list-control-autocomplete .first-active').removeClass('first-active').prevAll(".sym-control").not(".d-none").first().addClass('first-active')
            }
            if(event.keyCode == 40){    //down
                let index =  $('#list-control-autocomplete .first-active').index();
                if(index < $('#list-control-autocomplete .sym-control').length - 1)
                    $('#list-control-autocomplete .first-active').removeClass('first-active').nextAll(".sym-control").not(".d-none").first().addClass('first-active')
            }
            $("#list-control-autocomplete").scrollTop(0);//set to top
            $("#list-control-autocomplete").scrollTop($('#list-control-autocomplete .first-active').offset().top-$("#list-control-autocomplete").height());//th
            
        },
        handleFocus(e){
            $('#list-control-autocomplete .sym-control').removeClass('first-active');
            $('#list-control-autocomplete .sym-control').first().addClass('first-active');
        },
        onSearch(event){
            $('#list-control-autocomplete .sym-control').removeClass('d-none');
            $('#list-control-autocomplete .sym-control').removeClass('first-active');
            $('#list-control-autocomplete .sym-control:not(:contains("' + event + '"))').addClass('d-none');
            $('#list-control-autocomplete .sym-control:contains("' + event + '")').first().addClass('first-active')
        },
        addControl(event){
            if(event.keyCode == 13){
                let type = $('#list-control-autocomplete .first-active').attr('control-type');
                this.$emit('add-control',type);
            }
            
        },
        selectControl(type){
            this.$emit('add-control',type);
        }
    }
}
</script>
<style  scoped>
    #list-control-autocomplete{
        position: absolute;
        max-height: 400px;
        overflow: auto;
    }
    
    .first-active{
        background: #f2f2f2;
    }
    .tf-search-control{
        margin: 8px 8px 0 8px !important;
    }
</style>