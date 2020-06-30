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
import { createDepartmentNode, defineDepartment } from "./../nodeDefinition/departmentDefinition";
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
    created(){
        defineDepartment();
    },
    mounted(){
        this.initDiagramView();
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
                name: '.name/text'
            };

            if(mapName[attrName]){
                this.$refs.jointPaper.graph.getCell(cellId).attr(mapName[attrName], value);
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

                    
            graph.resetCells(members.concat(connections));
            treeLayout.layout();

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
                // A member removal
                elementView.model.remove();
                treeLayout.layout();
            });


            paper.on('cell:pointerclick', function(elementView, evt, x, y) {
                evt.stopPropagation();
                console.log(elementView, evt, x, y);
                self.$emit('cell-clicked', elementView.model.id);
            });

            // directionPicker.on('option:select', function(option) {
            //     treeLayout.set('direction', option.value);
            //     treeLayout.layout();
            //     paperScroller.centerContent();
            // });
            // directionPicker.render().$el.appendTo('#orgchart-direction');

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