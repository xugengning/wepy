// file : bwip-js/browser-bitmap.js
//
// bwip-js bitmap interface for an HTML canvas.
//
// Copyright (c) 2011-2018 Mark Warren
//
// Licensed MIT.  See the LICENSE file in the bwip-js root directory
// for the extended copyright notice.
"use strict";

module.exports = Bitmap;

// bgcolor is optional, defaults to #fff
function Bitmap(cvsid, rot, bgcolor) {
	var rgb  = [0, 0, 0];
	var padx = 0;	// padding-x
	var pady = 0;	// padding-y

	// Initialized in imageinfo()
	var imgwidth, imgheight, ctx, idata, bytes;

	this.pad = function(x, y) {
		if (rot == 'R' || rot == 'L') {
			padx = y;
			pady = x;
		} else {
			padx = x;
			pady = y;
		}
	}

	// Sets the final size for the drawing surface and maximum number of
	// colors.  If fonts are lazy-loaded and not available when the cross-compiled
	// code is executing, the number of colors can be wrong.
	this.imageinfo = function(width, height, ncolors) {
		if (rot == 'R' || rot == 'L') {
			imgwidth  = height;
			imgheight = width;
		} else {
			imgwidth  = width;
			imgheight = height;
		}

		ctx  = cvsid
		ctx.width  = imgwidth + 2*padx;
		ctx.height = imgheight + 2*pady;

		// Convert from cmyk?
		if (bgcolor && bgcolor.length == 8) {
			var c = parseInt(bgcolor.substr(0,2), 16) / 255;
			var m = parseInt(bgcolor.substr(2,2), 16) / 255;
			var y = parseInt(bgcolor.substr(4,2), 16) / 255;
			var k = parseInt(bgcolor.substr(6,2), 16) / 255;
			var r = Math.floor((1-c) * (1-k) * 255);
			var g = Math.floor((1-m) * (1-k) * 255);
			var b = Math.floor((1-y) * (1-k) * 255);
			bgcolor = 'rgb(' + r + ',' + g + ',' + b + ')';
		} else if (bgcolor) {
			bgcolor = '#' + bgcolor;
		}

		ctx.fillStyle = bgcolor || '#fff';
		ctx.fillRect(0, 0, ctx.width, ctx.height);
		ctx.fillStyle = '#000';

    console.log(ctx);

    wx.canvasGetImageData({
      canvasId: ctx.canvasId,
      x: padx,
      y: pady,
      width: imgwidth,
      height: imgheight,
      success(res) {
        idata = res
        bytes = idata.data;
        console.log(res.width) // 100
        console.log(res.height) // 100
        console.log(res.data instanceof Uint8ClampedArray) // true
        console.log(res.data.length) // 100 * 100 * 4

      },
      complete(res){
        console.log(res);
      }
    })

	}

	this.color = function(r, g, b) {
		rgb = [r, g, b];
	}

	// a is the alpha-level of the pixel [0 .. 255]
	this.set = function(x, y, a) {
		// PostScript builds bottom-up, we build top-down.
		if (rot == 'N') {
			y = imgheight - y - 1;
		} else if (rot == 'I') {
			x = imgwidth - x - 1;
		} else {
			y = imgwidth - y;
			if (rot == 'L') {
				var t = y;
				y = imgheight - x - 1;
				x = t - 1;
			} else {
				var t = x;
				x = imgwidth - y;
				y = t;
			}
		}

		// alpha-blend with the existing pixel
		// var idx = (y * imgwidth + x) * 4
		// a = a / 255;
		// bytes[idx+0] = (bytes[idx+0] * (1 - a) + rgb[0] * a)|0;
		// bytes[idx+1] = (bytes[idx+1] * (1 - a) + rgb[1] * a)|0;
		// bytes[idx+2] = (bytes[idx+2] * (1 - a) + rgb[2] * a)|0;
		// bytes[idx+3] = 255;
	}

	this.finalize = function(callback) {
		wx.canvasPutImageData({
      canvasId: ctx.canvasId,
      x: padx,
      y: pady,
      data: idata,
      width: 1,
      success(res) {},
      complete(res){
        console.log(res);
      }
    })
		callback(null, cvsid);
	}
}
