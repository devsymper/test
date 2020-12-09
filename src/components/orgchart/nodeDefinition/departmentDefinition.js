let shapeSize = {
	width: 250,
	height: 120
};
let icon = {
	user: '<path xmlns="http://www.w3.org/2000/svg" id="account-multiple-outline" d="M10.011,10.06a3.167,3.167,0,0,0,0-3.686A2.147,2.147,0,0,1,11.233,6a2.217,2.217,0,0,1,0,4.433,2.147,2.147,0,0,1-1.222-.374M5.217,8.217a2.217,2.217,0,1,1,2.217,2.217A2.217,2.217,0,0,1,5.217,8.217m1.267,0a.95.95,0,1,0,.95-.95.95.95,0,0,0-.95.95m5.383,6.017V15.5H3V14.233S3,11.7,7.433,11.7s4.433,2.533,4.433,2.533m-1.267,0c-.089-.494-.842-1.267-3.167-1.267s-3.122.83-3.167,1.267M11.835,11.7a3.369,3.369,0,0,1,1.3,2.533V15.5h2.533V14.233s0-2.3-3.838-2.533Z" transform="translate(-3 -6)"/>',
	department:'<path xmlns="http://www.w3.org/2000/svg" id="office-building-outline" d="M11.773,2.409v8.182H9.045V9H8.136v1.591H5.409V2.409h6.364M9.955,4.227h.909V3.318H9.955v.909m-1.818,0h.909V3.318H8.136v.909m-1.818,0h.909V3.318H6.318v.909M9.955,6.045h.909V5.136H9.955v.909m-1.818,0h.909V5.136H8.136v.909m-1.818,0h.909V5.136H6.318v.909M9.955,7.864h.909V6.955H9.955v.909m-1.818,0h.909V6.955H8.136v.909m-1.818,0h.909V6.955H6.318v.909M9.955,9.682h.909V8.773H9.955v.909m-3.636,0h.909V8.773H6.318v.909M12.682,1.5H4.5v10h8.182Z" transform="translate(-4.5 -1.5)"/>'
};
let avatarSize = shapeSize.height / 2 + 5;
let borderBottomHeight = 2;
let SymperDepartment;
export const DEFAULT_DEPARTMENT_DISPLAY = {
	fill: 'white',
	rx: 4,
	ry: 4,
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
		'font-size': 15,
		'text-transform': 'uppercase'
	},
	image: {
		'xlink:href': '/img/empty_avatar.PNG',
		height: avatarSize + 10,
		width: avatarSize + 10,
		y: shapeSize.height / 4 +5,
	},
	'.manager-name': {
		y: shapeSize.height / 2 - 10,
		x: avatarSize,
		fill: '#000000',
		'font-size': 13,
		stroke: 'black',
		'stroke-width': 0,
		'font-weight': 400,
		
		'font-family': 'Roboto',
	},
	'.manager-role': {
		y: shapeSize.height / 2 + avatarSize / 3 + 2,
		x: 20 + avatarSize,
		fill: '#000000',
		'font-size': 13,
		stroke: 'white',
		'stroke-width': 0,
		'font-weight': 400,
		
		'font-family': 'Roboto',
	},
	'.manager-email': {
		y: shapeSize.height / 2 + 10,
		x: avatarSize,
		fill: '#000000',
		'font-size': 13,
		stroke: 'white',
		'stroke-width': 0,
		'font-weight': 400,
		
		'font-family': 'Roboto',
	},
	'.img-manager':{
		'height':30,
		'width':30,
		'object-fit': 'cover',
	},
	'.btn.add': {
		'ref-dx': 0,
		'ref-y': 0,
		'ref': '.card',
		event: 'element:add',
		cursor: 'pointer'
	},
	'.btn.view': {
		'ref-dx': 0,
		'ref-y': 0,
		'ref': '.card',
		event: 'element:view',
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
		'font-weight': 300,
		stroke: 'green',
		x: -20,
		y: 110,
		'font-family': 'Roboto'
	},
	'.btn.view>text': {
		'font-size': 13,
		'font-weight': 300,
		x: -240,
		y: 110,
		'font-family': 'Roboto'
	},
	'.btn.show-infor-department>text': {
		'font-size': 13,
		'font-weight': 300,
		fill: '#000000',
		x: 15,
		y: 11,
		'font-family': 'Roboto'
	},
	'.btn.show-infor-department>.icon-department': {
		'font-size': 13,
		'font-weight': 300,
		fill: '#000000',
		x: 15,
		y: 11,
		'font-family': 'FontAwesome'
	},
	'.btn.show-infor-user>text': {
		'font-size': 13,
		'font-weight': 300,
		fill: '#000000',
		x: 15,
		y: 10,
		'font-family': 'Roboto'
	},
	'.btn.show-infor-user>.icon-user': {
		'font-size': 13,
		'font-weight': 300,
		fill: '#000000',
		x: 15,
		y: 10,
		'font-family': 'FontAwesome'
	},
	'.border-bottom': {
		height: borderBottomHeight,
		y: shapeSize.height - borderBottomHeight + 1,
		x: 3,
		width: shapeSize.width - 6,
		fill: '#f58634',
		'stroke-width': 0
	},
	'.btn.remove': {
		'ref-dx': 0,
		'ref-y': 0,
		'ref': '.card',
		event: 'element:remove',
		cursor: 'pointer'
	},
	'.btn.show-infor-user': {
		'ref-dx': -40,
		'ref-y': 100,
		'ref': '.card',
	},
	'.btn.show-infor-department': {
		'ref-dx': -90,
		'ref-y': 99,
		'ref': '.card',
	},
	'.btn.remove>circle': {
		r: 7,
		fill: 'red',
	},
	'.btn.remove>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 300,
		stroke: 'red',
		x: -40,
		y: 100,
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

	'.btn-collapse-expand-hor': {
		'ref-dx': -shapeSize.width/2,
		'ref-y':shapeSize.height,
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
	'.btn-collapse-expand-hor>text': {
		fill: 'white',
		'font-size': 15,
		'font-weight': 400,
		stroke: 'white',
		x: -4,
		y: 5,
		'font-family': 'Roboto'
	},
	'.btn-collapse-expand-ver': {
		'ref-dx': 0,
		'ref-y':shapeSize.height/2,
		'ref': '.card',
		event: 'element:collapse',
		cursor: 'pointer'
	},
	'.btn-collapse-expand-ver>circle': {
		r: 7,
		fill: 'blue',
		stroke: 'blue',
		'stroke-width': 0
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
	'.collapse-expand-circle': {
		r: CEConfig.radius,
		fill: 'blue',
		event: 'element:collapse',
	},
	'.buttonSign': {
		stroke: '#FFFFFF',
		strokeWidth: 0.1,
		event:"visiblePainted",
		text: '+'
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
export const PLUS_SIGN =  'M 1 5 9 5 M 5 1 5 9'
export const MINUS_SIGN =  'M 2 5 8 5'
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
            <image class="img-manager" />
            <text class="name"/>
            <text class="manager-name"/>
            <text class="manager-role"/>
            <text class="manager-email"/>

            <g>
                <rect class="border-bottom"/>
            </g>
			<line x1="10" y1="90" x2="240" y2="90" style="stroke:rgb(153,153,153);stroke-width:0.5" />
            <g class="btn add orgchart-action">
				<line class="line-action" x1="-20" y1="105" x2="-10" y2="105" style="stroke:rgb(36,98,36);stroke-width:1" />
				<line class="line-action" x1="-15" y1="110" x2="-15" y2="100" style="stroke:rgb(36,98,36);stroke-width:1" />
            </g>
            <g class="btn view orgchart-action">
                <text class="view">Chi tiết</text>
            </g>
			<g class="btn-collapse-expand-hor">
				<circle class="buttonSign"/>
				<text class="buttonSign"></text>
			</g>
			<g class="btn-collapse-expand-ver">
				<circle class="buttonSign"/>
				<text class="buttonSign"></text>
			</g>
			<g class="btn remove orgchart-action">
				<line class="line-action" x1="-40" y1="100" x2="-30" y2="110" style="stroke:rgb(247,0,0);stroke-width:1" />
				<line class="line-action" x1="-40" y1="110" x2="-30" y2="100" style="stroke:rgb(247,0,0);stroke-width:1" />
			</g>
		
			<g class="btn show-infor-user">
				${icon.user}<text >countUser</text>
            </g>
			<g class="btn  show-infor-department">
				${icon.department}<text >countDepartment</text>
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
		PLUS_SIGN:PLUS_SIGN,
		MINUS_SIGN:MINUS_SIGN ,
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
			this.attr('.btn-collapse-expand-hor', { display: visible ? 'block' : 'none' });
			this.attr('.btn-collapse-expand-ver', { display: visible ? 'block' : 'none' });
		},

		toggleButtonSign: function (plus) {
			if (plus) {
				this.attr('.buttonSign', { text: "+" });
			} else {
				this.attr('.buttonSign', { text: "-" });
			}
		}
	});
}

export const createDepartmentNode = function (name) {
	var element = new SymperDepartment().on({
		'change:name': function (cell, name) {
			cell.attr('.name/text',
				joint.util.breakText(name, 
					{
						width: 200,
						height: 45
					},
					{ 'font-size': 15 },
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
