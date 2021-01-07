<template>
    <div class="s-floatting-popup elevation-6" :style="style" v-show="isShow">
        <v-tabs height="40" class="pt-2 pl-1 px-1"  v-model="currentTab" background-color="transparent" grow>
            <v-tab v-for="item in tabs" :key="item.name">
                {{ item.text }}
            </v-tab>
        </v-tabs>
        <div style="height: calc(100% - 40px)">
            <v-tabs-items v-model="currentTab" class="h-100">
                <v-tab-item v-for="item in tabs" :key="item.name" class="h-100 p-2">
                    <component 
                        class="h-100"
                        :focusingControlName="focusingControlName"
                        :ref="'comp_'+item.name" 
                        :is="item.component"
                        :instance="instance"
                        :rowIndex="rowIndex"
                    />
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>
<script>
import HistoryControl from './../detail/HistoryControl';
import LinkControl from './LinkControl'
export default {
    components: {
        HistoryControl,
        LinkControl
    },
    props: {
        instance: {
            type: Number,
            default: 0
        },
        focusingControlName: {
            type: String,
            default: ''
        }
    },
    watch: {
        currentTab(vl){
            setTimeout((self) => {
                switch (vl) {
                    case 0:
                        self.showLinkControl()
                        break;
                
                    case 1:
                        self.showTrackChangeComp(); 
                        break;
                
                    case 2:
                        
                        break;
                
                    default:
                        break;
                }
            }, 10, this);
        },
        
    },
    data() {
        return {
        date: null,
        isShow: false,
        style: {},
        currentTab: 1,
        rowIndex:null,
        tabs: []
        };
    },
    computed:{
        viewType(){
            return this.$store.state.document.viewType[this.instance]
        }
    },
    beforeMount() {
        this.style.top = "26px";
        this.style.left = "0px";
    },
    mounted(){
        this.showTrackChangeComp();
        if(this.viewType == 'detail'){
            this.tabs = [
                {
                    text: "Liên kết",
                    name: 'link',
                    component: LinkControl
                },{
                    text: "Lịch sử chỉnh sửa",
                    name: 'trackChange',
                    component: HistoryControl
                },{
                    text: "Bình luận",
                    name: 'comment',
                    component: HistoryControl
                },
            ]
            this.style.width = '600px';
            this.style.height = '300px';
        }else{
            this.tabs = [
                {
                    text: "Liên kết",
                    name: 'link',
                    component: LinkControl
                }
            ];
            this.style.width = '150px';
            this.style.height = 'auto';
        }
    },
    methods: {
        showLinkControl(){
            if(this.$refs.comp_link){
                this.$refs.comp_link[0].show(this.focusingControlName);
            }
        },
        showTrackChangeComp(){
            if(this.$refs.comp_trackChange){
                this.$refs.comp_trackChange[0].show();
            }
        },
        hide() {
            this.isShow = false;
        },
        /**
         * context: ngữ cảnh sử dụng (detail, submit)
         * rowId : nếu là trong table thì có biến này
         */
        show(e, context, rowId = undefined) {
            if(rowId != undefined)
            this.rowIndex = rowId;
            this.isShow = true;
            if(this.viewType == 'detail'){
                this.$refs.comp_trackChange[0].computeDataTable();
            }
            this.calculatorPositionBox(e, context);
        },
        calculatorPositionBox(e, context) {
            // nếu autocomplete từ cell của handsontable
            let inputOffset = {};
            let input = $(e.target)
                .parent()
                .find(".s-control");
            if ($(e.target).closest(".handsontable").length > 0) {
                inputOffset = $(e.delegateTarget).offset();
                input = $(e.delegateTarget)
            }
            //nêu là ngoài bảng
            else {
                inputOffset = input.offset();
            }
            let detailFormOffset = context.offset();
            let detailFormWidth = context.width();
            let leftDiff = inputOffset.left - detailFormOffset.left;
            let cardWidth = $(".s-floatting-popup").width();
            let cardHeight = $(".s-floatting-popup").height();
            let inputWidth = input.width();
            let top = inputOffset.top - detailFormOffset.top + 26;
            this.style.top = top + "px";
            if (cardWidth + leftDiff > detailFormWidth) {
                this.style.left = Math.abs(leftDiff) + "px"
            } else {
                this.style.left = Math.abs(leftDiff) + "px"
            }
            if (
                window.innerHeight <
                inputOffset.top + $(".s-floatting-popup").height() + 40
            ) {
                let top1 = inputOffset.top - detailFormOffset.top - cardHeight
                if(this.viewType == 'detail'){
                    top1 = top1 + 30;
                }
                this.style.top = Math.abs(top1) +"px";
            }


        }
    }
};
</script>
<style scoped>
.s-floatting-popup {
    height: 250px;
    max-height: 500px;
    background: white;
    position: absolute;
    z-index: 200;
    width: 700px;
}
.s-floatting-popup .v-tab{
    font-size: 13px;
}
.s-floatting-popup >>> .v-tabs-bar{
    height: 30px !important;
}
</style>