<template>
    <div class="h-100 w-100">
    	<div ref="jointWrapper" class="xxxxxxxxx" :style="{
            height: wrapper.height,
            width: wrapper.width
        }"></div>
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
			// gridSize: this.gridSize,
			// drawGrid: this.drawGrid,
			background: this.background,
			interactive: !this.readonly
        });
        
        
        var paperScroller = new joint.ui.PaperScroller({
            paper: this.paper,
            autoResizePaper: true
        });
        
        paperScroller.$el.css({ width: '100%', height: '100%' }).appendTo(this.$refs.jointWrapper);
        paperScroller.zoom(-0.2);
        paperScroller.centerContent();
        this.paper.on('blank:pointerdown', paperScroller.startPanning);
		this.$emit('init', this.graph, this.paper, paperScroller);
	}
};
</script>

<style scoped>
</style>
