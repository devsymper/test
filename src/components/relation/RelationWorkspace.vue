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
			background: {
				color: '#F3F2F1',
			},
			gridSize: 10,
			drawGrid: {
				name: 'mesh',
			},
		};
	},
	methods: {
		setupGraph(graph , paper) {
			this.graph = graph
			this.paper = paper
			var order = new joint.shapes.mapping.Record({
				items: [
					[
						{
							id: 'file',
							label: 'File: (default)',
							icon: 'images/file.svg',
							highlighted: true,
							items: [
								{
									id: 'order',
									label: 'Order',
									icon: 'images/document.svg',
									items: [
										{
											id: 'order_id',
											label: 'id',
											icon: 'images/document.svg',
										},
										{
											id: 'order_name',
											label: 'name',
											icon: 'images/document.svg',
										},
										{
											id: 'order_email',
											label: 'email',
											icon: 'images/document.svg',
										},
										{
											id: 'order_entry_date',
											label: 'entry_date',
											icon: 'images/file.svg',
											items: [
												{
													id: 'entry_date_year',
													label: 'year',
													icon: 'images/document.svg',
												},
												{
													id: 'entry_date_month',
													label: 'month',
													icon: 'images/document.svg',
												},
												{
													id: 'entry_date_day',
													label: 'day',
													icon: 'images/document.svg',
												},
											],
										},
										{
											id: 'address',
											label: 'address',
											icon: 'images/file.svg',
											items: [
												{
													id: 'address_city',
													label: 'city',
													icon: 'images/document.svg',
												},
												{
													id: 'address_street',
													label: 'street',
													icon: 'images/document.svg',
												},
												{
													id: 'address_number',
													label: 'number',
													icon: 'images/document.svg',
												},
												{
													id: 'address_shipping',
													label: 'shipping',
													icon: 'images/document.svg',
												},
												{
													id: 'address_billing',
													label: 'billing',
													icon: 'images/document.svg',
												},
											],
										},
									],
								},
							],
						},
					],
				],
			});
			order.setName('Order');
			order.position(780, 200);
			order.addTo(graph);

			var nanonull = new joint.shapes.mapping.Record({
				items: [
					[
						{
							id: 'orders',
							label: 'orders',
							icon: 'images/file.svg',
							items: [
								{
									id: 'order_id',
									label: 'id',
									icon: 'images/document.svg',
								},
								{
									id: 'order_created_at',
									label: 'created_at',
									icon: 'images/document.svg',
								},
								{
									id: 'order_updated_at',
									label: 'updated_at',
									icon: 'images/document.svg',
								},
								{
									id: 'orderedproducts',
									label: 'orderedproducts',
									icon: 'images/file.svg',
									group: 'disabled',
								},
								{
									id: 'users',
									label: 'users',
									icon: 'images/file.svg',
									items: [
										{
											id: 'user_id',
											label: 'id',
											icon: 'images/document.svg',
										},
										{
											id: 'user_first_name',
											label: 'first_name',
											icon: 'images/document.svg',
										},
										{
											id: 'user_last_name',
											label: 'last_name',
											icon: 'images/document.svg',
										},
										{
											id: 'user_email',
											label: 'email',
											icon: 'images/document.svg',
										},
										{
											id: 'user_created_at',
											label: 'created_at',
											icon: 'images/document.svg',
										},
										{
											id: 'user_updated_at',
											label: 'updated_at',
											icon: 'images/document.svg',
										},
										{
											id: 'addresses',
											label: 'addresses',
											icon: 'images/file.svg',
											items: [
												{
													id: 'address_id',
													label: 'id',
													icon: 'images/document.svg',
												},
												{
													id: 'address_type',
													label: 'type',
													icon: 'images/document.svg',
												},
												{
													id: 'address_city',
													label: 'city',
													icon: 'images/document.svg',
												},
												{
													id: 'address_street',
													label: 'street',
													icon: 'images/document.svg',
												},
												{
													id: 'address_number',
													label: 'number',
													icon: 'images/document.svg',
												},
												{
													id: 'address_is_shipping',
													label: 'is_shipping',
													icon: 'images/document.svg',
												},
												{
													id: 'address_is_billing',
													label: 'is_billing',
													icon: 'images/document.svg',
												},
											],
										},
									],
								},
							],
						},
					],
				],
			});
			nanonull.setName('Nanonull');
			nanonull.position(50, 130);
			nanonull.addTo(graph);

			var constant1 = new joint.shapes.mapping.Constant();
			constant1.setValue('Order');
			constant1.position(240, 10);
			constant1.addTo(graph);

			var constant2 = new joint.shapes.mapping.Constant();
			constant2.setValue('.dat');
			constant2.position(240, 40);
			constant2.addTo(graph);

			var constant3 = new joint.shapes.mapping.Constant();
			constant3.setValue(' ');
			constant3.position(240, 70);
			constant3.addTo(graph);

			var concat1 = new joint.shapes.mapping.Concat();
			concat1.position(450, 0);
			concat1.addTo(graph);

			var concat2 = new joint.shapes.mapping.Concat();
			concat2.position(450, 120);
			concat2.addTo(graph);

			var getDate1 = new joint.shapes.mapping.GetDate();
			getDate1.position(450, 310);
			getDate1.addTo(graph);

			var links = [
				// concat1
				new joint.shapes.mapping.Link({
					source: { id: constant1.id, port: 'value' },
					target: { id: concat1.id, port: 'value_1' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'order_id' },
					target: { id: concat1.id, port: 'value_2' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: constant2.id, port: 'value' },
					target: { id: concat1.id, port: 'value_3' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: concat1.id, port: 'result' },
					target: { id: order.id, port: 'file' },
				}),
				// concat2
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'user_first_name' },
					target: { id: concat2.id, port: 'value_1' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: constant3.id, port: 'value' },
					target: { id: concat2.id, port: 'value_2' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'user_last_name' },
					target: { id: concat2.id, port: 'value_3' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: concat2.id, port: 'result' },
					target: { id: order.id, port: 'order_name' },
				}),
				// getDate1
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'user_created_at' },
					target: { id: getDate1.id, port: 'value' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: getDate1.id, port: 'year' },
					target: { id: order.id, port: 'entry_date_year' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: getDate1.id, port: 'month' },
					target: { id: order.id, port: 'entry_date_month' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: getDate1.id, port: 'day' },
					target: { id: order.id, port: 'entry_date_day' },
				}),
				// order
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'order_id' },
					target: { id: order.id, port: 'order_id' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'user_email' },
					target: { id: order.id, port: 'order_email' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'addresses' },
					target: { id: order.id, port: 'address' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'address_is_billing' },
					target: { id: order.id, port: 'address_billing' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'address_is_shipping' },
					target: { id: order.id, port: 'address_shipping' },
				}),

				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'address_city' },
					target: { id: order.id, port: 'address_city' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'address_street' },
					target: { id: order.id, port: 'address_street' },
				}),
				new joint.shapes.mapping.Link({
					source: { id: nanonull.id, port: 'address_number' },
					target: { id: order.id, port: 'address_number' },
				}),
			];

			links.forEach(function(link) {
				link.addTo(graph);
			});
			this.listenPaperEvent();
		},
		handleHeaderAction(action){
            this.$refs.jointPaper.actionOnToolbar(action);
        },
		listenPaperEvent() {
			let paper = this.$refs.jointPaper.paper;
			let graph = this.$refs.jointPaper.graph;
			paper.on('blank:pointerdown', paperScroller.startPanning);

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
				showElementTools(elementView);
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
			dataset.addTo(graph);
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
			link.addTo(graph);
		},
		loadRelations(datasets,items,links){
			graph.getCells().map((ele)=>{
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
			let childs = graph.getCells();
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
