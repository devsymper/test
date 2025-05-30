<template>
	<div>
		<v-treeview
			dense
			open-all
			:items="treeData"
			:class="{'tree-view': true, 'mb-2': true, 'tree-view-doc': !customCss, 'tree-view-custom': customCss}"
			ref="tree"
			style="
            overflow:hidden;padding-bottom:8px"
		>
			<template v-slot:append="{ item }">
				<div v-if="!item.condition" class="tree-item-slot">
					<v-autocomplete :items="listColumn"  :item-value="itemValue" v-model="item.column" class="tree__list-columns" @change="onChangeConfig" dense solo >
						<template v-slot:item="data">
							<ColumnInfo  v-if="customAutocomplete" :infoColumn="data.item" />
							<div class="d-flex" v-else>
								<span  class="fs-13">
									{{data.item.title}}
								</span>
							</div>
						</template>	
						<template v-slot:selection="data">
							<div v-if="customAutocomplete" class="d-flex">
								<span class="fs-13 ml-1">
									{{data.item.columnName}}
								</span>
							</div>
							<div v-else>
								<span  class="fs-13">
									{{data.item.name ? data.item.name : data.item.title}}
								</span>
							</div>
						</template>
					</v-autocomplete>
					<v-autocomplete
						:items="listOperator"
						@change="onChangeConfig"
						class="tree__list-operations ml-1 mr-1"
						item-text="title"
						:menu-props="{ minWidth: 60 }"
						v-model="item.operator"
						dense
						solo
					></v-autocomplete>
					<v-text-field v-model="item.value" @change="onChangeConfig" solo></v-text-field>
					<v-btn class="ml-2 mt-1 btn-delete-item-condition" tile icon x-small  @click="deleteConditionItem(item)">
						<v-icon small >mdi-close</v-icon>
					</v-btn>
				</div>
				<div v-else type="text" class="list-action-treesql">
					<v-btn light icon style="height: 28px;width: 28px;" v-if="!item.root" @click="deleteCondition(item)">
						<v-icon style="font-size:16px;"> mdi-close</v-icon>
					</v-btn>
					<v-btn light icon style="height: 28px;width: 28px;" @click="swapCondition(item)">
						<v-icon style="font-size:16px;">mdi mdi-swap-vertical-bold</v-icon>
					</v-btn>

					<v-menu bottom left offset-y transition="slide-y-transition">
						<template v-slot:activator="{ on }">
							<v-btn light icon v-on="on" style="height: 28px;width: 28px;">
								<v-icon style="font-size:16px;">mdi mdi-plus</v-icon>
							</v-btn>
						</template>

						<v-list>
							<v-list-item v-for="(node, i) in allNode" :key="i" style="cursor:pointer; min-height:25px;" @click="addNode(node, item, i)">
								<v-list-item-title style="font-size:13px;">{{ node.title }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</div>
			</template>
		</v-treeview>
	</div>
</template>

<script>
import ColumnInfo from '@/components/common/bi/ColumnInfo'
export default {
	props: {
		listColumn: {
			type: Array,
		},
		defaultData: {
			type: Array,
		},
		customAutocomplete:{
			type: Boolean, 
			default: false
		},
		itemValue:{
			type: String,
			default: 'name'
		},
		customCss:{
			type: Boolean,
			default: false
		}
	},
	watch: {
		defaultData: {
			deep: true,
			immediate: true,
			handler: function(vl) {
				if (vl) {
					this.treeData = vl;
				}
			},
		},
	},
	data() {
		return {
			listOperator: ['>', '>=', '<', '<=', '=', '!=', '<>', '!>', '!<', 'ILIKE'],
			treeData: [
				{
					id: 1,
					nodeType: 'group',
					name: 'AND',
					root: true,
					condition: true,
					children: [],
				},
			],
			mapIcon:{
				text: 'mdi-text-box-outline',
				number: 'mdi-format-list-numbered',
				date: 'mdi-clock-time-five-outline',
			},
			allNode: [
				{ title: 'item', type: 'item' },
				{ title: 'group', type: 'group' },
			],
		};
	},
	components:{
		ColumnInfo
	},
	methods: {
		addNode(node, item, i) {
			if (node.type == 'item') {
				item.children.push({ id: Date.now(), condition: false, name: '', parent: item.id, formulas: '' });
			} else {
				item.children.push({ id: Date.now(), condition: true, name: 'AND', parent: item.id, children: [] });
			}
			this.$emit('change-config', {})
			this.$refs.tree.updateAll(true);
		},
		setValueForNode() {},
		/**
		 * Thay đổi điều kiện
		 */
		swapCondition(item) {
			let value = item.name == 'OR' ? 'AND' : 'OR'
			this.$set(item, 'name' , value)
			this.onChangeConfig();
		},
		/**
		 * Hàm xóa 1 điều kiện con trong 1 node
		 */
		deleteConditionItem(item) {
			this.deleteCondition(item);
		},
		/**
		 * Xóa node
		 */
		deleteCondition(item) {
			this.$emit('change-config', {})
			let parentId = item.parent;
			let parentNode = this.bfs(this.treeData, parentId);
			for (let i = 0; i < parentNode.children.length; i++) {
				if (parentNode.children[i].id == item.id) {
					parentNode.children.splice(i, 1);
				}
			}
		},

		bfs(tree, id) {
			var queue = [];

			queue.push(tree[0]);

			while (queue.length !== 0) {
				for (let i = 0; i < queue.length; i++) {
					var node = queue.shift();
					if (node.id === id) {
						return node;
					}
					if (node.children) {
						queue = queue.concat(node.children);
					}
				}
			}
			return null;
		},
		/**
		 * Hàm lấy công thức từ tree validate
		 */

		getData(item) {
			let where = '';
			let name = item.name;
			let children = item.children;
			if (children.length == 0) {
				where = 'true';
			} else if (children.length == 1) {
				let value = children[0].value ? "'" + children[0].value + "'" : "''";
				where = '(' + children[0].column + ' ' + children[0].operator + ' ' + value + ')';
			} else {
				for (let index = 0; index < children.length; index++) {
					const childItem = children[index];
					let childSql = '';
					if (childItem.condition) {
						childSql = '(' + this.getData(childItem) + ')';
					} else {
						if (childItem.column && childItem.operator) {
							let childValue = childItem.value ? "'" + childItem.value + "'" : "''";
							childSql = '(' + childItem.column + ' ' + childItem.operator + ' ' + childValue + ')';
						} else {
							childSql = 'true';
						}
					}
					if (index == children.length - 1) {
						where += childSql;
					} else {
						where += childSql + ' ' + name + ' ';
					}
				}
			}
			return where;
		},
		getDataChildRen(children, data, currentCondition) {
			let dataCondition = '';
			for (let i = 0; i < children.length; i++) {
				let child = children[i];
				if (child.condition) {
					if (child.children.length > 0) {
						this.getDataChildRen(child.children, dataCondition);
					}
				} else {
					dataCondition += child.formulas + ' ' + currentCondition;
				}
			}
		},
		getTreeData() {
			let where = this.getData(this.treeData[0]);
			return { where: where, treeData: this.treeData };
		},
		onChangeConfig() {
			let where = this.getData(this.treeData[0]);
			this.$emit('change-config', { where: where, treeData: this.treeData });
		},
	},
};
</script>

<style scoped>
.fs-11 {
	font-size: 11px;
}
.v-list-item {
	min-height: unset !important;
	padding: 4px 12px;
}
.v-list-item .v-list-item__title {
	font: 11px !important;
}
.tree-view-doc >>> .v-treeview-node__level {
	display: none;
}
.tree-view >>> .v-treeview-node__label:hover .list-action-treesql{
	opacity: 1;
}
.tree-view >>> .v-treeview-node__label{
	font-size: 13px !important;	
}
.list-action-treesql{
	opacity:0;
}
.list-action-treesql:hover{
	opacity: 1;
}
.tree-view >>> .v-treeview-node__label {
	flex: unset;
}
.tree-view >>> .v-text-field__details{
	display: none;
}
.tree-view >>> .tree-item-slot {
	display: flex;
	margin-top: -8px;
}
.tree-view-custom >>> .tree-item-slot {
	margin-bottom: -14px;
}
.tree-view >>> .tree-item-slot .v-input {
	margin: unset;
}
.tree-view >>> .tree-item-slot .v-input__control {
	min-height: unset !important;
}
.tree-view >>> .tree-item-slot .v-input__control .v-input__slot {
	height: 25px;
	font-size: 11px;
	box-shadow: unset !important;
	border: 1px solid lightgray
}
.tree__list-columns >>> .v-input__icon,
.tree__list-operations >>> .v-input__icon {
	display: none;
}
.tree__list-columns >>> .v-input__slot{
	width: 150px !important
}
.tree__list-columns {
	margin-left: -7px !important;
}
.tree__list-operations {
	width: 70px;
}
.tree-view-doc ::v-deep .v-treeview-node__root {
	padding-right: 0 !important;
}
.tree-view-doc ::v-deep .v-treeview-node__children > .v-treeview-node:not(.v-treeview-node--leaf) {
	border: var(--symper-border);
	margin: 0px 2px 8px 12px;
}
.tree-view-doc ::v-deep .v-treeview-node__children > .v-treeview-node:not(.v-treeview-node--leaf) .v-treeview-node__root {
	padding-left: 0 !important;
}
.tree-view-doc >>> .v-treeview-node__toggle {
	display: none;
}
.tree-view-custom >>> .v-treeview-node__toggle {
	margin-left: 6px;
	margin-right: -8px;
}
.btn-delete-item-condition {
	opacity: 0;
}
.tree-item-slot:hover .btn-delete-item-condition {
	opacity: 1;
}
.tree-view-custom >>> .v-treeview-node__children{
	margin-left: -4px ;
}

</style>
