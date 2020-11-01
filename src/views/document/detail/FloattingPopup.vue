<template>
    <div class="s-floatting-popup elevation-6" :style="position" v-show="isShow">
        <v-tabs height="40" v-model="currentTab" background-color="transparent" grow>
            <v-tab v-for="item in tabs" :key="item.name">
                {{ item.text }}
            </v-tab>
        </v-tabs>

        <div style="height: calc(100% - 40px)">
            <v-tabs-items v-model="currentTab" class="h-100">
                <v-tab-item v-for="item in tabs" :key="item.name" class="h-100">
                    <component 
                        class="h-100"
                        :focusingControlName="focusingControlName"
                        :ref="'comp_'+item.name" 
                        :is="item.component"
                        :instance="instance"
                    />
                </v-tab-item>
            </v-tabs-items>
        </div>
    </div>
</template>
<script>
import HistoryControl from './HistoryControl';
export default {
    components: {
        HistoryControl
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
                self.showTrackChangeComp();            
            }, 10, this);
        }
    },
    data() {
        return {
        date: null,
        isShow: false,
        position: null,
        listLink: {},
        listLinkDisplay: {},
        currentTab: 1,
        tabs: [
            {
                text: "Liên kết",
                name: 'link',
                component: HistoryControl
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
        };
    },
    beforeMount() {
        this.position = {
            top: "26px",
            left: "0px"
        };
    },
    mounted(){
        this.showTrackChangeComp();
    },
    methods: {
        showTrackChangeComp(){
            if(this.$refs.comp_trackChange){
                this.$refs.comp_trackChange[0].show();
            }
        },
        hide() {
            this.isShow = false;
        },
        show(e, controlName) {
            this.isShow = true;
            this.calculatorPositionBox(e);
        },
        calculatorPositionBox(e) {
            // nếu autocomplete từ cell của handsontable
            let inputOffset = {};
            let input = $(e.target)
                .parent()
                .find(".s-control");
            if ($(e.target).closest(".handsontable").length > 0) {
                inputOffset = $(e.delegateTarget).offset();
            }
            //nêu là ngoài bảng
            else {
                inputOffset = input.offset();
            }
            let detailFormOffset = $("#sym-Detail-" + this.instance).offset();
            let detailFormWidth = $("#sym-Detail-" + this.instance).width();
            let leftDiff = inputOffset.left - detailFormOffset.left;
            let cardWidth = $(".s-floatting-popup").width();
            let cardHeight = $(".s-floatting-popup").height();
            let inputWidth = input.width();
            if (cardWidth + leftDiff > detailFormWidth) {
                this.position = {
                top: inputOffset.top - detailFormOffset.top + 26 + 30 + "px",
                left: Math.abs(inputOffset.left + inputWidth - 10 - cardWidth) + "px"
                };
            } else {
                this.position = {
                top: inputOffset.top - detailFormOffset.top + 26 + 30 + "px",
                left: Math.abs(detailFormOffset.left + leftDiff) + "px"
                };
            }
            if (
                window.innerHeight <
                inputOffset.top + $(".s-floatting-popup").height() + 40
            ) {
                this.position.top =
                Math.abs(inputOffset.top - detailFormOffset.top - cardHeight + 30) +
                "px";
            }
        }
    }
};
</script>
<style scoped>
.s-floatting-popup {
  height: auto;
  max-height: 500px;
  width: 600px;
  background: white;
  box-shadow: var(--symper-box-shadow-top);
  position: absolute;
  z-index: 200;
  height: 300px;
}
</style>