$(window).on('load', function () {
    // inisialisasi Toast
    var NotificationApp = function () {
    };

    NotificationApp.prototype.send = function (heading, body, position, loaderBgColor, icon, hideAfter, stack, showHideTransition) {
        // default
        if (!hideAfter)
            hideAfter = 3000;
        if (!stack)
            stack = 1;

        var options = {
            heading: heading,
            text: body,
            position: position,
            loaderBg: loaderBgColor,
            icon: icon,
            hideAfter: hideAfter,
            stack: stack
        };

        if (showHideTransition)
            options.showHideTransition = showHideTransition;

        // console.log(options);
        $.toast().reset('all');
        $.toast(options);
    },

        $.NotificationApp = new NotificationApp, $.NotificationApp.Constructor = NotificationApp


    // custom toast tambah
    function roleChanged(nama, role) {
        $.NotificationApp.send("Akses berubah!", `Akses ${nama} telah diubah menjadi ${role}`, 'bottom-right', '#5ba035', 'success');
    };
    function unitChanged(nama, unit) {
        $.NotificationApp.send("Akses berubah!", `Unit ${nama} telah diubah menjadi ${unit}`, 'bottom-right', '#5ba035', 'success');
    };

    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-data/pegawai";

    // inisialisasi datatables
    var tabel = $('#tabel').DataTable({
        "lengthChange": false,
        "dom": 'lrtip',
        "scrollX": true,
        "language": {
            "info": "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            "infoEmpty": "Menampilkan 0 sampai 0 dari 0 data",
            "loadingRecords": "Memuat...",
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
        ajax: urlWindow,

        columns: [{
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'nama',
            className: 'align-middle'
        }, {
            data: 'nip',
            className: 'align-middle text-center'
        }, {
            data: 'nidn',
            className: 'align-middle text-center'
        }, {
            data: 'jenis_kepegawaian',
            className: 'align-middle text-center'
        }],
        // }, {
        //     data: 'id',
        //     className: 'align-middle',
        //     orderable: false,
        //     searchable: false
        // },],
        // columnDefs: [{
        //     targets: 5,
        //     render: function render(data, type, row, meta) {
        //         return `<div class="row row-cols-sm-auto">
        //             <div class="col-4">
        //                 <div id="tooltip-container">
        //                     <a type="button" id="${data}"
        //                         class="role_data text-reset font-20">
        //                         <i class="ri-shield-user-line"
        //                             data-bs-container="#tooltip-container"
        //                             data-bs-toggle="tooltip" data-bs-placement="top"
        //                             title="Mengubah Akses"></i>
        //                     </a>
        //                 </div>
        //             </div>
        //         </div>`
        //     }
        // }],
        "order": [[0, 'asc']]
    });

    var roleId
    var unitId

    // pemberian nomor
    tabel.on('order.dt search.dt', function () {
        tabel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // inputan pencarian
    $('#input-search').keyup(function () {
        tabel.search($(this).val()).draw()
    })

    // inisialisasi selectize
    var $unit = $('.unit').selectize({
        hideSelected: false,
        plugins: {
            'dropdown_header': {
                title: 'Unit'
            }
        },
        onChange: function (value) {
            var id = $('#modal-role div.modal-body').attr('id-role')
            // console.log(unitId)
            if (unitId != value) {
                unitId = value
                $.ajax({
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    url: `${urlWindow}/${id}`,
                    method: 'PUT',
                    data: {
                        role_id: roleId,
                        unit_id: value,
                    },
                    success: function (data) {
                        console.log(data['status'])
                        unitChanged(data['nama'], data['unit'])
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            }
        }
    })
    var $role = $('.selectize-drop-header').selectize({
        hideSelected: false,
        plugins: {
            'dropdown_header': {
                title: 'Aktor'
            }
        },
        onChange: function (value) {
            var id = $('#modal-role div.modal-body').attr('id-role')
            if (value == 6) {
                var unit = $unit[0].selectize;
                unit.clear()
                $('#unit').hide()
            } else {
                $('#unit').fadeIn(250)
            }
            // console.log(role)
            if (roleId != value) {
                roleId = value
                $.ajax({
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    url: `${urlWindow}/${id}`,
                    method: 'PUT',
                    dataType: "JSON",
                    data: {
                        role_id: value,
                        unit_id: unitId
                    },
                    success: function (data) {
                        console.log(data['status'])
                        roleChanged(data['nama'], data['role'])
                    },
                    error: function (e) {
                        console.log(e)
                    }
                });
            }
        }
    })

    // inisialisasi scrf
    var csrf = $('#csrf').find('input').val()

    // tombol role data
    $(document).on('click', '.role_data', function () {
        var id = $(this).attr("id");
        $('#modal-role div.modal-body').attr('id-role', id)
        // console.log(id)
        $.ajax({
            url: `${urlWindow}/${id}/edit`,
            method: 'GET',
            success: function (data) {
                // console.log(data)
                roleId = data['role_id']
                unitId = data['id_unit']
                var role = $role[0].selectize;
                role.setValue(`${data['role_id']}`)
                var unit = $unit[0].selectize;
                unit.setValue(`${data['id_unit']}`)
                $('#modal-role').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // tombol sinkronisasi data
    $(document).on('click', '.sinkronisasi_data', function () {
        $('#sinkron').addClass('fa-spin')
        $('body').loadingModal({ text: 'Sinkronisasi sedang berlangsung... <br/> Harap tidak merefresh laman ini.' }).loadingModal('animation', 'fadingCircle').loadingModal('backgroundColor', 'black')
        $.ajax({
            url: `${urlWindow}/create`,
            method: 'GET',
            success: function (data) {
                console.log(data)
                tabel.ajax.reload();
                $('body').loadingModal('destroy')
                Swal.fire(
                    {
                        title: 'Sinkronisasi berhasil!',
                        text: `${data.jumlah_penambahan_user} data pegawai telah ditambahkan \n dan ${data.jumlah_perubahan_user} data pegawai mengalami pembaruan`,
                        icon: 'success',
                        confirmButtonColor: '#3bafda'
                    }
                )
                $('#sinkron').attr('class', 'ri-refresh-line')
            },
            error: function (e) {
                // console.log(e)
                $('body').loadingModal('destroy')
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal melakukan sinkronisasi',
                    text: `${e.responseJSON.message} | ${e.status} | ${e.statusText}`,
                    confirmButtonColor: '#3bafda'
                })
                $('#sinkron').attr('class', 'ri-refresh-line')
            }
        })
    })
})



