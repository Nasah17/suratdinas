$(window).on('load', function () {
    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-surat-dinas/surat-dinas";

    // inisialisasi datatables
    var tabel = $('#tabel-surat-tugas').DataTable({
        processing: true,
        serverSide: true,
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
            className: 'align-middle text-center'
        }, {
            data: 'status',
            className: 'align-middle text-center'
        }, {
            data: 'id',
            className: 'align-middle text-center',
            orderable: false,
            searchable: false
        }],
        columnDefs: [
            {
                targets: 3,
                render: function render(data, type, row, meta) {
                    return `<div class="open" title="${data}" id="${row.id}">
                                ${data.substr(0, 26)}
                                <br/>
                                ${data.substr(26, 25)}...
                            </div>`
                }
            }, {
                targets: 5,
                render: function render(data, type, row, meta) {
                    if (data == 1) {
                        return `<span class="badge badge-soft-primary rounded-pill">Telah Diverivikasi</span>`
                    } else if (data == 2) {
                        return `<span class="badge badge-soft-success rounded-pill">Telah Divalidasi</span>`
                    } else {
                        return `<span class="badge badge-soft-warning rounded-pill">Belum Diverifikasi</span>`
                    }
                }
            }, {
                targets: 6,
                render: function render(data, type, row, meta) {
                    return `<div id="tooltip-container">
                    <div class="row row-cols-sm-auto">
                    <div class="col-4">
                        <div id="tooltip-container">
                            <a type="button" id="${data}"
                                class="role_data text-reset font-16">
                                <i style="color: rgb(50,58,70);" class="ri-file-list-3-line"
                                    data-bs-container="#tooltip-container"
                                    data-bs-toggle="tooltip" data-bs-placement="top"
                                    title="Lihat File"></i>
                            </a>
                        </div>
                    </div>
                    <div class="col-4">
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
                    <div class="col-4">
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
                    </div>
                </div>`
                }
            }],
        "order": [[0, 'dsc']]

    });

    // pemberian nomor
    tabel.on('order.dt search.dt', function () {
        tabel.column(0, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
            cell.innerHTML = i + 1;
        });
    }).draw();

    // inputan pencarian
    $('#input-search-tugas').keyup(function () {
        tabel.search($(this).val()).draw()
    })

    var i = 0;

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


    $('#add').click(function () {
        $.ajax({
            type: "POST",
            url: `${window.location.origin}/api/get-multi-jabatan`,
            dataType: "JSON",
            data: `kode_jabatan=${kodeJabatan}`,
            cache: false,
            success: function (data1) {
                console.log(data1)
                var $dataPegawai = $('[data-pegawai=unm]').selectize();
                var selectize = $dataPegawai[i + 1].selectize;
                selectize.clearOptions()
                for (let index = 0; index < data1['pegawai'].length; index++) {
                    selectize.addOption({ value: data1['pegawai'][index]['id'], text: data1['pegawai'][index]['nama'] })
                }
                var $jabatanKinerja = $('[data-pegawai=jabatan]').selectize({
                    onChange: function (value) {
                        if (value != "") {
                            var a = value.split("|");
                            var jabatan = a[2];
                            var tipe = $("#tipe").val();
                            if (tipe == 8 || tipe == 12) {
                                if (tingkat != "") {
                                    $.ajax({
                                        type: "POST",
                                        url: `${window.location.origin}/api/get-sks-jabatan`,
                                        dataType: "JSON",
                                        data: ({
                                            jabatan,
                                            tingkat
                                        }),
                                        cache: false,
                                        success: function (data1) {
                                            console.log(data1[0]['sks']);
                                            $(`#sks${i}`).val(data1[0]['sks']);
                                            $(`#sks_master${i}`).val(data1[0]['sks']);
                                        }
                                    });
                                }
                            } else {
                                if (a[1] != 'null') {
                                    $(`#sks${i}`).val(a[1]);
                                    $(`#sks_master${i}`).val(a[1]);
                                }
                            }
                        }
                    }
                });
                var selectize = $jabatanKinerja[i].selectize;
                selectize.clearOptions()
                for (let index = 0; index < data1['jabatan'].length; index++) {
                    selectize.addOption({ value: `${data1['jabatan'][index]['id']}|${data1['jabatan'][index]['sks']}|${data1['jabatan'][index]['Jabatan']}`, text: data1['jabatan'][index]['Jabatan'] })
                }
            },
            error: function (e) {
                console.log(e)
            }
        });
        i++;

        $('#divJabatan').append(`<div id="row${i}" class="row">
                                        <div class="col-md-5">
                                            <select id="pegawai${i}" data-pegawai="unm" name="pegawai${i}"
                                                placeholder="Pilih Nama Pegawai...">
                                                    <option value=""></option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <input type="hidden" class="form-control" id="lblJabatan${i}"
                                                name="lblJabatan${i}" readonly>
                                            <select id="jabatanKinerja${i}" data-pegawai="jabatan" name="jabatanKinerja${i}"
                                                placeholder="Pilih Jabatan Kinerja...">
                                                <option value=""></option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">
                                            <input type="hidden" class="form-control" id="sks${i}" name="sks${i}" readonly
                                                            placeholder="SKS">
                                            <input type="text" class="form-control" id="sks_master${i}"
                                                name="sks_master${i}" readonly placeholder="...">
                                        </div>
                                        <div class="col-md-1">
                                            <button type="button" name="remove" id="${i}" class="btn btn-danger btn_remove">X</button>
                                        </div>
                                    </div>`);

    });
    $(document).on('click', '.btn_remove', function () {
        var button_id = $(this).attr("id");
        i--;
        $('#row' + button_id + '').remove();
    });
})



