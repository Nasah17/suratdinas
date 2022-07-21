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
    const urlWindow = window.location.origin + "/manajemen-surat-dinas/surat-dinas";

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
            data: 'approval',
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
                    if (data == 1) {
                        return `<span class="badge badge-soft-success rounded-pill">Diterima</span>`
                    } else if (data == 2) {
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
                    return `<div class="row">
                    <div class="col-${row.approval == 1 ? '6' : '3'}" ${row.approval == 1 ? '' : 'style="padding-right: 12px;padding-left: 5px;"'}>
                        <div id="tooltip-container">
                            <a type="button" data-surat="${data}|${row.nomor_surat}|${row.sks_master_tendik}|${row.sks_pendidik}|${row.label_jabatan_tendik}|${row.label_jabatan_pendidik}|${row.id_rubrik_tendik}|${row.id_rubrik_pendidik}|${row.input3}|${row.input2}|${row.input0}|${row.label0}|${row.approval}"
                                class="lihat_anggota text-reset font-16">
                                <i style="color: rgb(101,89,204);" class="ri-group-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Anggota Surat Dinas"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-${row.approval == 1 ? '6' : '3'}" ${row.approval == 1 ? '' : 'style="padding-right: 12px;padding-left: 5px;"'}>
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
                    ${row.approval != 1 ? `<div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <a type="button" id="${data}"
                            class="edit_data text-reset font-16">
                            <i style="color: rgb(247,184,75);" class="fe-edit"
                                data-bs-container="#tooltip-container"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Edit Data"></i>
                        </a>
                </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <a type="button" class="hapus text-reset font-16"
                            id="${data}">
                            <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                data-bs-container="#tooltip-container"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Hapus Data"></i>
                        </a>
                    </div>` : ''}
                </div>`
                }
            }, {
                targets: 7,
                visible: false,
            }],
        "order": [[5, 'asc'], [0, 'dsc']]

    })

    tabel.column(7).search($('#periode-keputusan').val()).draw();
    tabel.column(5).search($('#status-keputusan').val()).draw();

    // periode
    $('#periode-keputusan').on('change', function () {
        tabel.columns(7).search($(this).val()).draw();
    })

    // status
    $('#status-keputusan').on('change', function () {
        // tabel.column(5).search($(this).val()).draw();
        tabel.column(5).search($(this).val()).draw();
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
        processing: true,
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
            data: 'approval',
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
                    if (data == 1) {
                        return `<span class="badge badge-soft-success rounded-pill">Diterima</span>`
                    } else if (data == 2) {
                        return `<abbr><a type="button" class="alasan" data-bs-toggle="tooltip" data-bs-placement="top" title="Alasan ditolak, klik untuk lebih lanjut." data-surat="${row.ditolak.alasan}">
                        <span class="badge badge-soft-danger rounded-pill">Ditolak</span>
                    </a></abbr>`
                    } else {
                        return `<span class="badge badge-soft-warning rounded-pill">Belum Diverifikasi</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    return `<div class="row">
                    <div class="col-${row.approval == 1 ? '6' : '3'}" ${row.approval == 1 ? '' : 'style="padding-right: 12px;padding-left: 5px;"'}>
                            <a type="button" data-surat="${data}|${row.nomor_surat}|${row.sks_master_tendik}|${row.sks_pendidik}|${row.label_jabatan_tendik}|${row.label_jabatan_pendidik}|${row.id_rubrik_tendik}|${row.id_rubrik_pendidik}|${row.input3}|${row.input2}|${row.input0}|${row.label0}|${row.approval}"
                                class="lihat_anggota text-reset font-16">
                                <i style="color: rgb(101,89,204);" class="ri-group-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Anggota Surat Dinas"></i>
                            </a>
                    </div>
                    <div class="col-${row.approval == 1 ? '6' : '3'}" ${row.approval == 1 ? '' : 'style="padding-right: 12px;padding-left: 5px;"'}>
                            <a type="button" data-surat="${data}|${row.file}"
                                class="lihat_surat text-reset font-16">
                                <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Lihat File"></i>
                            </a>
                        </div>
                    ${row.approval != 1 ? `<div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <a type="button" id="${data}"
                            class="edit_data text-reset font-16">
                            <i style="color: rgb(247,184,75);" class="fe-edit"
                                data-bs-container="#tooltip-container"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Edit Data"></i>
                        </a>
                </div>
                    <div class="col-3" style="padding-right: 12px;padding-left: 5px;">
                        <a type="button" class="hapus text-reset font-16"
                            id="${data}">
                            <i style="color: rgb(235,81,81);" class="fe-trash-2"
                                data-bs-container="#tooltip-container"
                                data-bs-toggle="tooltip" data-bs-placement="top"
                                title="Hapus Data"></i>
                        </a>
                    </div>` : ''}
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

    // inisialisasi selectize
    var $jenis = $('.jenis').selectize({
        hideSelected: false,
        onChange: function (value) {
            $('.nomor-surat').hide()
            $('.tanggal-surat').hide()
            $('.perihal-surat').hide()
            $('.topik-penugasan').hide()
            $('.menetapkan').hide()
            $('.pengesah').hide()
            $('.file-surat').hide()
            if (value == 1) {
                $('.nomor-surat').fadeIn(250)
                $('.tanggal-surat').fadeIn(500)
                $('.perihal-surat').fadeIn(750)
                $('.menetapkan').fadeIn(1000)
                $('.pengesah').fadeIn(1250)
                $('.file-surat').fadeIn(1500)
            } else if (value == 2) {
                $('.nomor-surat').fadeIn(250)
                $('.tanggal-surat').fadeIn(500)
                $('.topik-penugasan').fadeIn(750)
                $('.pengesah').fadeIn(1000)
                $('.file-surat').fadeIn(1250)
            }
        }
    })
    var $buktiKinerjaTendik = $('#lblbuktiKinerjaTendik').selectize();
    var $rubrikTendik = $('.rubrik-tendik').selectize({
        hideSelected: false,
        onChange: function (value) {
            if (value != '') {
                $('body').loadingModal({ text: 'Memuat Inputan Rubrik <br/> Tenaga Kependidikan' }).loadingModal('animation', 'fadingCircle').loadingModal('backgroundColor', 'black')
            }

            $('#form_show_tendik').hide();
            $("#divTingkatTendik").hide()
            $('#divSksTendik').hide()
            $('#divbuktiKinerjaTendik').hide();
            $('#tipeTendik').val("");
            $('#sksTendik').val("");
            $('#sks_masterTendik').val("");
            $('#label_jabatan_tendik').val("");
            $("#lbltingkatTendik").val("");
            $.ajax({
                url: `${window.location.origin}/get-rubrik-dosen`,
                type: "POST",
                dataType: "JSON",
                data: `id=${value}`,
                cache: false,
                success: function (data) {
                    let tipe = data.tipe;
                    $('#tipeTendik').val(tipe);
                    $('#sksTendik').val(data.sks);
                    $('#sks_masterTendik').val(data.sks);
                    $('#label_jabatan_tendik').val(data.label_jabatan);
                    // $("[for=jabatanKinerjaTendik]").html(data.label_jabatan);
                    $('#form_show_tendik').fadeIn();
                    $('#divSksTendik').fadeIn()

                    var bukti = data['bukti_kinerja'].split("|");
                    var selectize = $buktiKinerjaTendik[0].selectize;
                    selectize.clear()
                    selectize.clearOptions()
                    for (let index = 0; index < bukti.length; index++) {
                        selectize.addOption({ value: bukti[index], text: bukti[index] });
                    }

                    $('#divbuktiKinerjaTendik').fadeIn();

                    if (data.tipe == 8) {
                        getTingkatRubrikTendik(data.kode_jabatan);
                    } else if (data.tipe == 13) {
                        getTingkatRubrikTendik(data.kode_jabatan);
                    }
                    $('body').loadingModal('destroy')
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })
    var $buktiKinerja = $('#lblbuktiKinerja').selectize();
    var $rubrikPendidik = $('.rubrik-pendidik').selectize({
        hideSelected: false,
        onChange: function (value) {
            // console.log(value)
            if (value != '')
                $('body').loadingModal({ text: 'Memuat Inputan Rubrik <br/> Pendidik' }).loadingModal('animation', 'fadingCircle').loadingModal('backgroundColor', 'black')

            $('#form_show_pendidik').hide();
            $("#divInput0").hide()
            $("#divInput1").hide()
            $("#divInput2").hide()
            $("#divInput3").hide()
            $("#divInput4").hide()
            $("#divTingkat").hide()
            $('#divSks').hide()
            $('#divbuktiKinerja').hide();
            $('#tipe').val("");
            $("#input0").val("");
            $("#input1").val("");
            $("#input2").val("");
            $("#input3").val("");
            $("#input4").val("");
            $('#sks').val("");
            $('#sks_master').val("");
            $('#label_jabatan_pendidik').val("");
            $.ajax({
                url: `${window.location.origin}/get-rubrik-dosen`,
                type: "POST",
                dataType: "JSON",
                data: `id=${value}`,
                cache: false,
                success: function (data) {
                    let tipe = data.tipe;
                    $('#tipe').val(tipe);
                    $('#sks').val(data.sks);
                    $('#sks_master').val(data.sks);
                    $('#label_jabatan_pendidik').val(data.label_jabatan);
                    // $("[for=jabatanKinerja]").html(data.label_jabatan);
                    $('#form_show_pendidik').fadeIn();
                    $('#divSks').fadeIn()

                    var input = [];
                    if (data['inputan'] != null)
                        input = data['inputan'].split("|");
                    for (let index = 0; index < 5; index++) {
                        $('#divInput' + index).fadeIn();
                        if (typeof input[index] === 'undefined')
                            $('#divInput' + index).hide();
                        $("[for=input" + index + "]").html(`${input[index]}
                        <span class="text-danger">*</span></label>`);
                    }

                    // $('#divJabatan').fadeOut();
                    // $('#divTingkat').fadeOut();
                    // $('#divSebagai').fadeOut();
                    $('#divbuktiKinerja').fadeIn();

                    var bukti = data['bukti_kinerja'].split("|");
                    var selectize = $buktiKinerja[0].selectize;
                    selectize.clear()
                    selectize.clearOptions()
                    for (let index = 0; index < bukti.length; index++) {
                        selectize.addOption({ value: bukti[index], text: bukti[index] });
                    }

                    // kodeJabatan = data.label_jabatan

                    if (data.tipe == 3) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 4) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 5) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 6) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 7) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 8) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                        var b = getTingkatRubrik(data.kode_jabatan);
                    } else if (data.tipe == 10) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 11) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                    } else if (data.tipe == 12) {
                        // var a = getJabatanRubrik(data.kode_jabatan, data.label_jabatan);
                        var b = getTingkatRubrik(data.kode_jabatan);
                    }
                    $('body').loadingModal('destroy')
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
    })
    var $pengesah = $('[data-pegawai=unm]').selectize({
        hideSelected: false,
    })
    var $periode = $('.periode').selectize({
        hideSelected: false,
    })
    var $tingkat = $('#lbltingkat').selectize();
    var $tingkatTendik = $('#lbltingkatTendik').selectize();

    var i = 1;

    function getJabatanRubrik(kode_jabatan, label, banding = null) {
        kodeJabatan = kode_jabatan
        $.ajax({
            type: "POST",
            url: `${window.location.origin}/get-jabatan-rubrik`,
            dataType: "JSON",
            data: `kode_jabatan=${kode_jabatan}`,
            cache: false,
            success: function (data1) {
                console.log(data1)
                $('#divJabatan').fadeIn();
                var $jabatanKinerja = $('[data-pegawai=jabatan]').selectize();
                var selectize = $jabatanKinerja[0].selectize;
                selectize.clearOptions()
                for (let index = 0; index < data1.length; index++) {
                    if (banding == data1[index]['Jabatan'])
                        selectize.addOption({ value: `${data1[index]['id']}|${data1[index]['sks']}|${data1[index]['Jabatan']}`, text: data1[index]['Jabatan'] })
                    else
                        selectize.addOption({ value: `${data1[index]['id']}|${data1[index]['sks']}|${data1[index]['Jabatan']}`, text: data1[index]['Jabatan'] })
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
        return false;
    }

    function getTingkatRubrik(kode_jabatan, banding = null, tipe = null) {
        $.ajax({
            type: "POST",
            url: `${window.location.origin}/get-jabatan-rubrik`,
            dataType: "JSON",
            data: `kode_jabatan=${kode_jabatan}`,
            cache: false,
            success: function (data1) {

                $('#divTingkat').fadeIn();
                var selectize = $tingkat[0].selectize;
                selectize.clear()
                selectize.clearOptions()
                for (let index = 0; index < data1.length; index++) {
                    if (banding == data1[index]['jabatan'])
                        selectize.addOption({ value: data1[index]['tingkat'], text: data1[index]['tingkat'] })
                    else
                        selectize.addOption({ value: data1[index]['tingkat'], text: data1[index]['tingkat'] })
                }

                if (tipe == 12 && tingkat == "Universitas") {
                    $('#divSebagai').fadeIn();
                    var ddlJenis = document.getElementById('sebagai');
                    $(ddlJenis).empty();
                    $(ddlJenis).materialSelect('destroy');
                    $(ddlJenis).append('<option value="" selected disabled>Pilih Data</option>');
                    if (jabatan == "Ketua") {
                        $(ddlJenis).append('<option value="1.5|Ketua Tim Teknis">Ketua Tim Teknis</option>');
                        $(ddlJenis).append('<option value="2|Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP">Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP</option>');
                    } else if (jabatan == "Sekertaris") {
                        $(ddlJenis).append('<option value="3|Sekretaris senat Universitas">Sekretaris senat Universitas</option>');
                        $(ddlJenis).append('<option value="2|Sekretaris SPI">Sekretaris SPI</option>');
                    } else if (jabatan == "Anggota") {
                        $(ddlJenis).append('<option value="2|Anggota senat Universitas">Anggota senat Universitas</option>');
                        $(ddlJenis).append('<option value="1|Tim Teknis Rektor/Wakil Rektor">Tim Teknis Rektor/Wakil Rektor </option>');
                        $(ddlJenis).append('<option value="0.75|Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya">Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya</option>');
                    }
                    $(ddlJenis).materialSelect();
                }
            }
        });
        return false;
    }

    function getTingkatRubrikTendik(kode_jabatan) {
        $.ajax({
            type: "POST",
            url: `${window.location.origin}/get-jabatan-rubrik`,
            dataType: "JSON",
            data: ({ kode_jabatan }),
            cache: false,
            success: function (data1) {

                $('#divTingkatTendik').fadeIn();

                var selectize = $tingkatTendik[0].selectize;
                selectize.clear()
                selectize.clearOptions()
                for (let index = 0; index < data1.length; index++) {
                    selectize.addOption({ value: data1[index]['tingkat'], text: data1[index]['tingkat'] })
                }
            }
        });
        return false;
    }

    var tipe
    var jabatan

    $('#jabatanKinerja').change(function () {
        var value = $(this).val();
        var a = value.split("|");

        tipe = $("#tipe").val();
        if (tipe == 8 || tipe == 12) {
            jabatan = a[2];
            tingkat = $("#tingkat").val();
            if (tingkat != "") {
                $.ajax({
                    type: "POST",
                    url: `${window.location.origin}/get-sks-jabatan`,
                    dataType: "JSON",
                    data: ({
                        jabatan,
                        tingkat
                    }),
                    cache: false,
                    success: function (data1) {
                        console.log(data1[0]['sks']);
                        $('#sks').val(data1[0]['sks']);
                        $('#sks_master').val(data1[0]['sks']);
                    }
                });

            }

        } else {
            if (a[1] != 'null') {
                $('#sks').val(a[1]);
                $('#sks_master').val(a[1]);
            }
        }
        return false;
    });
    $('#tingkat').change(function () {
        $('#divSebagai').fadeOut();
        var value = $("#jabatanKinerja").val();
        if (value != "") {
            var a = value.split("|");

            var tipe = $("#tipe").val();
            if (tipe == 8 || tipe == 12) {
                var jabatan = a[2];
                var tingkat = $("#tingkat").val();
                if (tingkat != "") {
                    $.ajax({
                        type: "POST",
                        url: `${window.location.origin}/get-sks-jabatan`,
                        dataType: "JSON",
                        data: ({
                            jabatan,
                            tingkat
                        }),
                        cache: false,
                        success: function (data1) {
                            $('#sks').val(data1[0]['sks']);
                            $('#sks_master').val(data1[0]['sks']);
                            for (let index = 0; index <= i; index++) {
                                $(`#sks${i}`).val(data1[0]['sks']);
                                $(`#sks_master${i}`).val(data1[0]['sks']);
                            }
                        }
                    });

                }
                if (tipe == 12 && tingkat == "Universitas") {
                    $('#divSebagai').fadeIn();
                    var ddlJenis = document.getElementById('sebagai');
                    $(ddlJenis).empty();
                    $(ddlJenis).materialSelect('destroy');
                    $(ddlJenis).append('<option value="" selected disabled>Pilih Data</option>');
                    if (jabatan == "Ketua") {
                        $(ddlJenis).append('<option value="1.5|Ketua Tim Teknis">Ketua Tim Teknis</option>');
                        $(ddlJenis).append('<option value="2|Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP">Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP</option>');
                    } else if (jabatan == "Sekertaris") {
                        $(ddlJenis).append('<option value="3|Sekretaris senat Universitas">Sekretaris senat Universitas</option>');
                        $(ddlJenis).append('<option value="2|Sekretaris SPI">Sekretaris SPI</option>');
                    } else if (jabatan == "Anggota") {
                        $(ddlJenis).append('<option value="2|Anggota senat Universitas">Anggota senat Universitas</option>');
                        $(ddlJenis).append('<option value="1|Tim Teknis Rektor/Wakil Rektor">Tim Teknis Rektor/Wakil Rektor </option>');
                        $(ddlJenis).append('<option value="0.75|Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya">Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya</option>');
                    }
                    $(ddlJenis).materialSelect();
                }
            }
        }
        return false;
    });
    $('#sebagai').change(function () {
        var data = $("#lblsebagai").val();
        var a = data.split("|");
        $('#sks').val(a[0]);
        $('#sks_master').val(a[0]);

        return false;
    });

    // tombol tambah data
    $(document).on('click', '.tambah-data', function () {
        $('.nomor-surat').hide()
        $('.tanggal-surat').hide()
        $('.perihal-surat').hide()
        $('.topik-penugasan').hide()
        $('.menetapkan').hide()
        $('.pengesah').hide()
        $('.file-surat').hide()
        $('[style="font-size: 12px"]').remove();
        var jenis = $jenis[0].selectize;
        jenis.clear()
        var selectizeTendik = $rubrikTendik[0].selectize;
        selectizeTendik.clear()
        var selectizePendidik = $rubrikPendidik[0].selectize;
        selectizePendidik.clear()
        $('#form_show_pendidik').hide();
        $('#form_show_tendik').hide();
        $('#modal h4.modal-title').html('Tambah Surat Dinas')
        $('#form-modal-add')[0].reset()
        $('#id_surat').val('')
        // $('#form-modal-add').attr('jenis', 'add')
        $('#modal').modal('show')
    })

    // tombol edit data
    $(document).on('click', '.edit_data', function () {
        $('[style="font-size: 12px"]').remove();
        $('#modal h4.modal-title').html('Edit Surat Dinas')
        $('#form-modal-add')[0].reset();
        // $('#form-modal-add').attr('jenis', 'edit')
        var id = $(this).attr("id");
        $('#id_surat').val(id)
        // console.log(onTab)
        $.ajax({
            url: `${urlWindow}/${id}|${onTab}/edit`,
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data);
                $('#tipe').val(data.tipe);
                $('#tipeTendik').val(data.tipeTendik);
                var periode = $periode[0].selectize;
                periode.setValue(data.periode)
                var jenis = $jenis[0].selectize;
                jenis.setValue(data.jenis_surat)
                var selectizePendidik = $rubrikPendidik[0].selectize;
                selectizePendidik.setValue(data.rubrik_pendidik)
                $('#id_rubrik_pendidik').val(data.rubrik_pendidik)
                var selectizeTendik = $rubrikTendik[0].selectize;
                selectizeTendik.setValue(data.rubrik_tendik)
                $('#id_rubrik_tendik').val(data.rubrik_tendik)
                $('#lblnomor_surat').val(data.nomor_surat);
                $('#val_tanggal_surat').val(data.tanggal_surat);
                $('#perihal_surat').val(data.perihal_surat ?? '');
                $('#topik').val(data.topik ?? '');
                $('#menetapkan').val(data.menetapkan ?? '');
                var pengesah = $pengesah[0].selectize;
                pengesah.setValue(data.pengesah)
                setTimeout(function () {
                    $('#input0').val(data.input0);
                    $('#input1').val(data.input1);
                    var tingkat = $tingkat[0].selectize;
                    tingkat.setValue(data.tingkat)
                    var tingkatTendik = $tingkatTendik[0].selectize;
                    tingkatTendik.setValue(data.tingkatTendik)
                    var buktiKinerja = $buktiKinerja[0].selectize;
                    buktiKinerja.setValue(data.buktiKinerja)
                    var buktiKinerjaTendik = $buktiKinerjaTendik[0].selectize;
                    buktiKinerjaTendik.setValue(data.buktiKinerjaTendik)
                    $('#modal').modal('show')
                }, 3000)
            }
        })
    })

    // Alert edit rubrik
    $('.rubrik-tendik').click(function () {
        if ($('#id_surat').val()) {
            Swal.fire({
                title: "Peringatan!",
                text: "Mengganti rubrik akan mereset anggota yang telah ditambahkan.",
                icon: "warning",
                confirmButtonColor: "#3bafda",
            })
        }
    })
    $('.rubrik-pendidik').click(function () {
        if ($('#id_surat').val()) {
            Swal.fire({
                title: "Peringatan!",
                text: "Mengganti rubrik akan mereset anggota yang telah ditambahkan.",
                icon: "warning",
                confirmButtonColor: "#3bafda",
            })
        }
    })

    // add data
    $('#form-modal-add').on('submit', function (event) {
        event.preventDefault()
        $(this).find('[style="font-size: 12px"]').remove();
        var formData = new FormData(this)
        $.ajax({
            headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
            processData: false,
            contentType: false,
            url: `${urlWindow}`,
            method: 'POST',
            data: formData,
            beforeSend: function () {
                $('#btn-add').attr('disabled', '')
                $('#btn-add').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            },
            success: function (data) {
                console.log(data)

                tabel.ajax.reload()
                tabelTugas.ajax.reload()
                $('#modal').modal('hide')
                $('#btn-add').removeAttr('disabled')
                $('#btn-add').html('Simpan')
                if ($('#id_surat').val()) {
                    editData()
                } else {
                    tambahData()
                }
            },
            error: function (xhr) {
                // console.log(xhr)
                $('#btn-add').removeAttr('disabled')
                $('#btn-add').html('Simpan')
                let response = xhr.responseJSON
                if ($.isEmptyObject(response) == false) {
                    $.each(response.errors, (key, value) => {
                        $('#' + key).after('<div style="font-size: 12px" class="text-danger">  ' + value + '</div>')
                    })
                }
            }
        })
    })

    // tombol hapus
    $(document).on('click', 'div.row a.hapus', function () {
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
                    url: `${urlWindow}/${idData}|${onTab}`,
                    method: "DELETE",
                    success: function (e) {
                        console.log(e)
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
                if (onTab == 'sk') {
                    tabel.row($(this).parents('tr')).remove().draw();
                } else if (onTab == 'st') {
                    tabelTugas.row($(this).parents('tr')).remove().draw();
                }
                Swal.fire('Telah dihapus!', 'Data telah dihapus.', 'success'
                )
                hapusData()
            }
        })
    });

    // tombol tambah Anggota
    $(document).on('click', '.tambah_anggota', function () {
        $('#tbody-tendik').html("");
        $('#tbody-pendidik').html("");
        $('[style="font-size: 12px"]').html('')
        if ($('div.div_input_awal_tendik').length < 1) {
            inputanTendik = false
        } else {
            inputanTendik = true
            // jumlahInput++
        }
        if ($('div.div_input_awal_pendidik').length < 1) {
            inputanPendidik = false
        } else {
            inputanPendidik = true
            jumlahInput++
        }
        console.log(jumlahInput)

        i = 0
        iPendidik = 0
        var status = $status[0].selectize;
        status.clear()
        var status = $status[1].selectize;
        status.clear()
        var dataPegawaiTendik = $dataPegawaiTendik[0].selectize;
        dataPegawaiTendik.clear()
        var dataPegawaiPendidik = $dataPegawaiPendidik[0].selectize;
        dataPegawaiPendidik.clear()
        var jabatanKinerjaTendik = $jabatanKinerjaTendik[0].selectize;
        jabatanKinerjaTendik.clear()
        var sebagaiPendidikS = $sebagaiPendidik[0].selectize;
        sebagaiPendidikS.clear()
        var jabatanKinerjaPendidik = $jabatanKinerjaPendidik[0].selectize;
        jabatanKinerjaPendidik.clear()
        jumlahInput = 1

        if (labelInput != 'Jumlah Anggota' || tabelAnggota.data().count() < jumlahInputMax) {
            jumlahInput = tabelAnggota.data().count() + 1
            console.log(jumlahInput)
            console.log(jumlahInputMax)
            $('#modal-anggota').modal('hide')
            $('#modal-tambah-anggota').modal('show')
        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Jumlah anggota telah mencapai batas maksimal!.",
                icon: "warning",
                confirmButtonColor: "#3bafda",
            })
        }
    })

    var iPendidik = 1
    var arrayI = []
    var sks_tendik = "0.00"
    var sks_pendidik = "0.00"
    var id_rubrik_tendik
    var id_rubrik_pendidik
    var tingkat_tendik
    var tingkat_pendidik
    var jabatanTendik = false
    var jabatanPendidik = false
    var sebagaiTendik = false
    var sebagaiPendidik = false
    var jumlah = 1
    var jumlahInput = 0
    var jumlahInputMax
    var labelInput
    var valueJabatanTendik
    var valueJabatanPendidik
    var inputanTendik = false
    var inputanPendidik = false
    //  data-surat="${data}|${row.nomor_surat}|${row.sks_master_tendik}|${row.sks_master_pendidik}|${row.label_jabatan_tendik}|${row.label_jabatan_pendidik}|${row.id_rubrik_tendik}|${row.id_rubrik_pendidik}|${row.input3}|${row.input2}"

    var $status = $('[status="dibayarkan"]').selectize();
    var $dataPegawaiTendik = $('[data-pegawai="tendik"]').selectize();
    var $dataPegawaiPendidik = $('[data-pegawai="pendidik"]').selectize();
    var $jabatanKinerjaTendik = $('[data-pegawai=jabatan_tendik]').selectize({
        onChange: function (value) {
            var a = value.split('|')
            $('#sks_master_tendik').val(a[1])
        }
    });
    var $sebagaiPendidik = $('[data-pegawai="sebagai_pendidik"]').selectize({
        onChange: function (value) {
            var a = value.split('|')
            $('#sks_master_pendidik').val(a[0])
        }
    });
    var $jabatanKinerjaPendidik = $('[data-pegawai=jabatan_pendidik]').selectize({
        onChange: function (value) {
            var a = value.split('|')
            if (sebagaiPendidik) {
                var sPendidik = $sebagaiPendidik[0].selectize;
                sPendidik.clear()
                sPendidik.clearOptions()
                if (a[2] == "Ketua") {
                    sPendidik.addOption({ value: `1.50|Ketua Tim Teknis`, text: `Ketua Tim Teknis` })
                    sPendidik.addOption({ value: `2.00|Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP`, text: `Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP` })
                } else if (a[2] == "Sekertaris") {
                    sPendidik.addOption({ value: `3.00|Sekretaris senat Universitas`, text: `Sekretaris senat Universitas` })
                    sPendidik.addOption({ value: `2.00|Sekretaris SPI`, text: `Sekretaris SPI` })
                } else if (a[2] == "Anggota") {
                    sPendidik.addOption({ value: `2.00|Anggota senat Universitas`, text: `Anggota senat Universitas` })
                    sPendidik.addOption({ value: `1.00|Tim Teknis Rektor/Wakil Rektor`, text: `Tim Teknis Rektor/Wakil Rektor` })
                    sPendidik.addOption({ value: `0.75|Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya`, text: `Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya` })
                }
            } else {
                valSks = a[1] * jumlah
                $('#sks_master_pendidik').val(valSks)
            }
        }
    });

    // tombol lihat Anggota
    $(document).on('click', '.lihat_anggota', function () {
        tabelAnggota.clear().draw();
        jabatanTendik = false
        sebagaiTendik = false
        jabatanPendidik = false
        sebagaiPendidik = false
        var data_surat = $(this).attr('data-surat').split('|')
        if (onTab == 'sk') {
            path = 'anggota-surat-keputusan'
        } else if (onTab == 'st') {
            path = 'anggota-surat-tugas'
        }
        tabelAnggota.ajax.url(`${window.location.origin}/${path}/${data_surat[0]}`).load();
        sks_tendik = data_surat[2]
        sks_pendidik = data_surat[3]
        id_rubrik_tendik = data_surat[6]
        id_rubrik_pendidik = data_surat[7]
        tingkat_tendik = data_surat[8]
        tingkat_pendidik = data_surat[9]
        labelInput = data_surat[11]
        // console.log(data_surat[3])
        $('#divAnggotaTendik').show()
        $('#divAnggotaPendidik').show()
        $('#divTombolTambahAnggota').show()
        $('[name="id_rubrik_tendik"]').val(id_rubrik_tendik)
        $('[name="id_rubrik_pendidik"]').val(id_rubrik_pendidik)
        if (id_rubrik_tendik == 'null') {
            $('#divAnggotaTendik').hide()
        } else if (id_rubrik_pendidik == 'null') {
            $('#divAnggotaPendidik').hide()
        }
        var column = tabelAnggota.column(5);
        column.visible(true);
        if (data_surat[12] == 1) {
            column.visible(!column.visible());
            $('#divTombolTambahAnggota').hide()
        }
        if (labelInput == 'Jumlah Anggota') {
            jumlahInputMax = data_surat[10]
        }
        jumlah = data_surat[10] != 'null' ? data_surat[10] : 1
        // console.log(jumlah)
        $('#sks_master_tendik').val(data_surat[2])
        $('#sks_master_pendidik').val(data_surat[3])
        $('#surat_anggota').val(`${data_surat[0]}|${onTab}`)
        $('[show="jabatan_tendik"]').hide()
        $('[show="sebagai_tendik"]').hide()
        $('[show="jabatan_pendidik"]').hide()
        $('[show="sebagai_pendidik"]').hide()
        // console.log(data_surat[8])
        if (data_surat[4] != 'null') {
            $('[show="jabatan_tendik"]').show()
            jabatanTendik = true
            $.ajax({
                url: `${window.location.origin}/get-jabatan-anggota`,
                method: 'POST',
                data: ({
                    id_rubrik: data_surat[6],
                    tingkat: data_surat[8]
                }),
                success: function (data) {
                    console.log(data)
                    var selectize = $jabatanKinerjaTendik[0].selectize;
                    selectize.clearOptions()
                    for (let index = 0; index < data['jabatan'].length; index++) {
                        selectize.addOption({ value: `${data['jabatan'][index]['id']}|${data['jabatan'][index]['sks']}|${data['jabatan'][index]['Jabatan']}`, text: data['jabatan'][index]['Jabatan'] })
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
        if (data_surat[5] != 'null') {
            $('[show="jabatan_pendidik"]').show()
            jabatanPendidik = true
            $.ajax({
                url: `${window.location.origin}/get-jabatan-anggota`,
                method: 'POST',
                data: ({
                    id_rubrik: data_surat[7],
                    tingkat: data_surat[9]
                }),
                success: function (data) {
                    // console.log(data)
                    var selectize = $jabatanKinerjaPendidik[0].selectize;
                    selectize.clearOptions()
                    for (let index = 0; index < data['jabatan'].length; index++) {
                        selectize.addOption({ value: `${data['jabatan'][index]['id']}|${data['jabatan'][index]['sks']}|${data['jabatan'][index]['Jabatan']}`, text: data['jabatan'][index]['Jabatan'] })
                    }
                    if (data['tipe'] == 12 && data_surat[9] == 'Universitas') {
                        sebagaiPendidik = true
                        $('[show="sebagai_pendidik"]').show()
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            })
        }
        $('[name="status_jabatan_tendik"]').val(jabatanTendik)
        $('[name="status_sebagai_tendik"]').val(sebagaiTendik)
        $('[name="status_jabatan_pendidik"]').val(jabatanPendidik)
        $('[name="status_sebagai_pendidik"]').val(sebagaiPendidik)
        // if (sebagaiPendidik)
        //     console.log('true')
        $('#modal-anggota .sub-header').html(`Surat Dinas Dengan Nomor Surat :  ${data_surat[1]}`)
        $('#modal-anggota').modal('show')
    })

    // inisialisasi datatables
    var tabelAnggota = $('#tabel-anggota').DataTable({
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
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }],
        columnDefs: [
            {
                targets: 2,
                render: function render(data, type, row, meta) {
                    return data ?? '-'
                }
            }, {
                targets: 4,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-success">Non Tupoksi (dibayarkan)</span>`
                    } else {
                        return `<span class="badge badge-soft-warning">Tupoksi (tidak dibayarkan)</span>`
                    }
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    return `<div class="row row-cols-sm-auto">
                                <div class="col-12">
                                    <div id="tooltip-container">
                                        <a type="submit" class="hapus-anggota text-reset font-16"
                                            data-anggota="${onTab}|${data}|${row.nip}|${row.employee.nidn}|${row.id_surat}">
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

    // tombol hapus anggota
    $(document).on('click', 'div.row a.hapus-anggota', function () {
        let data = $(this).attr('data-anggota')
        // console.log(data)
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
                    url: `${window.location.origin}/anggota-surat-dinas/${data}`,
                    method: "DELETE",
                    success: function (e) {
                        console.log(e)
                    },
                    error: function (e) {
                        console.log(e)
                    }
                })
                tabelAnggota.row($(this).parents('tr')).remove().draw();
                Swal.fire('Telah dihapus!', 'Data telah dihapus.', 'success'
                )
                hapusData()
            }
        })
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

    // lihat file
    $(document).on('click', '.lihat_surat', function () {
        var data_surat = $(this).attr('data-surat').split('|')
        var nama_surat = data_surat[1].split('-')
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
        window.open(`${window.location.origin}/storage/file-surat-dinas/${surat}/${nama_surat[2]}-${nama_surat[3]}-${nama_surat[4]}/${data_surat[1]}`, "kad", features);
    })
    // tombol  tambah field anggota surat dinas.
    $('#btn-add-tendik').click(function () {
        // jumlahInput++
        if (!inputanTendik) {
            inputanTendik = true
        } else {
            i++;
        }
        console.log(i)
        $('#tbody-tendik').append(`<div class="div_input_tendik">
        <div class="row">
            <div class="col-md-6">
                <div class="mb-2">
                    <label class="form-label" for="pegawai_tendik${i}">
                        Nama
                        <span class="text-danger">*</span>
                    </label>
                    <select id="pegawai_tendik${i}" data-pegawai="tendik" name="pegawai_tendik[]"
                        placeholder="Pilih Nama Pegawai...">
                        <option value=""></option>
                    </select>
                    <div message="pegawai_tendik[]" style="font-size: 12px"
                        class="text-danger"></div>
                </div>
            </div>
            <div class="col-md-6" show="jabatan_tendik" ${jabatanTendik ? '' : 'style="display: none;"'}>
                <div class="mb-2">
                    <label class="form-label" for="jabatanKinerjaTendik${i}">
                        Jabatan
                        <span class="text-danger">*</span>
                    </label>
                    <select id="jabatanKinerjaTendik${i}" class="jabatan_tendik" data-pegawai="jabatan_tendik"
                        name="jabatanKinerjaTendik[]" placeholder="Pilih Jabatan Kinerja...">
                        <option value=""></option>
                    </select>
                    <div message="jabatanKinerjaTendik[]" style="font-size: 12px"
                        class="text-danger"></div>
                </div>
            </div>
            <div class="col-md-6" show="sebagai_tendik" style="display: none">
                <div class="mb-2">
                    <label class="form-label" for="sebagaiTendik${i}">
                        Sebagai
                        <span class="text-danger">*</span>
                    </label>
                    <select id="sebagaiTendik${i}" data-pegawai="sebagai_tendik" name="sebagaiTendik[]"
                        placeholder="Pilih Sebagai...">
                        <option value=""></option>
                    </select>
                    <div message="sebagaiTendik[]" style="font-size: 12px"
                        class="text-danger"></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-2">
                    <label class="form-label" for="sks_master_tendik${i}">
                        SKS / Poin Kinerja
                    </label>
                    <input type="hidden" class="form-control" id="sks_tendik${i}"
                        name="sks_tendik[]" readonly placeholder="SKS">
                    <input type="text" class="sks_master_tendik form-control" id="sks_master_tendik${i}"
                        name="sks_master_tendik[]" readonly placeholder="..." value="${sks_tendik}">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-2">
                    <label class="form-label" for="status_dibayarkan_tendik${i}">
                        Status Anggota
                        <span class="text-danger">*</span>
                    </label>
                    <select id="status_dibayarkan_tendik${i}" name="status_dibayarkan_tendik[]"
                        placeholder="Pilih Status" status="dibayarkan">
                        <option value=""></option>
                        <option value="1">Non Tupoksi (dibayarkan)</option>
                        <option value="0">Tupoksi (tidak dibayarkan)</option>
                    </select>
                    <div message="status_dibayarkan_tendik[]" style="font-size: 12px"
                        class="text-danger"></div>
                </div>
            </div>
        </div>
        <div class="row justify-content-md-center mb-2">
            <div class="col col-lg-1">
            </div>
            <div class="col-md-auto">
                <button type="button"
                    class="btn_remove_tendik btn btn-outline-danger waves-effect waves-light">
                    Hapus <i class="mdi mdi-close-circle-outline"></i>
                </button>
            </div>
            <div class="col col-lg-1">
            </div>
        </div>
        <hr>
        </div>`);
        var $status = $('[status="dibayarkan"]').selectize();
        // console.log(jumlahInput)
        var $dataPegawaiTendik = $('[data-pegawai="tendik"]').selectize();
        var $jabatanKinerjaTendik = $('[data-pegawai=jabatan_tendik]').selectize({
            onChange: function (value) {
                var a = value.split('|')
                // $(`#sks_master_tendik${a[3]}`).val(a[1])
                // $(this).closest('div.div_input').find('[name="sks_master_tendik[]"]').val(a[1])
                valueJabatanTendik = a[1]
            }
        });
        var selectize = $status[i].selectize;
        var dataPegawaiTendik = $dataPegawaiTendik[i].selectize;
        $('[data-pegawai=jabatan_tendik]').on('change', function () {
            $(this).closest('div.div_input_tendik').find('[name="sks_master_tendik[]"]').val(valueJabatanTendik)
        })
        var selectize = $jabatanKinerjaTendik[i].selectize
        $.ajax({
            type: "POST",
            url: `${window.location.origin}/get-multi-jabatan`,
            dataType: "JSON",
            data: ({
                id_rubrik: id_rubrik_tendik,
                tingkat: tingkat_tendik
            }),
            cache: false,
            success: function (data1) {
                dataPegawaiTendik.clearOptions()
                for (let index = 0; index < data1['tendik'].length; index++) {
                    dataPegawaiTendik.addOption({ value: `${data1['tendik'][index]['nip']}|${data1['tendik'][index]['nama']}|${data1['tendik'][index]['id']}`, text: `${data1['tendik'][index]['nip']} - ${data1['tendik'][index]['nama']}` })
                }
                selectize.clearOptions()
                for (let index = 0; index < data1['jabatan'].length; index++) {
                    selectize.addOption({ value: `${data1['jabatan'][index]['id']}|${data1['jabatan'][index]['sks']}|${data1['jabatan'][index]['Jabatan']}|${i}`, text: data1['jabatan'][index]['Jabatan'] })
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
    });
    $(document).on('click', '.btn_remove_tendik', function () {
        i--;
        jumlahInput--;
        $(this).parents('div.div_input_tendik').remove();
    });
    $(document).on('click', '.btn_remove_awal_tendik', function () {
        if (i != 0) {
            i--;
            inputanTendik = true
        }
        jumlahInput--;
        console.log(i)
        $(this).parents('div.div_input_awal_tendik').remove();
    });
    $(document).on('click', '.btn_remove_awal_pendidik', function () {
        if (iPendidik != 0) {
            iPendidik--;
            inputanPendidik = true
        }
        jumlahInput--;
        $(this).parents('div.div_input_awal_pendidik').remove();
    });

    // tombol  tambah field anggota surat dinas.
    $('#btn-add-pendidik').click(function () {
        console.log(jumlahInput)
        // console.log(iPendidik)
        jumlahInput++
        if (labelInput != 'Jumlah Anggota' || jumlahInput <= jumlahInputMax) {
            if (!inputanPendidik) {
                inputanPendidik = true
            } else {
                iPendidik++;
            }

            $('#tbody-pendidik').append(`<div class="div_input_pendidik">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-2">
                            <label class="form-label" for="pegawai_pendidik${iPendidik}">
                                Nama
                                <span class="text-danger">*</span>
                            </label>
                            <select id="pegawai_pendidik${iPendidik}" data-pegawai="pendidik" name="pegawai_pendidik[]"
                                placeholder="Pilih Nama Pegawai...">
                                <option value=""></option>
                            </select>
                            <div message="pegawai_pendidik[]" style="font-size: 12px"
                                class="text-danger"></div>
                        </div>
                    </div>
                    <div class="col-md-6" show="jabatan_pendidik" ${jabatanPendidik ? '' : 'style="display: none;"'}>
                        <div class="mb-2">
                            <label class="form-label" for="jabatanKinerjaPendidik${iPendidik}">
                                Jabatan
                                <span class="text-danger">*</span>
                            </label>
                            <select id="jabatanKinerjaPendidik${iPendidik}" sks="${iPendidik}" data-pegawai="jabatan_pendidik"
                                name="jabatanKinerjaPendidik[]" placeholder="Pilih Jabatan Kinerja...">
                                <option value=""></option>
                            </select>
                            <div message="jabatanKinerjaPendidik[]" style="font-size: 12px"
                                class="text-danger"></div>
                        </div>
                    </div>
                    <div show="sebagai_pendidik" ${sebagaiPendidik ? '' : 'style="display: none;"'}>
                        <div class="mb-2">
                            <label class="form-label" for="sebagaiPendidik${iPendidik}">
                                Sebagai
                                <span class="text-danger">*</span>
                            </label>
                            <select id="sebagaiPendidik${iPendidik}" data-pegawai="sebagai_pendidik" name="sebagaiPendidik[]"
                                placeholder="Pilih Sebagai...">
                                <option value=""></option>
                            </select>
                            <div message="sebagaiPendidik[]" style="font-size: 12px"
                                class="text-danger"></div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-2">
                            <label class="form-label" for="sks_master_pendidik${iPendidik}">
                                SKS / Poin Kinerja
                            </label>
                            <input type="hidden" class="form-control" id="sks_pendidik${iPendidik}"
                                name="sks_pendidik[]" readonly placeholder="SKS">
                            <input type="text" class="form-control" id="sks_master_pendidik${iPendidik}"
                                name="sks_master_pendidik[]" readonly placeholder="..." value="${sks_pendidik}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="mb-2">
                            <label class="form-label" for="status_dibayarkan_pendidik${sks_pendidik}">
                                Status Anggota
                                <span class="text-danger">*</span>
                            </label>
                            <select id="status_dibayarkan_pendidik${iPendidik}" name="status_dibayarkan_pendidik[]"
                                placeholder="Pilih Status" status="dibayarkan">
                                <option value=""></option>
                                <option value="1">Non Tupoksi (dibayarkan)</option>
                                <option value="0">Tupoksi (tidak dibayarkan)</option>
                            </select>
                            <div message="status_dibayarkan_pendidik[]" style="font-size: 12px"
                                class="text-danger"></div>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-md-center mb-2">
                    <div class="col col-lg-1">
                    </div>
                    <div class="col-md-auto">
                        <button type="button"
                            class="btn_remove_pendidik btn btn-outline-danger waves-effect waves-light">
                            Hapus <i class="mdi mdi-close-circle-outline"></i>
                        </button>
                    </div>
                    <div class="col col-lg-1">
                    </div>
                </div>
                <hr>
                </div>`);
            // console.log(jumlahInput <= jumlahInputMax)
            var $status = $('[status="dibayarkan"]').selectize();
            var selectize = $status[iPendidik].selectize;
            var $dataPegawai = $('[data-pegawai="pendidik"]').selectize();
            var dataPegawai = $dataPegawai[iPendidik].selectize;
            var $sebagaiPendidik = $('[data-pegawai="sebagai_pendidik"]').selectize({
                onChange: function (value) {
                    var a = value.split('|')
                    // $('#sks_master_pendidik' + a[2]).val(a[0])
                    valueJabatanPendidik = a[1]
                }
            });
            var $jabatanKinerjaPendidik = $('[data-pegawai=jabatan_pendidik]').selectize({
                onChange: function (value) {
                    var a = value.split('|')
                    if (sebagaiPendidik) {
                        var sPendidik = $sebagaiPendidik[a[3]].selectize;
                        sPendidik.clearOptions()
                        if (a[2] == "Ketua") {
                            sPendidik.addOption({ value: `1.50|Ketua Tim Teknis|${a[3]}`, text: `Ketua Tim Teknis` })
                            sPendidik.addOption({ value: `2.00|Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP|${a[3]}`, text: `Ketua Pusat Pengembangan, Ketua Komisi Etik, Ketua Unit Manajemen Aset, Ketua Carrier Development, Ketua LSP` })
                        } else if (a[2] == "Sekertaris") {
                            sPendidik.addOption({ value: `3.00|Sekretaris senat Universitas|${a[3]}`, text: `Sekretaris senat Universitas` })
                            sPendidik.addOption({ value: `2.00|Sekretaris SPI|${a[3]}`, text: `Sekretaris SPI` })
                        } else if (a[2] == "Anggota") {
                            sPendidik.addOption({ value: `2.00|Anggota senat Universitas|${a[3]}`, text: `Anggota senat Universitas` })
                            sPendidik.addOption({ value: `1.00|Tim Teknis Rektor/Wakil Rektor|${a[3]}`, text: `Tim Teknis Rektor/Wakil Rektor` })
                            sPendidik.addOption({ value: `0.75|Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya|${a[3]}`, text: `Anggota Tim Teknis, personalia PPM perwakilan fakultas, atau personalia unit lainnya` })
                        }
                    } else {
                        valSks = a[1] * jumlah
                        $('#sks_master_pendidik' + a[3]).val(valSks)
                    }
                }
            });

            $('[data-pegawai=jabatan_pendidik]').on('change', function () {
                console.log(valueJabatanPendidik)
                $(this).closest('div.div_input').find('[name="sks_master_pendidik[]"]').val(valueJabatanPendidik)
            })

            var selectize = $jabatanKinerjaPendidik[iPendidik].selectize
            $.ajax({
                type: "POST",
                url: `${window.location.origin}/get-multi-jabatan`,
                dataType: "JSON",
                data: ({
                    id_rubrik: id_rubrik_pendidik,
                    tingkat: tingkat_pendidik
                }),
                cache: false,
                success: function (data1) {
                    console.log(data1)

                    dataPegawai.clearOptions()
                    for (let index = 0; index < data1['pendidik'].length; index++) {
                        dataPegawai.addOption({ value: `${data1['pendidik'][index]['nip']}|${data1['pendidik'][index]['nama']}|${data1['pendidik'][index]['nidn']}`, text: `${data1['pendidik'][index]['nidn'] ?? data1['pendidik'][index]['nip']} - ${data1['pendidik'][index]['nama']}` })
                    }

                    selectize.clearOptions()
                    for (let index = 0; index < data1['jabatan'].length; index++) {
                        selectize.addOption({ value: `${data1['jabatan'][index]['id']}|${data1['jabatan'][index]['sks']}|${data1['jabatan'][index]['Jabatan']}|${iPendidik}`, text: data1['jabatan'][index]['Jabatan'] })
                    }
                },
                error: function (e) {
                    console.log(e)
                }
            });

        } else {
            Swal.fire({
                title: "Peringatan!",
                text: "Jumlah inputan anggota telah mencapai batas maksimal!.",
                icon: "warning",
                confirmButtonColor: "#3bafda",
            })
        }

    });
    $(document).on('click', '.btn_remove_pendidik', function () {
        iPendidik--;
        jumlahInput--;
        $(this).parents('div.div_input_pendidik').remove();
    });
    // $(document).on('click', '.btn_remove_awal', function () {
    // });

    // form modal tambah anggota
    $('#form-modal-add-anggota').on('submit', function (event) {
        event.preventDefault()
        var formData = $(this).serialize()
        $(this).find('[style="font-size: 12px"]').html('')
        // console.log(formData)
        $.ajax({
            url: `${window.location.origin}/anggota-surat-dinas`,
            method: 'POST',
            data: formData,
            beforeSend: function () {
                $('#btn-add-anggota').attr('disabled', '')
                $('#btn-add-anggota').html('<span class="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true"></span> Loading...')
            },
            success: function (data) {
                console.log(data)
                $('#btn-add-anggota').removeAttr('disabled')
                $('#btn-add-anggota').html('Simpan')
                $('#modal-tambah-anggota').modal('hide')
                $('#modal-anggota').modal('show')
                tabelAnggota.ajax.reload()
                tambahAnggota()
            },
            error: function (xhr) {
                console.log(xhr)
                $('#btn-add-anggota').removeAttr('disabled')
                $('#btn-add-anggota').html('Simpan')
                let response = xhr.responseJSON
                // var selectInput = $(`select[name="pegawai_tendik[]"]`)
                // console.log(selectInput)
                if ($.isEmptyObject(response) == false) {
                    $.each(response.errors, (key, value) => {
                        var keyE = key.split('.')
                        $(`div[message="${keyE[0]}[]"]`).get(keyE[1]).append(`${value}`)
                    })
                }
            }
        })
    })

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


{/* <tr class="div_input">
<td>
    <select id="pegawai_tendik${i}" data-pegawai="tendik" name="pegawai_tendik[]"
        placeholder="Pilih Nama Pegawai...">
        <option value=""></option>
    </select>
</td>
<td show="jabatan_tendik" ${jabatanTendik ? '' : 'style="display: none;"'}>
    <select id="jabatanKinerjaTendik${i}" class="jabatan_tendik" data-pegawai="jabatan_tendik"
        name="jabatanKinerjaTendik[]" placeholder="Pilih Jabatan Kinerja...">
        <option value=""></option>
    </select>
</td>
<td show="sebagai_tendik" style="display: none;">
    <select id="sebagaiTendik${i}" data-pegawai="sebagai_tendik" name="sebagaiTendik[]"
        placeholder="Pilih Sebagai...">
        <option value=""></option>
    </select>
</td>
<td>
    <input type="hidden" class="form-control" id="sks_tendik${i}"
        name="sks_tendik[]" readonly placeholder="SKS">
    <input type="text" class="sks_master_tendik form-control" id="sks_master_tendik${i}"
        name="sks_master_tendik[]" readonly placeholder="..." value="${sks_tendik}">
</td>
<td>
    <select id="status_dibayarkan_tendik${i}" name="status_dibayarkan_tendik[]"
        placeholder="Pilih Status" status="dibayarkan">
        <option value=""></option>
        <option value="1">Non Tupoksi (dibayarkan)</option>
        <option value="0">Tupoksi (tidak dibayarkan)</option>
    </select>
</td>
<td>
    <button type="button" class="btn_remove_tendik btn btn-danger">x</button>
</td>
</tr> */}

{/* <tr class="div_input">
<td>
    <select id="pegawai_pendidik[]" data-pegawai="pendidik" name="pegawai_pendidik[]"
        placeholder="Pilih Nama Pegawai...">
        <option value=""></option>
    </select>
</td>
<td show="jabatan_pendidik" ${jabatanPendidik ? '' : 'style="display: none;"'}>
    <select id="jabatanKinerjaPendidik${iPendidik}" sks="${iPendidik}" data-pegawai="jabatan_pendidik"
        name="jabatanKinerjaPendidik[]" placeholder="Pilih Jabatan Kinerja...">
        <option value=""></option>
    </select>
</td>
<td show="sebagai_pendidik" ${sebagaiPendidik ? '' : 'style="display: none;"'}>
    <select id="sebagaiPendidik${iPendidik}" data-pegawai="sebagai_pendidik" name="sebagaiPendidik[]"
        placeholder="Pilih Sebagai...">
        <option value=""></option>
    </select>
</td>
<td>
    <input type="hidden" class="form-control" id="sks_pendidik${iPendidik}"
        name="sks_pendidik[]" readonly placeholder="SKS">
    <input type="text" class="form-control" id="sks_master_pendidik${iPendidik}"
        name="sks_master_pendidik[]" readonly placeholder="..." value="${sks_pendidik}">
</td>
<td>
    <select id="status_dibayarkan_pendidik${iPendidik}" name="status_dibayarkan_pendidik[]"
        placeholder="Pilih Status" status="dibayarkan">
        <option value=""></option>
        <option value="1">Non Tupoksi (dibayarkan)</option>
        <option value="0">Tupoksi (tidak dibayarkan)</option>
    </select>
</td>
<td>
    <button type="button" class="btn_remove_pendidik btn btn-danger">x</button>
</td>
</tr> */}



