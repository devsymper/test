const defaultState = {
	listItemSelected: {
		documents: {
			icon: 'mdi-file-document',
			title: 'Documents',
			name: 'documents',
			item: [{
					id: 1,
					name: 'adn2'
				},
				{
					id: 3,
					name: 'adn2'
				},
				{
					id: 2,
					name: 'adn2'
				},
			]
		},
		orgcharts: {
			icon: 'mdi-view-dashboard',
			title: 'Orgcharts',
			name: 'orgcharts',
			item: []
		},
		reports: {
			icon: 'mdi-folder',
			title: 'Reports',
			name: 'reports',
			item: []
		},
		workflows: {
			icon: 'mdi-lan',
			title: 'Workflows',
			name: 'workflows',
			item: []
		},
	}
};

export default defaultState;