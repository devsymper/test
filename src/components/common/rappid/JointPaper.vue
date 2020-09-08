<template>
    <div class="h-100 w-100">
        <div ref="symperPaperToolbar" class=" d-none">
        </div>
    	<div ref="jointWrapper" class="symper-orgchart-paper" :style="{
            height: wrapper.height,
            width: wrapper.width
        }"></div>
        <a ref="downloadLinkSVG" href></a>
    </div>
</template>

<script>
import { util } from '../../../plugins/util';
require('./jointjs');
export default {
    data(){
        return {
            wrapper: {
                height: '300px',
                width: '500px'
            }
        }
    }, 
	name: 'JointPaper',
	props: {
		width: {
			type: [String, Number],
			default: 800
		},
		height: {
			type: [String, Number],
			default: 600
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
		this.name = this.$options.name;
		console.log(`[${this.name}] Created`);
		this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
	
	},
	mounted() {
		console.log(`[${this.name}] Mounted:`, this.$refs.joint);
        let thisSize = util.getComponentSize(this);
        this.wrapper.height = (thisSize.h - 80)+'px';
        this.wrapper.width = thisSize.w+'px';
		this.paper = new joint.dia.Paper({
			cellViewNamespace: joint.shapes,
			model: this.graph,
			width: this.width,
			height: this.height,
			background: this.background,
            interactive: !this.readonly,
            sorting: joint.dia.Paper.sorting.APPROX,
        });
        var paperScroller = new joint.ui.PaperScroller({
            paper: this.paper,
            autoResizePaper: true
        });
        paperScroller.$el.css({ width: '100%', height: '100%' }).appendTo(this.$refs.jointWrapper);
        paperScroller.zoom(-0.2);
        paperScroller.centerContent();
        this.paper.on('blank:pointerdown', paperScroller.startPanning);
        this.addToolbar(paperScroller);
		this.$emit('init', this.graph, this.paper, paperScroller);
		// add element
		 var rect = new joint.shapes.standard.Rectangle();
			rect.position(100, 30);
			rect.resize(100, 40);
			rect.attr({
				body: {
					fill: 'blue'
				},
				label: {
					text: 'Hello',
					fill: 'white'
				}
			});
			rect.addTo(this.paper);
		
    },
    methods: {
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
        addToolbar(paperScroller){
            let commandManager = new joint.dia.CommandManager({
                graph: this.graph
            });
            let toolbar = new joint.ui.Toolbar({
                tools: ['zoomIn', 'zoomOut', 'zoomToFit', 'undo', 'redo', 'zoomSlider'],
                references: {
                    paperScroller: paperScroller,
                    commandManager: commandManager
                }
            });
            $(this.$refs.symperPaperToolbar).append(toolbar.render().el);
        }
    }
};
</script>

<style scoped>
</style>
