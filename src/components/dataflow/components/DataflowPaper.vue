<template>
    <div class=" symper-dataflow-workspace">
        <div ref="symperPaperToolbar d-none" >
        </div>
        <div ref="nodeStencile" style="width: 100%;position: relative;" class="symper-node-stencil" v-show="action != 'embed'">

        </div>
    	<div ref="jointWrapper" :style="{
            maxHeight: '100%',
            maxWidth: '100%',
            overflow: 'auto',
            height: (height - 55) + 'px'
        }"></div>
        <a ref="downloadLinkSVG" href></a>
    </div>
</template>

<script>
require('@/components/common/rappid/jointjs.js');
import { util } from '@/plugins/util.js';
import { DISPLAY_CONFIGS } from "@/components/dataflow/configPool/nodeDisplayConfig.js";
import { registerNodeDisplay } from "@/components/dataflow/configPool/nodeDisplayConfig.js";
import { autoLoadNodeClasses } from "@/components/dataflow/configPool/dataflowConfig.js";

let mapTypeToNodeClass = autoLoadNodeClasses();
registerNodeDisplay();
export default {
    data(){
        return {
            wrapper: {
                height: '300px',
                width: '500px'
            },
            selectingNode: null
        }
    }, 
	name: 'DataflowPaper',
	props: {
        instanceKey: {
            defaul: ''
        },
        action: {
            defaul: 'view'
        },
		width: {
			type: [String, Number],
			default: 800
		},
		height: {
			type: [String, Number],
			default: 250
		},
		gridSize: {
			type: Number,
			default: 1
		},
		drawGrid: {
			type: [Object, Boolean],
			default: false
		},
		background: {
			type: [Object, Boolean],
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		}
	},
	created() {
		this.graph = new joint.dia.Graph;
	},
	mounted() {
        this.initPaper();
    },
    computed: {
        dataflowInfo(){
            return this.$store.state.dataflow.allDataflow[this.instanceKey];
        }
    },
    methods: {
        addLinkTools(link) {
            let paper = this.paper;
            link.set('router', { name: 'manhattan' });
            link.set('connector', { name: 'normal' });

            let linkView = link.findView(paper);
            var removeButton = new joint.linkTools.Remove({
                distance: '30%'
            });

            var verticesTool = new joint.linkTools.Vertices();
            var segmentsTool = new joint.linkTools.Segments();

            var toolsView = new joint.dia.ToolsView({
                tools: [verticesTool, segmentsTool, removeButton]
            });
            linkView.addTools(toolsView);
            linkView.hideTools();
        },
        addLinkOrders(link, order) {
            link.appendLabel({
                attrs: {
                    text: {
                        text: '#' + order
                    }
                },
                position: {
                    distance: 0.55
                }
            });
        },
        addLinks(links){
            let portIn = '';
            let portOut = '';
            for (let linkInfo of links) {
                let sourcePorts = this.graph.getCell(linkInfo.source).getPorts();
                portOut = sourcePorts[0].group == 'out' ? sourcePorts[0].id : sourcePorts[1].id;

                let targetPorts = this.graph.getCell(linkInfo.target).getPorts();
                if (targetPorts.length < 2) {
                    continue
                }
                portIn = targetPorts[0].group == 'in' ? targetPorts[0].id : targetPorts[1].id;

                var link = new joint.shapes.app.Link({
                    source: {
                        id: linkInfo.source,
                        port: portOut
                    },
                    target: {
                        id: linkInfo.target,
                        port: portIn
                    }
                });
                link.addTo(this.graph, { 'async': false });
            }
        },
        getInitOrderOneField(idNode) {
            if (nodesOrder[idNode]) {
                delete nodesOrder[idNode];
            }
            nodesOrder[idNode] = true;
            for (let nextNodeId in this.dataflowInfo.allWidget[idNode].nextNodes) {
                this.getInitOrderOneField(nextNodeId);
            }
        },
        getNodeExeOrder(){
            for (let nodeId in this.dataflowInfo.allWidget) {
                this.getInitOrderOneField(nodeId);
            }
            return Object.keys(nodesOrder);
        },
        center(){
            this.actionOnToolbar('zoomToFit');
        },
        initPaper(){
            let graph = this.graph;
            let thisSize = util.getComponentSize(this);
            this.wrapper.height = (thisSize.h - 80)+'px';
            this.wrapper.width = thisSize.w+'px';
            var commandManager = new joint.dia.CommandManager({
                graph: graph
            });
            this.paper = new joint.dia.Paper({
                model: graph,
                width: 1000,
                height: 1000,
                gridSize: 10,
                drawGrid: true,
                magnetThreshold: 'onleave',
                moveThreshold: 5,
                clickThreshold: 5,
                linkPinning: false,
                sorting: joint.dia.Paper.sorting.APPROX,
                markAvailable: true,
                snapLinks: { radius: 40 },
                defaultConnectionPoint: { name: 'anchor' },
                defaultConnector: {
                    name: 'jumpover',
                    args: { jump: 'cubic' }
                },
                highlighting: {
                    magnetAvailability: {
                        name: 'addClass',
                        options: {
                            className: 'record-item-available'
                        }
                    },
                    connecting: {
                        name: 'stroke',
                        options: {
                            padding: 8,
                            attrs: {
                                'stroke': 'none',
                                'fill': '#7c68fc',
                                'fill-opacity': 0.2
                            }
                        }
                    }
                },
                defaultLink: function() {
                    let link = new joint.shapes.app.Link();
                    return link;
                },

                async: true,
                sorting: joint.dia.Paper.sorting.APPROX
            });
        
            let paperScroller = new joint.ui.PaperScroller({
                paper: this.paper,
                cursor: 'grab',
                autoResizePaper: true
            });
            this.paperScroller = paperScroller;
            // this.addToolbar();
            var commandManager = new joint.dia.CommandManager({
                graph: graph
            });
            var toolbar = new joint.ui.Toolbar({
                // initialize tools with default settings
                tools: ['zoomIn', 'zoomOut', 'zoomToFit', 'zoomSlider', 'undo', 'redo'],
                references: {
                    paperScroller: paperScroller,
                    commandManager: commandManager
                }
            });
            $(this.$refs.symperPaperToolbar).append(toolbar.render().el);
        
            this.addStencil();
            this.paper.on('blank:pointerdown', paperScroller.startPanning);
            this.handlePaperEvents();
            $(this.$refs.jointWrapper).append(paperScroller.el);
            paperScroller.render().center();
        },
        addStencil() {
            let graph = this.graph;
            let paper = this.paper;

            var stencil = new joint.ui.Stencil({
                graph: graph,
                paper: paper,
                width: '100%',
                height: 58,
                layout: {
                    columnWidth: 70,
                    columns: 30,
                    rowHeight: 45,
                },
                dropAnimation: true,
            });
            $(this.$refs.nodeStencile).append(stencil.el);
            let items = [];

            for (let type in mapTypeToNodeClass) {
                if(joint.shapes.app[type]){
                    let s = new joint.shapes.app[type]({
                        size: { width: 45, height: 45 },
                    });
                    items.push(s);
                }
            }
            stencil.render().load(items);
        },
        makeTextBreak(text) {
            return joint.util.breakText(text, {
                width: DISPLAY_CONFIGS.width * 2,
                height: DISPLAY_CONFIGS.height * 3,
                title: text
            }, {
                'font-size': DISPLAY_CONFIGS.labelFontSize,
                title: text
            });
        },
        addNodeToWorkspace(attr){
            let nodeType = attr.type.replace('app.', '');
            let nodeClass = joint.shapes.app[nodeType];
            if(nodeClass){
                let cell = new nodeClass({
                    position: attr.position,
                    id: attr.id,
                });
                cell.attr('.symper-widget-label/text', this.makeTextBreak(attr.name));
                this.graph.addCell(cell);
            }else{
                console.error("Node type '" + nodeType + "' is not defined");
            }
        },
        handlePaperEvents(){
            let paper = this.paper;
            let graph = this.graph;
            let self = this;

            paper.on('cell:pointerdown', (cellView, evt, x, y) => {
                let node = cellView.model;
                if (node.attributes.type == 'app.Link') {
                    return;
                }
                self.disSelectNode(self.selectingNode);
                self.highlightNode(node);
                self.showRemoveButton(node.id);
                self.selectingNode = node;
                self.$emit('node-selected', {id: cellView.model.id});
            });

            paper.on('cell:mouseenter', (cellView, evt, x, y) => {
                cellView.model.toFront();
            });

            paper.on('cell:contextmenu	', (cellView, evt, x, y) => {
                // if (window.EMBED_BI) {
                //     showContextMenuOfNode(cellView, evt, x, y);
                // }
            });
            paper.on('blank:pointerclick', (cellView, evt, x, y) => {
                this.disSelectNode(this.selectingNode);
                self.selectingNode = null;
                self.$emit('paper-selected');
            });
            graph.on('remove', function(cell, collection, opt) {
                if (cell.isLink()) {
                    let cellAtrr = cell.attributes;
                    // if (cellAtrr.target.id) {
                    //     ListWidget[cellAtrr.target.id].removeLink(cellAtrr.source.id);
                    //     ListWidget[cellAtrr.target.id].reorderLinks(cell);
                    // }
                    self.$emit('link-removed', {
                        sourceId: cellAtrr.source.id,
                        targetId: cellAtrr.target.id
                    });
                }
            })

            paper.on('link:mouseleave', function(linkView) {
                linkView.hideTools();
            });

            paper.on('link:mouseenter', function(linkView) {
                linkView.showTools();
                self.hilightLink(linkView.model);

            });

            paper.on('link:mouseleave', function(linkView) {
                linkView.hideTools();
                self.unHilightLink(linkView.model);
            });

            paper.on('link:connect', (linkView, evt, elementViewConnected, magnet, arrowhead) => {
                // let linkAttr = linkView.model.attributes;
                let sourceId = linkAttr.source.id;
                let targetId = linkAttr.target.id;
                // if (ListWidget[targetId].stackInput) {
                //     addLinkOrders(linkView.model, ListWidget[targetId].inputDatasetCount + 1);
                // }
                // ListWidget[sourceId].connectToWidget(targetId);
                self.$emit('link-connected', {
                    sourceId: sourceId,
                    targetId: targetId
                });
            });

            graph.on('add', (cell, collection, opt) => {
                let type = cell.attributes.type;
                if (type == 'app.Link') {
                    self.addLinkTools(cell, paper);
                }else{
                    type = type.split('.')[1];
                    self.$emit('node-added', {
                        id: cell.id,
                        type: type
                    });
                }
            });
        },
        setNodeName(id, name){
            let node = this.graph.getCell(id);
            node.attr('.symper-widget-label/text', this.makeTextBreak(name));
        },
        hilightLink(link) {
            link.attr('line/stroke', DISPLAY_CONFIGS.highlightWidBordergetColor);
            link.attr('line/strokeWidth', DISPLAY_CONFIGS.hightlightWidth);
            link.attr('text/fill', DISPLAY_CONFIGS.highlightWidBordergetColor);
        },
        unHilightLink(link) {
            link.attr('line/stroke', DISPLAY_CONFIGS.normalWidgetBorderColor);
            link.attr('line/strokeWidth', DISPLAY_CONFIGS.normalWidth);
            link.attr('text/fill', DISPLAY_CONFIGS.normalWidgetBorderColor);
        },
        saveSVG(){
            let self = this;
            let downloadLink = $(this.$refs.downloadLinkSVG);
            let done = function(svgString) {
                util.setEncoded(
                    downloadLink,
                    "diagram.svg",
                    svgString
                );
            };
            this.paper.toSVG(done);
        },
        actionOnToolbar(type){
            let ele = $(this.$refs.symperPaperToolbar).find('.joint-widget[data-type='+type+']');
            ele.mousedown();
            ele.click();
            if(type == 'zoomToFit'){
                $(this.$refs.symperPaperToolbar).find('.joint-widget[data-type=zoomSlider]').find('input').val(100).change();
            }
        },
        addToolbar(){
            let commandManager = new joint.dia.CommandManager({
                graph: this.graph
            });
            let toolbar = new joint.ui.Toolbar({
                tools: ['zoomIn', 'zoomOut', 'zoomToFit', 'undo', 'redo', 'zoomSlider'],
                references: {
                    paperScroller: this.paperScroller,
                    commandManager: commandManager
                }
            });
            $(this.$refs.symperPaperToolbar).append(toolbar.render().el);
        },
        disSelectNode(node) {
            this.unHighlightNode(node);
        },
        highlightNode(node, mode = 'select') {
            if (node.model) {
                node = node.model
            }
            let color = '';
            if (mode == 'select') {
                color = DISPLAY_CONFIGS.highlightWidBordergetColor;
            } else {
                color = 'red';
            }
            if (node.attr) {
                node.attr('.symper-widget-frame/stroke', color);
                node.attr('.symper-widget-frame/strokeWidth', 2);
            }
        },
        unHighlightNode(node) {
            if(node){
                if (node.model) {
                    node = node.model
                }
                if (node.attr) {
                    node.attr('.symper-widget-frame/stroke', DISPLAY_CONFIGS.normalWidgetBorderColor);
                    node.attr('.symper-widget-frame/strokeWidth', 1);
                }
                this.hideRemoveButton(node.id);
            }
        },
        showRemoveButton(idNode) {
            $(".joint-cell[model-id=" + idNode + "]").find('.symper-widget-remove').removeClass('d-none');
        },
        hideRemoveButton(idNode) {
            $(".joint-cell[model-id=" + idNode + "]").find('.symper-widget-remove').addClass('d-none');
        },
        removeNode(nodeId) {
            // let jointLinks = this.graph.getLinks();
            // let nodeId = currentNode.jointNode.id;
            // for (let link of jointLinks) {
            //     if (link.attributes.source.id == nodeId) {
            //         ListWidget[link.attributes.target.id].removeLink(nodeId);
            //     } else if (link.attributes.target.id == nodeId) {
            //         ListWidget[nodeId].removeLink(link.attributes.source.id);
            //     }
            // }
            // ListWidget[nodeId].jointChild.remove();
            // delete ListWidget[nodeId];
            // currentNode.jointNode = false;
            // selectPaper();
        }
    },
};
</script>

