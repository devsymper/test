<template>
    <div class="symper-action-view" :style="{
        width: myWidth,
        height: myHeight,
    }">
        <div class="h-100 w-100" ref="container">

        </div>
    </div>
</template>

<script>
import {getKeyForAction} from "./index";
import actionMap from "./index";

export default {
    props: {
        width: {
            default: '100%'
        },
        height: {
            default: '100%'
        },
        /**
         * Định nghĩa về action cần thực thi trong component này
         */
        actionDef : {
            type: Object,
            default(){
                return {
                    module: '',
                    resource: '',
                    scope: '',
                    action: ''
                }
            }
        },
        param: {
            type: Object,
            default(){
                return {}
            }
        }
    },
    watch: {
        actionDef: {
            deep: true,
            immediate: true,
            handler(newValue){
                this.displayActionView();
            }
        }
    },
    created(){
        this.displayActionView();
    },
    methods: {
        async displayActionView(){
            let key = getKeyForAction(this.action);
            if(actionMap.hasOwnProperty(key)) {
                if(actionMap[key].hasOwnProperty('getLink')){
                    let link = actionMap[key].getLink(this.param);
                    let matchRoute = this.$router.match(url);
                    if(matchRoute && matchRoute.matched && matchRoute.matched[0]){
                        let newComponent = await matchRoute.matched[0].components.default();
                        debugger;
                    }
                }else{
                    console.warn('[SYMPER ACTION VIEW]: getLink method not found in action definition', this.action, this.param);
                }
            } else {
                console.error('[SYMPER ACTION VIEW]: action key not ', this.action);
            }
        }
    },
    computed: {
        myWidth(){
            return isNaN(Number(this.width)) ? this.width : (this.width + 'px');
        },
        myHeight(){
            return isNaN(Number(this.height)) ? this.height : (this.height + 'px');
        },
    }
}
</script>

<style>

</style>