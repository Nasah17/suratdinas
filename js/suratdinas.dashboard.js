$(window).on('load', function () {
    var urlWindow = window.location.origin + "/dashboard"

    var admin = [1, 2];
    var pegawaiRole = [3, 4, 5, 6, 7, 8, 9, 10];
    // console.log(pegawaiRole.includes(parseInt($('#role_id').val())));
    // console.log(admin.includes(parseInt($('#role_id').val())));
    if (pegawaiRole.includes(parseInt($('#role_id').val()))) {
        var value = $('#periode').val().split('|')
        $('#non-tupoksi').html(value[0])
        $('#tupoksi').html(value[1])
        $('#total-sks').html(`(${(Math.round((parseFloat(value[0]) + parseFloat(value[1])) * 100) / 100).toFixed(2)})`)

        $('#periode').on('change', function () {
            var value = $(this).val().split('|')
            $('#non-tupoksi').html(value[0])
            $('#tupoksi').html(value[1])
            $('#total-sks').html(`(${(Math.round((parseFloat(value[0]) + parseFloat(value[1])) * 100) / 100).toFixed(2)})`)
        })
    } else if (admin.includes(parseInt($('#role_id').val()))) {
        var periode = $('#periode-diagram').val().split('|')
        var unitsSK = periode[0].split(',')
        var unitsST = periode[1].split(',')
        // console.log(Math.max.apply(null, unitsSK.concat(unitsST)))
        var ctx = $("#radar-surat-dinas").get(0).getContext("2d");
        var dataColors = $("#radar-surat-dinas").data('colors').split(',');
        var labels = $("#radar-surat-dinas").data('nama-units').split(',');
        var defaultColors = ["#1abc9c", "#f1556c", "#3bafda", "#e3eaef"];
        var colors = dataColors ? dataColors : defaultColors.concat();
        var maxCount = Math.max.apply(null, unitsSK.concat(unitsST))
        var pembanding = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650]
        pembanding.reverse()
        var max
        pembanding.forEach(function (p) {
            if (maxCount <= p) {
                max = p
            }
        });
        // console.log(max)
        // var max = maxCount <=10 ? 10 : maxCount <= 20 ? 20 : maxCount <= 30

        var chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Surat Keputusan",
                        backgroundColor: hexToRGB(colors[0], 0.3),
                        borderColor: colors[0],
                        pointBackgroundColor: colors[0],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: colors[0],
                        data: unitsSK
                    },
                    {
                        label: "Surat Tugas",
                        backgroundColor: hexToRGB(colors[1], 0.3),
                        borderColor: colors[1],
                        pointBackgroundColor: colors[1],
                        pointBorderColor: "#fff",
                        pointHoverBackgroundColor: "#fff",
                        pointHoverBorderColor: colors[1],
                        data: unitsST
                    },
                ]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                            max: max
                        }
                    }]
                }
            }
        })

        $('#periode-diagram').on('change', function () {
            var periode = $(this).val().split('|')
            var unitsSK = periode[0].split(',')
            var unitsST = periode[1].split(',')
            var maxCount = Math.max.apply(null, unitsSK.concat(unitsST))
            var max1
            pembanding.forEach(function (p) {
                if (maxCount <= p) {
                    max1 = p
                }
            });
            chart.data.datasets = [
                {
                    label: "Surat Keputusan",
                    backgroundColor: hexToRGB(colors[0], 0.3),
                    borderColor: colors[0],
                    pointBackgroundColor: colors[0],
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: colors[0],
                    data: unitsSK
                },
                {
                    label: "Surat Tugas",
                    backgroundColor: hexToRGB(colors[1], 0.3),
                    borderColor: colors[1],
                    pointBackgroundColor: colors[1],
                    pointBorderColor: "#fff",
                    pointHoverBackgroundColor: "#fff",
                    pointHoverBorderColor: colors[1],
                    data: unitsST
                },
            ]
            chart.options.scales.yAxes = [
                {
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        max: max1
                    }
                }
            ]
            chart.update();
        })

        // inisialisasi datatables surat tugas
        var tabel = $('#dashboard-pegawai').DataTable({
            "lengthChange": false,
            "dom": 'lrtip',
            "scrollX": true,
            "language": {
                "info": "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                "infoEmpty": "Menampilkan 0 sampai 0 dari 0 data",
                "emptyTable": "Tidak ada data yang tersedia",
                "zeroRecords": "Tidak ada data yang tersedia",
                "infoFiltered": "(telah difilter dari _MAX_ data)",
                "search": "",
                "paginate": {
                    "previous": "<i class='mdi mdi-chevron-left'>",
                    "next": "<i class='mdi mdi-chevron-right'>"
                }
            },
            "drawCallback": function () {
                $('.dataTables_paginate > .pagination').addClass('pagination-rounded')
            },
            // ajax: `${urlWindow}`,

            columns: [{
                data: 'id',
                className: 'align-middle',
                orderable: false,
                searchable: false
            }, {
                data: 'nip',
                className: 'align-middle',
            }, {
                data: 'nama',
                className: 'align-middle',
            }, {
                data: 'poin_non_tupoksi',
                className: 'align-middle text-center'
            }, {
                data: 'poin_tupoksi',
                className: 'align-middle text-center'
            }, {
                data: 'id',
            }],
            columnDefs: [
                {
                    targets: 1,
                    render: function render(data, type, row, meta) {
                        return `${row.nidn ? row.nidn : data}`
                    }
                }, {
                    targets: 5,
                    visible: false,
                }],
            // "order": [[0, 'dsc']]
        })

        // periode
        tabel.ajax.url(`${urlWindow}/data-pegawai/${$('#periode-pegawai').val()}`).load();
        $('#periode-pegawai').on('change', function (ev) {
            tabel.ajax.url(`${urlWindow}/data-pegawai/${$(this).val()}`).load();
            ev.preventDefault();
            var $portlet = $(this).closest('.card');
            // This is just a simulation, nothing is going to be reloaded
            $portlet.append('<div class="card-disabled"><div class="card-portlets-loader"><div class="spinner-border text-primary m-2" role="status"></div></div></div>');
            var $pd = $portlet.find('.card-disabled');
            setTimeout(function () {
                $pd.fadeOut('fast', function () {
                    $pd.remove();
                });
            }, 1750);
        })

        // pemberian nomor
        tabel.on('order.dt search.dt', function () {
            tabel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                cell.innerHTML = i + 1;
            });
        }).draw();

        // inputan pencarian
        $('#search-pegawai-dash').keyup(function () {
            tabel.search($(this).val()).draw()
        })
    }



    function hexToRGB(hex, alpha) {
        var r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
        } else {
            return "rgb(" + r + ", " + g + ", " + b + ")";
        }
    }
})



