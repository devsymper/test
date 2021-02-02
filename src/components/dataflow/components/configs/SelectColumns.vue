<template> 
	<DatasetColumnSelector :rowData="columns" />

</template>

<script>
import DatasetColumnSelector from '@/components/dataset/DatasetColumnSelector';
export default {
	props: {
		columns: {
			tyoe: Array,
			default() {
				return [
					{
						uid: 'stmp_1601113864179_dvt',
						idDataset: 'stmp_1601113864179',
						columnName: 'dvt',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: 'đvt',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_tskt',
						idDataset: 'stmp_1601113864179',
						columnName: 'tskt',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: 'TTKT1',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_ma_hang',
						idDataset: 'stmp_1601113864179',
						columnName: 'ma_hang',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: 'Mã hàng',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_ton_dau',
						idDataset: 'stmp_1601113864179',
						columnName: 'ton_dau',
						type: 'number',
						symperDocId: 'stmp_1601113864179',
						title: 'Sl Tồn đầu',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_kho_xuat',
						idDataset: 'stmp_1601113864179',
						columnName: 'kho_xuat',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: 'Kho xuất',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_ton_cuoi',
						idDataset: 'stmp_1601113864179',
						columnName: 'ton_cuoi',
						type: 'number',
						symperDocId: 'stmp_1601113864179',
						title: 'SL Tồn cuối',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_sum_sl_nhap',
						idDataset: 'stmp_1601113864179',
						columnName: 'sum_sl_nhap',
						type: 'number',
						symperDocId: 'stmp_1601113864179',
						title: ' sum SL  nhập',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_first_ten_hang',
						idDataset: 'stmp_1601113864179',
						columnName: 'first_ten_hang',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: ' first Tên hàng',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_sum_sl_xuat_tru',
						idDataset: 'stmp_1601113864179',
						columnName: 'sum_sl_xuat_tru',
						type: 'number',
						symperDocId: 'stmp_1601113864179',
						title: ' sum SL xuất trừ',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_sum_sl_thuc_xuat',
						idDataset: 'stmp_1601113864179',
						columnName: 'sum_sl_thuc_xuat',
						type: 'number',
						symperDocId: 'stmp_1601113864179',
						title: ' sum SL thực xuất',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_first_ma_chung_tu',
						idDataset: 'stmp_1601113864179',
						columnName: 'first_ma_chung_tu',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: ' first Mã chứng từ',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_first_so_chung_tu',
						idDataset: 'stmp_1601113864179',
						columnName: 'first_so_chung_tu',
						type: 'text',
						symperDocId: 'stmp_1601113864179',
						title: ' first Số chứng từ',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
					{
						uid: 'stmp_1601113864179_first_ngay_chung_tu',
						idDataset: 'stmp_1601113864179',
						columnName: 'first_ngay_chung_tu',
						type: 'date',
						symperDocId: 'stmp_1601113864179',
						title: ' first Ngày chứng từ',
						from: '27318aea-b316-4f22-b225-a9f674e75b76',
						selected: true,
					},
				];
			},
		},
	},
	components: {
		DatasetColumnSelector,
	},
};
</script>

<style></style>
