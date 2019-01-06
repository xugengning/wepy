var barcode = require('./barcode');
var qrcode = require('./qrcode');

function convert_length(length) {
	return Math.round(wx.getSystemInfoSync().windowWidth * length / 750);
}

function barc(ctx, code, width, height) {
  barcode.code128(ctx, code, convert_length(width), convert_length(height))
}

function qrc(ctx, code, width, height) {
	qrcode.api.draw(code, {
		ctx,
		width: convert_length(width),
		height: convert_length(height)
	})
}

module.exports = {
	barcode: barc,
	qrcode: qrc
}