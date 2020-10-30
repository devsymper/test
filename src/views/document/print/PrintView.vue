<template>
    <VuePerfectScrollbar class="wrap-print-multiple">
        <detail-view 
        v-for="(value, index) in listObject" 
        :key="index" 
        :isPrint="true"
        :contentHeight="'100%'"
        :formId="(value.formId) ? value.formId : 0" 
        :docObjInfo="{docObjId:value.document_object_id,docSize : '595px'}" 
        @after-loaded-component-detail="afterLoaded"
        />
    </VuePerfectScrollbar>
</template>

<script>
import Detail from './../detail/Detail'
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        'detail-view' : Detail,
        VuePerfectScrollbar
    },
    data(){
        return {
            listObject:[],
            countComponentDetail:0
        }
    },
    props:{
        allObject:{
            type:Array,
            default(){
                return []
            }
        },
        isAlwaysPrint:{
            type:Boolean,
            default:true
        }
    },
    created(){
        if(this.$route.params.extraData)
        this.listObject = this.$route.params.extraData.listObject;
    },
    watch:{
        allObject:{
            deep: true,
            immediate: true,
            handler(newVl){
                this.listObject = newVl
            }
        }
    },
    methods:{

        afterLoaded(){
            if(!this.isAlwaysPrint){
                return;
            }
            this.countComponentDetail += 1;
            if(this.countComponentDetail == Object.keys(this.listObject).length){
                setTimeout((self) => {
                    self.printContent() 
                }, 500,this);
            }
        },
        printContent(fromContext = false){
            
            // Get HTML to print from element
            
            let prtHtml = $('.wrap-print-multiple').clone();
            prtHtml.find('.wrap-content-detail').css({height:'100%'})
            prtHtml = prtHtml.html();
            // Get all stylesheets HTML
            let stylesHtml = '';
            for (const node of [...document.querySelectorAll('link, style')]) {
            stylesHtml += node.outerHTML;
            }
            let cstyle = `<style type="text/css">
                         @media print {
                                html, body{
                                height:100%;
                                width:100%;
                                }
                            }
                            .wrap-print-multiple table{
                                width:100% !important;
                            }
                            .wrap-print-multiple{
                                width:100%;
                            }
                            .sym-form-Detail{
                                overflow:hidden;
                            }
                    </style>`
                     stylesHtml += cstyle;
            // Open the print window
            const WinPrint = window.open('', 'Print', 'width=800,height=900,toolbar=0,scrollbars=0,status=0');

            WinPrint.document.write(`<!DOCTYPE html>
            <html>
            <head>
                ${stylesHtml}
            </head>
            <body>
                ${prtHtml}
            </body>
            </html>`);

            WinPrint.document.close(); // necessary for IE >= 10
            WinPrint.focus(); // necessary for IE >= 10*/

            setTimeout(() => {
                WinPrint.print();
                WinPrint.close();
            }, 1000);
           
            
        },
    }
    
    
    
}
</script>
<style scoped>
    .wrap-print-multiple{
        overflow: auto;
        height: calc(100%);
        width: 100%;
    }
    .wrap-print-multiple >>> .wrap-s-control-table table{
        width: 100% !important;
    }
    .wrap-print-multiple >>> .wrap-content-detail{
        overflow-y: hidden !important;
    }
</style>