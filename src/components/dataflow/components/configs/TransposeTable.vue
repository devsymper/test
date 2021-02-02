<template>
    <div class="w-100 fs-13">    
        <div class="d-flex justify-space-between pl-1 w-100">
            <div class="mr-1" style="width:50%">
                <div class="font-weight-medium">Column name title </div>
                <v-text-field
                    v-model="nodeData.configs.keyColumnTitle"
                    class="d-inline-block sym-small-size"
                    single-line
                    outlined
                    hide-details
                    dense
                    flat
                    style="width: 95%"
                ></v-text-field>
            </div>
            <div style="width:50%">
                <div class="font-weight-medium">Column value title </div>
                <v-text-field
                    v-model="nodeData.configs.dataColumnTitle"
                    class="d-inline-block sym-small-size"
                    single-line
                    outlined
                    hide-details
                    dense
                    flat
                    style="width: 95%"
                ></v-text-field>
            </div>
        </div>
      
        <div class="pt-1" style="height:200px">
            <span class="pl-1 font-weight-medium">Key columns</span>
            <dataset-column-selector 
                style="height:calc(100% - 15px)"
                :rowData="nodeData.configs.keyColumns"
            />
        </div>
        <div class="pt-1" style="height:calc(100% - 250px)">
            <span class="pl-1 font-weight-medium">Data columns</span>
            <dataset-column-selector 
                :rowData="nodeData.configs.dataColumns"
            />
        </div>
    </div>
</template>

