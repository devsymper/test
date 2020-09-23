const defaultState = {
	listFavorite: [],
	viewSideBySide:false,
	currentAppId: 0,
	listItemSelected: {
		document_category:{
			icon : 'mdi-file-edit-outline',
			title: "Danh mục",
			// this.$t('apps.listType.documents')
			name:  'document_category',
			item:[
				
			]
		},
		document_major:{
			icon : 'mdi-file-edit-outline',
			title: "Nghiệp vụ",
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
		workflow_definition: {
			icon: 'mdi-lan',
			title: 'Workflows',
			name: 'workflow_definition',
			item: []
		},
	}
};
export default defaultState;