<template>
    <v-card 
    v-show="isShow" 
    class="card-history-control" :style="positionBox">
        <v-data-table
        :headers="headers"
        :items="dataTable"
        disable-pagination
        fixed-header
        hide-default-footer
        dense
        no-data-text="Không có dữ liệu"
        calculate-widths
        >
       
        </v-data-table>
    </v-card>
</template>
<script>
export default {
    data () { 
        return {
            isShow:false,
            positionBox:{'top':0,'left':0},
            headers: [
                {text:'Ngày',value:'date'},
                {text:'Người cập nhật',value:'userupdate'},
                {text:'Giá trị trước',value:'beforeValue'},
                {text:'Giá trị sau',value:'afterValue'}
            ],
            dataTable: [
                {date:'21/10/2020',userupdate:'Nguyễn Đình Hoàng',beforeValue:'sửa đổi 1',afterValue:'sửa đổi 2'},
                {date:'21/10/2020',userupdate:'Nguyễn Đình Hoàng',beforeValue:'sửa đổi 1',afterValue:'sửa đổi 2'},
                {date:'21/10/2020',userupdate:'Nguyễn Đình Hoàng',beforeValue:'sửa đổi 1',afterValue:'sửa đổi 2'},
                {date:'21/10/2020',userupdate:'Nguyễn Đình Hoàng',beforeValue:'sửa đổi 1',afterValue:'sửa đổi 2'},
                {date:'21/10/2020',userupdate:'Nguyễn Đình Hoàng',beforeValue:'sửa đổi 1',afterValue:'sửa đổi 2'},
            ],
            controlId:""
        }
    },
 
    
    methods:{
        show(el){
            this.isShow = true;
            this.calculatorPositionBox(el);
        },
        hide(){
            this.isShow = false;
            this.resetData();
        },
        resetData(){
            // this.dataTable = []
        },
      
        setData(data){
            this.dataTable = data.dataBody;
        },
        calculatorPositionBox(el){
            let autoEL = $(this.$el).detach();
            el.parent().append(autoEL);
            this.positionBox = {'top':el.height()+2+'px','left':'0px'};
        },
       
    }
}
</script>
<style scoped>
    .card-history-control{
        position: absolute;
        top: 0;
        left: 100px;
        z-index: 99999;
        max-width: unset !important;
    }
    .active-row{
        background: #f0f0f0;
    } 
    .card-history-control >>> tbody tr{
        font-size: 13px;
        color: #212529;
    }
    .card-history-control >>> td{
        /* display: flex!important; */
        height: 30px;
        font-size: 13px;
        white-space: nowrap;
    }
    .card-history-control >>> th{
        /* display: flex!important; */
        white-space: nowrap;
    }
    .row-item{
        color: red;
    }

</style>