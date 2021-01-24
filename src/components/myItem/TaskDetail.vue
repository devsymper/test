<template>
	<div class="w-100" style="height: 100%">
		<v-row class="ml-0 mr-0 justify-space-between task-header" id="taskHeader" style="line-height: 36px;height:44px">
			<v-tooltip bottom>
				<template v-slot:activator="{ on }">
					<div v-on="on" class="fs-13 pl-2 pt-1 float-left text-ellipsis" :style="{ width: widthInfoTask + 'px' }">
						<span>
							{{ taskBreadcrumb }}
						</span>
						<v-chip x-small label class="ma-2" :color="taskStatus.color" text-color="white">
							<span class="fs-12">
								{{ $t('tasks.' + taskStatus.title) }}
							</span>
						</v-chip>
					</div>
				</template>
				<span>{{ taskBreadcrumb }}</span>
			</v-tooltip>
			<div id="action-task" class="text-right pt-1 pb-1 pr-0 float-right">
				<v-btn small disabled class="mr-3" color="success" v-if="showSubmitSuccessBtn"> <v-icon small color="success" class="mr-1">mdi-check-outline</v-icon> Submited </v-btn>
				<span v-if="!originData.endTime && !hideActionTask" class="mr-10">
					<span v-if="originData.assigneeInfo && checkRole(originData.assigneeInfo.id) == true" style="margin-right: 85px !important">
						<v-btn
							small
							depressed
							v-for="(action, idx) in taskActionBtns"
							:dark="!loadingAction || idx == indexAction"
							:key="idx"
							:color="action.color"
							class="mr-1"
							@click="saveTaskOutcome(action.value, idx)"
							:loading="loadingAction && idx == indexAction"
							:disabled="loadingAction && idx != indexAction"
						>
							{{ action.text }}
						</v-btn>
					</span>
					<span v-else class="mr-14">
						<v-btn small depressed disabled v-for="(action, idx) in taskActionBtns" :key="idx" :color="action.color" class="mr-2" :class="{'mr-9': checkShowEditRecord()}" >
							{{ action.text }}
						</v-btn>
					</span>
				</span>

				<ListActionMenu
					id="action-task-life-cycle"
					@action-clicked="handlerActionClick"
					:userType="userType"
					:taskType="taskStatus.value"
					:taskInfo="taskInfo"
					:showResolveAction="!showSubmitBtn"
					:style="{ position: 'absolute', right: rightAction + 'px ', top: '4px' }"
				/>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn class="ml-18" v-on="on" text small @click="toggleSidebar" icon tile>
							<v-icon small>mdi-information-outline</v-icon>
						</v-btn>
					</template>
					<span>Xem chi tiết</span>
				</v-tooltip>
				<v-tooltip bottom>
					<template v-slot:activator="{ on }">
						<v-btn icon tile @click="$copyTextToClipboard(linkTask)" v-on="on" text small>
							<v-icon small>mdi-page-next-outline</v-icon>
						</v-btn>
					</template>
					<span>Sao chép đường dẫn</span>
				</v-tooltip>
				<v-tooltip bottom v-if="checkShowEditRecord()">
					<template v-slot:activator="{ on }">
						<v-btn @click="showUpdateSubmitedDocument()" icon tile v-on="on" text small>
							<v-icon small>mdi-pencil-circle-outline</v-icon>
						</v-btn>
					</template>
					<span>Sửa nội dung văn bản</span>
				</v-tooltip>
				<!-- <button @click="getTaskTest">Click</button> -->
				<v-btn small tile icon text @click="closeDetail">
					<v-icon small>mdi-close</v-icon>
				</v-btn>
			</div>
		</v-row>
		<v-divider style="border-color: #dedede;"></v-divider>
		<v-row class="ma-0 detail-task" style="height: calc(100% - 45px);">
			<!-- <VuePerfectScrollbar :style="{height: parentHeight +'px'}" > -->
			<task
				@task-submited="handleTaskSubmited"
				@task-submit-error="submitError"
				:is="`task`"
				:taskInfo="taskInfo"
				:appId="appId"
				:isShowSidebar="isShowSidebar"
				:originData="originData"
				:tabsData="tabsData['people']"
				@changeUpdateAsignee="changeUpdateAsignee"
				:definitionName="breadcrumb.definitionName"
				:ref="`task`"
			>
			</task>
			<!-- </VuePerfectScrollbar> -->
		</v-row>
		<v-dialog v-model="showDialogAlert" max-width="350">
			<v-card>
				<v-card-title class="headline">{{ $t('myItem.alert.title_aproval') }}</v-card-title>
				<v-card-text>{{ $t('myItem.alert.contentPermissionDenied') }}</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red darken-1" text @click="showDialogAlert = false">Ok</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<SnackBarSubmit
			ref="snackbar"
			:userType="userType"
			:taskType="taskStatus.value"
			@edit-clicked="showUpdateSubmitedDocument"
			:showResolveAction="!showSubmitBtn"
			@action-clicked="handlerActionClick"
		/>
		<AssignDialog :showDialog="modelDialog.reAssignShowDialog" @cancel="modelDialog.reAssignShowDialog = false" :originData="originData" @success="refreshMyItem('reAssign')" />
		<ClaimDialog :showDialog="modelDialog.claimShowDialog" @cancel="modelDialog.claimShowDialog = false" :taskId="originData.id" @success="refreshMyItem('claim')" />
		<CompleteDialog
			:showDialog="modelDialog.completeShowDialog"
			@cancel="modelDialog.completeShowDialog = false"
			:taskId="originData.id"
			:varsForBackend="varsForBackend"
			:taskInfo="taskInfo"
			@success="refreshMyItem('complete')"
		/>
		<DelegateDialog
			:showDialog="modelDialog.delegateShowDialog"
			@cancel="modelDialog.delegateShowDialog = false"
			:taskStatus="taskStatus"
			@success="refreshMyItem('delegate')"
			:taskId="originData.id"
			:originData="originData"
		/>
		<ResolveDialog
			:showDialog="modelDialog.resolveShowDialog"
			@cancel="modelDialog.resolveShowDialog = false"
			:originData="originData"
			:taskId="originData.id"
			@success="refreshMyItem('resolve')"
		/>
		<UnClaimDialog :showDialog="modelDialog.unClaimShowDialog" @cancel="modelDialog.unClaimShowDialog = false" @success="refreshMyItem('unClaim')" :taskId="originData.id" />
	</div>