<style>
.symper-node-stencil .joint-port:nth-child(odd) {
    transform: translate(35px, 17.5px)!important;
}

.symper-node-stencil .joint-port:nth-child(even) {
    transform: translate(0px, 17.5px)!important;
}

.symper-node-stencil .symper-widget-frame {
    height: 35px!important;
    width: 35px!important;
}

.symper-node-stencil .symper-widget-image {
    height: 20px!important;
    width: 20px!important;
}

.symper-node-stencil .joint-paper.joint-theme-default,
.symper-node-stencil .content {
    background-color: #f7f7f7!important;
}

.symper-node-stencil .content {
    overflow: hidden;
}

.symper-dataflow-workspace .joint-paper{
    top: -10px;
    left: -15px;
    height: 55px;
}
.symper-dataflow-workspace .symper-widget .symper-widget-remove{
    height: 15px;
    width: 15px;
    x:18px;
    y:-12px;
    cursor: pointer;
}
.symper-dataflow-workspace .embed-dataflow .multipane-resizer, .embed-dataflow circle{
    display: none;
}

.symper-dataflow-workspace .embed-dataflow .joint-paper-scroller {
    overflow: hidden;
}


.symper-dataflow-workspace .symper-widget-image {
    height: 35px;
    width: 35px;
}
</style>
