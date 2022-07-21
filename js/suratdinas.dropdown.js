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

        // console.log(options);
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
    const urlWindow = window.location.origin + "/manajemen-menu/sidebar/dropdown";

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
                "targets": 3
            }
        ],
        "order": [[0, 'dsc']]

    });

    // inisialisasi switchery

    $('[data-plugin="switchery"]').each(function (idx, obj) {
        new Switchery($(this)[0], $(this).data());
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

    // inisialisasi selectize
    var $select = $('.selectize-drop-header').selectize({
        sortField: 'text',
        hideSelected: false,
        plugins: {
            'dropdown_header': {
                title: 'Menu'
            }
        }
    })

    var dropdownIsActive = document.querySelector('.dropdown-is-active')

    // tombol tambah data
    $(document).on('click', '.tambah-data', function () {
        if (!dropdownIsActive.checked) {
            dropdownIsActive.click()
        }
        $('#form-modal-add')[0].reset()
        $('h4.modal-title').html('Tambah Data')
        $('#form-modal-add').attr('jenis', 'add')
        $('#form-modal-add').attr('class', 'needs-validation')
        $('#modal-add').modal('show')
    })

    // tombol edit data
    $(document).on('click', '.edit_data', function () {
        $('#form-modal-add').attr('class', 'needs-validation')
        $('h4.modal-title').html('Edit Data')
        $('#form-modal-add')[0].reset();
        if (!dropdownIsActive.checked) {
            dropdownIsActive.click()
        }
        $('#form-modal-add').attr('jenis', 'edit')
        var id = $(this).attr("id");
        $('#form-modal-add').attr('id-edit', id)
        // console.log(id)
        $.ajax({
            url: `${urlWindow}/${id}/edit`,
            method: 'GET',
            success: function (data) {
                // console.log(data)
                var selectize = $select[0].selectize;
                selectize.setValue(`${data['submenu_id']}`)
                $('#dropdown_title').val(data['dropdown_title'])
                $('#dropdown_url').val(data['dropdown_url'])
                $('#dropdown_class').val(data['dropdown_class'])
                if (data['dropdown_is_active'] == 0) {
                    dropdownIsActive.click();
                }
                $('#modal-add').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // add data
    $('#form-modal-add').on('submit', function (event) {
        event.preventDefault()
        var kondisi = $(`#submenu_id`).val() != "" && $(`#dropdown_title`).val() != "" && $(`#dropdown_url`).val() != "" && $(`#dropdown_class`).val() != ""
        var statusForm = $(this).attr('jenis') == 'add'
        var id_edit = $(this).attr('id-edit')
        // console.log(statusForm)
        if (kondisi && statusForm) {
            let formData = $(this).serialize()
            $.ajax({
                url: `${urlWindow}`,
                method: "POST",
                data: formData,
                beforeSend: function () {
                    $('#btn-add').attr('disabled', '')
                    $('#btn-add').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
                },
                success: function (data) {
                    // console.log(data)
                    tabel.row.add([
                        data['id'],
                        data['title'],
                        data['submenu_title'],
                        `<div class="row row-cols-sm-auto">
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="button" id="${data['id']}"
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
                                        id="${data['id']}">
                                        <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Hapus Data"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    ]).draw(false)
                    $(this).attr('class', 'needs-validation')
                    $('#modal-add').modal('hide')
                    $('#btn-add').removeAttr('disabled')
                    $('#btn-add').html('Simpan')
                    tambahData()
                },
                error: function (e) {
                    console.log(e)
                }
            })
        } else if (kondisi && !statusForm) {
            let formData = $(this).serialize()
            $.ajax({
                url: `${urlWindow}/${id_edit}`,
                method: "PUT",
                data: formData,
                beforeSend: function () {
                    $('#btn-add').attr('disabled', '')
                    $('#btn-add').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
                },
                success: function (data) {
                    // console.log(data)
                    tabel.row($(`#tabel tbody tr td #${id_edit}`).parents('tr')).remove().draw();
                    tabel.row.add([
                        id_edit,
                        $(`#dropdown_title`).val(),
                        data['submenu_title'],
                        `<div class="row row-cols-sm-auto">
                            <div class="col-6">
                                <div id="tooltip-container">
                                    <a type="button" id="${id_edit}"
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
                                        id="${id_edit}">
                                        <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                            data-bs-container="#tooltip-container"
                                            data-bs-toggle="tooltip" data-bs-placement="top"
                                            title="Hapus Data"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`
                    ]).draw(false)
                    $('#modal-add').modal('hide')
                    $('#btn-add').removeAttr('disabled')
                    $('#btn-add').html('Simpan')
                    editData()
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })

    // inisialisasi scrf
    var csrf = $('#csrf').find('input').val()

    // tombol hapus
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
                    url: `${urlWindow}/${idData}`,
                    method: "DELETE",
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



