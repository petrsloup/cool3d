/**
 *
 * @author slouppetr@gmail.com (Petr Sloup)
 *
 */

goog.provide('cool3d.Camera');

goog.require('goog.dom');
goog.require('goog.events');



/**
 * @param {!function()} onready .
 * @param {Function=} opt_ondeny .
 * @constructor
 */
cool3d.Camera = function(onready, opt_ondeny) {
  this.video_ =
      /** @type {!HTMLVideoElement} */(goog.dom.createElement('video'));

  this.onready_ = onready;

  var getUserMedia_ =
      navigator['getUserMedia'] || navigator['webkitGetUserMedia'] ||
      navigator['mozGetUserMedia'] || navigator['msGetUserMedia'];

  if (!goog.isDefAndNotNull(getUserMedia_))
    alert('Your browser does not allow webcamera access!');

  getUserMedia_ = goog.bind(getUserMedia_, navigator);

  try {
    getUserMedia_({
      'video': true,
      'audio': false
    }, goog.bind(this.start_, this), opt_ondeny);
  } catch (e) {
    getUserMedia_('video', goog.bind(this.start_, this), opt_ondeny);
  }
};


/**
 * @return {!HTMLVideoElement} .
 */
cool3d.Camera.prototype.getVideo = function() {
  return this.video_;
};


/**
 * @param {!Object} stream LocalMediaStream.
 * @private
 */
cool3d.Camera.prototype.start_ = function(stream) {
  var key = goog.events.listen(this.video_, 'canplay', function() {
    goog.events.unlistenByKey(key);
    setTimeout(goog.bind(function() {
      this.video_.play();
      this.onready_();
    }, this), 500);
  }, true, this);

  var domURL = window.URL || window.webkitURL;
  this.video_.src = domURL ?
      domURL.createObjectURL(/** @type {!Blob} */(stream)) : stream;
};
