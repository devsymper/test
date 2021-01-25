<template>
	<JointPaperDataMapping :background="background" :gridSize="gridSize" :draw-grid="drawGrid" @init="setupGraph" ref="jointPaper" />
</template>

<script>
import JointPaperDataMapping from '@/components/common/rappid/JointPaperDataMapping';
require('@/plugins/rappid/rappid.css');

export default {
	props: {
		action: {
			type: String,
			default: 'edit',
		},
	},
	components: {
		JointPaperDataMapping,
	},
	data() {
		return {
			paper: null,
			graph: null,
			paperScroller: null,
			background: {
				color: '#F3F2F1',
			},
			gridSize: 10,
			drawGrid: {
				name: 'mesh',
			},
			datasets: []
		};
	},
	methods: {
		setupGraph(graph , paper, paperScroller) {
			this.graph = graph
			this.paper = paper
			this.paperScroller = paperScroller
			this.listenPaperEvent();
		},
		handleHeaderAction(action){
            this.$refs.jointPaper.actionOnToolbar(action);
		},
		showElementTools(elementView) {
			var element = elementView.model;
			var transform = new joint.ui.FreeTransform({
				cellView: elementView,
				allowRotation: false
			});
			transform.render();
			transform.listenTo(element, 'change', updateMinSize);
			updateMinSize();

			function updateMinSize() {
				var minSize = element.getMinimalSize();
				transform.options.minHeight = minSize.height;
				transform.options.minWidth = minSize.width;
			}
		},
		listenPaperEvent() {
			let self = this
			let paper = this.$refs.jointPaper.paper;
			let graph = this.$refs.jointPaper.graph;
			paper.on('blank:pointerdown', this.paperScroller.startPanning);

			paper.on('link:mouseenter', function(linkView) {
				this.removeTools();
				showLinkTools(linkView);
				rsl.showRelateColumn(linkView);
			});

			paper.on('link:mouseleave', function(linkView) {
				this.removeTools();
				rsl.removeRelateColumn(linkView);
			});

			paper.on('element:magnet:pointerdblclick', function(elementView, evt, magnet) {
				evt.stopPropagation();
				itemEditAction(elementView.model, elementView.findAttribute('item-id', magnet));
			});

			paper.on('element:magnet:contextmenu', function(elementView, evt, magnet) {
				var itemId = elementView.findAttribute('item-id', magnet);
				var tools = elementView.model.getItemTools(itemId);
				if (tools) {
					evt.stopPropagation();
					itemActionPicker(magnet, elementView, elementView.findAttribute('item-id', magnet), tools);
				}
			});

			paper.on('element:pointerclick', function(elementView) {
				self.showElementTools(elementView);
			});

			paper.on('element:pointermove', function(view, evt, x, y) {
				var data = evt.data;
				if (data.ghost) {
					data.ghost.attr({
						x: x - data.dx,
						y: y - data.dy,
					});
				} else {
					var bbox = view.model.getBBox();
					var ghost = V('rect');
					ghost.attr(bbox);
					ghost.attr({
						fill: 'transparent',
						stroke: '#5755a1',
						'stroke-dasharray': '4,4',
						'stroke-width': 2,
					});
					ghost.appendTo(this.viewport);
					evt.data.ghost = ghost;
					evt.data.dx = x - bbox.x;
					evt.data.dy = y - bbox.y;
				}
			});

			paper.on('element:pointerup', function(view, evt, x, y) {
				var data = evt.data;
				if (data.ghost) {
					data.ghost.remove();
					view.model.position(x - data.dx, y - data.dy);
				}
			});
		},
		scrollPaperToTop(time = 1000) {
			setTimeout(
				(self) => {
					let viewPort = $(self.$refs.jointPaper.$el).find('.symper-relation-paper>.joint-paper-scroller');
					let view = $(self.$refs.jointPaper.$el).find('.symper-relation-paper>.joint-paper-scroller>.paper-scroller-background>.joint-paper');
					$(viewPort).scrollTop($(view).position().top);
				},
				time,
				this
			);
		},
		addDataset(datasetData,items = [],pos = {}) {
			debugger
			let dataset = new joint.shapes.mapping.Record({
				items: [items],
				id:datasetData.id,
				symperDatasetConfigs:{
					id:datasetData.id,
					label:datasetData.label
				}
			});

			pos.x = pos.x?pos.x:50;
			pos.y = pos.y?pos.y:130;
			dataset.position(pos.x, pos.y);
			dataset.setName(datasetData.label);
			dataset.addTo(this.graph);
			this.datasets[datasetData.id] = {
				label:datasetData.label,
				obj:dataset
			};
		},
		removeDataset(datasetData) {
			this.datasets[datasetData.id].obj.remove();
		},
		searchColumns(vl){
			if(vl){
				let items  = $(".record-item-body");
				$(".record-item-label").each((index,ele)=>{
					if($(ele).text().toLowerCase().includes(vl)){
						$(items[index]).css('fill','#ffbc58');
					}else{
						$(items[index]).css('fill','#00000000');
					}
				});
			}else{
				$(".record-item-body").css('fill','#00000000');
			}
		},
		getLabelToLink(pos = 'source',type){
			let linkType = {
				o:1,
				m:'n'
			};
			distance = {
				source:0.15,
				target:0.85
			};
			return {
				attrs: {
					text: {
						text: linkType[type]
					},
				},
				position: {
					distance: distance[pos]
				}
			}
		},
		updateDatasetColumns(datasetColumns) {
			for(let idDts in datasetColumns){
				let dts = this.datasets[idDts];
				if(!dts){
					continue;
				}
				let dtsLabel = dts.label;
				let dtsPos = dts.obj.position();
				this.removeDataset({id:idDts});
				this.addDataset({
						id:idDts,
						label:dtsLabel
					},
					datasetColumns[idDts],
					dtsPos
				);
			}
		},
		addLink(slink){
			link = new joint.shapes.mapping.Link(slink);
			link.label(0,this.getLabelToLink('source',slink.symperLinkType[0]));
			link.label(1,this.getLabelToLink('target',slink.symperLinkType[1]));
			link.addTo(this.graph);
		},
		loadRelations(datasets,items,links){
			this.graph.getCells().map((ele)=>{
				ele.remove();
			});
			for(let dataset of datasets){
				dts = dataset.dataset;
				this.addDataset(dts,items[dts.id],dataset.position);
			}
			for(let slink of links){
				rsl.addLink(slink);
			}
		},
		getWorkspaceInfo(){
			//mapping.Link
			let childs = this.graph.getCells();
			let dataLink = [];
			let dtss = [];

			for(let c of childs){
				if(c.attributes.type == 'mapping.Link'){
					dataLink.push({
						from:c.attributes.source.port,
						to:c.attributes.target.port,
						type:c.attributes.symperLinkType
					}); 
				}else{
					dtss.push({
						position:c.attributes.position,
						dataset:c.attributes.symperDatasetConfigs
					});
				}
			}

			
			return {
				links:dataLink,
				dtss:dtss
			};
		},
		getAllLinks(){
			return this.graph.getCells().filter((ele)=>{
				return ele.attributes.type.includes('Link');
			});   
		}
	},
};
</script>

<style></style>
