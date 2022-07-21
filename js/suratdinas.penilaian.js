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
    function telahDinilai() {
        $.NotificationApp.send("Berhasil!", "Anggota telah dinilai", 'bottom-right', '#5ba035', 'success');
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
    const urlWindow = window.location.origin + "/penilaian/keanggotaan-surat-dinas";

    // inisialisasi datatables
    var tabel = $('#tabel-penilaian').DataTable({
        autoWidth: false,
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
        ajax: `${urlWindow}`,

        columns: [{
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'id',
            className: 'align-middle',
        }, {
            data: 'jenis_surat',
            className: 'align-middle',
        }, {
            data: 'id',
            className: 'align-middle'
        }, {
            data: 'id',
            className: 'align-middle'
        }, {
            data: 'status',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }, {
            data: 'id',
        }],
        columnDefs: [
            {
                targets: 1,
                render: function render(data, type, row, meta) {
                    return row.surat_keputusans ? row.surat_keputusans.nomor_surat : row.surat_tugas.nomor_surat
                }
            }, {
                targets: 2,
                render: function render(data, type, row, meta) {
                    if (data == 'sk') {
                        var jenis_surat = 'Surat Keputusan'
                    } else {
                        var jenis_surat = 'Surat Tugas'
                    }
                    return jenis_surat
                }
            }, {
                targets: 3,
                render: function render(data, type, row, meta) {
                    var tanggal = row.surat_keputusans ? row.surat_keputusans.tanggal_surat.split('-') : row.surat_tugas.tanggal_surat.split('-')
                    return `${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`
                }
            }, {
                targets: 4,
                render: function render(data, type, row, meta) {
                    var fieldSurat = row.surat_keputusans ? `${row.surat_keputusans.perihal_surat}` : `${row.surat_tugas.topik}`
                    return `<div data-bs-toggle="tooltip" data-bs-placement="top" title="${fieldSurat}">
                                ${fieldSurat.substr(0, 26)}
                                <br/>
                                ${fieldSurat.substr(26, 25)}${fieldSurat.length >= 51 ? '...' : ''}
                            </div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-success rounded-pill">Telah Dinilai</span>`
                    } else if (data == 0) {
                        return `<span class="badge badge-soft-warning rounded-pill">Belum Dinilai</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    var surat_dinas
                    if (row.jenis_surat == 'sk') {
                        var surat_dinas = row.surat_keputusans
                    } else {
                        var surat_dinas = row.surat_tugas
                    }
                    return `<div class="row row-cols-sm-auto">
                                <div class="col-4" style="padding-right: 12px;padding-left: 5px;">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${surat_dinas.penginput.nama}|${surat_dinas.unit.nama_unit}|${surat_dinas.periode.nama_periode}|${surat_dinas.nomor_surat}|Surat Keputusan|${surat_dinas.tanggal_surat}|-|-|${surat_dinas.topik}|${surat_dinas.employee.nama}|${surat_dinas.id_rubrik_tendik ? surat_dinas.rubrik_tendik.kode_urut + ' ' + surat_dinas.rubrik_tendik.rubrik : '-'}|${surat_dinas.rubrik_pendidik ? surat_dinas.rubrik_pendidik.kode_urut + ' ' + surat_dinas.rubrik_pendidik.rubrik : '-'}|${surat_dinas.id_rubrik_tendik ? surat_dinas.sks_master_tendik : '-'}|${surat_dinas.rubrik_pendidik ? surat_dinas.sks_master_pendidik : '-'}|${row.status}|${data}"
                                            class="info_surat text-reset font-16">
                                            <i style="color: rgb(59,175,218);" class="ri-information-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Info Surat"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4" style="padding-right: 12px;padding-left: 5px;">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${surat_dinas.id}|${surat_dinas.file}|${row.jenis_surat}"
                                            class="lihat_surat text-reset font-16">
                                            <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Lihat File"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4" style="padding-right: 12px;padding-left: 5px;">
                                    <div id="tooltip-container">
                                        <a type="button" data-anggota="${data}|${row.surat_keputusans ? row.surat_keputusans.id : row.surat_tugas.id}|${row.surat_keputusans ? 'sk' : 'st'}"
                                            class="nilai_anggota text-reset font-16">
                                            <i style="color: rgb(26,188,156);" class="ri-edit-circle-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Menilai Anggota"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>`
                }
            }, {
                targets: 7,
                render: function render(data, type, row, meta) {
                    return row.surat_keputusans ? row.surat_keputusans.id_periode : row.surat_tugas.id_periode
                },
                visible: false,
            }],
        "order": [[0, 'dsc']]

    });

    tabel.columns(7).search($('#periode-keputusan').val()).draw();
    tabel.columns(5).search($('#status-dinilai').val()).draw();

    // periode
    $('#periode-keputusan').on('change', function () {
        tabel.columns(7).search($(this).val()).draw();
    })

    // status
    $('#status-dinilai').on('change', function () {
        tabel.columns(5).search($(this).val()).draw();
    })

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

    // lihat file
    $(document).on('click', '.lihat_surat', function () {
        var nama_surat = $(this).attr('data-surat').split('|')
        var data_surat = nama_surat[1].split('-')
        var surat
        if (nama_surat[2] == 'sk') {
            var surat = 'surat-keputusan'
        } else if (nama_surat[2] == 'st') {
            var surat = 'surat-tugas'
        }
        var height = 500
        var width = 800
        var top = parseInt((screen.availHeight) - height - 100);
        var left = parseInt((screen.availWidth) - width - 300);
        var features = "location=1, status=1, scrollbars=1, width=" + width + ", height=" + height + ", top=" + top + ", left=" + left;
        // console.log(nama_surat)
        window.open(`${window.location.origin}/storage/file-surat-dinas/${surat}/${data_surat[2]}-${data_surat[3]}-${data_surat[4]}/${nama_surat[1]}`, "kad", features);
    })

    // tombol info surat
    $(document).on('click', '.info_surat', function () {
        $('.suratTugas').hide()
        $('.suratKeputusan').hide()
        $('.trTingkat').hide()

        var data_surat = $(this).attr('data-surat').split('|')
        $('#nama_penginput').html(data_surat[0])
        $('#unit').html(data_surat[1])
        $('#periode').html(data_surat[2])
        $('#nomor_surat').html(data_surat[3])
        $('#jenis_surat').html(data_surat[4])
        var div_status = $('#status_dinilai')
        var status = data_surat[14]
        if (status == 1) {
            div_status.html('<i class="mdi mdi-check-all me-1"></i> Telah Dinilai')
            div_status.attr('class', 'ribbon ribbon-success float-start')
        } else if (status == 0) {
            div_status.html('<i class="mdi mdi-alert-outline me-1"></i> Belum Dinilai')
            div_status.attr('class', 'ribbon ribbon-warning float-start')
        }
        var tanggal = data_surat[5].split('-')
        $('#tanggal_surat').html(`${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`)
        if (data_surat[15] == 'sk') {
            $('.suratKeputusan').show()
            $('#perihal').html(data_surat[6])
            $('#menetapkan').html(data_surat[7])
        } else if (data_surat[15] == 'st') {
            $('.suratTugas').show()
            $('#topik_penugasan').html(data_surat[8])
        }
        $('#pengesah').html(data_surat[9])
        $('#rubrik_tendik').html(`${data_surat[10]} / ${data_surat[12]}`)
        $('#rubrik_pendidik').html(`${data_surat[11]} / ${data_surat[13]}`)
        $('#modal-info-surat').modal('show')
    })

    // Tombol modal menilai
    $(document).on('click', '.nilai_anggota', function () {
        $('table#tabel-penilaian-anggota tbody').html('')
        var data = $(this).attr("data-anggota").split('|')
        $('#id_penilaian').val(data[0])
        // console.log(id)
        $.ajax({
            url: `${urlWindow}/${data[1]}|${data[2]}/edit`,
            method: 'GET',
            success: function (data) {
                console.log(data)
                var anggota
                var i = 1
                anggota += `<tr>
                                <td class="text-center align-middle" colspan="3">
                                    Nilai
                                    Semua</td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top" title="Sangat Baik">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="1.00"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                                <td class=" checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Baik">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.80"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Cukup">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.60"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Kurang">
                                    <div class="form-check position-absolute start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.40"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Sangat Kurang">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.20"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Tidak Aktif">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.00"
                                            name="nilai-atas" aria-label="...">
                                    </div>
                                </td>
                            </tr>`
                $.each(data, function (key, value) {
                    // console.log(key.nama + ": " + value.nama)
                    anggota += `<tr>
                                    <input type="hidden" name="id_pegawai[]" value="${value.id}">
                                    <input type="hidden" name="sks[]" value="${value.sks}">
                                    <input type="hidden" class="nilai_pegawai" name="nilai_pegawai[]">
                                    <td class="text-center align-middle">${i}</td>
                                    <td>${value.employee.nama}</td>
                                    <td>${value.jabatan ?? '-'}</td>
                                    <td class="checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Sangat Baik">
                                        <div class="form-check position-absolute top-50 start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 1.00 ? 'checked' : ''} value="1.00" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                    <td class=" checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Baik">
                                        <div class="form-check position-absolute top-50 start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 0.80 ? 'checked' : ''} value="0.80" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                    <td class="checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Cukup">
                                        <div class="form-check position-absolute top-50 start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 0.60 ? 'checked' : ''} value="0.60" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                    <td class="checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Kurang">
                                        <div class="form-check position-absolute start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 0.40 ? 'checked' : ''} value="0.40" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                    <td class="checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Sangat Kurang">
                                        <div class="form-check position-absolute top-50 start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 0.20 ? 'checked' : ''} value="0.20" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                    <td class="checked-self position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Tidak Aktif">
                                        <div class="form-check position-absolute top-50 start-50 translate-middle"
                                            style="padding-left: 26px">
                                            <input type="radio" class="reset-all form-check-input" ${value.nilai_keaktifan == 0.00 ? 'checked' : ''} value="0.00" name="nilai${value.id}" aria-label="...">
                                        </div>
                                    </td>
                                </tr>`
                    i++
                })
                anggota += `<tr>
                                <td class="text-center align-middle" colspan="3">
                                    Nilai
                                    Semua</td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Sangat Baik">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="1.00"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                                <td class=" checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Baik">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.80"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Cukup">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.60"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Kurang">
                                    <div class="form-check position-absolute start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.40"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Sangat Kurang">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.20"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                                <td class="checked-all position-relative" data-bs-toggle="tooltip" data-bs-placement="top"  title="Tidak Aktif">
                                    <div class="form-check position-absolute top-50 start-50 translate-middle"
                                        style="padding-left: 26px">
                                        <input type="radio" class="form-check-input" value="0.00"
                                            name="nilai-bawah" aria-label="...">
                                    </div>
                                </td>
                            </tr>`
                $('table#tabel-penilaian-anggota tbody').html(anggota)
            },
            error: function (e) {
                console.log(e)
            }
        })
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
        let formData = $(this).serialize()
        // console.log(formData)

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
                console.log(data)
                tabel.ajax.reload()
                $('#modal').modal('hide')
                $('#btn').removeAttr('disabled')
                $('#btn').html('Simpan')
                telahDinilai()
            },
            error: function (e) {
                console.log(e)
                $('#btn').removeAttr('disabled')
                $('#btn').html('Simpan')
            }
        })
    })

    $('table tbody').on('click', '.checked-self', function () {
        if ($(this).find('input').not(':checked')) {
            $(this).find('input').prop("checked", true);
            var value = $(this).find('input').val()
            $(this).parents('tr').find('input[class="nilai_pegawai"]').val(value)
            // console.log($(this).parents('tbody').find("input[name='nilai']:checked").val())
            if ($(this).parents('tbody').find("input[name='nilai-atas']:checked").val() != value) {
                $(this).parents('tbody').find('[name="nilai-atas"]').prop("checked", false);
            }
            if ($(this).parents('tbody').find("input[name='nilai-bawah']:checked").val() != value) {
                $(this).parents('tbody').find('[name="nilai-bawah"]').prop("checked", false);
            }
        }
    });
    $('table tbody').on('click', '.checked-all', function () {
        if ($(this).find('input').not(':checked')) {
            $(this).find('input').prop("checked", true);
        }
        var value = $(this).find('input').val()
        $(this).parents('tbody').find('[class="nilai_pegawai"]').val(value)
        $(this).parents('tbody').find(`[value="${value}"]`).prop("checked", true);
        // if ($(this).find('input').is(':checked')) {
        // }
    });
    $('table tbody').on('click', '.reset-all', function () {
        var value = $(this).val()
        // console.log($(this).parents('tbody').find("input[name='nilai']:checked").val())
        if ($(this).parents('tbody').find("input[name='nilai-atas']:checked").val() != value) {
            $(this).parents('tbody').find('[name="nilai-atas"]').prop("checked", false);
        }
        if ($(this).parents('tbody').find("input[name='nilai-bawah']:checked").val() != value) {
            $(this).parents('tbody').find('[name="nilai-bawah"]').prop("checked", false);
        }
    });
    $('table tbody').on('click', '[name="nilai-atas"]', function () {
        if ($(this).is(':checked')) {
            var value = $(this).val()
            $(this).parents('tbody').find(`[value="${value}"]`).prop("checked", true);
        }
    });
    $('table tbody').on('click', '[name="nilai-bawah"]', function () {
        if ($(this).is(':checked')) {
            var value = $(this).val()
            $(this).parents('tbody').find(`[value="${value}"]`).prop("checked", true);
        }
    });
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



