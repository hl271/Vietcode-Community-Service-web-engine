<template>
    <editor :value="value" v-on:input="$emit('input', $event.target.value)" api-key="ntimow4eomwnxgr8suffbnxbgrnktocgahqje14eo1cyyd3g" :init="editorSettings"></editor>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
export default {
    components: {
        'editor': Editor
    },
    data: () => ({
        editorSettings: {
            height: 500,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap print preview anchor textcolor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table contextmenu paste code help wordcount'
            ],
            toolbar: "undo redo |  formatselect | fontselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
            content_css: [
                '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i'
            ],
            font_formats: 'Arial=arial,helvetica,sans-serif;Courier New=courier new,courier,monospace;AkrutiKndPadmini=Akpdmi-n'
        },
        vModelContentData: this.vModelContent
    }),
    props: ['value']
}
</script>

