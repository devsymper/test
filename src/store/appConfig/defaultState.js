const defaultState = {
	listFavorite: [],
	viewSideBySide:false,
	showDetailArea: false,
	currentAppId: 0,
	currentAppName: "",
	listApps:{},
	selectingItemType: '',
	activeChildItem: '',
	listItemSelected: {
		workflow_definition: {
			icon: 'mdi-lan',
			title: 'Workflows',
			name: 'workflow_definition',
			item: []
		},
		document_category:{
			icon : 'mdi-file-document-outline',
			title: "Danh mục",
			// this.$t('apps.listType.documents')
			name:  'document_category',
			item:[
				
			]
		},
		document_major:{
			icon : 'mdi-file-edit-outline',
			title: "Chứng từ",
			// title: this.$t('apps.listType.documents'),
			name:  'document_major',
			item:[

			]
		},
		orgchart: {
			icon: 'mdi-widgets-outline',
			title: 'Orgcharts',
			name: 'orgchart',
			item: []
		},
		dashboard: {
			icon: 'mdi-view-dashboard',
			title: 'Reports',
			name: 'dashboard',
			item: []
		},
		
	}
};
export default defaultState;