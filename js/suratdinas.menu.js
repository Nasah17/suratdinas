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
$(window).on('load', function () {

    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-menu/sidebar/menu";

    // inisialisasi datatables
    var tabel = $('#tabel').DataTable({
        processing: true,
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
        "columnDefs": [
            {
                "searchable": false,
                "orderable": false,
                "targets": 0
            },
            {
                "searchable": false,
                "orderable": false,
                "targets": 2
            }
        ],
        "order": [[0, 'dsc']]

    });

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

    // tombol tambah data
    $('#tambah-data').click(function () {
        $('div.modal-footer button.btn-edit-menu').attr('style', 'display: none;')
        $('div.modal-footer button.btn-add-menu').removeAttr('style')
        $.ajax({
            url: `${urlWindow}/create`,
            method: 'GET',
            success: function (data) {
                // console.log(data)
                $('#form-modal').attr('class', 'needs-validation')
                $('h4.modal-title').html('Tambah Data')
                $('.modal-body').html(`${data}`)
                $('#modal').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // tombol edit data
    $('#tabel tbody').on('click', 'tr td a.edit', function () {
        $('div.modal-footer button.btn-add-menu').attr('style', 'display: none;')
        $('div.modal-footer button.btn-edit-menu').removeAttr('style')
        let id = $(this).data('id-edit')
        console.log(id)
        $.ajax({
            url: `${urlWindow}/${id}/edit`,
            method: 'GET',
            success: function (data) {
                // console.log(data)
                $('#form-modal').attr('class', 'needs-validation')
                $('h4.modal-title').html('Edit Data')
                $('div.modal-footer button.simpan').attr('id', 'btn-edit-menu')
                $('.modal-body').html(`${data}`)
                $('#modal').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // fungsi tambah
    $('div.modal-footer button#btn-add-menu').click(function () {
        let formDataArray = $('#form-modal').serializeArray()
        if (formDataArray[1]['value'] != "") {
            $('div.modal-footer button#btn-add-menu').attr('disabled', '')
            $('div.modal-footer button#btn-add-menu').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            let formData = $('#form-modal').serialize()
            $.ajax({
                url: `${urlWindow}`,
                method: "POST",
                data: formData,
                success: function (data) {
                    tabel.row.add([
                        data,
                        formDataArray[1]['value'],
                        `<div class="row row-cols-sm-auto">
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="button" id="edit-${data}"
                                        data-id-edit="${data}"
                                        class="edit text-reset font-16">
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
                                        data-id-hapus="${data}">
                                        <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Hapus Data"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    ]).draw(false)
                    $('#form-modal').attr('class', 'needs-validation')
                    $('#modal').modal('hide')
                    $('#menu_title').val('')
                    $('#menu_url').val('')
                    $('div.modal-footer button#btn-add-menu').removeAttr('disabled')
                    $('div.modal-footer button#btn-add-menu').html('Simpan')
                    tambahData()
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })

    // fungsi edit
    $('div.modal-footer button#btn-edit-menu').click(function () {
        let id = $('#edit-blade').data('edit-blade')
        let formDataArray = $('#form-modal').serializeArray()
        if (formDataArray[1]['value'] != "") {
            $('div.modal-footer button#btn-edit-menu').attr('disabled', '')
            $('div.modal-footer button#btn-edit-menu').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            let formData = $('#form-modal').serialize()
            $.ajax({
                url: `${urlWindow}/${id}`,
                method: "PUT",
                data: formData,
                success: function () {
                    tabel.row($(`#tabel tbody tr td #edit-${id}`).parents('tr')).remove().draw();
                    tabel.row.add([
                        id,
                        formDataArray[1]['value'],
                        `<div class="row row-cols-sm-auto">
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="button" id="edit-${id}" data-id-edit="${id}"
                                        class="edit text-reset font-16">
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
                                        data-id-hapus="${id}">
                                        <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Hapus Data"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    ]).draw(false)
                    $('#form-modal').attr('class', 'needs-validation')
                    $('#modal').modal('hide')
                    $('div.modal-footer button#btn-edit-menu').removeAttr('disabled')
                    $('div.modal-footer button#btn-edit-menu').html('Simpan')
                    editData()
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })

    // inisialisasi scrf
    let csrf = $('#csrf').find('input').val()

    // tombol hapus
    $('#tabel tbody').on('click', 'div.row a.hapus', function () {
        let idData = $(this).data('id-hapus')
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
                    url: `${urlWindow}/${idData}`,
                    method: "Delete",
                    data: `_token=${csrf}`,
                    success: function (e) {
                        console.log(e)
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
                tabel
                    .row($(this).parents('tr'))
                    .remove()
                    .draw();
                Swal.fire(
                    'Telah dihapus!',
                    'Data telah dihapus.',
                    'success'
                )
                hapusData()
            }
        })
    });
})

