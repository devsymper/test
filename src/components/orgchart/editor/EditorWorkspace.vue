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
        updateCellAttrs(cellId, attrName, value){
            let mapName = {
                name: '.name/text',
                border: '.card'
            };

            if(mapName[attrName]){
                if(typeof value == 'object'){
                    for(let key in value){
                        this.$refs.jointPaper.graph.getCell(cellId).attr(mapName[attrName]+'/'+key, value[key]);
                    }
                }else{
                    this.$refs.jointPaper.graph.getCell(cellId).attr(mapName[attrName], value);
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
                let name = "Phòng ban "+ countDepartment;
                // Adding a new member
                var newNode = createDepartmentNode(name);
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
        },
        unHighlightCurrentNode(){
            if(this.selectingNode && this.selectingNode.id && this.selectingNode.id != SYMPER_HOME_ORGCHART){
                this.updateCellAttrs(this.selectingNode.id,'border' , DEFAULT_DEPARTMENT_DISPLAY);
            }
        },
        highlightNode(nodeModel = null){
            if(nodeModel == null){
                if(this.selectingNode && this.selectingNode.id && this.selectingNode.id != SYMPER_HOME_ORGCHART){
                    this.updateCellAttrs(this.selectingNode.id,'border', FOUCUS_DEPARTMENT_DISPLAY);
                }
            }else{
                this.updateCellAttrs(nodeModel.id,'border', FOUCUS_DEPARTMENT_DISPLAY);
            }
        },
        setupGraph(graph, paper, paperScroller){
            let self = this;
            var members = [
                createDepartmentNode('Phòng ban 1')
            ];

            var connections = [];
            var treeLayout = new joint.layout.TreeLayout({
                graph: graph,
                direction: 'B'
            });
            this.$refs.jointPaper.treeLayout = treeLayout;

                    
            graph.resetCells(members.concat(connections));
            treeLayout.layout();
            this.listenPaperEvent();
            new joint.ui.TreeLayoutView({
                paper: paper,
                model: treeLayout,
                previewAttrs: {
                    parent: { rx: 10, ry: 10 }
                }
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