<template>
    <joint-paper 
        :background="background" 
        :grid-size="gridSize" 
        :draw-grid="drawGrid" 
        @init="setupGraph"
        :readonly="readonly"
        ref="jointPaper" />
</template>
<script>
import JointPaper from "@/components/common/rappid/JointPaper";
import { createDepartmentNode, defineDepartment, DEFAULT_DEPARTMENT_DISPLAY, FOUCUS_DEPARTMENT_DISPLAY } from "./../nodeDefinition/departmentDefinition";
import { createPositionNode, definePosition, DEFAULT_POSITION_DISPLAY, FOUCUS_POSITION_DISPLAY } from "./../nodeDefinition/positionDefinition";
import { SYMPER_HOME_ORGCHART, getDefaultConfigNodeData, jointLinkNode } from './nodeAttrFactory';  
import avatarDefault from "@/assets/image/avatar_default.jpg";
import { util } from '../../../plugins/util';
import {
    appConfigs
} from "@/configs";
require('@/plugins/rappid/rappid.css');
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
        },
        readonly:{
            type: Boolean,
            default: false
        }
    },
    created(){
        defineDepartment();
        definePosition();
    },
    mounted(){
        this.initDiagramView();
    },
    computed: {
        selectingNode(){
            let workspace = this.$store.state.orgchart.editor[this.instanceKey];
            if(workspace){
                return workspace.selectingNode;
            }else{
                return getDefaultConfigNodeData();
            }
        },
        mapUserById(){
            return this.$store.state.app.allUsers.reduce((map, user) => {
                map[user.id] = user;
                return map;
            },{});
        }
    },
    data(){
        return {
			background: {
				color: '#F3F2F1'
			},
			gridSize: 30,
			drawGrid: {
				name: 'mesh'
            },
            viewportRect:null,
            paper: null,
            paperScroller: null,
        }
    },
	methods: {
        saveSVG(){
            this.$refs.jointPaper.saveSVG();
        },
        handleHeaderAction(action){
            this.$refs.jointPaper.actionOnToolbar(action);
        },
        loadDiagramFromJson(cells){
			let cellsReduce = this.customDepartmentInfor(cells)
			let treeLayout = this.$refs.jointPaper.treeLayout;
            this.$refs.jointPaper.graph.fromJSON(cellsReduce);
			treeLayout.layout();
			this.getAllDiagramCells()
		},
		customDepartmentInfor(cells){
			let orgChartData = this.$store.state.orgchart.orgChartData
			let orgchartId = this.$route.params.id	
			let countUser 
			let countDepartment
			let self = this
			cells.cells.forEach(function(e){
				if(e.type == 'Symper.Department'){
					orgChartData[orgchartId].departments.forEach(function(k){
						if(e.id == k.vizId){
							self.$store.dispatch('orgchart/getUserByVizId', k)
							let listUser = self.$store.getters['orgchart/listUserInCurrentNode']
							countDepartment = self.$store.state.orgchart.listChildInCurrentNode.length - 1
       						countUser = listUser.length	
						}
					})
					e.markup = e.markup.replace('countUser', countUser)
					e.markup = e.markup.replace('countDepartment', countDepartment)
				}
			})
			return cells
		},
        getAllDiagramCells(){
            return this.$refs.jointPaper.graph.toJSON();
        },
        updateCellAttrs(cellId, attrName, value){
            let mapName = {
                name: '.name/text',
                border: '.card',
                managerName: '.manager-name/text',
                managerEmail: '.manager-email/text',
                managerAvartar: 'image/xlink:href',
                userInPositionAvartar: 'image/xlink:href',
                accountNumberPlus: '.account-number-plus/text',
                positionCode: '.position-code/text',
                lastDynamicAttr: '.dynamic-attr-value/text',
                highlight: '.border-bottom/fill'
			};
			
			let cell = this.$refs.jointPaper.graph.getCell(cellId);
            if(cell && mapName[attrName]){
                if(typeof value == 'object'){
                    for(let key in value){
                        cell.attr(mapName[attrName]+'/'+key, value[key]);
                    }
                }else{
					let imgurl = util.addEnvToUrl(appConfigs.apiDomain.fileManagement+'readFileSvg/user_avatar');
                    if(value.includes(imgurl)){
						cell.attr(mapName[attrName], value,
					);
                    }else{
						if(value && attrName == 'name'){
							let newValue =   joint.util.breakText(
									value, 
									{
										width: 165,
										height: 20
									},
									{ 'font-size': 13 },
									{ ellipsis: true  }
								)
							cell.attr(mapName[attrName], newValue,
							);
						}
						else if(value){
 							let newValue =   joint.util.breakText(
								value, 
								{
									width: 160,
									height: 20
								},
								{ 'font-size': 13 },
								{ ellipsis: true  }
							)
                        cell.attr(mapName[attrName], newValue,
                        );
						}
                          
                    }
                  
                   
                }
            }
        },
        listenPaperEvent(){
            let paper = this.$refs.jointPaper.paper;
            let graph = this.$refs.jointPaper.graph;
            let treeLayout = this.$refs.jointPaper.treeLayout;
            let self = this;

            paper.on('element:remove', function(elementView, evt, x, y) {
                evt.stopPropagation();
                let allChildIds = self.getAllChildIdOfNode(elementView.model.id);
                for(let idCell of allChildIds){
                    let cell = self.$refs.jointPaper.graph.getCell(idCell);
                    cell.remove();
                }
                // A member removal
				treeLayout.layout();
				self.$emit('delete-node')
            });
            paper.on('element:view', function(elementView, evt, x, y) {
				  self.$emit('cell-contextmenu', elementView.model.id);
				  evt.stopPropagation()
				  evt.preventDefault()
            });
            paper.on('element:add', function(elementView, evt) {
                evt.stopPropagation();
                let countDepartment = graph.getCells().filter((el) => {
                    return el.attributes.type != 'org.Arrow';
                }).length + 1;
                let name = self.context == 'department' ? self.$t('orgchart.editor.department') : self.$t('orgchart.editor.position');
                name += (' '+countDepartment);
                // Adding a new member
                let newNode ;
                if(self.context == 'department'){
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
				self.$store.commit('orgchart/updateCurrentChildrenNodeId',elementView.model.id)
                self.highlightNode(elementView.model);               
            });

            paper.on('blank:pointerclick', function(elementView, evt, x, y) {
                self.unHighlightCurrentNode();    
                self.$emit('blank-paper-clicked');      
            });

            paper.on('cell:contextmenu', function(elementView, evt, x, y) {
				self.$emit('cell-contextmenu', elementView.model.id); 
            });
            
            paper.on('element:collapse', function(view, evt) {
                evt.stopPropagation();
                self.toggleBranch(view.model);
            });
        },
        toggleBranch(root){
            let self = this
            var shouldHide = !root.isCollapsed();
            root.set({ collapsed: shouldHide });
            this.$refs.jointPaper.graph.getSuccessors(root).forEach(function(successor) {
                successor.set({
                    hidden: shouldHide,
                    collapsed: false
                });
            });
            this.layoutAndFocus(this.viewportRect.center());
        },
        layoutAndFocus(focusPoint) {
            let treeLayout = this.$refs.jointPaper.treeLayout;
            treeLayout.layout();
            var center = treeLayout.getLayoutBBox().center();
            this.resizePaper();
            this.paperScroller.center(center.x, center.y);
        },
        resizePaper() {
            let treeLayout = this.$refs.jointPaper.treeLayout;
            this.paper.fitToContent({
                useModelGeometry: true,
                allowNewOrigin: 'any',
                padding: 30,
                contentArea: treeLayout.getLayoutBBox()
            });
        },
        getAllElementModel(){
            return this.$refs.jointPaper.graph.getCells();
        },
        getAllNode(){
            return this.$refs.jointPaper.graph.getCells().filter((el) => {
				return el.attributes.type != 'org.Arrow';
			});
			
        },
        getAllLink(){
            return this.$refs.jointPaper.graph.getCells().filter((el) => {
                return el.attributes.type == 'org.Arrow';
            });
        },
        getAllChildIdOfNode(nodeId){
            let allCell = this.$refs.jointPaper.graph.getCells();
            let mapNode = {};
            let links = [];
            for(let cell of allCell){
                if(cell.attributes.type == 'org.Arrow'){
                    links.push({
                        source: cell.attributes.source.id,
                        target: cell.attributes.target.id,
                    });
                }else{
                    mapNode[cell.attributes.id] = {
                        children: {},
                        parent: {}
                    } 
                }
            }   

            for(let l of links ){
                mapNode[l.source].children[l.target] = true;
                mapNode[l.target].parent[l.source] = true;
            }
            let childIds = {};
            this.appendChildToNode(childIds, mapNode, nodeId);
            return Object.keys(childIds);
        },

        appendChildToNode(result, mapNode, currentNodeId){
            result[currentNodeId] = true;
            for(let childId in mapNode[currentNodeId].children){
                this.appendChildToNode(result, mapNode, childId);
            }
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
			let data = {
                id: firstNode.id,
                name: nodeName,
                autoCreateFirstNode: true
			}
            this.$emit('new-viz-cell-added', data);
			return data
        },
        changeUserDisplayInNode(userIdList){
            let lastUserInfo = this.mapUserById[userIdList[userIdList.length - 1]];
            let avatarUser = util.addEnvToUrl(appConfigs.apiDomain.fileManagement+"readFileSvg/user_avatar_")+lastUserInfo.id
            if(this.context == 'department'){
                if(!lastUserInfo) return;
                this.updateCellAttrs(this.selectingNode.id, 'managerName', lastUserInfo.displayName );
                this.updateCellAttrs(this.selectingNode.id, 'managerEmail', lastUserInfo.email );
                this.updateCellAttrs( this.selectingNode.id, 'managerAvartar', avatarUser);
            }else if(this.context == 'position' && this.selectingNode.id != 'SYMPER_HOME_ORGCHART' ){
                if(userIdList.length == 0){
                    this.updateCellAttrs( this.selectingNode.id, 'userInPositionAvartar', avatarUser);
                    this.updateCellAttrs( this.selectingNode.id, 'accountNumberPlus', '');
                }else{
                    if(!lastUserInfo) return;
                    this.updateCellAttrs( this.selectingNode.id, 'userInPositionAvartar', avatarUser );
                    let plusUser = userIdList.length == 1 ? '' : ('+' + (userIdList.length - 1));
                    this.updateCellAttrs( this.selectingNode.id, 'accountNumberPlus', plusUser);
                }
            }
        },
        setupGraph(graph, paper, paperScroller,viewportRect){
            this.viewportRect = viewportRect
            this.paper = paper
            this.paperScroller = paperScroller
            this.graph = graph;
            let self = this;
            let nodeName = this.context == 'department' ? this.$t('orgchart.editor.department') : this.$t('orgchart.editor.position');
            nodeName += ' 1';
            let firstNode = this.context == 'department' ?  createDepartmentNode(nodeName) : createPositionNode(nodeName);
            
            var treeLayout = new joint.layout.TreeLayout({
                graph: graph,
                direction: 'B',
                parentGap: 40,
                filter: function(siblings) {
                    // Layout will skip elements which have been collapsed
                    let rsl = siblings.filter(function(sibling) {
                        return !sibling.isHidden();
                    });
                    return rsl;
                },
                updateAttributes: function(_, model) {
                    // Update some presentation attributes during the layout
                    model.toggleButtonVisibility(!graph.isSink(model));
                    model.toggleButtonSign(!model.isCollapsed());
                }
            });
            this.treeLayout = treeLayout;
            this.$refs.jointPaper.treeLayout = treeLayout;
            graph.resetCells([firstNode]);
            this.repositionFirstCell(graph, paperScroller);
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
            self.scrollPaperToTop();
        },
        scrollPaperToTop(time = 1000){
            setTimeout((self) => {
                let viewPort = $(self.$refs.jointPaper.$el).find('.symper-orgchart-paper>.joint-paper-scroller');
                let view = $(self.$refs.jointPaper.$el).find('.symper-orgchart-paper>.joint-paper-scroller>.paper-scroller-background>.joint-paper');
                $(viewPort).scrollTop($(view).position().top);
            }, time, this);
        },
        repositionFirstCell(graph, paperScroller){
            let firstNode = graph.getCells()[0];
            firstNode.position(300,20);
            
        },
        changeTypeView(type){
            let treeLayout = this.$refs.jointPaper.treeLayout;
            treeLayout.set('direction', type);
            treeLayout.layout();
        },
		exampleSetupGraph(graph) {
			
        },
        initDiagramView(){
            
        }
    },
    watch:{
       
    }
}
</script>

<style>
.name{
	text-transform: uppercase !important;
}
.img-manager{
	height: 35px !important;
	width: 35px !important;
}
.view:hover{
	border-bottom: 1px solid black;
}
</style>