</template>

<script>
import icon from '../../components/common/SymperIcon';
import attachment from './Attachment';
import comment from './Comment';
import info from './Info';
import people from './People';
import relatedItems from './RelatedItems';
import task from './Task';
import BPMNEngine from '../../api/BPMNEngine';
import { getVarsFromSubmitedDoc } from '../../components/process/processAction';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import { documentApi } from '../../api/Document';
import { extractTaskInfoFromObject, addMoreInfoToTask } from '@/components/process/processAction';
import ListActionMenu from './taskLifeCycle/ListActionMenu';
import SnackBarSubmit from './taskLifeCycle/SnackBarSubmit';
import { util } from '../../plugins/util';
import AssignDialog from './taskLifeCycle/Dialogs/AssignDialog';
import ClaimDialog from './taskLifeCycle/Dialogs/ClaimDialog';
import CompleteDialog from './taskLifeCycle/Dialogs/CompleteDialog';
import DelegateDialog from './taskLifeCycle/Dialogs/DelegateDialog';
import ResolveDialog from './taskLifeCycle/Dialogs/ResolveDialog';
import UnClaimDialog from './taskLifeCycle/Dialogs/UnClaimDialog';
import { taskApi } from '../../api/task';
import { formulasApi } from '../../api/Formulas';

