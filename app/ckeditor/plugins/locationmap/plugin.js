CKEDITOR.plugins.add('locationmap', {
    requires: 'widget',
    icons: 'locationmap',
    init: function(editor) {
        editor.widgets.add('LocationMap', {
            button: 'Insert Map',
            template: '<div class="locationmap"><iframe height="" src="" width="" style="border: none; max-width:100%;"></iframe></div>',
            dialog: 'locationmapDialog',
            allowedContent: 'iframe(!locationmap){width}{src}{height}',
            upcast: function(element) {
                return element.name == 'div' && element.hasClass('locationmap')
            },
            init: function() {
                el = this.element.$.firstChild;
                this.setData('width', el.getAttribute('width'));
                this.setData('height', el.getAttribute('height'));
                this.setData('src', el.getAttribute('src'))
            },
            data: function() {
                el = this.element.$.firstChild;
                el.setAttribute('width', this.data.width);
                el.setAttribute('height', this.data.height);
                el.setAttribute('src', this.data.src)
            }
        });
        CKEDITOR.dialog.add('locationmapDialog', this.path + 'dialogs/locationmap.js')
    }
});