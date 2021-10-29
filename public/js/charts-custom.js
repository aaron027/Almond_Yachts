

// chart 2
var ctx = document.getElementById("chart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr'],
        datasets: [{
            label: 'Lightship',
            data: [150, 200, 190, 190, 200, 230, 220],
            barPercentage: .5,
            backgroundColor: "#d5ae82",
        }, {
            label: 'Cruising',
            data: [190, 140, 180, 240, 160, 190, 140],
            barPercentage: .5,
            backgroundColor: "#edc79d",
        }]
    },
    options: {
        maintainAspectRatio: false,

        legend: {
            display: false,
            labels: {
                fontColor: '#585757',
                boxWidth: 40,
            }
        },
        tooltips: {
            enabled: true
        },
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#585757'
                },
                gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0.07)"
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#585757'
                },
                gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0.07)"
                },
            }]
        }
    }
});


// chart 3
new Chart(document.getElementById("chart3"), {
    type: 'doughnut',
    data: {
        labels: ["Electric Lightship", "Cruising ship"],
        datasets: [{
            label: "Popular Categories",
            backgroundColor: ["#d5ae82", "#edc79d"],
            data: [500, 800]
        }]
    },
    options: {
        legend: {
            display: false,
            position: "left",

        },
        maintainAspectRatio: false,
        title: {
            display: false,
            text: 'Top Category'
        }
    }
});