/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	config.skin = 'moono-lisa';
	config.language = 'vi';
	config.extraPlugins = 'locationmap';
	config.locationMapPath = '/gmap/';
	config.allowedContent = true;
	config.entities = false;
	
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'paragraph', groups: [ 'align', 'bidi', 'list', 'indent', 'blocks', 'links', 'paragraph' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'tools', groups: [ 'tools' ] }
	];

	config.removeButtons = 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Radio,Checkbox,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,PageBreak,Iframe,ShowBlocks,About,SpecialChar,Font,Superscript,Subscript,Blockquote,Strike,Styles,WenzGmap,GoogleDocs,LineHeight';
	config.removePlugins = 'base64image,html5audio,simage';

    config.filebrowserBrowseUrl = '/editor/ckfinder/ckfinder.html';
	config.filebrowserImageBrowseUrl = '/editor/ckfinder/ckfinder.html?type=Images';
    config.filebrowserVideoBrowseUrl = '/editor/ckfinder/ckfinder.html?type=Images';
	config.filebrowserFlashBrowseUrl = '/editor/ckfinder/ckfinder.html?type=Flash';
	config.filebrowserUploadUrl = '/editor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files';
	config.filebrowserImageUploadUrl = '/editor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images';
	config.filebrowserFlashUploadUrl = '/editor/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Flash';
};