// The chart for show orders in week days
var ctx = document.getElementById("chart2").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fr', 'Sat'],
        datasets: [{
            label: 'Lightship',
            data: [$("#orderByDay li:nth-child(1)").html(), $("#orderByDay li:nth-child(2)").html(), $("#orderByDay li:nth-child(3)").html(), $("#orderByDay li:nth-child(4)").html(), $("#orderByDay li:nth-child(5)").html(), $("#orderByDay li:nth-child(6)").html(), $("#orderByDay li:nth-child(7)").html()],
            barPercentage: .5,
            backgroundColor: "#d5ae82",
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

// The chart for show top category in index page
new Chart(document.getElementById("chart3"), {
    type: 'doughnut',
    data: {
        labels: ["Electric Lightship", "Cruising ship"],
        datasets: [{
            label: "Popular Categories",
            backgroundColor: ["#d5ae82", "#edc79d"],
            data: [$("#category1").html(), $("#category2").html()]
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