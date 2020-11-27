<template>
	<div class="d-flex list-item-selector">
		<v-autocomplete
            v-model="values"
			v-show="selectingApp == true"
            :items="listItem"
            dense
            chips
			item-text="name"
			return-object
			class="ml-1"
			style="margin-top:-3px"
            small-chips
			@change="handleChange"
            multiple
          ></v-autocomplete>
		<v-btn
			icon
			tile
			x-small
			class="ml-1 mr-2"
			color="green"
			v-if="selectingApp == false"
			@click="selectApp($event)"
		>
			<v-icon x-small>
				mdi-plus-thick
			</v-icon>
		</v-btn>
		<v-btn
			icon
			tile
			x-small
			class="ml-1 mr-2"
			color="error"
			v-else
			@click="selectingApp = false"
		>
			<v-icon x-small>
				mdi-close
			</v-icon>
		</v-btn>
		<div :class="{'selecting-app': selectingApp == true }" style="width:400px; margin-top:-10px; margin-left:-4px">
			<v-sheet
			>
				<v-chip-group
					mandatory
					active-class="primary--text"
				>
					<v-chip
						v-for="value in values"
						:key="value.id"
						small
						color="lightskyblue"
						label
						class="fs-13"
						@click="handleAppClick(value)"
					>
					{{ value.name }}
					</v-chip>
				</v-chip-group>
			</v-sheet>
		</div>
	</div>
</template>

<script>
export default {
	props:{
		listItem:{
			type: Array,
			default(){
				return []
			}
		},
		data:{

		},
		values:{
			type: Array,
			default(){
				return []
			}
		}
	},
	data(){
		return {
			selectingApp: false,
		}
	},
	methods:{
		selectApp(event){
			event.preventDefault()
			event.stopPropagation() 
			this.selectingApp = true
		},
		cancelSelect(){
			this.selectingApp = false
		},
		handleAppClick(app){
			this.selectingApp = false
			this.$emit('item-selected' , app.id)
		},
		handleChange(){
			this.$emit('list-item-selected' , this.values)
		}
	
	},
	mounted(){
		let self = this 
	}
}
</script>

<style scoped>

.list-item-selector >>> .v-slide-group__prev,
.list-item-selector >>> .v-slide-group__next{
	min-width: unset !important;
}
.list-item-selector >>> .selecting-app{
	width:250px !important
}
.list-item-selector >>> .v-chip--select{
	display: none !important;
}
</style>