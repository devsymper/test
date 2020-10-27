<template>
    <div class="kh-sidebar-right" style="height:calc(100% - 74px)" :class="{'d-none' : skh.statusRightBar==-1}">
        <div class="kh-sbr-all w-100 h-100" v-if="skh.statusRightBar==1">
            <div class="row w-100 sb-top" style="height:33px;">
                <div class="symper-title col h-100 pt-1 pl-2">Tệp đính kèm</div>
                <div class="r-right col h-100">
                <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
                <UploadFile
                        @uploaded-file="uploaded"
                        :objectIdentifier="hash"
                        :objectType="`knowledge`"
                        :iconName="`mdi-plus`"
                        class="upload-file h-100"
                        style="float:right"
                    />
                <!-- <v-icon class="fs-16">mdi-plus</v-icon> -->
                </div>
            </div>
            <div class="row w-100 sb-top">
                <div class="symper-title col pt-1 pl-2">Tên file</div>
                <div class="r-right col-md-5" style="padding-top:4px;">
                <div class="symper-title">Ngày đăng</div>
                </div>
            </div>
            <div class="list-item w-100" style="height: calc(100% - 63px);">
                <v-container
                class="scroll-bar-right h-100"
                max-height="498"
                style="overflow: auto;"
                >
                <v-list dense>
                    <v-list-item-group class>
                    <v-list-item
                        v-for="(item, i) in listFileAttachment"
                        :key="i"
                        @contextmenu="show($event,item.serverPath,item.name,item.type,item.id)"
                    >
                        <v-icon
                        class="fs-14"
                        v-if="item.type=='jpg' || item.type=='png' ||item.type=='jpeg'"
                        >mdi-image</v-icon>
                        <v-icon class="fs-14" v-else>mdi-file-document-outline</v-icon>
                        <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <!-- <p  :id="`file-`+item.id"
                            v-on="on"
                            v-text="item.name+'.'+item.type"></p> -->
                            <v-list-item-title
                            :id="`file-`+item.id"
                            v-on="on"
                            class="fs-13"
                            v-text="item.name"
                            ></v-list-item-title>
                        </template>
                        <span>{{ item.name}}</span>
                        </v-tooltip>
                        <v-list-item-title class="fs-13 sb-date-file" v-text="item.createAt"></v-list-item-title>
                    </v-list-item>
                    </v-list-item-group>
                </v-list>
                </v-container>
            </div>
        </div>
        <!-- toc -->
        <div class="kh-table-content kh-sbr-all w-100 h-100" v-if="skh.statusRightBar==2">
        <div class="row w-100 sb-top" style="height:33px;">
            <div class="symper-title col pt-1 pl-2">Mục lục</div>
            <div class="r-right h-100 col">
            <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
            </div>
        </div>
        <div class="kh-toc w-100">
            <ul id="toc"></ul>
        </div>
        </div>
        <!-- comment -->
        <div class="kh-comment kh-sbr-all w-100 h-100 " v-if="skh.statusRightBar==3">
            <v-icon class="btn-close" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
            <Comment class="compComment w-100" :showComment="true" :height="'100%'" :objectIdentifier="hash" :objectType="`knowledge`"/>
        </div>
        <!-- history -->
        <div class="kh-history kh-sbr-all w-100 h-100" v-if="skh.statusRightBar==4">
        <div class="row w-100 sb-top" style="height:33px;">
            <div class="symper-title col pt-1 pl-2">Lịch sử</div>
            <div class="r-right col">
            <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
            </div>
        </div>
        <div class="row w-100 sb-top">
            <table>
            <tr>
                <td
                class="symper-title pl-1"
                @click="showHistory(0)"
                :class="{'td-active' :history_active==0}"
                >Tất cả</td>
                <td
                class="symper-title"
                @click="showHistory(1)"
                :class="{'td-active' :history_active==1}"
                >Văn bản hiện tại</td>
            </tr>
            </table>
        </div>
        <div class="w-100" v-if="history_active==0" style="height: calc(100% - 63px);">
            <v-container
            class="scroll-bar-right h-100"
            style="overflow: auto;"
            >
            <v-list dense class="list-log">
                <v-list-item-group>
                <v-list-item v-for="(item, i) in listLogAll" :key="i">
                    <symperAvatar :size="20" :userId="item.userId" /> <p class="fs-13">
                    <b>{{item.userName}}</b>
                    Đã {{convertAction(item.action)}}
                    <span
                        v-if="item.docId!=undefined"
                    >{{$t("kh.document")}}</span>
                    <span v-if="item.docId==undefined">{{$t("kh.folder")}}</span>
                    <b>{{item.name}}</b>
                    <br />
                    {{item.createdAt}}
                    </p>
                    <!-- <p class="fs-13">{{item.createdAt}}</p> -->
                </v-list-item>
                </v-list-item-group>
            </v-list>
            </v-container>
            <!-- </v-sheet> -->
        </div>
        <div class="w-100" v-if="history_active==1" style="height: calc(100% - 63px);">
            <!-- <v-sheet id="scrolling-techniques" class="overflow-y-auto" max-height="498"> -->
            <v-container
            class="scroll-bar-right h-100"
            style="overflow: auto;"
            >
            <v-list dense class="list-log">
                <v-list-item-group>
                <v-list-item v-for="(item, i) in listLogDoc" :key="i">
                    <symperAvatar :size="20" :userId="item.userId" />
                    <p class="fs-13">
                    <b>{{item.userName}}</b>
                    Đã {{convertAction(item.action)}}
                    <span>{{$t("kh.document")}}</span>
                    <b>{{item.name}}</b>
                    <br />
                    <span v-text="convertDate(item.createdAt)"></span>
                    </p>
                </v-list-item>
                </v-list-item-group>
            </v-list>
            </v-container>
            <!-- </v-sheet> -->
        </div>
        </div>
        <!-- backup -->
        <div class="kh-history kh-sbr-all w-100 h-100" v-if="skh.statusRightBar==5">
        <div class="row w-100  sb-top" style="height:33px;">
            <div class="symper-title col pt-1 pl-2">Backup</div>
            <div class="r-right col">
            <v-icon class="fs-16" @click="invertStatusRightBar(-1)">mdi-close</v-icon>
            </div>
        </div>
        <div class="row w-100 sb-top">
            <div class="symper-title col pt-1 pl-2">Phiên bản</div>
            <div class="r-right col-md-6" style="padding-top:4px;">
            <div class="symper-title">Ngày tạo</div>
            </div>
        </div>
        <div class="w-100" style="height: calc(100% - 63px);">
            <v-list class="h-100 " dense :flat="true">
            <v-list-item-group class="pl-2">
                <v-list-item
                    style="padding-left: 0px!important;"
                    v-for="(item, i) in listBackupDocument"
                    :key="i"
                    @contextmenu="showMenuBackup($event,item.id,item.docName,item.docContent)"
                >
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                    <v-list-item-title v-on="on" class="fs-13 text-ellipsis" v-text="item.backupName"></v-list-item-title>
                    </template>
                    <span>{{ item.backupName }}</span>
                </v-tooltip>
                <v-list-item-title class="fs-13 his-date" v-text="convertDate(item.createdAt)"></v-list-item-title>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                    <v-icon
                        v-on="on"
                        class="fs-14"
                        @click="backupDocument(item.id,item.docContent)"
                    >mdi-backup-restore</v-icon>
                    </template>
                    <span>{{ $t("kh.sidebar.restore") }}</span>
                </v-tooltip>
                </v-list-item>
            </v-list-item-group>
            </v-list>
        </div>
        </div>
        <!-- Dialog Remove Node -->
        <v-dialog v-model="dialogAlert" max-width="450">
        <v-card>
            <v-card-title class="headline">{{header}}</v-card-title>
            <v-card-text>{{title}}</v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="handleClick">{{$t("kh.dialog.yes")}}</v-btn>
            <v-btn color="red darken-1" text @click="dialogAlert = false">{{$t("kh.dialog.cancel")}}</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>

        <v-menu v-model="context_menu_backup" :position-x="x" :position-y="y" absolute offset-y>
        <v-list class="context-menu">
            <v-list-item
            v-for="(item, index) in contextMenuBackup"
            :key="index"
            @click="item.menuAction(item.title)"
            dense
            >
            <v-icon class="fs-15">{{item.icon}}</v-icon>
            <v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        </v-menu>

        <v-menu v-model="context_menu" :position-x="x" :position-y="y" absolute offset-y>
        <v-list class="context-menu">
            <v-list-item
            v-for="(item, index) in contextMenu"
            :key="index"
            @click="item.menuAction(item.title)"
            dense
            >
            <v-icon class="fs-15">{{item.icon}}</v-icon>
            <v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
        </v-menu>

        <KHShowImage
        @downloadOrBackupFile="downloadOrBackupFile"
        v-bind:id="id"
        v-bind:fileId="fileId"
        v-bind:name="name"
        v-bind:serverPath="serverPath"
        v-bind:type="type"
        v-bind:docContent="docContent"
        />
    </div>
