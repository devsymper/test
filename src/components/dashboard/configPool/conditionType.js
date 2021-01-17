let allCondType = {
	contains: {
		label: "Contains",
		value: "contains"
	},
	notcontains: {
		label: "Not contains",
		value: "notcontains"
	},
	startwith: {
		label: "Start with",
		value: "startwith"
	},
	notstartwith: {
		label: "Not Start with",
		value: "notstartwith"
	},
	is: {
		label: "Is",
		value: "is"
	},
	isnot: {
		label: "Is Not",
		value: "isnot"
	},
	isblank: {
		label: "Is Blank",
		value: "isblank"
	},
	notblank: {
		label: "Not Blank",
		value: "notblank"
	},
	in: {
		label: "In",
		value: "in"
	},
	notin: {
		label: "Not In",
		value: "notin"
	},
	isall: {
		label: "Is all",
		value: "isall"
	},

	lessthan: {
		label: "Less than",
		value: "lessthan",
		sign: '<'
	},
	greaterthan: {
		label: "Greater than",
		value: "greaterthan",
		sign: '>'
	},
	lessthanorequal: {
		label: "Less than or equal",
		value: "lessthanorequal",
		sign: '<='
	},
	greaterthanorequal: {
		label: "Greater or equal",
		value: "greaterthanorequal",
		sign: '>='
	},
};

let speCondType = {
	number: ['isall', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'is', 'isnot', 'isblank', 'notblank', 'in', 'notin'],
	date: ['isall', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'is', 'isnot', 'isblank', 'notblank', 'in', 'notin'],
	datetime: ['isall', 'lessthan', 'lessthanorequal', 'greaterthan', 'greaterthanorequal', 'is', 'isnot', 'isblank', 'notblank', 'in', 'notin'],
	text: ['isall', 'is', 'isnot', 'isblank', 'notblank', 'startwith', 'contains', 'notcontains', 'notstartwith', 'in', 'notin']
};

let cpnCondType = {};
for (let type in speCondType) {
	cpnCondType[type] = {};
	for (let condName of speCondType[type]) {
		cpnCondType[type][condName] = allCondType[condName];
	}
}
export default cpnCondType;