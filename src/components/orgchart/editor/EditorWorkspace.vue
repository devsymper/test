<template>
    <joint-paper 
        :background="background" 
        :grid-size="gridSize" 
        :draw-grid="drawGrid" 
        @init="setupGraph"
        ref="jointPaper" />
</template>

<script>
import JointPaper from "@/components/common/rappid/JointPaper";
import { createDepartmentNode, defineDepartment, DEFAULT_DEPARTMENT_DISPLAY, FOUCUS_DEPARTMENT_DISPLAY } from "./../nodeDefinition/departmentDefinition";
import { createPositionNode, definePosition, DEFAULT_POSITION_DISPLAY, FOUCUS_POSITION_DISPLAY } from "./../nodeDefinition/positionDefinition";
import { SYMPER_HOME_ORGCHART } from './nodeAttrFactory';
require('@/plugins/rappid/rappid.css');

// A helper to create an arrow connection
function jointLinkNode(source, target) {
    return new joint.shapes.org.Arrow({
        source: { id: source.id },
        target: { id: target.id },
        attrs:{
            '.connection': {
                'stroke-width': 1
            }
        },
    });
}

export default {
    components: {
        JointPaper
    },
    props: {
        instanceKey: {
            default: ''
        },
        context: {
            default: 'department'
        }
    },
    created(){
        defineDepartment();
    },
    mounted(){
        this.initDiagramView();
    },
    computed: {
        selectingNode(){
            return this.$store.state.orgchart.editor[this.instanceKey].selectingNode;
        }
    },
    data(){
        return {
			background: {
				color: 'white'
			},
			gridSize: 30,
			drawGrid: {
				name: 'mesh'
			}
        }
    },
	methods: {
        loadDiagramFromJson(cells){
            this.$refs.jointPaper.graph.fromJSON(cells);
        },
        getAllDiagramCells(){
            return this.$refs.jointPaper.graph.toJSON();
        },
        updateCellAttrs(cellId, attrName, value){
            let mapName = {
                name: '.name/text',
                border: '.card'
            };
            let cell = this.$refs.jointPaper.graph.getCell(cellId);
            if(cell && mapName[attrName]){
                if(typeof value == 'object'){
                    for(let key in value){
                        cell.attr(mapName[attrName]+'/'+key, value[key]);
                    }
                }else{
                    cell.attr(mapName[attrName], value);
                }
            }
        },
        listenPaperEvent(){
            let paper = this.$refs.jointPaper.paper;
            let graph = this.$refs.jointPaper.graph;
            let treeLayout = this.$refs.jointPaper.treeLayout;
            let self = this;
            
            paper.on('element:add', function(elementView, evt) {
                evt.stopPropagation();
                let countDepartment = graph.getCells().filter((el) => {
                    return el.attributes.type == 'org.Member';
                }).length + 1;
                let name = self.context == 'department' ? self.$t('orgchart.editor.department') : self.$t('orgchart.editor.position');
                name += (' '+countDepartment);
                // Adding a new member
                let newNode ;
                if(this.context == 'department'){
                    newNode = createDepartmentNode(name);
                }else{
                    newNode = createPositionNode(name);
                }
                
                var newConnection = jointLinkNode(elementView.model, newNode);
                graph.addCells([newNode, newConnection]);
                treeLayout.layout();
                self.$emit('new-viz-cell-added', {
                    id: newNode.id,
                    name: name
                });
            });

            paper.on('element:delete', function(elementView, evt, x, y) {
                evt.stopPropagation();
                elementView.model.remove();
                treeLayout.layout();
            });

            paper.on('cell:pointerclick', function(elementView, evt, x, y) {
                evt.stopPropagation();
                self.unHighlightCurrentNode();
                self.$emit('cell-clicked', elementView.model.id);
                self.highlightNode(elementView.model);               
            });

            paper.on('blank:pointerclick', function(elementView, evt, x, y) {
                self.unHighlightCurrentNode();    
                self.$emit('blank-paper-clicked');      
            });

            paper.on('cell:contextmenu', function(elementView, evt, x, y) {
                self.$emit('cell-contextmenu', elementView.model.id);      
            });
        },
        unHighlightCurrentNode(){
            let displayConfig = this.context == 'department' ? DEFAULT_DEPARTMENT_DISPLAY : DEFAULT_POSITION_DISPLAY;
            if(this.selectingNode && this.selectingNode.id && this.selectingNode.id != SYMPER_HOME_ORGCHART){
                this.updateCellAttrs(this.selectingNode.id,'border' , displayConfig);
            }
        },
        highlightNode(nodeModel = null){
            let displayConfig = this.context == 'department' ? FOUCUS_DEPARTMENT_DISPLAY : FOUCUS_POSITION_DISPLAY;
            if(nodeModel == null){
                if(this.selectingNode && this.selectingNode.id && this.selectingNode.id != SYMPER_HOME_ORGCHART){
                    this.updateCellAttrs(this.selectingNode.id,'border', displayConfig);
                }
            }else{
                this.updateCellAttrs(nodeModel.id,'border', displayConfig);
            }
        },
        createFirstVizNode(){
            let nodeName = this.context == 'department' ? this.$t('orgchart.editor.department') : this.$t('orgchart.editor.position');
            nodeName += ' 1';
            let firstNode = this.context == 'department' ?  createDepartmentNode(nodeName) : createPositionNode(nodeName);
            this.$refs.jointPaper.graph.resetCells([firstNode]);
            this.$emit('new-viz-cell-added', {
                id: firstNode.id,
                name: nodeName
            });
        },
        setupGraph(graph, paper, paperScroller){
            let self = this;
            let nodeName = this.context == 'department' ? this.$t('orgchart.editor.department') : this.$t('orgchart.editor.position');
            nodeName += ' 1';
            let firstNode = this.context == 'department' ?  createDepartmentNode(nodeName) : createPositionNode(nodeName);

            var treeLayout = new joint.layout.TreeLayout({
                graph: graph,
                direction: 'B'
            });
            this.$refs.jointPaper.treeLayout = treeLayout;
            graph.resetCells([firstNode]);
            treeLayout.layout();
            this.listenPaperEvent();
            new joint.ui.TreeLayoutView({
                paper: paper,
                model: treeLayout,
                previewAttrs: {
                    parent: { rx: 10, ry: 10 }
                }
            });
            
            self.$emit('new-viz-cell-added', {
                id: firstNode.id,
                name: nodeName
            });
        },
		exampleSetupGraph(graph) {
			
        },
        initDiagramView(){
            
        }
	}
}
</script>

<style>

</style>