export default {
	name: 'taskDetail',
	props: {
		// Thông tin của một task, cấu trúc giống như một item khi lấy danh sách task
		taskInfo: {
			type: Object,
			default: () => {
				return {};
			},
		},
		delegationState: {
			default: null,
		},
		originData: {
			type: Object,
			default: () => {
				let self = this;
				return {
					assigneeInfo: {
						id: 0,
					},
				};
			},
		},
		isInitInstance: {
			type: Boolean,
			default: false,
		},
		parentHeight: {
			type: Number,
			default: 300,
		},
		hideActionTask: {
			type: Boolean,
			default: false,
		},
		allVariableProcess: {
			type: Array,
			default: () => {
				return [];
			},
		},
		appId: {
			type: String,
			default: '',
		},
		reload: {
			type: Boolean,
			default: true,
		},
	},
	watch: {
		taskInfo: {
			deep: true,
			immediate: true,
			handler(valueAfter) {
				this.changeTaskDetail();
				this.showSubmitSuccessBtn = false;
				this.setCustomDocControls();
			},
		},
		delegationState(val) {
			// if(val == 'pending'){
			// 	this.taskStatus = this.getTaskStatus('#8E2D8C', 'Ủy quyền', 'delegate')
			// }
		},
		originData: {
			deep: true,
			immediate: true,
			handler(valueAfter) {
				this.isShowSidebar = false;
				this.varsForBackend = {};
				this.checkActionOfUser(valueAfter);
				if (this.checkShowEditRecord()) {
					this.rightAction = 120;
				} else {
					this.rightAction = 90;
				}
			},
		},
		taskBreadcrumb: function() {
			this.getWidthHeaderTask();
		},
		'sapp.collapseSideBar': function(newVl) {
			this.getWidthHeaderTask();
		},

		taskActionBtns: {
			deep: true,
			immediate: true,
			handler(arr) {
				if (this.checkShowEditRecord()) {
					this.rightAction = 120;
				} else {
					this.rightAction = 90;
				}
			},
		},
	},
	components: {
		icon: icon,
		attachment,
		comment,
		info,
		people,
		relatedItems,
		task,
		VuePerfectScrollbar,
		ListActionMenu,
		SnackBarSubmit,
		AssignDialog,
		ClaimDialog,
		CompleteDialog,
		DelegateDialog,
		ResolveDialog,
		UnClaimDialog,
	},
	data: function() {
		return {
			indexAction: -1,
			showSubmitSuccessBtn: false,
			varsForBackend: {},
			modelDialog: {
				unClaimShowDialog: false,
				claimShowDialog: false,
				resolveShowDialog: false,
				completeShowDialog: false,
				delegateShowDialog: false,
				reAssignShowDialog: false,
			},
			loadingAction: false,
			showSnackbar: false,
			rightAction: 120,
			showDialogAlert: false,
			isRole: false, //value =falses khi assignee = userId, =true khi assignee = userId:role
			widthInfoTask: 330,
			isShowSidebar: false,
			breadcrumb: {
				appName: '',
				definitionName: '',
				instanceName: '',
				taskName: '',
			},
			descriptionTask: '',
			tabsData: {
				people: {
					assignee: [],
					owner: [],
					participant: [],
					watcher: [],
				},
				task: {},
				'sub-task': {},
				attachment: {},
				comment: {},
				info: {},
				'related-items': {},
			},
			userType: '',
			linkTask: '',
			taskActionBtns: [
				// {
				//     text:"Submit",
				//     value:"submit",
				//     color:"blue"
				// },
			],
			taskAction: undefined,
			tab: null,
		};
	},
	computed: {
		stask() {
			return this.$store.state.task;
		},
		// showResoleAction(){
		// 	if(this.taskInfo.action.parameter.documentObjectId){
		// 		return true
		// 	}else{
		// 		return false
		// 	}
		// },
		showSubmitBtn() {
			if (this.taskInfo.action) {
				if (this.taskInfo.action.parameter.documentObjectId) {
					return false;
				} else {
					return true;
				}
			} else {
				return true;
			}
		},
		sapp() {
			return this.$store.state.app;
		},
		taskStatus() {
			let obj;
			if (this.originData.isDone == '1') {
				obj = this.getTaskStatus('success', 'complete', 'complete');
			} else {
				if (!this.delegationState) {
					if (this.originData.assignee) {
						obj = this.getTaskStatus('#F59324', 'assign', 'assign');
					} else {
						obj = this.getTaskStatus('#ED6A5E', 'unAssign', 'unAssign');
					}
				} else {
					if (this.delegationState == 'pending') {
						obj = this.getTaskStatus('#8E2D8C', 'delegate', 'delegate');
					}
					if (this.delegationState == 'resolved') {
						obj = this.getTaskStatus('#F59324', 'assign', 'assign');
					}
				}
			}
			return obj;
		},
		usersMap() {
			return this.$store.state.app.allUsers.reduce((map, el) => {
				map[el.id] = el;
				return map;
			}, {});
		},	
		taskBreadcrumb() {
			let bsr = this.breadcrumb.taskName;
			let allDef = this.$store.state.process.allDefinitions;
			if (this.breadcrumb.definitionName) {
				if (this.breadcrumb.appName && this.breadcrumb.appName != '') {
					bsr = `${this.breadcrumb.appName} / ${this.breadcrumb.definitionName} / ${bsr}`;
				} else {
					bsr = `${this.breadcrumb.definitionName} / ${bsr}`;
				}
			} else if (this.isInitInstance && !$.isEmptyObject(allDef)) {
				if (allDef[this.$route.params.id]) {
					bsr = `${allDef[this.$route.params.id].name} / Start workflow`;
				} else {
					bsr = `... / Start workflow`;
				}
			}
			return bsr;
		},
	},
	created() {},
	methods: {
		needComplyFormula(str) {
			return /ref\s*\(|select |\$\{/i.test(str);
		},
		async updateProcessInstanceName() {
			if (this.taskAction != '' && this.taskAction != undefined && this.taskAction != 'submitAdhocTask') {
				let dataInput = this.$refs.task.getVarsMap();
				let processName = '';
				let processKey = this.originData.processDefinitionId.split(':')[0];
				let processInstanceNameKey = processKey + '_instanceDisplayText';
				let formulaName = dataInput[processInstanceNameKey];
				if (this.needComplyFormula(formulaName)) {
					let newName = await formulasApi.getDataByAllScriptType(formulaName, dataInput);
					BPMNEngine.updateProcessInstance(this.originData.processInstanceId, {
						name: newName,
					});
				}
			}
		},
		submitError() {
			console.log('Error submit');
			this.loadingAction = false;
		},
		refreshMyItem(type) {
			this.modelDialog[type + 'ShowDialog'] = false;
			this.$emit('task-submited');
			// this.$emit('reselect-object')
		},
		handlerDelegateSuccess() {
			this.modelDialog.delegateShowDialog = false;
			this.$emit('reload-data');
		},
		getTaskStatus(color, title, value) {
			let obj = {
				color: color,
				title: title,
				value: value,
			};
			return obj;
		},
		checkActionOfUser(originData) {
			let userInfor = this.$store.state.app.endUserInfo;
			if (this.originData.assigneeInfo) {
				if (userInfor.id == this.originData.assigneeInfo.id) {
					this.userType = 'assignee';
				}
			}
			if (this.originData.ownerInfo) {
				if (userInfor.id == this.originData.ownerInfo.id) {
					this.userType = 'owner';
				}
			}
		},
		handlerActionClick(action) {
			this.modelDialog[action + 'ShowDialog'] = true;
		},
		getWidthHeaderTask() {
			setTimeout(
				(self) => {
					let width = $('#taskHeader').width() - $('#action-task').width() - 40;
					self.widthInfoTask = width;
				},
				210,
				this
			);
		},
		checkShowEditRecord() {
			let taskInfo = this.taskInfo;
			if (this.delegationState == 'pending') {
				return true;
			} else if (this.originData) {
				let isPendding = !this.originData.endTime;
				if (taskInfo.action) {
					let isApprovalTask = taskInfo.action.action == 'approval';
					let hasEditableControls = !taskInfo.approvalEditableControls || (taskInfo.approvalEditableControls && taskInfo.approvalEditableControls.length);
					return isPendding && isApprovalTask && hasEditableControls;
				}
			}
		},
		checkRole(assigneeId) {
			if (assigneeId == this.$store.state.app.endUserInfo.id) {
				return true;
			} else {
				return false;
			}
		},
		setCustomDocControls() {
			let editableControls = this.taskInfo.approvalEditableControls;
			if (editableControls && $.isArray(editableControls)) {
				for (let ctrl of editableControls) {
					if (ctrl == 'SYMPER_NONE_CONTROLS') {
						editableControls = [];
						break;
					} else if (ctrl == 'SYMPER_ALL_CONTROLS') {
						editableControls = null;
						break;
					}
				}
			}
			this.taskInfo.approvalEditableControls = editableControls;
		},
		showUpdateSubmitedDocument() {
			this.$refs.task.showUpdateSubmitedDocument = true;
		},
		changeUpdateAsignee() {
			this.$emit('changeUpdateAsignee');
		},
		toggleSidebar() {
			this.isShowSidebar = !this.isShowSidebar;
		},
		changeTaskDetailInfo(taskId) {
			let hostname = window.location.hostname;
			let copyText = this.taskInfo.action.parameter.taskId;
			copyText = util.addEnvToUrl('https://' + hostname + '/#/myitem/tasks/' + copyText);
			this.linkTask = copyText;

			if (!taskId) {
				return;
			}
			let self = this;
			for (let role in self.tabsData.people) {
				self.tabsData.people[role] = [];
				if (this.originData[role]) {
					let userIdentifier = this.originData[role];
					if (userIdentifier.indexOf(':') > 0) {
						userIdentifier = userIdentifier.split(':')[0];
					}
					self.tabsData.people[role] = userIdentifier.split(',').reduce((arr, el) => {
						if (self.usersMap[el]) {
							arr.push(self.usersMap[el]);
						} else {
							console.warn('user id not found : ', el);
						}
						return arr;
					}, []);
				}
			}
			self.setTaskBreadcrumb(this.originData);
		},
		setTaskBreadcrumb(task) {
			if (!task.name) {
				try {
					task.description = JSON.parse(task.description);
				} catch (error) {
					task.description = {};
				}
				task.name = task.description.content;
			}

			this.descriptionTask = task.description;
			this.breadcrumb.taskName = task.name;
			if (task.processDefinitionId) {
				let processDefinitionId = task.processDefinitionId;
				var arrProcessDefinitionId = processDefinitionId.split(':'); //tách chuỗi để lấy DefinitionKey
				if (this.$store.state.process.allDefinitions[arrProcessDefinitionId[0]]) {
					this.breadcrumb.definitionName = this.$store.state.process.allDefinitions[arrProcessDefinitionId[0]].name;
				}
				this.breadcrumb.instanceName = this.taskInfo.extraLabel + ' ' + this.taskInfo.extraValue;
			} else {
				this.breadcrumb.definitionName = '';
				this.breadcrumb.instanceName = '';
			}
			if (task.processInstanceId && task.processInstanceId != null) {
				this.getAppName(task.processInstanceId);
			}
		},
		async getAppName(processInstanceId) {
			let self = this;
			if (this.appId) {
				if (this.$store.state.task.allAppActive.length == 0) {
					await self.$store.dispatch('task/getAllAppActive');
				}
				let allApp = this.$store.state.task.allAppActive;
				let app = allApp.find((element) => element.id == self.appId);
				if (app) {
					self.breadcrumb.appName = app.name;
				} else {
					self.breadcrumb.appName = '';
				}
			} else {
				const dataVariable = this.allVariableProcess.find((element) => element.processInstanceId === processInstanceId);
				if (dataVariable) {
					self.appId = dataVariable.value;
					if (this.$store.state.task.allAppActive.length == 0) {
						await self.$store.dispatch('task/getAllAppActive');
					}
					let allApp = this.$store.state.task.allAppActive;
					let app = allApp.find((element) => element.id == self.appId);
					if (app) {
						self.breadcrumb.appName = app.name;
					} else {
						self.breadcrumb.appName = '';
					}
				} else {
					self.breadcrumb.appName = '';
				}
			}
		},
		closeDetail() {
			this.$emit('close-detail', {});
		},
		async saveTaskOutcome(value, idx) {
			// hành động khi người dùng submit task của họ
			this.indexAction = idx;
			//check xem user có phải assignee
			this.loadingAction = true;
			// kiểm tra xem user hiện tại có role được phân quyền trong task không?
			if (this.$store.state.app.endUserInfo.id != this.originData.assigneeInfo.id) {
				this.showDialogAlert = true;
				this.loadingAction = false;
			} else if (this.checkRoleUser(this.originData)) {
				if (this.taskAction == 'submit' || this.taskAction == 'update') {
					this.$refs.task.submitForm(value);
				} else if (this.taskAction == 'approval') {
					let elId = this.originData.taskDefinitionKey;
					let taskData = {
						// action nhận 1 trong 4 giá trị: complete, claim, resolve, delegate
						action: 'complete',
						assignee: '1',
						// "formDefinitionId": "12345",
						outcome: value,
						variables: [
							{
								name: elId + '_outcome',
								type: 'string',
								value: value,
							},
							{
								name: elId + '_executor_fullname',
								type: 'string',
								value: this.$store.state.app.endUserInfo.displayName,
							},
							{
								name: elId + '_executor_id',
								type: 'string',
								value: this.$store.state.app.endUserInfo.id,
							},
						],
						// "transientVariables": []
					};
					let res = await this.submitTask(taskData);
					this.saveApprovalHistory(value);
					if (this.reload) {
						this.$emit('task-submited', res);
					} else {
						this.reloadDetailTask();
					}
					this.updateProcessInstanceName();
					this.loadingAction = false;
				} else if (this.taskAction == '' || this.taskAction == undefined || this.taskAction == 'submitAdhocTask') {
					let taskData = {
						action: 'complete',
						outcome: value,
					};
					let res = await this.submitTask(taskData);
					if (this.reload) {
						this.$emit('task-submited', res);
					} else {
						this.reloadDetailTask();
					}
					this.loadingAction = false;
				}
			} else {
				this.showDialogAlert = true;
				this.loadingAction = false;
			}
		},
		saveApprovalHistory(value) {
			let title = this.taskActionBtns.reduce((tt, el) => {
				if (el.value == value) {
					tt = el.text;
				}
				return tt;
			}, '');

			let dataToSave = {
				objectId: this.taskInfo.action.parameter.documentObjectId,
				userId: this.$store.state.app.endUserInfo.id,
				actionTitle: title,
				actionName: value,
				note: '',
			};
			documentApi.saveApprovalHistory(dataToSave);
		},
		async submitTask(taskData) {
			let self = this;
			if (this.taskAction == 'submit' || this.isRole == false) {
				// isRole == false thi update task cập nhật role hiện tại
				await this.updateTask(taskData);
			}
			return new Promise(async (resolve, reject) => {
				try {
					let taskId = self.taskInfo.action.parameter.taskId;
					let result = await BPMNEngine.actionOnTask(taskId, taskData);
					self.$snotifySuccess('Task completed!');
					resolve(result);
				} catch (error) {
					let detail = '';
					if (error.responseText) {
						detail = JSON.parse(error.responseText);
						detail = detail.exception;
					}
					self.$snotifyError(error, 'Can not submit task!', detail);
					reject(error);
				}
			});
		},
		checkRoleUser(originData) {
			let self = this;
			if (originData.assignee.indexOf(':') > 0) {
				let arrDataAssignee = originData.assignee.split(':');
				let assigneeId = arrDataAssignee[0];
				let roleIdentify = originData.assignee.slice(assigneeId.length + 1);
				// ktra enduser có tồn tại role trong assignee không
				if (roleIdentify != '0') {
					let rolesUser = self.$store.state.app.endUserInfo.roles;
					let role = rolesUser[arrDataAssignee[1]].find((element) => element.id == roleIdentify);
					if (role) {
						self.isRole = true;
						return true;
					} else {
						self.isRole = false;
						return false;
					}
				} else {
					self.isRole = false;
					return true;
				}
			} else {
				self.isRole = false;
				return true;
			}
		},
		async updateTask(taskData) {
			let data = {};
			if (this.isRole == false) {
				data.assignee = this.$store.state.app.endUserInfo.id + ':' + this.$store.state.app.endUserInfo.currentRole.id;
			}
			if (this.taskAction == 'submit') {
				// khi submit task
				let description;
				if (typeof this.descriptionTask == 'string') {
					description = JSON.parse(this.descriptionTask);
				} else {
					description = this.descriptionTask;
				}
				if (this.isSubmited) {
					description.action.parameter.documentObjectId = this.documentObjectId;
				} else {
					description.action.parameter.documentObjectId = taskData.variables[0].value;
				}
				data.description = JSON.stringify(description);
			}

			let taskId = this.originData.id;
			return BPMNEngine.updateTask(taskId, data);
		},
		async handleTaskSubmited(data) {
			this.$refs.snackbar.clickShowSnackbar();
			this.showSubmitSuccessBtn = true;
			let obj = {
				text: 'Submit',
				value: 'submit',
				color: 'blue',
			};
			this.taskActionBtns.splice(this.taskActionBtns.indexOf(obj), 1);
			let elId = this.taskInfo.action.parameter.activityId;
			let docId = data.document_id;
			if (!docId) {
				docId = this.taskInfo.action.parameter.documentId;
			}
			this.varsForBackend = await getVarsFromSubmitedDoc(data, elId, docId);
			let taskData = {
				outcome: 'submit',
				variables: this.varsForBackend.vars,
			};
			this.updateTask(taskData);
			// let res =  await this.submitTask(taskData);
			this.reloadDetailTask();
			// if (this.reload) {
			// 	this.$emit('task-submited', res);
			// }
			this.updateProcessInstanceName();
			this.loadingAction = false;
		},
		showApprovalOutcomes(approvalActions) {
			if (typeof approvalActions == 'string') {
				approvalActions = JSON.parse(approvalActions);
			}
			approvalActions = approvalActions.filter((el) => {
				return Boolean(el.value);
			});

			this.taskActionBtns = approvalActions;
		},

		// lấy data mới dựa theo data của task
		async changeTaskDetail() {
			let self = this;
			self.loadingAction = false;
			if (!self.taskInfo.action) {
				return;
			}
			let varsMap = {};
			self.taskAction = self.taskInfo.action.action;
			if (self.taskAction == 'approval') {
				self.showApprovalOutcomes(JSON.parse(self.taskInfo.approvalActions));
			} else if (self.showSubmitBtn == true && self.taskAction == 'submit') {
				self.taskActionBtns = [
					{
						text: 'Submit',
						value: 'submit',
						color: 'blue',
					},
				];
			} else if (self.taskAction == 'submitAdhocTask') {
				self.taskActionBtns = [
					{
						text: 'Submit',
						value: 'submit',
						color: 'blue',
					},
				];
			}
			// else if(self.taskAction == 'undefined' ){
			//     self.taskActionBtns = [
			//         {
			//             text:"Complete",
			//             value:"complete",
			//             color:"green"
			//         }
			//     ]
			// }
			self.changeTaskDetailInfo(self.taskInfo.action.parameter.taskId);
		},
		async reloadDetailTask() {
			let self = this;
			let filter = {};
			filter.taskId = this.originData.id;
			let res = await BPMNEngine.postTaskHistory(filter);
			if (res.total > 0) {
				let task = res.data[0];
				let taskInfo = extractTaskInfoFromObject(task);
				task = addMoreInfoToTask(task);
				task.symperApplicationId = this.appId;
				let infotTask = {};
				infotTask.taskInfo = taskInfo;
				infotTask.originData = task;
				self.$emit('change-info-task', infotTask);
			}
		},
		/**
		 * Hàm kiểm tra khi load task:
		 *
		 * kiểm tra nếu task chưa hoàn thành sẽ call api sang document check xem có documentObject nào đc tạo
		 * từ taskId chưa.. nếu có (trường hợp chưa đưa task life circle vào sử dụng) thì sẽ cho update documentObjectId vào task
		 * và complete task
		 */
		async checkTaskSubmitedDocument() {
			let taskId = this.originData.id;
			let self = this;
			this.descriptionTask = this.originData.description;
			if (!this.originData.endTime) {
				let res = await taskApi.getDocumentObjectIdWithTaskId(taskId);
				if (res.data != false) {
					// doc đã đc submit
					self.isSubmited = true;
					self.documentObjectId = res.data.id;
					self.handleTaskSubmited({});
				}
			}
		},
	},
};
</script>

<style scoped>
.v-tab {
	padding: 0px !important;
	border-width: 20px !important;
	text-transform: none !important;
}
.task-header {
	position: relative;
}
.task-header #action-task {
	position: absolute;
	right: 10px;
}
</style>
<style>
.menu-action-task-life-cycle .v-btn {
	box-shadow: unset !important;
}
</style>
