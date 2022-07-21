$(window).on('load', function () {
    // inisialisasi APP URL
    const urlWindow = window.location.origin + "/manajemen-data/jabatan";

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
            name: 'DT_RowIndex',
            className: 'align-middle',
            orderable: false,
            searchable: false
        }, {
            data: 'kode_jabatan',
            className: 'align-middle text-center'
        }, {
            data: 'Jabatan',
            className: 'align-middle'
        }, {
            data: 'tingkat',
            className: 'align-middle text-center'
        }, {
            data: 'sks',
            className: 'align-middle text-center',
        }],
        "order": [[1, 'asc']]
    });

    // inputan pencarian
    $('#input-search').keyup(function () {
        tabel.search($(this).val()).draw()
    })

    // tombol sinkronisasi data
    $(document).on('click', '.sinkronisasi_data', function () {
        $('#sinkron').addClass('fa-spin')
        $('body').loadingModal({ text: 'Sinkronisasi sedang berlangsung... <br/> Harap tidak merefresh laman ini.' }).loadingModal('animation', 'fadingCircle').loadingModal('backgroundColor', 'black')
        $.ajax({
            url: `${urlWindow}/create`,
            method: 'GET',
            success: function (data) {
                // console.log(data)
                tabel.ajax.reload();
                $('body').loadingModal('destroy')
                Swal.fire(
                    {
                        title: 'Sinkronisasi berhasil!',
                        text: `${data.jumlah_sinkronisasi} data jabatan telah disinkronisasi`,
                        icon: 'success',
                        confirmButtonColor: '#3bafda'
                    }
                )
                $('#sinkron').attr('class', 'ri-refresh-line')
            },
            error: function (e) {
                console.log(e)
                $('body').loadingModal('destroy')
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal melakukan sinkronisasi',
                    text: `${e.responseText} <br/> ${e.status} | ${e.statusText}`,
                    confirmButtonColor: '#3bafda'
                })
            }
        })
    })
})



