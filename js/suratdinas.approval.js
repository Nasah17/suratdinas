$(window).on('load', function () {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

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
    function suratDiterima() {
        $.NotificationApp.send("Berhasil!", "Status Approval telah diperbarui menjadi diterima", 'bottom-right', '#5ba035', 'success');
    };
    // custom toast tambah
    function suratDitolak() {
        $.NotificationApp.send("Berhasil!", "Status Approval telah diperbarui menjadi ditolak", 'bottom-right', '#5ba035', 'success');
    };

    // custom toast tambah anggota
    function tambahAnggota() {
        $.NotificationApp.send("Berhasil!", "Anggota telah ditambahkan", 'bottom-right', '#5ba035', 'success');
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
    const urlWindow = window.location.origin + "/manajemen-surat-dinas/approval";

    var onTab = 'sk'
    var id_validator = $('#id_validator').val()

    $('#tab-sk').on('click', function () {
        onTab = 'sk'
        $('[class="breadcrumb-item active"]').html('Surat Keputusan')
        tabel.draw()
    })
    $('#tab-st').on('click', function () {
        onTab = 'st'
        $('[class="breadcrumb-item active"]').html('Surat Tugas')
        tabelTugas.draw()
    })

    // inisialisasi datatables
    var tabel = $('#tabel-surat-keputusan').DataTable({
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
            data: 'nomor_surat',
            className: 'align-middle',
        }, {
            data: 'tanggal_surat',
            className: 'align-middle'
        }, {
            data: 'perihal_surat',
            className: 'align-middle'
        }, {
            data: 'pengesah',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }, {
            data: 'id_periode',
        }],
        columnDefs: [
            {
                targets: 2,
                render: function render(data, type, row, meta) {
                    var tanggal = data.split('-')
                    return `${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`
                }
            }, {
                targets: 3,
                render: function render(data, type, row, meta) {
                    return `<div data-bs-toggle="tooltip" data-bs-placement="top" title="${data}">
                                ${data.substr(0, 26)}
                                <br/>
                                ${data.substr(26, 25)}${data.length >= 51 ? '...' : ''}
                            </div>`
                }
            }, {
                targets: 4,
                render: function render(data, type, row, meta) {
                    return `<div data-bs-toggle="tooltip" data-bs-placement="top" title="${row.employee.nama}"> ${data} </div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    var _statusSurat
                    if (id_validator == 1) {
                        _statusSurat = row.validator_1
                    } else if (id_validator == 2) {
                        _statusSurat = row.validator_2
                    } else if (id_validator == 3) {
                        _statusSurat = row.validator_3
                    }
                    if (_statusSurat == 1) {
                        return `<span class="badge badge-soft-success rounded-pill">Diterima</span>`
                    } else if (_statusSurat == 0) {
                        return `<a type="button" class="alasan" data-bs-toggle="tooltip"          data-bs-placement="top" title="Alasan ditolak, klik untuk lebih lanjut." data-surat="${row.ditolak.alasan}">
                                    <span class="badge badge-soft-danger rounded-pill">Ditolak</span>
                                </a>`
                    } else {
                        return `<span class="badge badge-soft-warning rounded-pill">Belum Diverifikasi</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    return `<div class="row row-cols-sm-auto">
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.nomor_surat}|${row.sks_master_tendik}|${row.sks_pendidik}|${row.label_jabatan_tendik}|${row.label_jabatan_pendidik}|${row.id_rubrik_tendik}|${row.id_rubrik_pendidik}|${row.input3}|${row.input2}|${row.input0}|${row.label0}"
                                class="lihat_anggota text-reset font-16">
                                <i style="color: rgb(101,89,204);" class="ri-group-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Anggota Surat Dinas"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.file}"
                                class="lihat_surat text-reset font-16">
                                <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Lihat File"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${row.penginput.nama}|${row.unit.nama_unit}|${row.periode.nama_periode}|${row.nomor_surat}|Surat Keputusan|${row.tanggal_surat}|${row.perihal_surat}|${row.menetapkan}|-|${row.employee.nama}|${row.id_rubrik_tendik ? row.rubrik_tendik.kode_urut + ' ' + row.rubrik_tendik.rubrik : '-'}|${row.rubrik_pendidik ? row.rubrik_pendidik.kode_urut + ' ' + row.rubrik_pendidik.rubrik : '-'}|${row.id_rubrik_tendik ? row.sks_master_tendik : '-'}|${row.rubrik_pendidik ? row.sks_master_pendidik : '-'}|${row.approval ?? 0}"
                                class="info_surat text-reset font-16">
                                <i style="color: rgb(59,175,218);" class="ri-information-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Info Surat"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.nomor_surat}"
                                class="approve text-reset font-16">
                                <i style="color: rgb(26,188,156);" class="ri-check-double-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Verifikasi"></i>
                            </a>
                        </div>
                    </div>
                </div>`
                }
            }, {
                targets: 7,
                visible: false,
            }],
        "order": [[5, 'asc'], [0, 'dsc']]

    });

    tabel.column(7).search($('#periode-keputusan').val()).draw();
    tabel.column(5).search($('#status-keputusan').val()).draw();

    // periode
    $('#periode-keputusan').on('change', function () {
        tabel.column(7).search($(this).val()).draw();
    })

    // status
    $('#status-keputusan').on('change', function () {
        tabel.column(5).search($(this).val()).draw();
    })

    // unit
    // $('#unit-keputusan').on('change', function () {
    //     tabel.column(8).search($(this).val()).draw();
    // })

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

    // inisialisasi datatables surat tugas
    var tabelTugas = $('#tabel-surat-tugas').DataTable({
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
        ajax: `${urlWindow}/create`,

        columns: [{
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'nomor_surat',
            className: 'align-middle',
        }, {
            data: 'tanggal_surat',
            className: 'align-middle'
        }, {
            data: 'topik',
            className: 'align-middle'
        }, {
            data: 'pengesah',
            // name: pengesah,
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }, {
            data: 'id_periode',
        }],
        columnDefs: [
            {
                targets: 2,
                render: function render(data, type, row, meta) {
                    var tanggal = data.split('-')
                    return `${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`
                }
            }, {
                targets: 3,
                render: function render(data, type, row, meta) {
                    return `<div data-bs-toggle="tooltip" data-bs-placement="top" title="${data}">
                                ${data.substr(0, 26)}
                                <br/>
                                ${data.substr(26, 25)}${data.length >= 51 ? '...' : ''}
                            </div>`
                }
            }, {
                targets: 4,
                render: function render(data, type, row, meta) {
                    return `<div data-bs-toggle="tooltip" data-bs-placement="top" title="${row.employee.nama}"> ${data} </div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    var _statusSurat
                    if (id_validator == 1) {
                        _statusSurat = row.validator_1
                    } else if (id_validator == 2) {
                        _statusSurat = row.validator_2
                    } else if (id_validator == 3) {
                        _statusSurat = row.validator_3
                    }
                    if (_statusSurat == 1) {
                        return `<span class="badge badge-soft-success rounded-pill">Diterima</span>`
                    } else if (_statusSurat == 0) {
                        return `<a type="button" class="alasan" data-bs-toggle="tooltip"          data-bs-placement="top" title="Alasan ditolak, klik untuk lebih lanjut." data-surat="${row.ditolak.alasan}">
                                    <span class="badge badge-soft-danger rounded-pill">Ditolak</span>
                                </a>`
                    } else {
                        return `<span class="badge badge-soft-warning rounded-pill">Belum Diverifikasi</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    return `<div class="row row-cols-sm-auto">
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.nomor_surat}|${row.sks_master_tendik}|${row.sks_pendidik}|${row.label_jabatan_tendik}|${row.label_jabatan_pendidik}|${row.id_rubrik_tendik}|${row.id_rubrik_pendidik}|${row.input3}|${row.input2}|${row.input0}|${row.label0}"
                                class="lihat_anggota text-reset font-16">
                                <i style="color: rgb(101,89,204);" class="ri-group-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Anggota Surat Dinas"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.file}"
                                class="lihat_surat text-reset font-16">
                                <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Lihat File"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${row.penginput.nama}|${row.unit.nama_unit}|${row.periode.nama_periode}|${row.nomor_surat}|Surat Keputusan|${row.tanggal_surat}|-|-|${row.topik}|${row.employee.nama}|${row.id_rubrik_tendik ? row.rubrik_tendik.kode_urut + ' ' + row.rubrik_tendik.rubrik : '-'}|${row.rubrik_pendidik ? row.rubrik_pendidik.kode_urut + ' ' + row.rubrik_pendidik.rubrik : '-'}|${row.id_rubrik_tendik ? row.sks_master_tendik : '-'}|${row.rubrik_pendidik ? row.sks_master_pendidik : '-'}|${row.approval ?? 0}"
                                class="info_surat text-reset font-16">
                                <i style="color: rgb(59,175,218);" class="ri-information-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Info Surat"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.nomor_surat}"
                                class="approve text-reset font-16">
                                <i style="color: rgb(26,188,156);" class="ri-check-double-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Verifikasi"></i>
                            </a>
                        </div>
                    </div>
                </div>`
                }
            }, {
                targets: 7,
                visible: false,
            }],
        "order": [[5, 'asc'], [0, 'dsc']]
    })

    tabelTugas.column(7).search($('#periode-tugas').val()).draw();
    tabelTugas.column(5).search($('#status-tugas').val()).draw();

    // periode
    $('#periode-tugas').on('change', function () {
        tabelTugas.column(7).search($(this).val()).draw();
    })

    // status
    $('#status-tugas').on('change', function () {
        tabelTugas.column(5).search($(this).val()).draw();
    })

    // unit
    // $('#unit-tugas').on('change', function () {
    //     tabelTugas.column(8).search($(this).val()).draw();
    // })

    // pemberian nomor
    tabelTugas.on('order.dt search.dt', function () {
        tabelTugas.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // inputan pencarian
    $('#input-search-tugas').keyup(function () {
        tabelTugas.search($(this).val()).draw()
    })

    // rubrik
    $(document).on('click', '.rubrik', function () {
        var data_surat = $(this).attr('data-surat')
        Swal.fire({
            text: data_surat,
            showConfirmButton: false,
        })
    })

    // lihat file
    $(document).on('click', '.lihat_surat', function () {
        var nama_surat = $(this).attr('data-surat').split('|')
        var data_surat = nama_surat[1].split('-')
        if (onTab == 'sk') {
            var surat = 'surat-keputusan'
        } else if (onTab == 'st') {
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

    // inisialisasi datatables tabel anggota
    var tabelAnggota = $('#tabel-anggota').DataTable({
        autoWidth: true,
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
        ajax: ``,

        columns: [{
            data: 'id',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'employee.nama',
            className: 'align-middle'
        }, {
            data: 'jabatan',
            className: 'align-middle'
        }, {
            data: 'sks',
            className: 'align-middle text-center'
        }, {
            data: 'status_anggota',
            className: 'align-middle text-center'
        }],
        columnDefs: [
            {
                targets: 4,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-success">Non Tupoksi (dibayarkan)</span>`
                    } else {
                        return `<span class="badge badge-soft-warning">Tupoksi (tidak dibayarkan)</span>`
                    }
                }
            }],
        "order": [[0, 'asc']]
    });

    // pemberian nomor
    tabelAnggota.on('order.dt search.dt', function () {
        tabelAnggota.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // inputan pencarian
    $('#input-search-anggota').keyup(function () {
        tabelAnggota.search($(this).val()).draw()
    })

    // tombol lihat Anggota
    $(document).on('click', '.lihat_anggota', function () {
        tabelAnggota.clear().draw();
        var data_surat = $(this).attr('data-surat').split('|')
        // console.log(data_surat)
        if (onTab == 'sk') {
            path = 'anggota-surat-keputusan'
        } else if (onTab == 'st') {
            path = 'anggota-surat-tugas'
        }
        tabelAnggota.ajax.url(`${window.location.origin}/${path}/${data_surat[0]}`).load();
        $('#modal-anggota .sub-header').html(`Nomor Surat :  ${data_surat[1]}`)
        $('#modal-anggota').modal('show')
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
        var status = data_surat[14]
        if (status == 1) {
            $('#status_surat_dinas').html('<i class="mdi mdi-check-all me-1"></i> Diterima')
            $('#status_surat_dinas').attr('class', 'ribbon ribbon-success float-start')
        } else if (status == 2) {
            $('#status_surat_dinas').html('<i class="mdi mdi-close-octagon-outline me-1"></i> Ditolak')
            $('#status_surat_dinas').attr('class', 'ribbon ribbon-danger float-start')
        } else {
            $('#status_surat_dinas').html('<i class="mdi mdi-alert-outline me-1"></i> Belum Diverifikasi')
            $('#status_surat_dinas').attr('class', 'ribbon ribbon-warning float-start')
        }
        var tanggal = data_surat[5].split('-')
        $('#tanggal_surat').html(`${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`)
        if (onTab == 'sk') {
            $('.suratKeputusan').show()
            $('#perihal').html(data_surat[6])
            $('#menetapkan').html(data_surat[7])
        } else if (onTab == 'st') {
            $('.suratTugas').show()
            $('#topik_penugasan').html(data_surat[8])
        }
        $('#pengesah').html(data_surat[9])
        $('#rubrik_tendik').html(`${data_surat[10]} / ${data_surat[12]}`)
        $('#rubrik_pendidik').html(`${data_surat[11]} / ${data_surat[13]}`)
        $('#modal').modal('show')
    })

    // tombol approval
    $(document).on('click', '.approve', function () {
        let data = $(this).attr('data-surat').split('|')
        // console.log(buttons)
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: `Memverifikasi surat dinas dengan nomor surat :  ${data[1]}!`,
            icon: 'warning',
            showCloseButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonColor: "#f1556c",
            confirmButtonColor: "#1abc9c",
            confirmButtonText: 'Terima!',
            cancelButtonText: 'Tolak!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: `${urlWindow}/${data[0]}|${onTab}`,
                    data: {
                        approval: 1,
                        alasan: ""
                    },
                    method: "PUT",
                    success: function (e) {
                        console.log(e)
                        Swal.fire('Diterima!', 'Surat Dinas Telah di terima.', 'success')
                        if (onTab == 'sk')
                            tabel.ajax.reload()
                        else
                            tabelTugas.ajax.reload()
                        suratDiterima()

                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    title: `Alasan Ditolak`,
                    input: 'textarea',
                    inputAttributes: {
                        autocapitalize: 'on'
                    },
                    inputPlaceholder: 'Masukkan alasan',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Harus mengisikan alasan!'
                        }
                    },
                    showCloseButton: true,
                    showCancelButton: true,
                    showConfirmButton: true,
                    cancelButtonColor: "#1abc9c",
                    confirmButtonColor: "#f1556c",
                    confirmButtonText: 'Tolak!',
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: `${urlWindow}/${data[0]}|${onTab}`,
                            data: {
                                approval: 0,
                                alasan: result.value
                            },
                            method: "PUT",
                            success: function (e) {
                                console.log(result.value)
                                Swal.fire('Ditolak!', 'Surat Dinas Telah ditolak.', 'success')
                                if (onTab == 'sk')
                                    tabel.ajax.reload()
                                else
                                    tabelTugas.ajax.reload()
                                suratDitolak()
                            },
                            error: function (e) {
                                console.log(e)
                            }
                        })
                    }
                })
            }
        })
    });

    // alasan
    $(document).on('click', '.alasan', function () {
        var data_surat = $(this).attr('data-surat')
        Swal.fire({
            title: 'Alasan Ditolak',
            text: data_surat,
            showConfirmButton: false,
        })
    })
})



