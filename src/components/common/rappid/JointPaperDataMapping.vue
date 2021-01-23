<template>
	<div class="h-100 w-100">
		<div ref="symperPaperToolbar" class=" d-none"></div>
		<div
			ref="jointWrapper"
			class="symper-orgchart-paper"
			:style="{
				height: wrapper.height,
				width: wrapper.width,
			}"
		></div>
		<a ref="downloadLinkSVG" href></a>
	</div>
</template>

<script>
import { util } from '../../../plugins/util';
require('./jointjs');
require('@/components/common/rappid/dataMapping/joint.anchors.mapping')
require('@/components/common/rappid/dataMapping/joint.linkTools.mapping')
require('@/components/common/rappid/dataMapping/joint.routers.mapping')
require('@/components/common/rappid/dataMapping/joint.shapes.mapping')
export default {
	data() {
		return {
			wrapper: {
				height: '300px',
				width: '500px',
			},
		};
	},
	name: 'JointPaper',
	props: {
		width: {
			type: [String, Number],
			default: 600,
		},
		height: {
			type: [String, Number],
			default: 400,
		},
		gridSize: {
			type: Number,
			default: 1,
		},
		drawGrid: {
			type: [Object, Boolean],
			default: false,
		},
		background: {
			type: [Object, Boolean],
			default: false,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
	},
	created() {
		this.name = this.$options.name;
		console.log(`[${this.name}] Created`);
		this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
	},
	mounted() {
		let self = this;
		let thisSize = util.getComponentSize(this);
		this.wrapper.height = thisSize.h - 80 + 'px';
		this.wrapper.width = thisSize.w + 'px';

		this.paper = new joint.dia.Paper({
			cellViewNamespace: joint.shapes,
			model: this.graph,
			width: this.width,
			height: this.height,
			background: '#ffffff',
			async: true,
			defaultAnchor: { name: 'modelCenter' },
			defaultConnectionPoint: { name: 'boundary' },
			defaultConnector: { name: 'normal' },
			interactive: true,
			sorting: joint.dia.Paper.sorting.APPROX,
			// dung na them
			interactive: {
				linkMove: false,
				elementMove: false,
			},
			markAvailable: true,
			snapLinks: { radius: 40 },
			defaultRouter: {
				name: 'mapping',
				args: { padding: 30 },
			},
			defaultConnectionPoint: { name: 'anchor' },
			defaultAnchor: { name: 'mapping' },
			defaultConnector: {
				name: 'jumpover',
				args: { jump: 'cubic' },
			},
			highlighting: {
				magnetAvailability: {
					name: 'addClass',
					options: {
						className: 'record-item-available',
					},
				},
				connecting: {
					name: 'stroke',
					options: {
						padding: 8,
						attrs: {
							stroke: 'none',
							fill: '#7c68fc',
							'fill-opacity': 0.2,
						},
					},
				},
			},
			defaultLink: function() {
				return new joint.shapes.mapping.Link();
			},
			validateConnection: function(sv, sm, tv, tm, end) {
				if (sv === tv) return false;
				if (sv.model.isLink() || tv.model.isLink()) return false;
				if (end === 'target') return tv.model.getItemSide(tv.findAttribute('item-id', tm)) !== 'right';
				return sv.model.getItemSide(sv.findAttribute('item-id', sm)) !== 'left';
			},
		});

		var paperScroller = new joint.ui.PaperScroller({
			paper: this.paper,
			autoResizePaper: true,
		});
		var viewportOverlap = 50;
		var viewportRect = paperScroller.getVisibleArea().inflate(viewportOverlap);
		paperScroller.el.onscroll = function() {
			viewportRect = paperScroller.getVisibleArea().inflate(viewportOverlap);
		};
		paperScroller.$el.css({ width: '100%', height: '100%' }).appendTo(this.$refs.jointWrapper);
		paperScroller.zoom(-0.2);
		paperScroller.centerContent();
		this.paper.on('blank:pointerdown', paperScroller.startPanning);
		this.addToolbar(paperScroller);
		this.$emit('init', this.graph);
	},
	methods: {
		saveSVG() {
			let self = this;
			let downloadLink = $(this.$refs.downloadLinkSVG);
			let done = function(svgString) {
				util.setEncoded(downloadLink, 'diagram.svg', svgString);
			};
			this.paper.toSVG(done);
		},
		actionOnToolbar(type) {
			let ele = $(this.$refs.symperPaperToolbar).find('.joint-widget[data-type=' + type + ']');
			ele.mousedown();
			ele.click();
			if (type == 'zoomToFit') {
				$(this.$refs.symperPaperToolbar)
					.find('.joint-widget[data-type=zoomSlider]')
					.find('input')
					.val(100)
					.change();
			}
		},
		addToolbar(paperScroller) {
			let commandManager = new joint.dia.CommandManager({
				graph: this.graph,
			});
			let toolbar = new joint.ui.Toolbar({
				tools: ['zoomIn', 'zoomOut', 'zoomToFit', 'undo', 'redo', 'zoomSlider'],
				references: {
					paperScroller: paperScroller,
					commandManager: commandManager,
				},
			});
			$(this.$refs.symperPaperToolbar).append(toolbar.render().el);
		},
	},
	watch: {},
};
</script>

<style scoped>
.symper-orgchart-paper >>> svg,
.symper-orgchart-paper >>> .paper-scroller-background {
	background-color: #f1f1f1;
}
</style>
