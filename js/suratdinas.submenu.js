
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
    const urlWindow = window.location.origin + "/manajemen-menu/sidebar/submenu";

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

    var submenuDropdown = document.querySelector('.submenu-dropdown')
    var submenuIsActive = document.querySelector('.submenu-is-active')

    // inisisalisasi switchery
    $('[data-plugin="switchery"]').each(function (idx, obj) {
        new Switchery($(this)[0], $(this).data());
    });

    // tombol dropdown
    $('.dropdown').click(function () {
        if (!submenuDropdown.checked) {
            $('#collapseExample').collapse('show')
        } else {
            $('#collapseExample').collapse('hide')
            $('#submenu_url').val(' ')
            $('#submenu_class').val(' ')
        }
    })

    // tombol tambah data
    $(document).on('click', '.tambah-data', function () {
        if (submenuDropdown.checked) {
            submenuDropdown.click()
        }
        if (!submenuIsActive.checked) {
            submenuIsActive.click()
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
        if (!submenuDropdown.checked) {
            submenuDropdown.click()
            $('#collapseExample').collapse('hide')
        }
        if (!submenuIsActive.checked) {
            submenuIsActive.click()
        }
        $('#form-modal-add').attr('jenis', 'edit')
        var id = $(this).attr("id");
        $('#form-modal-add').attr('id-edit', id)
        // console.log(id)
        $.ajax({
            url: `${urlWindow}/${id}/edit`,
            method: 'GET',
            success: function (data) {
                if (data['submenu_dropdown'] == 0) {
                    submenuDropdown.click()
                    $('#collapseExample').collapse('toggle')
                }
                // console.log(data)
                var selectize = $select[0].selectize;
                selectize.setValue(`${data['menu_id']}`)
                $('#submenu_title').val(data['submenu_title'])
                $('#submenu_url').val(data['submenu_url'])
                $('#submenu_class').val(data['submenu_class'])
                $('#submenu_icon').val(data['submenu_icon'])
                if (data['submenu_is_active'] == 0) {
                    submenuIsActive.click()
                }
                $('#modal-add').modal('show')
            },
            error: function (e) {
                console.log(e)
            }
        })
    })

    // form tambah dan edit data
    $('#form-modal-add').on('submit', function (event) {
        event.preventDefault()
        var kondisi = $(`#menu_id`).val() != "" && $(`#submenu_title`).val() != "" && $(`#submenu_url`).val() != "" && $(`#submenu_class`).val() != "" && $(`#submenu_icon`).val() != ""
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
                    console.log(data)
                    tabel.row.add([
                        data['id'],
                        data['title'],
                        `${data['dropdown'] == 1 ? '<span class="badge badge-soft-success rounded-pill">Enable</span>' : '<span class="badge badge-soft-warning rounded-pill">Disable</span>'}`,
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
                    console.log(data)
                    tabel.row($(`#tabel tbody tr td #${id_edit}`).parents('tr')).remove().draw();
                    tabel.row.add([
                        id_edit,
                        $(`#submenu_title`).val(),
                        `${data['dropdown'] == 1 ? '<span class="badge badge-soft-success rounded-pill">Enable</span>' : '<span class="badge badge-soft-warning rounded-pill">Disable</span>'}`,
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

    // fungsi tambah
    $('div.modal-footer button#btn-add-menu').click(function () {
        let formDataArray = $('#form-modal-add').serializeArray()
        // console.log(formDataArray[1]['name'] == "menu_id")
        console.log(formDataArray)
        var kondisi = $(`#menu_id`).val() != "" && $(`#submenu_title`).val() != "" && $(`#submenu_url`).val() != "" && $(`#submenu_class`).val() != "" && $(`#submenu_icon`).val() != ""
        // console.log(formDataArray.find(function (id) { return id['value'] == ' ' && id['value'] == '' }))
        if (kondisi) {
            $(this).attr('disabled', '')
            $(this).html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            let formData = $('#form-modal-add').serialize()
            $.ajax({
                url: `${urlWindow}`,
                method: "POST",
                data: formData,
                success: function (data) {
                    tabel.row.add([
                        data['id'],
                        'efefrer',
                        `${data['dropdown'] == 1 ? '<span class="badge badge-soft-success rounded-pill">Enable</span>' : '<span class="badge badge-soft-warning rounded-pill">Disable</span>'}`,
                        `<div class="row row-cols-sm-auto">
                        <div class="col-6">
                            <div id="tooltip-container">
                                <a type="button" id="edit-${data['id']}"
                                    data-id-edit="${data['id']}"
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
                                    data-id-hapus="${data['id']}">
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
                    $(`#modal`).modal('hide')
                    $('#submenu_title').val('')
                    $('#submenu_url').val('')
                    $('#submenu_class').val('')
                    $('#submenu_icon').val('')
                    $(this).removeAttr('disabled')
                    $(this).html('Simpan')
                    tambahData()
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })

    // fungsi edit
    $(`div.modal-footer button.btn-edit`).click(function () {
        let id = $(this).attr('id')
        let formDataArray = $(`#form-modal-edit-${id}`).serializeArray()
        var submenu_dropdown
        console.log(formDataArray)
        if (formDataArray[4]['name'] == "submenu_url") {
            submenu_dropdown = "off"
        } else if (formDataArray[5]['name'] == "submenu_url") {
            submenu_dropdown = "on"
        }
        var kondisiEdit
        if (submenu_dropdown == 'on') {
            var kondisiEdit = $(`#menu_id${id}`).val() != "" && $(`#submenu_title${id}`).val() != "" && $(`#submenu_icon${id}`).val() != ""
            console.log("tombol on")
        } else {
            var kondisiEdit = $(`#menu_id${id}`).val() != "" && $(`#submenu_title${id}`).val() != "" && $(`#submenu_url${id}`).val() != "" && $(`#submenu_class${id}`).val() != "" && $(`#submenu_icon${id}`).val() != ""
            console.log('tombol off')
        }
        // console.log(kondisiEdit)
        if (kondisiEdit) {
            console.log('edited')
            $(this).attr('disabled', '')
            $(this).html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            let formData = $(`#form-modal-edit-${id}`).serialize()
            $.ajax({
                url: `${urlWindow}/${id}`,
                method: "PUT",
                data: formData,
                success: function () {
                    tabel.row($(`#tabel tbody tr td #edit-${id}`).parents('tr')).remove().draw();
                    tabel.row.add([
                        id,
                        $(`#submenu_title${id}`).val(),
                        submenu_dropdown == 'on' ? '<span class="badge badge-soft-success rounded-pill">Enable</span>' : '<span class="badge badge-soft-warning rounded-pill">Disable</span>',
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
                    $(`#form-modal-edit-${id}`).attr('class', 'needs-validation')
                    $(`#modal-${id}`).modal('hide')
                    if ($(`#submenu_dropdown${id}`).val() == 'on') {
                        $(`#submenu_url${id}`).val('')
                        $(`#submenu_class${id}`).val('')
                    }
                    $(`button#${id}`).removeAttr('disabled')
                    $(`button#${id}`).html('Simpan')
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