</template>

<script>
import { knowledgeApi } from "./../../api/kh.js";
//import UploadFile from "./../../components/kh/uploadfile";
import UploadFile from "@/components/common/UploadFile.vue";
import KHShowImage from "./../../components/kh/KHShowImage";
import Comment from '@/components/common/comment/Comment.vue';
import { SYMPER_APP } from "./../../main.js";
import symperAvatar from "@/components/common/SymperAvatar.vue";
export default {
    components: {
        UploadFile,
        KHShowImage,
        Comment,
        symperAvatar
    },
    data() {
        return {
            fileId: "",
            serverPath: "",
            name: "",
            type: "",
            docContent: "",
            header: "",
            title: "",
            x: 0,
            y: 0,
            context_menu: false,
            dialogAlert: false,
            context_menu_backup: false,
            history_active: 1,
            id: "",
            docVersionID: 0,
            hash: "",
            items_attach: [
                {
                    text: "tailieu",
                    icon: "mdi-file-document-outline",
                    created_at: "08/07/2020"
                },
                {
                    text: "thietke",
                    icon: "mdi-file-document-outline",
                    created_at: "09/07/2020"
                },
                { text: "image-logo", icon: "mdi-file-image", created_at: "09/07/2020" }
            ],
            contextMenu: [
                {
                    title: this.$t("kh.contextmenu.open"),
                    menuAction: action => {
                        this.$store.commit("kh/changeStatusShowImage", true);
                    },
                    icon: "mdi-book-open-variant"
                },
                {
                    title: this.$t("kh.contextmenu.download"),
                    menuAction: action => {
                        let fileId = this.fileId;
                        this.downLoadFile(fileId);
                    },
                    icon: "mdi-download"
                },
                {
                    title: this.$t("kh.contextmenu.rename"),
                    menuAction: action => {
                        let id = this.fileId;
                        let name=this.name;
                        var renameInput = $("<input id="+"file-" + id + " value=" + name + " >");
                        $("#file-" + id).replaceWith(renameInput);
                        $("#file-" + id).val(name);
                        renameInput.on("blur", function(evt) {
                            $(this).replaceWith(
                                "<div id="+"file-" +
                                id +
                                " class='v-list-item__title fs-13'>"+
                                name +
                                " </div>"
                            );
                        });
                        setTimeout(function() {
                        $("#file-" + id)
                            .focus()
                            .val(name)
                            .select();
                        }, 200);
                        $("#file-" + id).keyup(function(e) {
                        if (e.keyCode === 13) {
                            var text = $("#file-" + id)
                            .val()
                            .trim();

                            if (text != "" && text != name) {
                            let data = {};
                            data.id = id;
                            data.newName = text;
                            knowledgeApi
                                .renameFile(data)
                                .then(res => {
                                if (res.status == 200) {
                                    $(this).replaceWith(
                                        "<div id="+"file-" +
                                        id +
                                        " class='v-list-item__title fs-13'>" +
                                        text +
                                        " </div>"
                                    );
                                } else if (res.status == 403) {
                                    SYMPER_APP.$snotifyError("Error", res.message);
                                }
                                })
                                .catch(err => {
                                console.log("error from rename file !!!", err);
                                })
                                .always(() => {});
                            } else {
                            $(this).replaceWith(
                                "<div id="+"file-" +
                                id +
                                " class='v-list-item__title fs-13'>" +
                                name +
                                " </div>"
                            );
                            }
                        }
                        });
                    },
                    icon: "mdi-pencil"
                },
                {
                    title: this.$t("kh.contextmenu.delete"),
                    menuAction: action => {
                        this.header = this.$t("common.remove_confirm_title");
                        this.title = this.$t("kh.dialog.remove");
                        this.dialogAlert = true;
                    },
                    icon: "mdi-delete-forever"
                }
            ],
            contextMenuBackup: [
                {
                    title: this.$t("kh.contextmenu.viewcontent"),
                    menuAction: action => {
                        this.$store.commit("kh/changeStatusShowImage", true);
                    },
                    icon: "mdi-view-carousel"
                },
                {
                    title: this.$t("kh.sidebar.restore"),
                    menuAction: action => {
                        let id = this.id;
                        this.backupDocument(id);
                    },
                    icon: "mdi-backup-restore"
                }
            ]
        };
    },
    methods: {
        convertAction(action) {
            if (action == 1) {
                return this.$t("kh.sidebar.add");
            } else if (action == 2) {
                return this.$t("kh.sidebar.edit");
            } else if (action == 3) {
                return this.$t("kh.sidebar.delete");
            } else if (action == 4) {
                return this.$t("kh.sidebar.add_favorite");
            } else if (action == 5) {
                return this.$t("kh.sidebar.delete_favorite");
            } else if (action == 6) {
                return this.$t("kh.sidebar.attach");
            } else if (action == 7) {
                return this.$t("kh.sidebar.restore");
            } else if (action == 8) {
                return this.$t("kh.sidebar.rename");
            }
        },
        downLoadFile(id) {
            knowledgeApi
                .downloadFile(id)
                .then(res => {})
                .catch(err => {
                console.log("error download file!!!", err);
                })
                .always(() => {});
        },
        /**
         * bắt sự kiện upload file
         */
        uploaded(dataObj) {
            this.$store.commit("kh/addToListAttachStore", dataObj);
		},
  
        downloadOrBackupFile(data) {
            if (data.type == "document_backup") {
                this.backupDocument(data.id);
            } else {
                this.downLoadFile(data.fileId);
            }
        },
        /**
         * Ẩn hiện side bar right
         */
        invertStatusRightBar(status) {
            this.$store.commit(
                "kh/changeStatusRightBar",
                (this.skh.statusRightBar = status)
            );
        },
        showHistory(is_active) {
            if (is_active == 0) {
                this.$store.dispatch("kh/getLogAll");
            }
            this.history_active = is_active;
        },
        backupDocument(id) {
            this.docVersionID = id;
            this.header = this.$t("kh.dialog.restore");
            this.title = this.$t("kh.dialog.titleRestore");
            this.dialogAlert = true;
        },
        /**
         * restore lại bản backup
         */
        restoreDocument() {
            if (this.docVersionID != 0) {
                setTimeout(() => {
                this.$store.commit("kh/changeStatusBackup", true);
                }, 100);
                let id = this.docVersionID;
                knowledgeApi
                .restoreDocumentBackup(id)
                .then(res => {
                    if (res.status == 200) {
                    this.$store.commit("kh/changeStatusRestore", true);
                    }
                })
                .catch(err => {
                    console.log("error from restore backup document!!!", err);
                })
                .always(() => {});
            }
            this.dialogAlert = false;
        },
        listToConvertLog(log, users) {
            for (let i = 0; i < log.length; i++) {
                var uid = log[i]["userId"];
                let obj = users.find(data => data.id === uid);
                if (obj) {
                var index = users.indexOf(obj);
                log[i]["userName"] = users[index].displayName;
                }
            }
            return log;
        },
        detectHeading() {
            $("#toc").empty();
            $("#toc").toc({
                content: "#myeditablediv",
                headings: "h1,h2,h3,h4,h5,h6"
            });
        },
        getData(hash = false) {
            if (hash == false) {
                hash = this.$route.params.hash;
            }
            this.hash=hash;
            this.$store.dispatch("app/getAllUsers");
            this.$store.dispatch("kh/getLogDocument", hash);
            this.$store.dispatch("kh/getBackupDocument", hash);
            this.$store.dispatch("kh/getBackupDocument", hash);
            this.$store.dispatch("kh/getArrFileAttachment", hash);
            this.detectHeading();
        },
        convertDate(date) {
            var d = new Date(date),
                month = "" + (d.getMonth() + 1),
                day = "" + d.getDate(),
                year = d.getFullYear(),
                h = "" + d.getHours(),
                i = "" + d.getMinutes(),
                s = "" + d.getSeconds();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;
            if (h.length < 2) h = "0" + h;
            if (i.length < 2) i = "0" + i;
            if (s.length < 2) s = "0" + s;
            return [year, month, day].join("-") + " " + [h, i].join(":");
        },
        /**
         * Hiển thị dialog
         */
        show(e, serverPath, name, type, id) {
            e.preventDefault();
            this.context_menu = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.serverPath = serverPath;
            this.name = name;
            this.type = type;
            this.fileId = id;
            this.$nextTick(() => {
                this.context_menu = true;
            });
        },
        showMenuBackup(e, id, docName, docContent) {
            e.preventDefault();
            this.context_menu_backup = false;
            this.x = e.clientX;
            this.y = e.clientY;
            this.id = id;
            this.name = docName;
            this.type = "document_backup";
            this.docContent = docContent;
            this.$nextTick(() => {
                this.context_menu_backup = true;
            });
        },
        handleClick() {
            if (this.skh.statusRightBar == 1) {
                this.removeFileAttach();
            } else if (this.skh.statusRightBar == 5) {
                this.restoreDocument();
            }
        },
        removeFileAttach() {
            let data={};
            data.id=this.fileId;
            knowledgeApi
                .removeFileAttach(data)
                .then(res => {
                if (res.status == 200) {
                    this.$store.dispatch("kh/removeFileAttachToStore", this.fileId);
                } else if (res.status == 403) {
                    SYMPER_APP.$snotifyError("Error", res.message);
                } else {
                    SYMPER_APP.$snotifyError(
                    "Error",
                    "Error from delete attachment file!!!"
                    );
                }
                })
                .catch(err => {
                console.log("error from delete attachment file!!!", err);
                })
                .always(() => {});
            this.dialogAlert = false;
        }
    },
    watch: {
        "skh.statusRightBar": function(newVl) {
            if (newVl == 1) {
                let hash = this.skh.currentDocument;
                if (hash == false) {
                    hash = this.$route.params.hash;
                }
                let data ={}; 
                data.objectIdentifier = String(hash);
                data.objectType = "knowledge";
                this.$store.dispatch("kh/getArrFileAttachment", data);
            } else if (newVl == 2) {
                setTimeout(() => {
                this.detectHeading();
                }, 200);
            } else if (newVl == 4) {
                setTimeout(() => {
                let hash = this.skh.currentDocument;
                if (hash == false) {
                    hash = this.$route.params.hash;
                }
                this.$store.dispatch("kh/getLogDocument", hash);
                //this.$store.dispatch("kh/getLogAll");
                }, 200);
            } else if (newVl == 5) {
                setTimeout(() => {
                let hash = this.skh.currentDocument;
                if (hash == false) {
                    hash = this.$route.params.hash;
                }
                this.$store.dispatch("kh/getBackupDocument", hash);
                }, 200);
            }
        },
        "skh.currentDocument": function(newVl) {
            this.getData(newVl);
        },
       
    },
    computed: {
        sapp() {
            return this.$store.state.app;
        },
        skh() {
            return this.$store.state.kh;
        },
        listLogDoc() {
            let root = this.skh.listLogDocument;
            root = this.listToConvertLog(
                this.skh.listLogDocument,
                this.sapp.allUsers
            );
            return root;
        },
        listLogAll() {
            let root = this.skh.listLogAll;
            root = this.listToConvertLog(this.skh.listLogAll, this.sapp.allUsers);
            return root;
        },
        listBackupDocument() {
            let root = this.skh.listBackupDocument;
            return root;
        },
        listFileAttachment() {
            let root = this.skh.arrFileAttach;
            console.log(root);
            return root;
        }
    },
    created() {
        this.getData();
    },
    mounted() {
        $(".kh-toc").on("click", "a", function(event) {
        // var p = $(this);
        // var pos = p.offset();
        // //console.log(p[0].offsetLeft);
        // console.log(pos);
        //alert($(this).attr("href"));
        //  var oldHref=$(this).attr("href");
        //  var url=window.location.href;
        //  var newUrl=url+oldHref;
        //  alert(newUrl);
        //$(this).attr("href",newUrl);
        });
    }
};
</script>

<style scoped>
.compComment >>>.v-tabs{
    margin:0px;
    padding-left:8px;
}

.compComment >>>.v-toolbar__content{
    height:33px!important;
}
.compComment >>>.input-comment{
    position: unset;
    bottom: unset;
    margin: 0px;
    width: 100%;
    padding-left: 16px;
    padding-right: 16px;
}
.compComment >>>.v-window{
    height: calc(100% - 120px);
}
.compComment >>>.v-toolbar__extension button{
    padding-right: 10px;
}

.kh-sidebar-right {
  width: 370px;
  position: absolute;
  right: 0px;
  top: 74px;
  border-left: 1px solid #bebebe;
  background-color: white;
}
.scroll-bar-right {
  padding-left: 8px;
  padding-top: 0px;
}
.upload-file >>>.v-btn--icon{
  height: 100%;
}
.upload-file >>> i{
  font-size: 19px!important;
}
.row {
  margin:0px!important;
}
.btn-close {
    position: absolute;
    right: 10px;
    top: 7px;
    z-index: 1;
    font-size: 16px;
}
</style>