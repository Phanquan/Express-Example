var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true})
 
// resize and remove EXIF profile data 
gm('/home/superquan/Pictures/Fun/Avatar/avatar.jpg')
.resize(150, 150,'!')
.write('/home/superquan/Pictures/Fun/Avatar/newly-avatar.jpg', function (err) {
  if (!err) {console.log('done')}
  else {console.log(err)};
});