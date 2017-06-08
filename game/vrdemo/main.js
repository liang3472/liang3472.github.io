var camera;
var isLookAt = false;
var videoElement = document.querySelector('video');
var cat = document.querySelector('a-image');

// 全屏时重置视频尺寸
function onResize() {
  $('#videoBg').height('100%')
    .width('100%');
}
window.addEventListener('resize', function () {
  onResize();
});

// Put variables in global scope to make them available to the browser console.
var constraints = window.constraints = {
  audio: false,
  video: {
    facingMode: {
      exact: "environment"
    }
  }
};
function handleSuccess(stream) {
  var videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ' + videoTracks[0].label);
  stream.oninactive = function () {
    console.log('Stream inactive');
  };
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}
function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
      constraints.video.width.exact + ' px is not supported by your device.');
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg('getUserMedia error: ' + error.name, error);
}
function errorMsg(msg, error) {
  // alert(msg);
  console.log(msg);
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
} else {
  // 不支持调用摄像头的时候，使用默认场景，小树林。
  $('#sky').attr('src', "https://c1.staticflickr.com/8/7376/16218590470_468084c950_h.jpg")
    .removeAttr('opacity')
    .removeAttr('color');
}

AFRAME.registerComponent('see-cat', {
  init: function () {
    var el = this.el;
    el.addEventListener('mouseenter', function () {
      console.log('焦点锁定');
      isLookAt = true;
    });
    el.addEventListener('mouseleave', function () {
      console.log('焦点解除锁定');
      isLookAt = false;
    });
  }
});

var scope = new Vue({
  el: '#game',
  data: {
    isShow: false
  },
  methods: {
    catchCat: function () {
      console.log('是否抓到猫：' + isLookAt);
      if (isLookAt) {
        cat.setAttribute('src', '#egg-break');
        setTimeout(function () {
          scope.isShow = true;
        }, 1000);
      }
    },
    replay: function () {
      cat.setAttribute('src', '#egg-nomal');
      scope.isShow = false;
    }
  }
});