const defaultState = {
	listFavorite: [],
	listItemSelected: {
		document_definition: {
			icon: 'mdi-file-edit-outline',
			title: 'Documents',
			name: 'document_definition',
			item: []
		},
		orgchart: {
			icon: 'mdi-widgets-outline',
			title: 'Orgcharts',
			name: 'orgchart',
			item: []
		},
		dasboard: {
			icon: 'mdi-view-dashboard',
			title: 'Reports',
			name: 'dasboard',
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