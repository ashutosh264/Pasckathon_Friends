var ref = firebase.database().ref();
let userid = $('#variableJSON1').text();
var red = firebase.database().ref(`users/${userid}/light`);
var green = firebase.database().ref(`users/${userid}/fan`);
var ldr = firebase.database().ref(`users/${userid}/ldr`);

var first = firebase.database().ref(`users/${userid}/ultrasonic/first`);
var second = firebase.database().ref(`users/${userid}/ultrasonic/second`);
var third = firebase.database().ref(`users/${userid}/ultrasonic/third`);
var fourth = firebase.database().ref(`users/${userid}/ultrasonic/fourth`);
var fifth = firebase.database().ref(`users/${userid}/ultrasonic/fifth`);
var servo = firebase.database().ref(`users/${userid}/servo`);

var red_check = document.getElementById("red");
var green_check = document.getElementById("green");
var slider = document.getElementById("slider");
var ctx = document.getElementById('myChart').getContext('2d');
var can = document.getElementById('canvas').getContext('2d')


var data={
labels: [],
datasets: [{
    label: 'Power',
    fill: false,
    borderColor: '#2196f3', 
    backgroundColor: '#2196f3',
    borderWidth: 1 
}]
}
var chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
    responsive: true, 
    maintainAspectRatio: false, 
}
});
var dou = new Chart(can , {
    type : "doughnut",
    data :  {
        datasets: [{
            data: [10, 20, 30 , 40 , 50],
            label : 'Poweer Used By Each Equipent',
            backgroundColor : ["#F07A60","#E5A99B","#824739", "#938784" , "#AD2300"]
        }],
        labels: [
            "Light",
            "Fan",
            "Air Conditioner",
            "Oven",
            "Geyser"
        ]
    },
    options : {
        animation : {
            responsive: true, 
            maintainAspectRatio: false,
            animateRotate : true
        }
    }
})
let dp=[];
let label=[];
let i=0;
first.on("value", function (snap) {
    console.log(snap.val());
    label.push(new Date().toLocaleString().split(',')[1]);
    dp.push(snap.val());
    i = dp.length;
    if(i>5){
        dp.shift();
        label.shift();
        i--;
    }
    data.labels = label;
    data.datasets[0].data=dp;
    console.log(dp);
    chart.update();  
});
second.on("value", function (snap) {
    console.log(snap.val());
    label.push(new Date().toLocaleString().split(',')[1]);
    dp.push(snap.val());
    i=dp.length;
    if(i>5){
        dp.shift();
        label.shift();
        i--;
    }
    data.labels = label;
    data.datasets[0].data=dp;
    chart.update();  
});
third.on("value", function (snap) {
    console.log(snap.val());
    label.push(new Date().toLocaleString().split(',')[1]);
    dp.push(snap.val());
    i = dp.length;
    if(i>5){
        dp.shift();
        label.shift();
        i--;
    }

    data.labels = label;
    data.datasets[0].data=dp;
    chart.update();  
});
fourth.on("value", function (snap) {
    console.log(snap.val());
    label.push(new Date().toLocaleString().split(',')[1]);
    dp.push(snap.val());
    i = dp.length;
    if(i>5){
        dp.shift();
        label.shift();
        i--;
    }
    data.labels = label;
    data.datasets[0].data=dp;
    chart.update();  
});
fifth.on("value", function (snap) {
    console.log(snap.val());
    label.push(new Date().toLocaleString().split(',')[1]);
    dp.push(snap.val());
    i = dp.length;
    if(i>5){
        dp.shift();
        label.shift();
        i--;
    }
    data.labels = label;
    data.datasets[0].data=dp;
    chart.update();  	   
});
servo.on("value", function (snap) {
    slider.value= snap.val();
    document.getElementById('sliderval').innerHTML=snap.val();
});
$(function(){                    
    red.on("value", function (snap) {
        if(snap.val()==1){
            $('#red').click();
        }
    });
    green.on("value", function (snap) {
        if(snap.val()==1){
            $('#green').click();
        }
    });
    
});

red_check.addEventListener('change', function(event) {
    if(event.target.checked){
    console.log("RED checked");
    red.set(1);
    }else{
    red.set(0);
    }
});
green_check.addEventListener('change', function(event) {
    if(event.target.checked){
    console.log("GREEN checked");
    green.set(1);
    }else{
    green.set(0);
    }
});
slider.addEventListener('change', function(event) {
    document.getElementById("sliderval").innerHTML=event.target.value;
    var pos= parseInt(event.target.value);
    console.log(pos);
    servo.set(pos);
});