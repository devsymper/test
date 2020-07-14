<template>
    <v-card 
    class="card-list-user"
    v-show="isShow"
    :style="positionBox">
        <div v-for="(user,index) in listUser" 
        :key="user.id + user.name" 
        class="user-item" 
        :style="{'background':(indexActive == index) ? '#f0f0f0' : ''}"
        v-on:click="selectItem(user)" >
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
            indexActive:-1
        }
    },
    created(){
        
        let thisCpn = this;
        this.$evtBus.$on('document-submit-user-input-change',e=>{
            if( thisCpn.isShow == false){
                thisCpn.show();
                thisCpn.calculatorPositionBox(e);
                thisCpn.element = $(e.target)
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
            thisCpn.filterUser($(e.target).val())
        })

        userApi.getListUser(1,100000).then(res => {
            if (res.status == 200) {
                thisCpn.listAllUser = res.data.listObject
                thisCpn.thisCpn = res.data.listObject
            }
            
        })
        .catch(err => {
            thisCpn.$snotify({
                    type: "error",
                    title: "can not save document",
                });
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
                return user.displayName.toLowerCase().includes(val) || user.id == val
            })
            this.listUser = list;
            
        },
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },

        // calPosition(e){
        //     this.positionBox = {'top':$(e.target).offset().top + 25 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
        // },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if($(e.target).closest('.handsontable').length > 0 ){
                let autoEL = $(this.$el).detach();
                $(e.target).closest('.wrap-table').append(autoEL);
                let edtos = $(e.target).offset();
                if(!$(e.target).is('.handsontableInput')){
                    edtos = $(e.target).closest('td.htAutocomplete.current.highlight').offset();
                }
                if($(e.target).is('div.htAutocompleteArrow')){
                    edtos = $(e.target).parent().offset();;
                }
                
                let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.positionBox = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let autoEL = $(this.$el).detach();
                $(e.target).parent().append(autoEL);
                this.positionBox = {'top':'28px','left':'0px'};
            }
        },
        selectItem(user){
            this.element.attr('user-id',user.id);
            this.element.val(user.displayName);
            this.element.trigger('change');
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
        height: 28px;
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