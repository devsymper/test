<template>
    <div v-show="showListColumn" class="popup-list-column">
        <v-card>
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
            <v-list-item-title > <span>{{item.title}}</span> <span style="font:11px roboto;font-weight:200">{{item.subTitle}}</span></v-list-item-title>
            </v-list-item-content>
                <v-icon v-if="listColumnSelected.includes(item)" color="green lighten-1">mdi-check-outline</v-icon>
        </v-list-item>
        </v-card>
    </div>
</template>

<script>
export default {
    data(){
        return {
             listColumn:[
                {
                    id:1,
                    icon: "mdi-folder",
                    title:"Hello",
                    subTitle:"Subtitle1",
                    selected:false,
                },
                {
                    id:2,
                    icon: "mdi-folder",
                    title:"Hello2",
                    subTitle:"Subtitle2",
                    selected:false,
                },
                {
                    id:3,
                    icon: "mdi-folder",
                    title:"Hello2",
                    subTitle:"Subtitle3",
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
            this.showListColumn = !this.showListColumn
            $(".popup-list-column").css("left", e.clientX).css("top",300)
        }
    },
    watch:{
       searchKey(val){
       }
    }
}
</script>

<style scoped>
.popup-list-column >>> .v-icon{
    font-size: 10px !important;
}
.popup-list-column >>> .v-avatar{
    height: 12px !important;
    width: 12px !important;
    min-width: unset !important;
}
.popup-list-column >>> .v-list-item__content .v-list-item__title{
    font:13px roboto;
}
.popup-list-column >>> .v-list-item__action .v-btn{
    width: 12px;
    height: 12px;
}
.popup-list-column >>> .v-list-item{
    min-height: unset;
    height: 30px;
    padding:0px 4px;
}

</style>