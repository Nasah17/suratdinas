$(window).on('load', function () {
    // inisialisasi Toast
    var NotificationApp = function () {
    };


    /**
     * Send Notification
     * @param {*} heading heading text
     * @param {*} body body text
     * @param {*} position position e.g top-right, top-left, bottom-left, etc
     * @param {*} loaderBgColor loader background color
     * @param {*} icon icon which needs to be displayed
     * @param {*} hideAfter automatically hide after seconds
     * @param {*} stack
     */
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

        console.log(options);
        $.toast().reset('all');
        $.toast(options);
    },

        $.NotificationApp = new NotificationApp, $.NotificationApp.Constructor = NotificationApp


    // custom toast tambah
    function tambahData() {
        $.NotificationApp.send("Berhasil!", "Data telah ditambahkan", 'bottom-right', '#5ba035', 'success');
    };

    // custom toast hapus
    function hapusData() {
        $.NotificationApp.send("Berhasil!", "Data telah dihapus.", 'bottom-right', '#5ba035', 'success');
    };

    // custom toast edit
    function editData() {
        $.NotificationApp.send("Berhasil!", "Data telah diubah.", 'bottom-right', '#5ba035', 'success');
    };

    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-data/unit";

    // inisialisasi datatables
    var tabel = $('#tabel').DataTable({
        processing: true,
        serverSide: true,
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
            data: 'DT_RowIndex',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'nama_unit',
            className: 'align-middle'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }],
        columnDefs: [{
            targets: 2,
            render: function render(data, type, row, meta) {
                return `<div class="row row-cols-sm-auto">
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="button" id="${data}"
                                        class="edit_data text-reset font-16">
                                        <i style="color: rgb(247,184,75);" class="fe-edit"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Edit Data"></i>
                                    </a>
                                </div>
                            </div>
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="submit" class="hapus text-reset font-16"
                                        id="${data}">
                                        <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Hapus Data"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
            }
        }],
        "order": [[0, 'asc']]
    });

    // inputan pencarian
    $('#input-search').keyup(function () {
        tabel.search($(this).val()).draw()
    })

    // Tombol tambah
    $(document).on('click', '.tambah-data', function () {
        $('#form-modal')[0].reset()
        $('h4.modal-title').html('Tambah Data')
        $('#form-modal').attr('jenis', 'add')
        $('#modal').modal('show')
    })

    // Tombol Edit
    // tombol edit data
    $(document).on('click', '.edit_data', function () {
        $('h4.modal-title').html('Edit Data')
        $('#form-modal')[0].reset();
        $('#form-modal').attr('jenis', 'edit')
        var id = $(this).attr("id");
        $('#form-modal').attr('id-edit', id)
        // console.log(id)
        $.ajax({
            url: `${urlWindow}/${id}/edit`,
            method: 'GET',
            success: function (data) {
                $('#nama_unit').val(data)
                $('#modal').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // modal form
    $(document).on('submit', '#form-modal', function (event) {
        event.preventDefault()
        var statusForm = $(this).attr('jenis') == 'add'
        var id_edit = $(this).attr('id-edit')
        // console.log(statusForm)
        if (statusForm) {
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
                    $('#modal').modal('hide')
                    $('#btn').removeAttr('disabled')
                    $('#btn').html('Simpan')
                    tambahData()
                },
                error: function (e) {
                    let response = e.responseJSON
                    if ($.isEmptyObject(response) == false) {
                        $.each(response.errors, (key, value) => {
                            $('#' + key)
                                .closest('.form-control')
                                .after('<div style="font-size: 12px" class="text-danger mt-1">  ' + value + '</div>')
                        })
                    }
                    $('#btn').removeAttr('disabled')
                    $('#btn').html('Simpan')
                }
            })
        } else if (!statusForm) {
            let formData = $(this).serialize()
            $.ajax({
                headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                url: `${urlWindow}/${id_edit}`,
                method: "PUT",
                data: formData,
                beforeSend: function () {
                    $('#btn').attr('disabled', '')
                    $('#btn').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
                },
                success: function (data) {
                    tabel.ajax.reload()
                    $('#modal').modal('hide')
                    $('#btn').removeAttr('disabled')
                    $('#btn').html('Simpan')
                    editData()
                },
                error: function (e) {
                    let response = e.responseJSON
                    if ($.isEmptyObject(response) == false) {
                        $.each(response.errors, (key, value) => {
                            $('#' + key)
                                .closest('.form-control')
                                .after('<div style="font-size: 12px" class="text-danger mt-1">  ' + value + '</div>')
                        })
                    }
                    $('#btn').removeAttr('disabled')
                    $('#btn').html('Simpan')
                }
            })
        }
    })

    $('#tabel tbody').on('click', 'div.row a.hapus', function () {
        let idData = $(this).attr('id')
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak dapat mengembalikan data ini!",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: "#f1556c",
            confirmButtonColor: "#1abc9c",
            confirmButtonText: 'Ya, hapus!'
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
                Swal.fire('Telah dihapus!', 'Data telah dihapus.', 'success')
                hapusData()
            }
        })
    });
})



