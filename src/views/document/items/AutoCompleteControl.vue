<template>
    <v-card id="list-control-autocomplete" class="list-control-autocomplete" style="display:none;">
        <v-text-field
            @input="onSearch($event)"
            @keydown="addControl($event)"
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
    mounted(){
        
    },
    methods:{
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
        margin: 8px 8px 0 8px;
    }
</style>