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
    function tambahData() {
        $.NotificationApp.send("Berhasil!", "Data telah ditambahkan", 'bottom-right', '#5ba035', 'success');
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
    const urlWindow = window.location.origin + "/pegawai/keanggotaan";

    var onTab = 'sk'

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
            data: 'surat_keputusan.nomor_surat',
            className: 'align-middle',
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'sks_dinilai',
            className: 'align-middle text-center'
        }, {
            data: 'status_anggota',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }, {
            data: 'surat_keputusan.id_periode',
        }],
        columnDefs: [
            {
                targets: 2,
                render: function render(data, type, row, meta) {
                    var rubrikDatatable = row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_keputusan.rubrik_tendik.kode_urut + ' ' + row.surat_keputusan.rubrik_tendik.rubrik : row.surat_keputusan.rubrik_pendidik.kode_urut + ' ' + row.surat_keputusan.rubrik_pendidik.rubrik
                    return `<a type="button" data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="top" title="${rubrikDatatable}" data-surat="${rubrikDatatable}"
                    class="rubrik text-reset">
                    ${row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_keputusan.rubrik_tendik.kode_urut : row.surat_keputusan.rubrik_pendidik.kode_urut}
                </a>`
                }
            }, {
                targets: 3,
                render: function render(data, type, row, meta) {
                    return `<div>${row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_keputusan.input2 ?? '-' : row.surat_keputusan.input3 ?? '-'}</div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-success">Non Tupoksi (dibayarkan)</span>`
                    } else {
                        return `<span class="badge badge-soft-warning">Tupoksi (tidak dibayarkan)</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    var jenisKepegawaian = row.employee.jenis_kepegawaian == 'pegawai'
                    var keaktifan
                    if (row.surat_keputusan.penilaian == null || row.surat_keputusan.penilaian.status == 0) {
                        keaktifan = 'Belum Dinilai'
                    } else {
                        if (row.nilai_keaktifan == 1.00) {
                            keaktifan = 'Sangat Baik'
                        } else if (row.nilai_keaktifan == 0.80) {
                            keaktifan = 'Baik'
                        } else if (row.nilai_keaktifan == 0.60) {
                            keaktifan = 'Cukup'
                        } else if (row.nilai_keaktifan == 0.40) {
                            keaktifan = 'Kurang'
                        } else if (row.nilai_keaktifan == 0.20) {
                            keaktifan = 'Sangat Kurang'
                        }
                    }
                    return ` <div class="row row-cols-sm-auto">
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_keputusan.file}"
                                            class="lihat_surat text-reset font-16">
                                            <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Lihat File"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_keputusan.id}|${row.surat_keputusan.nomor_surat}"
                                            class="lihat_anggota text-reset font-16">
                                            <i style="color: rgb(101,89,204);" class="ri-group-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Anggota Surat Dinas"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_keputusan.penginput.nama}|${row.surat_keputusan.unit.nama_unit}|${row.surat_keputusan.periode.nama_periode}|${row.surat_keputusan.nomor_surat}|Surat Keputusan|${row.surat_keputusan.tanggal_surat}|${row.surat_keputusan.perihal_surat}|${row.surat_keputusan.menetapkan}|-|${row.surat_keputusan.employee.nama}|${row.surat_keputusan.rubrik_tendik ? row.surat_keputusan.rubrik_tendik.kode_urut + ' ' + row.surat_keputusan.rubrik_tendik.rubrik : '-'}|${row.surat_keputusan.rubrik_pendidik ? row.surat_keputusan.rubrik_pendidik.kode_urut + ' ' + row.surat_keputusan.rubrik_pendidik.rubrik : '-'}|${row.surat_keputusan.sks_master_tendik ?? '-'}|${row.surat_keputusan.sks_master_pendidik ?? '-'}|${row.employee.nama}|${jenisKepegawaian ? row.surat_keputusan.rubrik_tendik.tipe : row.surat_keputusan.rubrik_pendidik.tipe}|${jenisKepegawaian ? row.surat_keputusan.input3 : row.surat_keputusan.input2}|${jenisKepegawaian ? row.surat_keputusan.rubrik_tendik.label_jabatan : row.surat_keputusan.rubrik_pendidik.label_jabatan}|${row.jabatan}|${row.sks}|${keaktifan}|${row.status_anggota}"
                                            class="info_surat text-reset font-16">
                                            <i style="color: rgb(59,175,218);" class="ri-information-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Info Surat"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>`
                }
            }, {
                targets: 7,
                visible: false,
            }],
        "order": [[0, 'dsc']]

    });

    tabel.columns(7).search($('#periode-keputusan').val()).draw();

    // periode
    $('#periode-keputusan').on('change', function () {
        tabel.columns(7).search($(this).val()).draw();
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

    // inisialisasi datatables surat tugas
    var tabelTugas = $('#tabel-surat-tugas').DataTable({
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
            data: 'surat_tugas.nomor_surat',
            className: 'align-middle',
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center'
        }, {
            data: 'sks_dinilai',
            className: 'align-middle text-center'
        }, {
            data: 'status_anggota',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }, {
            data: 'surat_tugas.id_periode',
        }],
        columnDefs: [
            {
                targets: 2,
                render: function render(data, type, row, meta) {
                    var rubrikDatatable = row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_tugas.rubrik_tendik.kode_urut + ' ' + row.surat_tugas.rubrik_tendik.rubrik : row.surat_tugas.rubrik_pendidik.kode_urut + ' ' + row.surat_tugas.rubrik_pendidik.rubrik
                    return `<a type="button" data-bs-container="#tooltip-container" data-bs-toggle="tooltip" data-bs-placement="top" title="${rubrikDatatable}" data-surat="${rubrikDatatable}"
                    class="rubrik text-reset">
                    ${row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_tugas.rubrik_tendik.kode_urut : row.surat_tugas.rubrik_pendidik.kode_urut}
                </a>`
                }
            }, {
                targets: 3,
                render: function render(data, type, row, meta) {
                    return `<div>${row.employee.jenis_kepegawaian == 'pegawai' ? row.surat_tugas.input2 ?? '-' : row.surat_tugas.input3 ?? '-'}</div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-success">Non Tupoksi (dibayarkan)</span>`
                    } else {
                        return `<span class="badge badge-soft-warning">Tupoksi (tidak dibayarkan)</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    var jenisKepegawaian = row.employee.jenis_kepegawaian == 'pegawai'
                    var keaktifan
                    if (row.surat_tugas.penilaian.status == 0) {
                        keaktifan = 'Belum Dinilai'
                    } else {
                        if (row.nilai_keaktifan == 1.00) {
                            keaktifan = 'Sangat Baik'
                        } else if (row.nilai_keaktifan == 0.80) {
                            keaktifan = 'Baik'
                        } else if (row.nilai_keaktifan == 0.60) {
                            keaktifan = 'Cukup'
                        } else if (row.nilai_keaktifan == 0.40) {
                            keaktifan = 'Kurang'
                        } else if (row.nilai_keaktifan == 0.20) {
                            keaktifan = 'Sangat Kurang'
                        }
                    }
                    return ` <div class="row row-cols-sm-auto">
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_tugas.file}"
                                            class="lihat_surat text-reset font-16">
                                            <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Lihat File"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_tugas.id}|${row.surat_tugas.nomor_surat}"
                                            class="lihat_anggota text-reset font-16">
                                            <i style="color: rgb(101,89,204);" class="ri-group-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Anggota Surat Dinas"></i>
                                        </a>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div id="tooltip-container">
                                        <a type="button" data-surat="${row.surat_tugas.penginput.nama}|${row.surat_tugas.unit.nama_unit}|${row.surat_tugas.periode.nama_periode}|${row.surat_tugas.nomor_surat}|Surat Tugas|${row.surat_tugas.tanggal_surat}|-|-|${row.surat_tugas.topik}|${row.surat_tugas.employee.nama}|${row.surat_tugas.rubrik_tendik ? row.surat_tugas.rubrik_tendik.kode_urut + ' ' + row.surat_tugas.rubrik_tendik.rubrik : '-'}|${row.surat_tugas.rubrik_pendidik ? row.surat_tugas.rubrik_pendidik.kode_urut + ' ' + row.surat_tugas.rubrik_pendidik.rubrik : '-'}|${row.surat_tugas.sks_master_tendik ?? '-'}|${row.surat_tugas.sks_master_pendidik ?? '-'}|${row.employee.nama}|${jenisKepegawaian ? row.surat_tugas.rubrik_tendik.tipe : row.surat_tugas.rubrik_pendidik.tipe}|${jenisKepegawaian ? row.surat_tugas.input3 : row.surat_tugas.input2}|${jenisKepegawaian ? row.surat_tugas.rubrik_tendik.label_jabatan : row.surat_tugas.rubrik_pendidik.label_jabatan}|${row.jabatan}|${row.sks}|${keaktifan}|${row.surat_tugas.label1 == 'Judul Buku' ? row.surat_tugas.label1 : '-'}|${row.surat_tugas.label1 == 'Judul Buku' ? row.surat_tugas.input1 : '-'}|${row.status_anggota}"
                                            class="info_surat text-reset font-16">
                                            <i style="color: rgb(59,175,218);" class="ri-information-line"
                                                data-bs-container="#tooltip-container"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                title="Info Surat"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>`
                }
            }, {
                targets: 7,
                visible: false,
            }],
        "order": [[0, 'dsc']]
    })

    tabelTugas.columns(7).search($('#periode-tugas').val()).draw();

    // periode
    $('#periode-tugas').on('change', function () {
        tabelTugas.columns(7).search($(this).val()).draw();
    })

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
        var nama_surat = $(this).attr('data-surat')
        var data_surat = $(this).attr('data-surat').split('-')
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
        // console.log(screen.availWidth)
        window.open(`${window.location.origin}/storage/file-surat-dinas/${surat}/${data_surat[2]}-${data_surat[3]}-${data_surat[4]}/${nama_surat}`, "kad", features);
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
        $('.trJabatan').hide()
        $('.trJudul').hide()

        var status
        var data_surat = $(this).attr('data-surat').split('|')
        $('#nama_penginput').html(data_surat[0])
        $('#unit').html(data_surat[1])
        $('#periode').html(data_surat[2])
        $('#nomor_surat').html(data_surat[3])
        $('#jenis_surat').html(data_surat[4])
        var tanggal = data_surat[5].split('-')
        $('#tanggal_surat').html(`${tanggal[2]}/${tanggal[1]}/${tanggal[0]}`)
        if (onTab == 'sk') {
            status = data_surat[21]
            $('.suratKeputusan').show()
            $('#perihal').html(data_surat[6])
            $('#menetapkan').html(data_surat[7])
        } else if (onTab == 'st') {
            status = data_surat[23]
            $('.suratTugas').show()
            $('#topik_penugasan').html(data_surat[8])
        }
        $('#pengesah').html(data_surat[9])
        $('#rubrik_tendik').html(`${data_surat[10]} / ${data_surat[12]}`)
        $('#rubrik_pendidik').html(`${data_surat[11]} / ${data_surat[13]}`)
        $('#nama_pegawai').html(data_surat[14])
        // console.log(data_surat[16])
        if (data_surat[15] == 8 || data_surat[15] == 12 || data_surat[15] == 13 && data_surat[16] != 'null') {
            $('.trTingkat').show()
            $('#tingkat').html(data_surat[16])
        }
        if (data_surat[17] != 'null') {
            $('.trJabatan').show()
            $('#label_jabatan').html(data_surat[17])
            $('#jabatan').html(data_surat[18])
        }
        if (data_surat[21] == 'Judul Buku' && data_surat[21] != 'null') {
            $('.trJudul').show()
            $('#label_judul').html(data_surat[21])
            $('#judul_buku').html(data_surat[22])
        }
        // console.log(status)
        var div_status = $('#status_anggota')
        if (status == 1) {
            div_status.html('<i class="mdi mdi-check-all me-1"></i> Non Tupoksi (dibayarkan)')
            div_status.attr('class', 'ribbon ribbon-success float-start')
        } else if (status == 0) {
            div_status.html('<i class="mdi mdi-close me-1"></i> Tupoksi (tidak dibayarkan)')
            div_status.attr('class', 'ribbon ribbon-warning float-start')
        }
        $('#sks').html(data_surat[19])
        $('#nilai_keaktifan').html(data_surat[20])

        // $('#sks_master').html(data_surat[11])
        $('#modal').modal('show')
    })

})



