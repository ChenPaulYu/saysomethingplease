console.clear()

var config = {
    apiKey: "AIzaSyDYwS8sV2bVq0hcXxw3gNHHmwF6go2pGF4",
    authDomain: "speak-something.firebaseapp.com",
    databaseURL: "https://speak-something.firebaseio.com",
    projectId: "speak-something",
    storageBucket: "speak-something.appspot.com",
    messagingSenderId: "508186378893"
};

firebase.initializeApp(config);

var lastTime = new Date();
var json;
var playing = false;
var autoplay = false;
var autoplayNum = 5;
var intTime = 60;
var latest;

const database = firebase.database();
const collection = database.ref('textcollection');

$('.speak').on('click',speak)

var SW9 = new SiriWave({
    style: "ios9",
    container: document.getElementById("container-9"),
    autostart: true
});

SW9.setAmplitude(1)

collection.on('value', function (snapshot) {
    window.speechSynthesis.cancel();
    console.log(latest)
    playing = true;
    json = snapshot.val();

    if (typeof latest === "undefined") {
        SW9.setAmplitude(1)
    } else {
        SW9.setAmplitude(10)
    }

    var last = json[Object.keys(json).pop()]
    // SW9.setAmplitude(10)
    
    speakout(last['text']);
    latest = last

    playing = false;
})


// setInterval(function(){

//     if(say) {
//         SW9.setAmplitude(30)
//     }else {
//         SW9.setAmplitude(1)
//     }
//     console.log(SW9.amplitude)
// },100)

setInterval(function () {
    checkTime();
}, intTime);


function toggleAutoPlay() {

    autoplay = !autoplay;
    console.log(autoplay);
}

function setplayNumber(num) {
    autoplayNum = num;
    console.log("set num: ", num);
}

function setAutoPlayInterval(time) {
    intTime = time;
    console.log("set interval ", intTime);
}

function checkTime() {
    if (!autoplay) return;
    var newTime = new Date();
    if ((newTime - lastTime) / 1000 > intTime) {
        console.log("gogo!");
        var ind = 0;
        var len = Object.keys(json).length;
        console.log("len ", len);
        var index = [];

        // build the index
        for (var x in json) {
            index.push(x);
        }
        shuffle(index);

        for (var i = 0; i < autoplayNum && !playing; i++) {

            console.log(playing, json[index[i]]);
            speakout(json[index[i]]['text']);

        }
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function speakout(input) {
    var msg = new SpeechSynthesisUtterance(input)
    window.speechSynthesis.speak(msg)
    lastTime = new Date();
    msg.onend = function (event) {
        SW9.setAmplitude(1)
        console.log('Utterance has finished being spoken after ' + event.elapsedTime + ' milliseconds.');
    }
}

function speak() {
    console.log('test')
    var input = $("#input").val()
    var newChildRef = collection.push(input);
    console.log(new Date().toString())
    console.log(input)
    newChildRef.set({ 'text': input, 'date': new Date().toString() });
}