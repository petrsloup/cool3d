/**
 *
 * @author slouppetr@gmail.com (Petr Sloup)
 *
 */

goog.provide('cool3d.Main');

goog.require('cool3d.Camera');
goog.require('cool3d.Scene');

goog.require('goog.dom');



/**
 * @param {!Element} element Element to render the application in.
 * @constructor
 */
cool3d.Main = function(element) {
  this.camera_ = new cool3d.Camera(
      goog.bind(this.start_, this),
      function(e) {
        alert('This app won\'t work without webcamera access!');
      });

  this.backCanvas_ = goog.dom.createElement('canvas');
  this.backContext_ = this.backCanvas_.getContext('2d');

  this.canvas3d_ = goog.dom.createDom('canvas', {'width': 640, 'height': 400});
  this.context3d_ = this.canvas3d_.getContext('webgl') ||
                    this.canvas3d_.getContext('experimental-webgl');

  this.canvas2d_ = goog.dom.createDom('canvas',
      {'style': 'position:fixed;top:0;right:0;z-index:100;'});
  this.context2d_ = this.canvas2d_.getContext('2d');

  goog.dom.append(element, this.canvas2d_);
  goog.dom.append(element, this.canvas3d_);

  this.requestAnimationFrame_ = goog.bind(
      window['requestAnimationFrame'] ||
      window['mozRequestAnimationFrame'] ||
      window['webkitRequestAnimationFrame'] ||
      window['msRequestAnimationFrame'] ||
      function(callback, el) {
        return setTimeout(callback, 1000 / 60);
      }, window);

  this.lastComp_ = null;

  this.scene_ = new cool3d.Scene(this.context3d_);
};


/**
 * Initiates the app after getting access to the webcam.
 * @private
 */
cool3d.Main.prototype.start_ = function() {
  var video = this.camera_.getVideo();
  this.backCanvas_.width = video.videoWidth / 4;
  this.backCanvas_.height = video.videoHeight / 4;

  this.canvas2d_.width = video.videoWidth / 4;
  this.canvas2d_.height = video.videoHeight / 4;

  this.requestAnimationFrame_(goog.bind(this.render_, this));
};


/**
 * Renders the application.
 * @private
 */
cool3d.Main.prototype.render_ = function() {
  this.requestAnimationFrame_(goog.bind(this.render_, this));

  var video = this.camera_.getVideo();

  this.context2d_.drawImage(video, 0, 0,
                            this.canvas2d_.width, this.canvas2d_.height);

  this.backContext_.drawImage(video, 0, 0,
                              this.backCanvas_.width, this.backCanvas_.height);

  //TODO: what does the parameterses mean?
  var comp = window['ccv']['detect_objects']({
    'canvas': this.backCanvas_,
    'cascade': window['cascade'],
    'interval': 1,
    'min_neighbors': 0
  });

  this.lastComp_ = (comp && comp.length) ? comp : this.lastComp_;

  this.context2d_.strokeStyle = 'yellow';

  if (this.lastComp_ && this.lastComp_.length) {
    //TODO: more faces
    var c = this.lastComp_[0];
    //window['console']['log'](goog.debug.deepExpose(c));
    var x = c['x'], y = c['y'], w = c['width'], h = c['height'];
    this.scene_.setEyePos((x + w / 2) / this.backCanvas_.width - 0.5,
                          (y + h / 2) / this.backCanvas_.height - 0.5);
    this.context2d_.strokeRect(x, y, w, h);
  }
  this.scene_.draw();
};

goog.exportSymbol('cool3d.Main', cool3d.Main);
