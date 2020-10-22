<template>
    <div  class="popup-list-column">
        <v-menu
            v-model="showListColumn"
            :position-x="x"
            :position-y="y"
            absolute
            offset-x
             :max-height="200"
            :nudge-width="220"
            :close-on-content-click="false"
            class="menu-list-column"
        >
           <div style="margin:12px 6px">
                 <v-list-item
                v-for="(item,i) in listColumn"
                :key="i"
                @click="chooseItem(item)"
            >
            <v-list-item-avatar>
            <v-icon
                class="grey lighten-1"
                dark
            >
                {{item.icon}}
            </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
            <v-list-item-title > <span>{{item.title}}</span> <span style="font:11px roboto;font-weight:200;padđing-left:4px">{{item.subTitle}}</span></v-list-item-title>
            </v-list-item-content>
                <v-icon v-if="listColumnSelected.includes(item)" color="green lighten-1">mdi-check-outline</v-icon>
        </v-list-item>
           </div>
        </v-menu>
    </div>
</template>

<script>
export default {
    data(){
        return {
            x:null,
            y:null,
             listColumn:[
                {
                    id:1,
                    icon: "mdi-lan",
                    title:"Số chứng từ ",
                    subTitle:"got_2",
                    selected:false,
                },
                {
                    id:2,
                    icon: "mdi-folder",
                    title:"Tên bộ phận",
                    subTitle:"sd_23",
                    selected:false,
                },
                {
                    id:3,
                    icon: "mdi-widgets",
                    title:"Mã bộ phân",
                    subTitle:"sd_234",
                    selected:false,
                },
            ]
        }
    },
    props:{
        showListColumn:{
            type:Boolean,
            default:false
        },
        listColumnSelected:{
            type: Array,
        },
        searchKey:{
            type:String,
            default:""
        }
        
    },
    methods:{
        chooseItem(item){
            this.$emit('item-clicked', item)
        },
        show(e){
            // this.showListColumn = !this.showListColumn
            this.x = e.clientX+40
            this.y = e.clientY+20
        }
    },
    watch:{
       searchKey(val){
       }
    }
}
</script>

<style scoped>
.v-menu__content{
    background-color: #ffffff !important;
}
.v-menu__content  .v-icon{
    font-size: 10px !important;
}
.v-menu__content  .v-avatar{
    height: 12px !important;
    width: 12px !important;
    min-width: unset !important;
}
.v-menu__content .v-list-item__content .v-list-item__title{
    font:13px roboto;
}

.v-menu__content  .v-list-item__action .v-btn{
    width: 12px;
    height: 12px;
}
.v-menu__content  .v-list-item{
    min-height: unset;
    height: 30px;
    padding:0px 4px;
}
.v-menu__content {
    margin-bottom:20px
}

</style>