<script>
import DatasetColumnSelector from '../../../dataset/DatasetColumnSelector.vue'
export default {
  components: { DatasetColumnSelector },
    props:{
        // nodeData:{
        //     type: Object,
        //     default(){
        //         return {}
        //     }
        // },
    },
    data(){
        return{
            nodeData: {
                configs:{"wgName":"","wgDes":"","saveAs":[],"nameToSaveAs":"","newIdDataset":"stmp_1612168501341","selectedDataset":false,"errorList":{},"autoUpdatePeriod":{"time":5,"unit":"minutes"},"keyColumns":[{"uid":"stmp_1608687132143_dvt","id_dataset":"stmp_1608687132143","name":"dvt","columnName":"dvt","title":"đvt","type":"text","selected":false},{"uid":"stmp_1608687132143_ma_lo","id_dataset":"stmp_1608687132143","name":"ma_lo","columnName":"ma_lo","title":"Mã lô","type":"text","selected":false},{"uid":"stmp_1608687132143_don_gia","id_dataset":"stmp_1608687132143","name":"don_gia","columnName":"don_gia","title":"Đơn giá","type":"number","selected":false},{"uid":"stmp_1608687132143_ghi_chu","id_dataset":"stmp_1608687132143","name":"ghi_chu","columnName":"ghi_chu","title":"Ghi chú","type":"text","selected":false},{"uid":"stmp_1608687132143_ma_hang","id_dataset":"stmp_1608687132143","name":"ma_hang","columnName":"ma_hang","title":"mã hàng","type":"text","selected":false},{"uid":"stmp_1608687132143_don_hang","id_dataset":"stmp_1608687132143","name":"don_hang","columnName":"don_hang","title":"Đơn hàng","type":"text","selected":false},{"uid":"stmp_1608687132143_kho_xuat","id_dataset":"stmp_1608687132143","name":"kho_xuat","columnName":"kho_xuat","title":"Kho xuất","type":"text","selected":false},{"uid":"stmp_1608687132143_ma_khach","id_dataset":"stmp_1608687132143","name":"ma_khach","columnName":"ma_khach","title":"Mã khách","type":"text","selected":false},{"uid":"stmp_1608687132143_so_luong","id_dataset":"stmp_1608687132143","name":"so_luong","columnName":"so_luong","title":"Số lượng","type":"number","selected":false},{"uid":"stmp_1608687132143_tb1_date","id_dataset":"stmp_1608687132143","name":"tb1_date","columnName":"tb1_date","title":"tb1 date","type":"date","selected":false},{"uid":"stmp_1608687132143_ten_hang","id_dataset":"stmp_1608687132143","name":"ten_hang","columnName":"ten_hang","title":"tên hàng","type":"text","selected":false},{"uid":"stmp_1608687132143_dien_giai","id_dataset":"stmp_1608687132143","name":"dien_giai","columnName":"dien_giai","title":"DIỄN GIẢI","type":"text","selected":false},{"uid":"stmp_1608687132143_ten_khach","id_dataset":"stmp_1608687132143","name":"ten_khach","columnName":"ten_khach","title":"Tên khách","type":"text","selected":false},{"uid":"stmp_1608687132143_thue_suat","id_dataset":"stmp_1608687132143","name":"thue_suat","columnName":"thue_suat","title":"Thuế suất","type":"number","selected":false},{"uid":"stmp_1608687132143_tien_thue","id_dataset":"stmp_1608687132143","name":"tien_thue","columnName":"tien_thue","title":"Tiền thuế","type":"number","selected":false},{"uid":"stmp_1608687132143_tong_tien","id_dataset":"stmp_1608687132143","name":"tong_tien","columnName":"tong_tien","title":"Tổng tiền","type":"number","selected":false},{"uid":"stmp_1608687132143_ma_cong_ty","id_dataset":"stmp_1608687132143","name":"ma_cong_ty","columnName":"ma_cong_ty","title":"ma cong ty","type":"text","selected":false},{"uid":"stmp_1608687132143_nguoi_giao","id_dataset":"stmp_1608687132143","name":"nguoi_giao","columnName":"nguoi_giao","title":"Người giao","type":"text","selected":false},{"uid":"stmp_1608687132143_sl_da_xuat","id_dataset":"stmp_1608687132143","name":"sl_da_xuat","columnName":"sl_da_xuat","title":"SL đã xuất","type":"number","selected":false},{"uid":"stmp_1608687132143_so_hoa_don","id_dataset":"stmp_1608687132143","name":"so_hoa_don","columnName":"so_hoa_don","title":"Số hóa đơn","type":"text","selected":false},{"uid":"stmp_1608687132143_thanh_tien","id_dataset":"stmp_1608687132143","name":"thanh_tien","columnName":"thanh_tien","title":"Thành tiền","type":"number","selected":false},{"uid":"stmp_1608687132143_trang_thai","id_dataset":"stmp_1608687132143","name":"trang_thai","columnName":"trang_thai","title":"Trạng thái","type":"text","selected":false},{"uid":"stmp_1608687132143_vi_tri_kho","id_dataset":"stmp_1608687132143","name":"vi_tri_kho","columnName":"vi_tri_kho","title":"Vị trí kho","type":"text","selected":false},{"uid":"stmp_1608687132143_ten_cong_ty","id_dataset":"stmp_1608687132143","name":"ten_cong_ty","columnName":"ten_cong_ty","title":"Tên công ty","type":"text","selected":false},{"uid":"stmp_1608687132143_sl_thuc_xuat","id_dataset":"stmp_1608687132143","name":"sl_thuc_xuat","columnName":"sl_thuc_xuat","title":"SL thực xuất","type":"number","selected":false},{"uid":"stmp_1608687132143_lenh_xuat_ban","id_dataset":"stmp_1608687132143","name":"lenh_xuat_ban","columnName":"lenh_xuat_ban","title":"Lệnh xuất bán","type":"text","selected":false},{"uid":"stmp_1608687132143_ngay_chung_tu","id_dataset":"stmp_1608687132143","name":"ngay_chung_tu","columnName":"ngay_chung_tu","title":"Ngày chứng từ","type":"date","selected":false},{"uid":"stmp_1608687132143_sl_khuyen_mai","id_dataset":"stmp_1608687132143","name":"sl_khuyen_mai","columnName":"sl_khuyen_mai","title":"SL khuyến mãi","type":"number","selected":false},{"uid":"stmp_1608687132143_ma_cong_ty___1","id_dataset":"stmp_1608687132143","name":"ma_cong_ty___1","columnName":"ma_cong_ty___1","title":"Mã công ty","type":"text","selected":false},{"uid":"stmp_1608687132143_ten_hang_bang_2","id_dataset":"stmp_1608687132143","name":"ten_hang_bang_2","columnName":"ten_hang_bang_2","title":"tên hàng bảng 2","type":"text","selected":false},{"uid":"stmp_1608687132143_thong_so_ky_thuat","id_dataset":"stmp_1608687132143","name":"thong_so_ky_thuat","columnName":"thong_so_ky_thuat","title":"Thông số kỹ thuật","type":"text","selected":false},{"uid":"stmp_1608687132143_ma_hang_trong_bang_1","id_dataset":"stmp_1608687132143","name":"ma_hang_trong_bang_1","columnName":"ma_hang_trong_bang_1","title":"mã hàng trong bảng 1","type":"text","selected":false},{"uid":"stmp_1608687132143_reec","id_dataset":"stmp_1608687132143","name":"reec","columnName":"reec","title":"vvvbb","type":"text","selected":false}],"dataColumns":[{"uid":"stmp_1608687132143_dvt","id_dataset":"stmp_1608687132143","name":"dvt","columnName":"dvt","title":"đvt","type":"text","selected":true},{"uid":"stmp_1608687132143_ma_lo","id_dataset":"stmp_1608687132143","name":"ma_lo","columnName":"ma_lo","title":"Mã lô","type":"text","selected":true},{"uid":"stmp_1608687132143_don_gia","id_dataset":"stmp_1608687132143","name":"don_gia","columnName":"don_gia","title":"Đơn giá","type":"number","selected":true},{"uid":"stmp_1608687132143_ghi_chu","id_dataset":"stmp_1608687132143","name":"ghi_chu","columnName":"ghi_chu","title":"Ghi chú","type":"text","selected":true},{"uid":"stmp_1608687132143_ma_hang","id_dataset":"stmp_1608687132143","name":"ma_hang","columnName":"ma_hang","title":"mã hàng","type":"text","selected":true},{"uid":"stmp_1608687132143_don_hang","id_dataset":"stmp_1608687132143","name":"don_hang","columnName":"don_hang","title":"Đơn hàng","type":"text","selected":true},{"uid":"stmp_1608687132143_kho_xuat","id_dataset":"stmp_1608687132143","name":"kho_xuat","columnName":"kho_xuat","title":"Kho xuất","type":"text","selected":true},{"uid":"stmp_1608687132143_ma_khach","id_dataset":"stmp_1608687132143","name":"ma_khach","columnName":"ma_khach","title":"Mã khách","type":"text","selected":true},{"uid":"stmp_1608687132143_so_luong","id_dataset":"stmp_1608687132143","name":"so_luong","columnName":"so_luong","title":"Số lượng","type":"number","selected":true},{"uid":"stmp_1608687132143_tb1_date","id_dataset":"stmp_1608687132143","name":"tb1_date","columnName":"tb1_date","title":"tb1 date","type":"date","selected":true},{"uid":"stmp_1608687132143_ten_hang","id_dataset":"stmp_1608687132143","name":"ten_hang","columnName":"ten_hang","title":"tên hàng","type":"text","selected":true},{"uid":"stmp_1608687132143_dien_giai","id_dataset":"stmp_1608687132143","name":"dien_giai","columnName":"dien_giai","title":"DIỄN GIẢI","type":"text","selected":true},{"uid":"stmp_1608687132143_ten_khach","id_dataset":"stmp_1608687132143","name":"ten_khach","columnName":"ten_khach","title":"Tên khách","type":"text","selected":true},{"uid":"stmp_1608687132143_thue_suat","id_dataset":"stmp_1608687132143","name":"thue_suat","columnName":"thue_suat","title":"Thuế suất","type":"number","selected":true},{"uid":"stmp_1608687132143_tien_thue","id_dataset":"stmp_1608687132143","name":"tien_thue","columnName":"tien_thue","title":"Tiền thuế","type":"number","selected":true},{"uid":"stmp_1608687132143_tong_tien","id_dataset":"stmp_1608687132143","name":"tong_tien","columnName":"tong_tien","title":"Tổng tiền","type":"number","selected":true},{"uid":"stmp_1608687132143_ma_cong_ty","id_dataset":"stmp_1608687132143","name":"ma_cong_ty","columnName":"ma_cong_ty","title":"ma cong ty","type":"text","selected":true},{"uid":"stmp_1608687132143_nguoi_giao","id_dataset":"stmp_1608687132143","name":"nguoi_giao","columnName":"nguoi_giao","title":"Người giao","type":"text","selected":true},{"uid":"stmp_1608687132143_sl_da_xuat","id_dataset":"stmp_1608687132143","name":"sl_da_xuat","columnName":"sl_da_xuat","title":"SL đã xuất","type":"number","selected":true},{"uid":"stmp_1608687132143_so_hoa_don","id_dataset":"stmp_1608687132143","name":"so_hoa_don","columnName":"so_hoa_don","title":"Số hóa đơn","type":"text","selected":true},{"uid":"stmp_1608687132143_thanh_tien","id_dataset":"stmp_1608687132143","name":"thanh_tien","columnName":"thanh_tien","title":"Thành tiền","type":"number","selected":true},{"uid":"stmp_1608687132143_trang_thai","id_dataset":"stmp_1608687132143","name":"trang_thai","columnName":"trang_thai","title":"Trạng thái","type":"text","selected":true},{"uid":"stmp_1608687132143_vi_tri_kho","id_dataset":"stmp_1608687132143","name":"vi_tri_kho","columnName":"vi_tri_kho","title":"Vị trí kho","type":"text","selected":true},{"uid":"stmp_1608687132143_ten_cong_ty","id_dataset":"stmp_1608687132143","name":"ten_cong_ty","columnName":"ten_cong_ty","title":"Tên công ty","type":"text","selected":true},{"uid":"stmp_1608687132143_sl_thuc_xuat","id_dataset":"stmp_1608687132143","name":"sl_thuc_xuat","columnName":"sl_thuc_xuat","title":"SL thực xuất","type":"number","selected":true},{"uid":"stmp_1608687132143_lenh_xuat_ban","id_dataset":"stmp_1608687132143","name":"lenh_xuat_ban","columnName":"lenh_xuat_ban","title":"Lệnh xuất bán","type":"text","selected":true},{"uid":"stmp_1608687132143_ngay_chung_tu","id_dataset":"stmp_1608687132143","name":"ngay_chung_tu","columnName":"ngay_chung_tu","title":"Ngày chứng từ","type":"date","selected":true},{"uid":"stmp_1608687132143_sl_khuyen_mai","id_dataset":"stmp_1608687132143","name":"sl_khuyen_mai","columnName":"sl_khuyen_mai","title":"SL khuyến mãi","type":"number","selected":true},{"uid":"stmp_1608687132143_ma_cong_ty___1","id_dataset":"stmp_1608687132143","name":"ma_cong_ty___1","columnName":"ma_cong_ty___1","title":"Mã công ty","type":"text","selected":true},{"uid":"stmp_1608687132143_ten_hang_bang_2","id_dataset":"stmp_1608687132143","name":"ten_hang_bang_2","columnName":"ten_hang_bang_2","title":"tên hàng bảng 2","type":"text","selected":true},{"uid":"stmp_1608687132143_thong_so_ky_thuat","id_dataset":"stmp_1608687132143","name":"thong_so_ky_thuat","columnName":"thong_so_ky_thuat","title":"Thông số kỹ thuật","type":"text","selected":true},{"uid":"stmp_1608687132143_ma_hang_trong_bang_1","id_dataset":"stmp_1608687132143","name":"ma_hang_trong_bang_1","columnName":"ma_hang_trong_bang_1","title":"mã hàng trong bảng 1","type":"text","selected":true},{"uid":"stmp_1608687132143_reec","id_dataset":"stmp_1608687132143","name":"reec","columnName":"reec","title":"vvvbb","type":"text","selected":true}],"keyColumnTitle":"Name","dataColumnTitle":"Value","autoReplaceNullValue":true}
            },
        }
    },

}
</script>

<style scoped>

</style>