<template>
    <div>
        <div id="reportEditor">
            <!-- {{ content }} -->
        </div>
    </div>
</template>

<script>
import tinymce from 'tinymce/tinymce';

import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/print';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/autoresize';

export default {
    components: {},
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },
    data(){
        return{
            editor : null,
        }
    },
    watch:{

    },
    methods:{
        getData(){
            this.editor.setContent(this.cellConfigs.viewConfigs.displayOptions.content);
        },
        changeData(content){
            this.cellConfigs.viewConfigs.displayOptions.content = content;
        }
    },
    mounted() {
      	let self = this
        tinymce.init({
            selector:  '#reportEditor',
            theme: 'silver',
            skin: 'oxide',
            inline:true,
            menubar: false,
            plugins: [
                    'autolink',
                    'link',
                    'lists',
                    'media',
                    'image',
                    'table',
                    'fullscreen',
                    'emoticons',
                    'paste',
                    'codesample',
                    'quickbars',
                    'quickimage'
                    ],
                    block_formats: 'Paragraph=p;Header 1=h1;Header 2=h2;Header 3=h3;Header 4=h4;Header 5=h5;Header 6=h6',
                    fontsize_formats: '7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 16pt 18pt 24pt 36pt 48pt',
                    paste_data_images: true,
                    quickbars_insert_toolbar: false,
                    toolbar:
                            'undo redo | fontselect fontsizeselect formatselect | bold italic forecolor backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist indent hr | table',                    
                    font_formats:
                        'Lato Black=lato; Roboto=roboto;Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
                    content_style:
                        '@import url(`https://fonts.googleapis.com/css2?family=Lato:wght@900&family=Roboto&display=swap`)',
                    init_instance_callback: function(editor) {
                        self.editor = editor;
                        self.getData();
                    },
                    onchange_callback :function(data) {
                        self.changeData(data);
                    },
                    setup: function(editor) {
                        editor.on('keyup', function(e) {
                            if(self.delayTimer){
                                clearTimeout(self.delayTimer);
                            }
                            self.delayTimer = setTimeout(() => {
                                self.changeData(editor.getContent());
                            },200)
                        }
                    )}
        });

    }
}
</script>

<style>

</style>