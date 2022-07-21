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
    function unitChanged(nama, unit) {
        $.NotificationApp.send("Unit telah diubah!", `Unit ${nama} telah diubah menjadi ${unit}`, 'bottom-right', '#5ba035', 'success');
    };

    function validatorChanged(nama, validator) {
        $.NotificationApp.send("Validator telah diubah!", `Validator ${nama} telah diubah menjadi Validator ${validator}`, 'bottom-right', '#5ba035', 'success');
    };

    // custom toast pegawai
    function pegawaiChanged() {
        $.NotificationApp.send("Berhasil!", "Mengembalikan Akses.", 'bottom-right', '#5ba035', 'success');
    };

    // custom toast tambah
    function tambahData() {
        $.NotificationApp.send("Berhasil!", "Data telah ditambahkan", 'bottom-right', '#5ba035', 'success');
    };

    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-unit/validator";

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
        ajax: `${urlWindow}`,

        columns: [{
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'name',
            className: 'align-middle'
        }, {
            data: 'username',
            className: 'align-middle text-center'
        }, {
            data: 'role',
            className: 'align-middle text-center'
        }, {
            data: 'unit_v',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        },],
        columnDefs: [
            {
                targets: 3,
                render: function render(data, type, row, meta) {
                    if (data == null) {
                        return ''
                    } else if (data.role_name != 'Admin') {
                        return `${data.role_name} ${row.validator}`
                    } else if (data.role_name == 'Admin') {
                        return `Admin | Validator ${row.validator}`
                    }
                }
            }, {
                targets: 4,
                render: function render(data, type, row, meta) {
                    if (data == null) {
                        return ''
                    } else {
                        return data.nama_unit
                    }
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    return `<div class="row row-cols-sm-auto">
                    <div class="col-6">
                        <div id="tooltip-container">
                            <a type="button" data-validator="${data}|${row.username}"
                                class="role_data text-reset font-20">
                                <i style="color: rgb(247,184,75);" class="ri-user-settings-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Mengubah Unit"></i>
                            </a>
                        </div>
                    </div>
                    ${row.username == 'admin' ? '' :
                            `<div class="col-6">
                    <div id="tooltip-container">
                        <a type="button" id="${data}"
                            class="hapus-validator text-reset font-20">
                            <i style="color: rgb(235,81,81);" class="ri-user-unfollow-line"
                                data-bs-container="#tooltip-container"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Hapus Akses Validasi"></i>
                        </a>
                    </div>
                </div>`}
            </div>`
                }
            }],
        "order": [[0, 'asc']]
    });

    var validator
    var unitId
    var kondisi

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
            $('.text-danger').remove()
            if (kondisi) {
                var id = $('#modal-role div.modal-body').attr('id-role')
                // console.log(unitId)
                // console.log(value)
                if (unitId != value && value != '') {
                    unitId = value
                    $.ajax({
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        url: `${urlWindow}/${id}`,
                        method: 'PUT',
                        data: {
                            unit_id: value,
                            validator: '',
                        },
                        success: function (data) {
                            console.log(data)
                            tabel.ajax.reload()
                            unitChanged(data.nama, data.unit)
                        },
                        error: function (e) {
                            let response = e.responseJSON
                            // console.log(e)
                            if ($.isEmptyObject(response) == false) {
                                $.each(response.errors, (key, value) => {
                                    $('#' + key).after('<div style="font-size: 12px" class="text-danger">  ' + value + '</div>')
                                })
                            }
                        }
                    });
                }
            }
        }
    })
    var $validator = $('.validator').selectize({
        hideSelected: false,
        plugins: {
            'dropdown_header': {
                title: 'Validator'
            }
        },
        onChange: function (value) {
            $('.text-danger').remove()
            if (kondisi) {
                var id = $('#modal-role div.modal-body').attr('id-role')
                // console.log(unitId)
                // console.log(value)
                if (validator != value && value != '') {
                    validator = value
                    $.ajax({
                        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                        url: `${urlWindow}/${id}`,
                        method: 'PUT',
                        data: {
                            unit_id: '',
                            validator: value,
                        },
                        success: function (data) {
                            console.log(data)
                            tabel.ajax.reload()
                            validatorChanged(data.nama, data.validator)
                        },
                        error: function (e) {
                            let response = e.responseJSON
                            // console.log(e)
                            if ($.isEmptyObject(response) == false) {
                                $.each(response.errors, (key, value) => {
                                    $('#' + key).after('<div style="font-size: 12px" class="text-danger">  ' + value + '</div>')
                                })
                            }
                        }
                    });
                }
            }
        }
    })
    var $pegawai = $('.pegawai').selectize({
        hideSelected: false,
        plugins: {
            'dropdown_header': {
                title: 'Pegawai'
            }
        }
    })


    // tombol edit validator
    $(document).on('click', '.role_data', function () {
        kondisi = true;
        $('#divPegawai').hide()
        $('h4.modal-title').html('Edit Validator')
        $('#modal-footer').hide()
        var dataValidator = $(this).attr("data-validator").split('|');
        if (dataValidator[1] == 'admin') {
            $('#divAkses').hide()
        }
        $('#modal-role div.modal-body').attr('id-role', dataValidator[0])
        // console.log(dataValidator)
        $.ajax({
            url: `${urlWindow}/${dataValidator[0]}/edit`,
            method: 'GET',
            success: function (data) {
                console.log(data)
                unitId = data.id_unit_v
                validator = data.validator
                var unit = $unit[0].selectize;
                unit.setValue(`${data.id_unit_v}`)
                var validator1 = $validator[0].selectize;
                validator1.setValue(`${data.validator}`)
                $('#modal-role').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // modal form
    $(document).on('submit', '#form-modal', function (event) {
        event.preventDefault()
        $('.text-danger').remove()
        let formData = $(this).serialize()
        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            url: `${urlWindow}`,
            method: "POST",
            data: formData,
            beforeSend: function () {
                $('#btn').attr('disabled', '')
                $('#btn').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            },
            success: function (data) {
                tabel.ajax.reload()
                $('#modal-role').modal('hide')
                $('#btn').removeAttr('disabled')
                $('#btn').html('Simpan')
                tambahData()
            },
            error: function (e) {
                let response = e.responseJSON
                // console.log(e)
                if ($.isEmptyObject(response) == false) {
                    $.each(response.errors, (key, value) => {
                        $('#' + key).after('<div style="font-size: 12px" class="text-danger">  ' + value + '</div>')
                    })
                }
                $('#btn').removeAttr('disabled')
                $('#btn').html('Simpan')
            }
        })
    })

    // tombol tambah Validator
    $(document).on('click', '.tambah-validator', function () {
        kondisi = false;
        var pegawai = $pegawai[0].selectize;
        pegawai.clear()
        var unit = $unit[0].selectize;
        unit.clear()
        var validator1 = $validator[0].selectize;
        validator1.clear()
        $('h4.modal-title').html('Tambah Validator')
        $('#divPegawai').show()
        $('#divAkses').show()
        $('#modal-footer').show()
        $('#modal-role').modal('show')
    })

    $('#tabel tbody').on('click', 'div.row a.hapus-validator', function () {
        let idData = $(this).attr('id')
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda akan mengembalikan akses pegawai sebelumnya!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: "#f1556c",
            confirmButtonColor: "#1abc9c",
            confirmButtonText: 'Ya!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    url: `${urlWindow}/${idData}`,
                    method: "DELETE",
                    success: function (e) {
                        console.log(e)
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
                tabel.row($(this).parents('tr')).remove().draw();
                Swal.fire('Selesai!', 'Akses telah dikembalikan.', 'success')
                pegawaiChanged()
            }
        })
    });
})



