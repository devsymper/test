<template>
    <div class="symper-dataflow-embed" :style="{
        width: cpnWidth,
        height: cpnHeight
    }">
        <iframe :src="embedLink" style="border:none" class="w-100 h-100" ref="dataflowIframe">

        </iframe>
    </div>
</template>

<script>
export default {
    methods: {
        /**
         * Chạy dataflow với tham số truyền vào là các biến của dataflow đó
         */
        runDataflow(vars = {}){
            let ifr = this.$refs.dataflowIframe.contentWindow.window;
            ifr.postMessage({
                action: 'run-dataflow',
                vars: vars
            },'*');
        },

        listenEventsFromIframe(){
            let self = this;
            // let ifr = this.$refs.dataflowIframe.contentWindow.window;
            window.addEventListener("message", function(event) {
                let data = event.data;
                if(data.action == 'dataflow-finished-running'){
                    self.$emit('dataflow-finished-running', data.data ? data.data : {});
                }
            });
        }
    },
    mounted(){
        this.listenEventsFromIframe();
    },
    computed: {
        embedLink(){
            if(this.dataflowId){
                return "https://bi.symper.vn/#/dataflow/"+this.dataflowId+"/embed"
            }else{
                return ''
            }
        },
        cpnWidth(){
            return isNaN(this.width) ? this.width : (this.width + 'px');
        },
        cpnHeight(){
            return isNaN(this.height) ? this.height : (this.height + 'px');
        },
    },
    props: {
        dataflowId: {
            default: 0
        },
        height:{
            default: 300
        },
        width:{
            default: 600
        }
    }
}
</script>

<style>

</style>