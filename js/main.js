const video = document.getElementById('video');

Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('./../js/models/'),
    faceapi.nets.tinyFaceDetector.loadFromUri('./../js/models/'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./../js/models/'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./../js/models/'),
    faceapi.nets.faceExpressionNet.loadFromUri('./../js/models/')
]).then(startVideo);

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {
        width: video.width,
        height: video.height
    };
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions().withAgeAndGender().withFaceDescriptors();
        const results = JSON.stringify(detections);
        console.log(`age: ${Math.round(detections[0].age)}`);
        console.log(`gender: ${detections[0].gender}`);
        if ((Math.round(detections[0].expressions.angry * 10) / 10) > 0.5) {
            console.log(`disgusted: ${Math.round(detections[0].expressions.angry * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.disgusted * 10) / 10) > 0.5) {
            console.log(`disgusted: ${Math.round(detections[0].expressions.disgusted * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.fearful * 10) / 10) > 0.5) {
            console.log(`fearful: ${Math.round(detections[0].expressions.fearful * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.happy * 10) / 10) > 0.5) {
            console.log(`happy: ${Math.round(detections[0].expressions.happy * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.neutral * 10) / 10) > 0.5) {
            console.log(`neutral: ${Math.round(detections[0].expressions.neutral * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.sad * 10) / 10) > 0.5) {
            console.log(`sad: ${Math.round(detections[0].expressions.sad * 10) / 10}`);
        } else if ((Math.round(detections[0].expressions.surprised * 10) / 10) > 0.5) {
            console.log(`surprised: ${Math.round(detections[0].expressions.surprised * 10) / 10}`);
        }
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        resizedDetections.forEach( detection => {
          const box = detection.detection.box;
          const drawBox = new faceapi.draw.DrawBox(box, { label: Math.round(detection.age) + " year old " + detection.gender });
          drawBox.draw(canvas);
        });
    }, 100);
});

const loading = document.getElementById('loading');
const testResults = document.getElementById('testResults');

function getMathRandom(min, max) {
    return Math.random() * (max - min) + min;
}

setTimeout(() => {
    loading.style.display = 'none';
    if (getMathRandom(0, 10) >= 5) {
        testResults.innerText = 'Start running replicant!';
    } else if (getMathRandom(0, 10) < 5) {
        testResults.innerText = 'as you were hooman...';
    }
}, 3000);