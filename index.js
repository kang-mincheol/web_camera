function initEvent() {
    
}


function cameraConfirm() {
    if(confirm('카메라 권한을 허용해주세요.')) {
        cameraStart();
    }
}




function cameraStart() {
    getDevices().then(getCamera);
}

function getDevices() {
    return navigator.mediaDevices.enumerateDevices();
}

function getCamera(deviceInfos) {

    var cameraValue = "";
    var agent = navigator.userAgent.toLowerCase();
    for (var info of deviceInfos) {
        if (info.kind == "videoinput") {
            cameraValue = info.deviceId;
        }
    }

    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    var constraints = {
        video: { facingMode: 'environment', deviceId: cameraValue }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(stream) {
            window.stream = stream;
            var cameraRenderWrap = document.querySelector('#camera_render');
            cameraRenderWrap.srcObject = stream;
            setTimeout(function() {
                var fixed_width = 314;
                var fixed_height = 200;
                var video = document.getElementById("camera_render");
                var videoWidth = video.videoWidth;
                var videoHeight = video.videoHeight;
                var ratio = fixed_width / videoWidth;
                var margin = 0;
                if (videoHeight * ratio > fixed_height) {
                    margin = parseInt((videoHeight - (fixed_height / ratio)));
                }
                $("#captureCanvas").attr({
                    width: videoWidth,
                    height: videoHeight - margin
                });
            }, 1000);

            if (!stream.active) {
                //카메라 권한 없는 경우
            }
        }).catch(function() {
            //카메라 권한 없는 경우
        });
}






function cameraStop() {
    var videoElem = document.getElementById('camera_render');
    var stream = videoElem.srcObject;
    var tracks = stream.getTracks();
    tracks.forEach(function(track) {
        track.stop();
    });
}





// 신분증 촬영
function cameraCapture() {
    var fixed_width = 314;
    var fixed_height = 200;
    var video = document.getElementById("camera_render");
    var canvas = document.getElementById("captureCanvas");
    var context = canvas.getContext("2d");
    var y_pos = 0;
    var videoWidth = video.videoWidth; //314  -> 640
    var videoHeight = video.videoHeight; //620  -> 204
    var ratio = fixed_width / videoWidth;
    if (videoHeight * ratio > fixed_height) {
        y_pos = parseInt((videoHeight - (fixed_height / ratio)) / 2);
    }
    console.log(videoWidth, videoHeight);
    console.log(y_pos);
    context.drawImage(video, 0, y_pos, fixed_width / ratio, fixed_height / ratio, 0, 0, videoWidth, videoHeight - (y_pos * 2));

    idFileUpload();
}

// 신분증 촬영 사진 업로드
function idFileUpload() {
    const imgCanvas = document.getElementById("captureCanvas");
    const imgBase64 = imgCanvas.toDataURL("image/jpeg", "image/octet-stream"); //base64로 변환
    const decodeImg = atob(imgBase64.split(',')[1]);

    let array = [];
    for (let i = 0; i < decodeImg.length; i++) {
        array.push(decodeImg.charCodeAt(i));
    }

    var file = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    var fileName = 'canvas_img_' + new Date().getMilliseconds() + '.jpg';

    var fileData = new FormData();
    fileData.append("cameraFile", file, fileName);

    console.log(fileData);
}