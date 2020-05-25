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
            <p>{{user.name}}</p>
        </div>
    </v-card>
</template>
<script>
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
            element:null,
            indexActive:null
        }
    },
    created(){
        
        let thisCpn = this;
        this.$evtBus.$on('document-submit-user-select-input',e=>{
            if($(e.target).attr('key-instance') == thisCpn.keyInstance){
                thisCpn.show();
                thisCpn.calPosition(e);
                thisCpn.element = $(e.target)
            }
        })
        this.$evtBus.$on('document-submit-user-input-change',e=>{
            if($(e.target).attr('key-instance') == thisCpn.keyInstance){
                if(e.keyCode == 38){    //len
                
                    if(thisCpn.indexActive == 0){
                        return false;
                    }
                    Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive--;
                    Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', true);
                    
                }   
                else if(e.keyCode == 40){
                    if(thisCpn.indexActive == thisCpn.listUser.length - 1){
                        return false;
                    }
                    Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', false);
                    thisCpn.indexActive++;
                    Vue.set(thisCpn.listUser[thisCpn.indexActive], 'active', true);
                }
                else if(e.keyCode == 13){
                    let user = thisCpn.listUser[thisCpn.indexActive];
                    thisCpn.selectItem(user)
                }
            }
        })
    },
    beforeMount(){
        this.isShow = false;
        this.positionBox = {'top':0,'left':0};
        this.indexActive = 0;
        this.listUser = [
            {id:1,avatar:'https://hoangnd.dev.symper.vn/icon/ic_image.png',name:'Nguyễn Đình Hoàng'},
            {id:2,avatar:'https://hoangnd.dev.symper.vn/icon/ic_image.png',name:'Nguyễn Đình Hải'},
            {id:3,avatar:'https://hoangnd.dev.symper.vn/icon/ic_image.png',name:'Nguyễn Đình Hoàn'},
            {id:4,avatar:'https://hoangnd.dev.symper.vn/icon/ic_image.png',name:'Nguyễn Đình Hoàn'},
            {id:5,avatar:'https://hoangnd.dev.symper.vn/icon/ic_image.png',name:'Nguyễn Đình Hoàn'},
            ]
    },
    methods:{
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },
        calPosition(e){
            this.positionBox = {'top':$(e.target).offset().top + 25 +'px','left':$(e.target).offset().left - $(e.target).width()/2+'px'};
        },
        selectItem(user){
            this.element.val(user.id);
            this.hide();
        }
    }
}
</script>

<style scoped> 
    .card-list-user{
        position: absolute;
        z-index: 99999;
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