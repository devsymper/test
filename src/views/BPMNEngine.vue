<template>
    <div class="w-100">
        <list-items
            :getDataUrl="'https://v2hoangnd.dev.symper.vn/users'"
            :pageTitle="'Danh sách document'"
            :containerHeight="containerHeight"
            :columns="columns"
            :data="data"
            :totalPage="totalPage"
            :actionPanelType="actionPanelType"
            :itemInputs="itemInputs"
        ></list-items>
    </div>
</template>
<script>
import ListItems from "./../components/common/ListItems.vue";
import { util } from "./../plugins/util.js";

export default {
    components: {
        "list-items": ListItems
    },
    data() {
        return {
            containerHeight: 200,
            columns: [
                { name: "id", title: "Id", type: "text" },
                { name: "name", title: "Tên", type: "text" },
                { name: "title", title: "Tiêu đề", type: "text" },
                { name: "menu", title: "Menu", type: "text" },
                { name: "workflow", title: "Worflow", type: "text" },
                { name: "createtime", title: "Thời gian tạo", type: "date" },
                {
                    name: "updatetime",
                    title: "Thời gian cập nhật",
                    type: "date"
                },
                { name: "userupdate", title: "Ba update", type: "text" },
                { name: "usercreate", title: "BA khởi tạo", type: "text" },
                { name: "countobject", title: "Số bản ghi", type: "text" }
            ],
            data: [
                {
                    id: "1910",
                    name: "f_pttm",
                    title: "PHIẾU THU TIỀN MẶT",
                    createtime: "2019-12-12 13:57:52",
                    updatetime: "2019-12-14 10:48:27",
                    userupdate: "tannq@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "0",
                    menu:
                        "<a href='/menu/?panel=detail&id=217'>DK - Phiếu thu tiền mặt</a>",
                    workflow: ""
                },
                {
                    id: "1909",
                    name: "dm_tk",
                    title: "DANH MỤC TÀI KHOẢN",
                    createtime: "2019-12-10 08:59:38",
                    updatetime: "2019-12-13 17:46:32",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "267",
                    menu:
                        "<a href='/menu/?panel=detail&id=216'>DK - Danh mục tài khoản</a>",
                    workflow: ""
                },
                {
                    id: "1907",
                    name: "f_pctm",
                    title: "PHIẾU CHI TIỀN MẶT",
                    createtime: "2019-12-09 17:21:11",
                    updatetime: "2020-01-03 17:48:27",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "2",
                    menu:
                        "<a href='/menu/?panel=detail&id=215'>DK - Phiếu chi tiền mặt</a>",
                    workflow: ""
                },
                {
                    id: "1905",
                    name: "k_dnnk",
                    title: "ĐỀ NGHỊ NHẬP KHO",
                    createtime: "2019-11-29 11:39:00",
                    updatetime: "2020-02-29 10:58:29",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "3",
                    menu:
                        "<a href='/menu/?panel=detail&id=208'>DK - Phiếu đề nghị nhập kho</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=321'>ĐỀ NGHỊ NHẬP KHO</a>"
                },
                {
                    id: "1904",
                    name: "dm_nv",
                    title: "DANH MỤC NGHIỆP VỤ",
                    createtime: "2019-11-29 08:37:06",
                    updatetime: "2020-02-01 16:56:44",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "110",
                    menu:
                        "<a href='/menu/?panel=detail&id=214'>DK - Danh mục nghiệp vụ</a>",
                    workflow: ""
                },
                {
                    id: "1900",
                    name: "k_ycl",
                    title: "YÊU CẦU LĨNH VẬT TƯ",
                    createtime: "2019-11-28 17:10:41",
                    updatetime: "2020-01-03 14:08:11",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "6",
                    menu:
                        "<a href='/menu/?panel=detail&id=213'>DK - Phiếu yêu cầu lĩnh vật tư</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=318'>YÊU CẦU LĨNH VẬT TƯ</a>"
                },
                {
                    id: "1898",
                    name: "dm_qct",
                    title: "DANH MỤC QUYỂN CHỨNG TỪ",
                    createtime: "2019-11-27 14:09:16",
                    updatetime: "2019-12-10 15:45:27",
                    userupdate: "tannq@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "213",
                    menu:
                        "<a href='/menu/?panel=detail&id=212'>DK - Danh mục quyển chứng từ</a>",
                    workflow: ""
                },
                {
                    id: "1896",
                    name: "d_pxb",
                    title: "PHIẾU XUẤT BÁN (GIAO HÀNG)",
                    createtime: "2019-11-21 17:15:14",
                    updatetime: "2019-11-29 09:38:44",
                    userupdate: "tannq@symper.vn",
                    usercreate: "thangnt@symper.vn",
                    countobject: "7",
                    menu:
                        "<a href='/menu/?panel=detail&id=201'>DK - Phiếu xuất bán</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=315'>PHIẾU XUẤT BÁN</a>"
                },
                {
                    id: "1894",
                    name: "k_lch",
                    title: "LỆNH CẤP HÀNG",
                    createtime: "2019-11-21 16:59:48",
                    updatetime: "2020-02-29 10:54:29",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "thangnt@symper.vn",
                    countobject: "6",
                    menu:
                        "<a href='/menu/?panel=detail&id=200'>DK - Lệnh cấp hàng</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=314'>LỆNH CẤP HÀNG</a>"
                },
                {
                    id: "1892",
                    name: "k_ldc",
                    title: "LỆNH ĐIỀU CHUYỂN",
                    createtime: "2019-11-21 16:36:23",
                    updatetime: "2020-03-03 14:47:39",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "thangnt@symper.vn",
                    countobject: "3",
                    menu:
                        "<a href='/menu/?panel=detail&id=202'>DK - Lệnh điều chuyển</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=316'>LỆNH ĐIỀU CHUYỂN</a>"
                },
                {
                    id: "1890",
                    name: "dm_nhom_nganh",
                    title: "DANH MỤC NHÓM NGÀNH",
                    createtime: "2019-11-13 16:48:37",
                    updatetime: "2019-11-13 16:48:37",
                    userupdate: null,
                    usercreate: "tannq@symper.vn",
                    countobject: "0",
                    menu:
                        "<a href='/menu/?panel=detail&id=211'>DK - Danh mục nhóm ngành</a>",
                    workflow: ""
                },
                {
                    id: "1886",
                    name: "dm_dvt",
                    title: "DANH MỤC ĐƠN VỊ TÍNH",
                    createtime: "2019-11-13 15:58:09",
                    updatetime: "2019-11-13 15:58:35",
                    userupdate: "tannq@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "3",
                    menu:
                        "<a href='/menu/?panel=detail&id=210'>DK - Danh mục đơn vị tính</a>",
                    workflow: ""
                },
                {
                    id: "1884",
                    name: "k_pdc",
                    title: "PHIẾU ĐIỀU CHUYỂN",
                    createtime: "2019-11-07 15:40:56",
                    updatetime: "2019-12-18 22:00:33",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "3",
                    menu:
                        "<a href='/menu/?panel=detail&id=203'>DK - Phiếu điều chuyển</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=317'>PHIẾU ĐIỀU CHUYỂN</a>"
                },
                {
                    id: "1876",
                    name: "x_lsx",
                    title: "LỆNH LẮP RÁP",
                    createtime: "2019-11-06 11:54:44",
                    updatetime: "2020-02-29 11:15:26",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "11",
                    menu:
                        "<a href='/menu/?panel=detail&id=193'>DK - Lệnh lắp ráp, sản xuất</a>",
                    workflow: ""
                },
                {
                    id: "1871",
                    name: "t_dxctnb",
                    title: "ĐỀ XUẤT CHI TIÊU NỘI BỘ",
                    createtime: "2019-11-05 10:53:59",
                    updatetime: "2020-02-27 11:22:32",
                    userupdate: "hoangdh@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "6",
                    menu:
                        "<a href='/menu/?panel=detail&id=192'>DK - Đề xuất chi tiêu nội bộ</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=313'>ĐỀ XUẤT CHI TIÊU NỘI BỘ</a>"
                },
                {
                    id: "1869",
                    name: "t_dntt",
                    title: "ĐỀ NGHỊ THANH TOÁN",
                    createtime: "2019-11-05 09:35:12",
                    updatetime: "2019-12-31 16:41:47",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "0",
                    menu:
                        "<a href='/menu/?panel=detail&id=209'>DK - Đề nghị thanh toán</a>",
                    workflow: ""
                },
                {
                    id: "1867",
                    name: "ca_dnhu",
                    title: "ĐỀ NGHỊ HOÀN ỨNG",
                    createtime: "2019-11-05 09:02:42",
                    updatetime: "2019-12-10 15:34:03",
                    userupdate: "tannq@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "1",
                    menu:
                        "<a href='/menu/?panel=detail&id=191'>DK - Đề nghị hoàn ứng</a>",
                    workflow: ""
                },
                {
                    id: "1865",
                    name: "t_dntu",
                    title: "ĐỀ NGHỊ TẠM ỨNG",
                    createtime: "2019-11-04 11:37:07",
                    updatetime: "2019-12-10 15:35:48",
                    userupdate: "tannq@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "0",
                    menu:
                        "<a href='/menu/?panel=detail&id=190'>DK - Đề nghị tạm ứng</a>",
                    workflow: ""
                },
                {
                    id: "1863",
                    name: "dm_dtkh",
                    title: "DANH MỤC ĐỐI TÁC",
                    createtime: "2019-11-04 08:56:16",
                    updatetime: "2020-01-10 16:16:14",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "95",
                    menu:
                        "<a href='/menu/?panel=detail&id=189'>DK - Danh mục đối tác khách hàng</a>",
                    workflow: ""
                },
                {
                    id: "1859",
                    name: "dm_kho_hang",
                    title: "DANH MỤC KHO HÀNG",
                    createtime: "2019-11-02 17:19:15",
                    updatetime: "2020-01-03 13:24:01",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "106",
                    menu:
                        "<a href='/menu/?panel=detail&id=188'>DK - Danh mục kho hàng</a>",
                    workflow: ""
                },
                {
                    id: "1858",
                    name: "dm_hhdv",
                    title: "DANH MỤC HÀNG HÓA DỊCH VỤ",
                    createtime: "2019-11-01 11:14:00",
                    updatetime: "2020-01-16 10:57:58",
                    userupdate: "thangnt@symper.vn",
                    usercreate: "tannq@symper.vn",
                    countobject: "25558",
                    menu:
                        "<a href='/menu/?panel=detail&id=187'>DK - Danh mục hàng hóa vật tư</a>",
                    workflow: ""
                },
                {
                    id: "1853",
                    name: "kcs_tphhp",
                    title: "Phiếu báo kết quả thành phần hóa học phôi thép",
                    createtime: "2019-10-04 09:23:44",
                    updatetime: "2019-10-04 09:43:23",
                    userupdate: null,
                    usercreate: null,
                    countobject: "2",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1851",
                    name: "vjs_gia_thep_v2",
                    title: "Giá bán thép thi trường trong nước",
                    createtime: "2019-09-21 12:55:41",
                    updatetime: "2019-09-25 17:01:39",
                    userupdate: null,
                    usercreate: null,
                    countobject: "2",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1849",
                    name: "dnpw_consol_pack_v1",
                    title: "DNPW consol package",
                    createtime: "2019-09-20 14:15:59",
                    updatetime: "2019-09-25 10:18:30",
                    userupdate: "thangnt@symper.vn",
                    usercreate: null,
                    countobject: "12",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1848",
                    name: "dnp_dm_tieu_chi_consol",
                    title: "DNPW Danh mục tiêu chí consol",
                    createtime: "2019-09-20 13:49:32",
                    updatetime: "2019-09-20 13:53:48",
                    userupdate: null,
                    usercreate: null,
                    countobject: "600",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1846",
                    name: "up_mvt",
                    title: "Cập nhật tên vật tư từ Dm hàng hóa đến phiếu PIC",
                    createtime: "2019-09-19 11:46:43",
                    updatetime: "2019-09-19 11:51:43",
                    userupdate: null,
                    usercreate: null,
                    countobject: "5",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1842",
                    name: "vjs_npsx_v1",
                    title: "Phiếu nhập phôi sản xuất",
                    createtime: "2019-09-17 15:49:45",
                    updatetime: "2019-09-18 11:21:42",
                    userupdate: null,
                    usercreate: null,
                    countobject: "0",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1840",
                    name: "vjs_ctgd_v1",
                    title: "Chứng thư giám định",
                    createtime: "2019-09-17 09:47:37",
                    updatetime: "2019-09-17 15:39:51",
                    userupdate: null,
                    usercreate: null,
                    countobject: "0",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1837",
                    name: "dnp_bcdkt",
                    title: "DNP Bảng cân đối kế toán",
                    createtime: "2019-09-17 09:17:42",
                    updatetime: "2019-09-17 09:27:03",
                    userupdate: null,
                    usercreate: null,
                    countobject: "3",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1836",
                    name: "dm_tckt",
                    title: "Danh mục tiêu chí kế toán",
                    createtime: "2019-09-17 09:04:55",
                    updatetime: "2019-09-17 09:04:55",
                    userupdate: null,
                    usercreate: null,
                    countobject: "118",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1835",
                    name: "bs_test",
                    title: "Test báo cáo BS",
                    createtime: "2019-09-16 09:53:33",
                    updatetime: "2019-09-27 15:34:10",
                    userupdate: null,
                    usercreate: null,
                    countobject: "136811",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1830",
                    name: "vjs_bh_ck",
                    title: "Danh mục chiết kháu vùng miền",
                    createtime: "2019-09-06 17:02:43",
                    updatetime: "2019-09-06 17:43:43",
                    userupdate: null,
                    usercreate: null,
                    countobject: "5",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1829",
                    name: "upload_files",
                    title: null,
                    createtime: "2019-09-05 21:51:37",
                    updatetime: "2019-09-05 21:53:35",
                    userupdate: null,
                    usercreate: null,
                    countobject: "1",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1811",
                    name: "dnpw_reporting_pack_v2",
                    title: "Báo cáo quản trị hàng tháng dnp",
                    createtime: "2019-09-01 10:06:58",
                    updatetime: "2019-09-17 23:18:17",
                    userupdate: null,
                    usercreate: null,
                    countobject: "1",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1809",
                    name: "dnp_bao_cao_sl",
                    title: "DNP Báo cáo sản lượng",
                    createtime: "2019-08-31 16:08:22",
                    updatetime: "2019-08-31 16:10:48",
                    userupdate: null,
                    usercreate: null,
                    countobject: "0",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1799",
                    name: "test_matrix_01",
                    title: "Dữ liệu đầu vào test matrix",
                    createtime: "2019-08-28 14:51:13",
                    updatetime: "2019-09-12 14:52:27",
                    userupdate: null,
                    usercreate: null,
                    countobject: "12953",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1798",
                    name: "dnp_dm_tieu_chi",
                    title: null,
                    createtime: "2019-08-28 14:00:44",
                    updatetime: "2019-08-30 11:04:20",
                    userupdate: null,
                    usercreate: null,
                    countobject: "285",
                    menu:
                        "<a href='/menu/?panel=detail&id=175'>Danh mục tiêu chí báo cáo DNP</a>",
                    workflow: ""
                },
                {
                    id: "1797",
                    name: "data_for_chart_v1",
                    title: "DATA FOR CHART",
                    createtime: "2019-08-28 12:01:28",
                    updatetime: "2019-08-29 10:28:59",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "324",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1795",
                    name: "test_chi_phi_joint",
                    title: "Test joint chi phí",
                    createtime: "2019-08-28 11:38:32",
                    updatetime: "2019-08-28 11:50:59",
                    userupdate: null,
                    usercreate: null,
                    countobject: "0",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1794",
                    name: "dm_chi_phi_phe_lieu",
                    title: "Danh mục chi phí phế liệu",
                    createtime: "2019-08-28 11:20:51",
                    updatetime: "2019-08-28 11:23:32",
                    userupdate: null,
                    usercreate: null,
                    countobject: "4",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1792",
                    name: "baocao_congno_v4",
                    title: "Báo cáo công nợ V4",
                    createtime: "2019-08-28 11:07:51",
                    updatetime: "2020-03-26 16:30:04",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "123",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1790",
                    name: "baocao_xbh_v4",
                    title: "baocao_xbh_v4",
                    createtime: "2019-08-28 10:39:52",
                    updatetime: "2020-03-26 16:48:43",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "2336",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1782",
                    name: "dnp_subsidiary_month_pack",
                    title: "Báo cáo hàng tháng DNP",
                    createtime: "2019-08-27 18:24:55",
                    updatetime: "2019-09-04 09:39:28",
                    userupdate: null,
                    usercreate: null,
                    countobject: "23",
                    menu:
                        "<a href='/menu/?panel=detail&id=176'>Báo cáo quản trị hàng tháng DNP</a>",
                    workflow:
                        "<a href='/workflow/?panel=add&action=edit&id=309'>Quy trình báo cáo hàng tháng</a>"
                },
                {
                    id: "1780",
                    name: "vjs_khbh_v1",
                    title: "Kế hoạch bán hàng chi tiết",
                    createtime: "2019-08-27 15:03:18",
                    updatetime: "2019-08-27 15:49:53",
                    userupdate: null,
                    usercreate: null,
                    countobject: "127",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1779",
                    name: "vjs_tuan_sale",
                    title: "Phân bổ tuần",
                    createtime: "2019-08-27 14:23:50",
                    updatetime: "2019-08-27 15:48:11",
                    userupdate: null,
                    usercreate: null,
                    countobject: "154",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1778",
                    name: "giabanthep_v1",
                    title: "giabanthep_v1",
                    createtime: "2019-08-26 18:04:25",
                    updatetime: "2020-03-28 11:48:27",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "24",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1777",
                    name: "kehoach_kinhdoanh",
                    title: "kehoach_kinhdoanh",
                    createtime: "2019-08-26 15:48:25",
                    updatetime: "2020-03-26 17:01:23",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "140",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1776",
                    name: "san_luong_thi_truong",
                    title: "san_luong_thi_truong",
                    createtime: "2019-08-26 13:25:43",
                    updatetime: "2020-03-26 17:05:59",
                    userupdate: "tannq@symper.vn",
                    usercreate: null,
                    countobject: "23",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1773",
                    name: "vjs_dm_dieukhoangiaohang",
                    title: "Điều khoản giao hàng",
                    createtime: "2019-08-21 16:22:58",
                    updatetime: "2019-08-21 16:23:32",
                    userupdate: null,
                    usercreate: null,
                    countobject: "11",
                    menu: "",
                    workflow: ""
                },
                {
                    id: "1771",
                    name: "dm_nptkh_v2",
                    title: "Danh mục người phụ trách khách hàng",
                    createtime: "2019-08-21 15:30:49",
                    updatetime: "2019-08-21 15:47:34",
                    userupdate: null,
                    usercreate: null,
                    countobject: "28",
                    menu:
                        "<a href='/menu/?panel=detail&id=182'>Danh mục người phụ trách khách hàng</a>",
                    workflow: ""
                }
            ],
            totalPage: 6,
            actionPanelType: "drag",
            itemInputs: {
                phone: {
                    title: "Số điện thoại",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                phone1: {
                    title: "Số điện thoại",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                phone2: {
                    title: "Số điện thoại",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                phone3: {
                    title: "Số điện thoại",
                    type: "text",
                    value: 12365,
                    validate: ["empty", "phone"]
                },
                hasLover: {
                    title: "Đã có người yêu?",
                    type: "switch",
                    value: true,
                    validate: ["empty", "phone"]
                },
                sex: {
                    title: "Giới tính",
                    type: "text",
                    value: "male",
                    validate: []
                }
            }
        };
    },
    mounted() {
        this.calcContainerHeight();
    },
    methods: {
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    },
    created() {}
};
</script>

<style>
</style>