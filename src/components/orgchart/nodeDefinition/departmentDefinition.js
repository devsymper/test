let shapeSize = {
	width: 200,
	height: 70
};

let avatarSize = shapeSize.height / 2 - 5;
let borderBottomHeight = 2;
let SymperDepartment;
export const DEFAULT_DEPARTMENT_DISPLAY = {
	fill: 'white',
	rx: 0,
	ry: 0,
	'stroke-width': 0.2,

	stroke: '#707070'
};
export const FOUCUS_DEPARTMENT_DISPLAY = {
	'stroke-width': 2,
	stroke: '#f58634'
};
let CEConfig = {
	stickHeight: 20,
	stickWidth: 1,
	radius: 7,
	fontSize: 12
};
export const DEFAULT_DEPARTMENT_ATTRS = {
	'.card': DEFAULT_DEPARTMENT_DISPLAY,
	'.name': {
		'text-anchor': 'middle',
		fill: '#000',
		text: '',
		'font-family': 'Roboto',
		'ref-x': 0.5,
		'ref-y': 0.12,
		'font-weight': 500,
		'font-size': 13,
	},
	image: {
		'xlink:href': '/img/empty_avatar.PNG',
		height: avatarSize,
		width: avatarSize,
		y: shapeSize.height / 4 + 7,
	},
	'.manager-name': {
		y: shapeSize.height / 2 + avatarSize / 3 + 2,
		x: 20 + avatarSize,
		fill: '#a4a4a4',
		'font-size': 13,
		stroke: 'white',
		'stroke-width': 0,
		'font-weight': 300,
		'font-family': 'Roboto',
	},
	'.btn.add': {
		'ref-dx': 0,
		'ref-y': 0,
		'ref': '.card',
		event: 'element:add',
		cursor: 'pointer'
	},
	'.btn.add>circle': {
		r: 7,
		fill: 'green',
		stroke: 'green',
		'stroke-width': 0
	},
	'.btn>rect': {
		height: 20,
		width: 45,
		rx: 2,
		ry: 2,
		fill: 'transparent',
		'stroke-width': 1
	},
	'.btn.add>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 400,
		stroke: 'white',
		x: -4,
		y: 5,
		'font-family': 'Roboto'
	},

	'.border-bottom': {
		height: borderBottomHeight,
		y: shapeSize.height - borderBottomHeight + 1,
		x: -0.5,
		width: shapeSize.width + 1,
		fill: '#f58634',
		'stroke-width': 0
	},
	'.btn.remove': {
		'ref-dx': -200,
		'ref-y': 0,
		'ref': '.card',
		event: 'element:remove',
		cursor: 'pointer'
	},
	'.btn.remove>circle': {
		r: 7,
		fill: 'red',
	},
	'.btn.remove>text': {
		fill: 'white',
		'font-size': 11,
		'font-weight': 500,
		stroke: 'white',
		x: -3,
		y: 4,
		'font-family': 'Roboto'
	},

	'.stick': {
		height: CEConfig.stickHeight,
		width: CEConfig.stickWidth,
		'stroke-width': 0,
		'fill': '#848484',
		// 'fill': DEFAULT_DEPARTMENT_DISPLAY.stroke,
		x: shapeSize.width / 2,
		y: shapeSize.height
	},

	'.btn-collapse-expand': {
		'ref-dx': 0,
		'ref-y': shapeSize.height + CEConfig.stickHeight - 20,
		'ref': '.card',
		event: 'element:collapse',
		cursor: 'pointer'
	},
	'.btn-collapse-expand>circle': {
		r: 7,
		fill: 'yellow',
		stroke: 'yellow',
		'stroke-width': 0
	},
	'.btn-collapse-expand>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 400,
		stroke: 'white',
		x: -4,
		y: 5,
		'font-family': 'Roboto'
	},
	'.collapse-expand-circle': {
		r: CEConfig.radius,
		fill: '#848484',
		event: 'element:collapse',

		// x: shapeSize.width / 2,
		// y: shapeSize.height + CEConfig.stickHeight
	},
	'.expand-text': {
		x: shapeSize.width / 2 - CEConfig.fontSize / 2 + 2,
		y: shapeSize.height + CEConfig.stickHeight + CEConfig.fontSize / 2 - 1,
		fill: 'white',
		cursor: 'pointer',
		'stroke-width': 1,
		display: 'none',
		event: 'element:collapse',

	},
	'.collapse-text': {
		x: shapeSize.width / 2 - CEConfig.radius / 2,
		y: shapeSize.height + CEConfig.stickHeight + CEConfig.radius,
		fill: 'white',
		'stroke-width': 1,
		'font-size': CEConfig.fontSize * 2,
		cursor: 'pointer',
		event: 'element:collapse',

	}
	
};

export const DEPARTMENT_NODE_DATA = {
	"type": "org.Member",
	"size": {
		"width": shapeSize.width,
		"height": shapeSize.height
	},
	"position": {
		"x": 50,
		"y": 200
	},
	"name": "Phòng ban 1",
	"attrs": DEFAULT_DEPARTMENT_ATTRS
};

export const departmentMarkup =
	`<g class="rotatable ">
        <g class="symper-orgchart-node">
            <g class="scalable">
                <rect class="card"/>
            </g>
            <image />
            <text class="name"/>
            <text class="manager-name"/>

            <g>
                <rect class="border-bottom"/>
            </g>

            <g class="btn add orgchart-action">
                <circle class="add"/>
                <text class="add">+</text>
            </g>
			<g class="btn-collapse-expand">
				<circle class="collapse-expand-circle"/>
				<text class="expand-text">+</text>
			</g>
            <g class="btn remove orgchart-action">
                <circle class="remove"/>
                <text class="remove">X</text>
            </g>
           
        </g>
    </g>`.replace(/\n/g, '').replace(/\s+/g, ' ');
	
	export const defineDepartment = function () {
	SymperDepartment = joint.shapes.org.Member.define('Symper.Department', {
		size: {
			width: shapeSize.width,
			height: shapeSize.height
		},
		hidden: false,
		attrs: DEFAULT_DEPARTMENT_ATTRS,
		markup: departmentMarkup,
	}, {
		hidden:false,
		isHidden: function () {
			return !!this.get('hidden');
		},

		isCollapsed: function () {
			return !!this.get('collapsed');
		},

		toggleButtonVisibility: function (visible) {

		},

		toggleButtonSign: function (plus) {

		}
	});
}

export const createDepartmentNode = function (name) {
	var element = new SymperDepartment().on({
		'change:name': function (cell, name) {
			cell.attr('.name/text',
				joint.util.breakText(name, 
					{
						width: 100,
						height: 45
					},
					{ 'font-size': 13 },
					{ ellipsis: true },
					cell.attr('.name',))
			);
		},
		'change:rank': function (cell, rank) {
			cell.attr('.rank/text', joint.util.breakText(rank, {
				width: 165,
				height: 45
			}, cell.attr('.rank')));
		}
	}).set({
		name: name,
		// rank: rank
	});
	return element;
}
