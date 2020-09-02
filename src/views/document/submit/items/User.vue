<template>
    <v-card 
    
    class="card-list-user"
    v-show="isShow"
    :style="positionBox">
        <div v-for="(user,index) in listUser" 
        :key="user.id + user.name" 
        class="user-item" 
        :style="{'background':(indexActive == index) ? '#f0f0f0' : ''}"
        @mousedown.stop.prevent
        @mouseup.stop.prevent
        @click.stop.prevent="selectItem(user)" >
            <img :src="user.avatar">
            <p>{{user.displayName}}</p>
        </div>
    </v-card>
</template>
<script>
import { userApi } from "./../../../../api/user";
export default {
    props:{
        keyInstance:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            isShow:null,
            positionBox:null,
            listUser:null,
            listAllUser:null,
            element:null,
            indexActive:1,
            isComponentActive:false,
        }
    },
    activated() {
        this.isComponentActive = true;
    },
    deactivated() {
        this.isComponentActive = false;
    },
    created(){
        
        let thisCpn = this;
        this.$evtBus.$on('document-submit-user-input-change',e=>{
            if(thisCpn.isComponentActive == false) return;
            if( thisCpn.isShow == false){
                thisCpn.element = $(e.curTarget)
                thisCpn.show();
                thisCpn.calculatorPositionBox(e);
            }
            if(e.keyCode == 38){    //len
                if(thisCpn.indexActive <= 0){
                    return false;
                }
                Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', false);
                thisCpn.indexActive--;
                Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', true);
                
            }   
            else if(e.keyCode == 40){
                if(thisCpn.indexActive >= thisCpn.listUser.length - 1){
                    return false;
                }
                if(thisCpn.indexActive != -1)
                Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', false);
                thisCpn.indexActive++;
                Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', true);
            }
            else if(e.keyCode == 13 && thisCpn.indexActive != -1){
                let user = thisCpn.listUser[thisCpn.indexActive];
                thisCpn.selectItem(user);
                thisCpn.indexActive = -1
            }
            thisCpn.filterUser(thisCpn.element.val())
        })

        userApi.getListUser(1,100000).then(res => {
            if (res.status == 200) {
                thisCpn.listAllUser = res.data.listObject;
                thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'listUser',
                    value: thisCpn.listAllUser,
                    instance:thisCpn.keyInstance
                });
            }
            
        })
        .catch(err => {
            
        })
        .always(() => {
        });
        
    },
    beforeMount(){
        this.isShow = false;
        this.positionBox = {'top':0,'left':0};
        this.indexActive = 0;
        this.listUser = []
    },
    methods:{
        filterUser(val){
            let list = this.listAllUser.filter(user=>{
                return user.displayName.toLowerCase().includes(val.toLowerCase()) || user.id == val
            })
            if(this.listUser.length > 0){
                this.listUser[0].active = true;
            }
            this.listUser = list;
            
        },
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },

        // calPosition(e){
        //     this.positionBox = {'top':$(e.curTarget).offset().top + 25 +'px','left':$(e.curTarget).offset().left - $(e.curTarget).width()/2+'px'};
        // },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if(this.element.closest('.handsontable').length > 0 ){
                let autoEL = $(this.$el).detach();
                this.element.closest('.wrap-table').append(autoEL);
                let edtos = this.element.offset();
                if(!this.element.is('.handsontableInput')){
                    edtos = this.element.closest('td.htAutocomplete.current.highlight').offset();
                }
                if(this.element.is('div.htAutocompleteArrow')){
                    edtos = this.element.parent().offset();;
                }
                
                let tbcos = this.element.closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + this.element.height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                this.element.parent().append(autoEL);
                this.positionBox = {'top':this.element.height()+2+'px','left':'0px'};
            }
        },
        selectItem(user){
            
            this.$emit('after-select-user',{input:this.element,value:user});
            this.hide();
        }
    }
}
</script>

<style scoped> 
    .card-list-user{
        position: absolute;
        z-index: 99999;
        max-width: unset !important;
    }
    .user-item{
        padding: 4px 8px;
        display: flex;
        cursor: pointer;
        transition: ease-in-out 100ms;
    }
    .user-item:hover{
        background: #f0f0f0;
    }
    .user-item img{
        margin-right: 8px;
        height: 20px;
        border-radius: 50%;

    }
    .user-item p{
        padding-top: 3px;
    }
</style>