var keystone = require('keystone');
var Types = keystone.Field.Types;

var Upload = new keystone.List('Upload');

var myStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: { path: keystone.expandPath('./public/uploads/') }
});

Upload.add({
  name: { type: Types.Key, index: true},
  file: { type: Types.File, storage: myStorage },
  alt: { type: Types.Text },
  tags: { type: Types.TextArray },
  uri: {
    type: Types.Url,
    noedit: true,
    watch: 'file',
    value: function () {
      console.log(JSON.stringify(this.file))
      return keystone.expandPath('file:///public/uploads/' + this.file.filename)
    }
  }
});

Upload.track = {
  createdAt: true,
  updatedAt: true,
}

Upload.defaultColumns = 'name'

Upload.register()