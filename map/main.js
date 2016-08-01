$(function () {

    // Prepare data
    var data = [
        {
            "hc-key": "ar-tf",
            "value": 0.43,
            "num": 91
        },
        {
            "hc-key": "ar-ba",
            "value": 43.21,
            "num": 9123
        },
        {
            "hc-key": "ar-sj",
            "value": 0.26,
            "num": 54
        },
        {
            "hc-key": "ar-mz",
            "value": 1.41,
            "num": 298
        },
        {
            "hc-key": "ar-nq",
            "value": 0.87,
            "num": 183
        },
        {
            "hc-key": "ar-lp",
            "value": 0.26,
            "num": 54
        },
        {
            "hc-key": "ar-rn",
            "value": 0.87,
            "num": 183
        },
        {
            "hc-key": "ar-sl",
            "value": 0.28,
            "num": 60
        },
        {
            "hc-key": "ar-cb",
            "value": 3.07,
            "num": 649
        },
        {
            "hc-key": "ar-ct",
            "value": 0.12,
            "num": 26
        },
        {
            "hc-key": "ar-lr",
            "value": 0.13,
            "num": 27
        },
        {
            "hc-key": "ar-sa",
            "value": 0.49,
            "num": 104
        },
        {
            "hc-key": "ar-se",
            "value": 0.85,
            "num": 180
        },
        {
            "hc-key": "ar-tm",
            "value": 0.71,
            "num": 150
        },
        {
            "hc-key": "ar-cc",
            "value": 0.51,
            "num": 108
        },
        {
            "hc-key": "ar-fm",
            "value": 0.09,
            "num": 19
        },
        {
            "hc-key": "ar-cn",
            "value": 0.42,
            "num": 88
        },
        {
            "hc-key": "ar-er",
            "value": 1.28,
            "num": 271
        },
        {
            "hc-key": "ar-ch",
            "value": null
        },
        {
            "hc-key": "ar-sf",
            "value": 3.04,
            "num": 642
        },
        {
            "hc-key": "ar-mn",
            "value": 0.49,
            "num": 103
        },
        {
            "hc-key": "ar-df",
            "value": 31.10,
            "num": 6566
        },
        {
            "hc-key": "ar-sc",
            "value": 0.66,
            "num": 139
        },
        {
            "hc-key": "ar-jy",
            "value": 0.20,
            "num": 43
        }
    ];

    // Initiate the chart
    var map = $('#container').highcharts('Map', {

        title : {
            text : 'Donar Online',
            style: {"color":"#000", "font-size":"30px","font-family": "'FS Albert', Helvetica, sans-serif","font-weight":"bold"}
        },

        subtitle : {
            text : 'Provincias y Donaciones',
            style: {"color":"#000", "font-size":"21px","font-family": "'Open Sans', Helvetica, sans-serif"}
        },

        credits : {
        	enabled: false
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
            	align: 'left',
            	alignTo: 'spacingBox',
                verticalAlign: 'top'
            }
        },

        legend: {
        	title: {
        		text: 'Porcentaje de Donaciones'
        	},
        	align: 'left',
        	verticalAlign: 'bottom',
        	layout: 'vertical'
        },

        colors: ['#a64ca6', '#b266b2', '#cc99cc', '#e5cce5', '#ffffff'],

        colorAxis: {
        	dataClasses: [{
        		to: 0.25
        	} , {
        		from: 0.25,
        		to: 0.5
        	} , {
        		from: 0.5,
        		to: 0.75
        	} , {
        		from: 0.75,
        		to: 1
        	} , {
        		from: 1,
        		to: 10
        	} , {
        		from: 10,
        		to: 100
        	}],
            min: 0,
            maxColor: '#3D9AEF'
        },

        series : [{
            data : data,
            mapData: Highcharts.maps['countries/ar/ar-all'],
            joinBy: 'hc-key',
            name: 'Donaciones',
            states: {
                hover: {
                    color: '#EF3D3D'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
            
        }],
        tooltip: {
            pointFormat: 'Número: {point.num}<br>Porcentaje: {point.value}%'
                  
        }
        
    });

	var chart = $('#container').highcharts();
	chart.setSize(650, 900);

});
