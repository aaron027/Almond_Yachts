

// chart 2
var ctx = document.getElementById("chart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Completed',
            data: [150, 200, 190, 190, 200, 230, 220, 500, 432, 656, 211, 300],
            barPercentage: .5,
            backgroundColor: "#d5ae82",
        }]
    },
    options: {
        maintainAspectRatio: false,

        legend: {
            display: false,
            labels: {
                fontColor: '#d5ae82',
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
                    fontColor: '#d5ae82'
                },
                gridLines: {
                    display: false,
                    color: "rgba(0, 0, 0, 0.07)"
                },
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontColor: '#d5ae82'
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
            label: "Top Diseases (millions)",
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