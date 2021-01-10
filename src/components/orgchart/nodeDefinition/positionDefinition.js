let shapeSize = {
    width: 210,
    height: 70
};
let avatarSize = shapeSize.height / 2 - 5;
let borderBottomHeight = 2;
let CEConfig = {
	stickHeight: 20,
	stickWidth: 1,
	radius: 7,
	fontSize: 12
};
export const DEFAULT_POSITION_DISPLAY = {
    fill: 'white',
    rx: 0,
    ry: 0,
    'stroke-width': 0.2,
    stroke: '#707070'
};
export const FOUCUS_POSITION_DISPLAY = {
    'stroke-width': 2,
    stroke: '#f58634'
};
export const DEFAULT_POSITION_ATTRS = {
    '.card': DEFAULT_POSITION_DISPLAY,
    '.name': {
        'text-anchor': 'middle',
        fill: '#000',
        text: '',
        'font-family': 'Roboto',
        'ref-x': 0.5,
        'ref-y': 0.12,
        'font-weight': 500,
    },
    image: {
        'xlink:href': '/img/empty_avatar.PNG',
        height: avatarSize,
        width: avatarSize,
        y: shapeSize.height / 3,
        x: shapeSize.width - avatarSize - 40
    },
    '.account-number-plus': {
        y: shapeSize.height - avatarSize + 7,
        x: shapeSize.width - avatarSize + 5,
        fill: '#a4a4a4',
        'font-size': 14,
        stroke: 'white',
        'stroke-width': 0,
        'font-weight': 500,
        'font-family': 'Roboto',
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
    '.position-code': {
        y: shapeSize.height / 4 + 20,
        x: 7,
        fill: '#a4a4a4',
        'font-size': 13,
        stroke: 'white',
        'stroke-width': 0,
        'font-weight': 300,
        'font-family': 'Roboto',
    },
    '.dynamic-attr-value': {
        y: shapeSize.height / 4 + 38,
        x: 7,
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
    '.btn.add>circle': { r: 7, fill: 'green', stroke: 'green', 'stroke-width': 0 },
    '.btn>rect': { height: 20, width: 45, rx: 2, ry: 2, fill: 'transparent', 'stroke-width': 1 },
    '.btn.add>text': { fill: 'white', 'font-size': 15, 'font-weight': 400, stroke: 'white', x: -4, y: 5, 'font-family': 'Roboto' },
    '.border-bottom': {
        height: borderBottomHeight,
        y: shapeSize.height - borderBottomHeight + 1,
        x: -0.5,
        width: shapeSize.width + 1,
        fill: '#f58634',
        'stroke-width': 0
    },
    '.btn.remove': {
        'ref-dx': -210,
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
    '.btn-collapse-expand-hor': {
		'ref-dx': -shapeSize.width / 2, 
		'ref-y': 0,
		'ref': '.card',
		event: 'element:collapse',
		cursor: 'pointer'
	},
	'.btn-collapse-expand-ver': {
		'ref-dx': 0, 
		'ref-y': shapeSize.height/2,
		'ref': '.card',
		event: 'element:collapse',
		cursor: 'pointer'
	},
	'.btn-collapse-expand-hor>circle': {
		r: 7,
		fill: 'blue',
		stroke: 'blue',
		'stroke-width': 0
	},
	'.btn-collapse-expand-ver>circle': {
		r: 7,
		fill: 'blue',
		stroke: 'blue',
		'stroke-width': 0
	},
	'.btn-collapse-expand-hor>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 400,
		stroke: 'white',
		x: -4,
		y: 5,
		'font-family': 'Roboto'
	},
	'.btn-collapse-expand-ver>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 400,
		stroke: 'white',
		x: -4,
		y: 5,
		'font-family': 'Roboto'
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


export const POSITION_NODE_DATA = {
    "type": "org.Member",
    "size": {
        "width": shapeSize.width,
        "height": shapeSize.height
    },
    "position": {
        "x": 50,
        "y": 200
    },
    "name": "Vị trí 1",
    "attrs": DEFAULT_POSITION_ATTRS
};
let SymperPosition;
export const positionMarkup = `<g class="rotatable symper-orgchart-node">
    <g class="scalable">
        <rect class="card"/>
    </g>
    <image/>
    <text class="account-number-plus"/>
    <text class="name"/>
    <text class="position-code"/>
    <text class="dynamic-attr-value"/>
    <text class="name"/>
    <text class="manager-name"/>

    <g>
        <rect class="border-bottom"/>
    </g>

    <g class="btn add orgchart-action">
        <circle class="add"/>
        <text class="add">+</text>
    </g>

    <g class="btn remove orgchart-action">
        <circle class="remove"/>
        <text class="remove">X</text>
    </g>

</g>`.replace(/\n/g, '').replace(/\s+/g, ' ');

export const definePosition = function() {
    SymperPosition = joint.shapes.org.Member.define('Symper.Position', {
        size: {
            width: shapeSize.width,
            height: shapeSize.height
        },
        attrs: DEFAULT_POSITION_ATTRS,
        markup: positionMarkup
    }, {
        isHidden: function() {
            return !!this.get('hidden');
        },

        isCollapsed: function() {
            return !!this.get('collapsed');
        },

        toggleButtonVisibility: function(visible) {

        },

        toggleButtonSign: function(plus) {

        }
    });
}

export const createPositionNode = function(name, attr = {}) {
    var element = new SymperPosition(attr).on({
        'change:name': function(cell, name) {
            cell.attr('.name/text',
                joint.util.breakText(name, { width: 160, height: 45 },
                    cell.attr('.name'))
            );
        },
        'change:rank': function(cell, rank) {
            cell.attr('.rank/text', joint.util.breakText(rank, { width: 165, height: 45 }, cell.attr('.rank')));
        }
    }).set({
        name: name,
        // rank: rank
    });

    return element;
}