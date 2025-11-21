"use client";

import React, { Children, useState } from "react";

// Tipe data tree
type TreeNode = {
  id: string;
  label: string;
  indicator?: string;
  children?: TreeNode[];
};

// Contoh data
const treeData: TreeNode = {
  id: "root",
  label: "Meningkatnya kesehatan lingkungan, ketahanan pangan dan produktivitas sumber daya kelautan dan perikanan yang berkelanjutan",
  indicator: "Indeks Ekonomi Biru (IBEI)",
  children: [
    { id: "1",
      label: "Meningkatnya ketahanan sektor perikanan terhadap bencana dan perubahan iklim",
      indicator: "Persentase cakupan ketersediaan komoditas perikanan sensitif iklim yang aman, sehat dan berkualitas",
      children: [
        { id: "1.1",
          label: "Meningkatnya Produktivitas Produksi Perikanan Tangkap",
          indicator: "Persentase peningkatan produksi perikanan tangkap",
          children: [
            { id: "1.1.1",
              label: "Meningkatnya produksi perikanan tangkap di wilayah laut sampai dengan 12 Mil",
              indicator: "Jumlah Produksi Perikanan Tangkap di Wilayah Laut Sampai Dengan 12 Mil",
              children: [
                { id: "1.1.1.1",
                  label: "Tersedianya Data dan Informasi Sumber Daya Ikan di Wilayah Laut sampai dengan 12 Mil",
                  indicator: "Jumlah data dan Informasi Sumber Daya Ikan yang Tersedia di Wilayah Laut sampai dengan 12 Mil",
                },
                { id: "1.1.1.2",
                  label: "Penyediaan Sarana dan Prasarana Usaha Perikanan Tangkap",
                  indicator: "Jumlah Sarana dan Prasarana Usaha Perikanan Tangkap yang Tersedia di Wilayah Laut sampai dengan 12 Mil",
                },
                { id: "1.1.1.3",
                  label: "Diterbitkannya rekomendasi surat izin penempatan rumpon",
                  indicator: "Jumlah rekomendasi Surat izin penempatan rumpon yang diterbitkan",
                }
              ]
            },
            { id: "1.1.2",
              label: "Meningkatnya Produksi Perikanan Tangkap di Perairan Umum Darat",
              indicator: "Jumlah Produksi Perikanan Tangkap di Perairan Umum Darat",
              children: [
                { id: "1.1.2.1",
                  label: "Tersedianya Data dan Informasi Sumber Daya Ikan di Wilayah Perairan Darat",
                  indicator: "Jumlah Produksi Perikanan Tangkap di Perairan Umum Darat",
                }
              ]
            },
            { id: "1.1.3",
              label: "Meningkatnya Produksi Perikanan yang di daratkan di pelabuhan perikanan",
              indicator: "Jumlah Produksi Ikan yang didaratkan di pelabuhan perikanan",
              children: [
                { id: "1.1.3.1",
                  label: "Tersedianya sarana dan prasarana pendukung untuk pelaksanaan penangkapan ikan terukur",
                  indicator: "Jumlah sarana dan prasarana pendukung yang tersedia untuk pelaksanaan penangkapan ikan terukur",
                },
                { id: "1.1.3.2",
                  label: "Pengolahan data dan informasi terkait dengan penangkapan ikan terukur",
                  indicator: "Jumlah data dan informasi yang tersedia untuk pelaksanaan penangkapan ikan terukur",
                }
              ]
            },
            { id: "1.1.4",
              label: "Meningkatnya Pengelolaan Pelabuhan Perikanan yang Menjadi Kewenangan Provinsi",
              indicator: "Jumlah Pelabuhan Perikanan yang terkelola dengan baik",
              children: [
                { id: "1.1.4.1",
                  label: "Tersedianya Sarana dan Prasarana Pelabuhan Perikanan",
                  indicator: "Jumlah Sarana dan Prasarana Pelabuhan Perikanan yang Tersedia",
                },
                { id: "1.1.4.2",
                  label: "Terlaksananya Fungsi Pemerintahan dan Pengusahaan Pelabuhan Perikanan",
                  indicator: "Fungsi Pemerintahan dan Pengusahaan Pelabuhan Perikanan yang Terlaksana",
                }
              ]
            },
            { id: "1.1.5",
              label: "Meningkatnya kapal perikanan yang memiliki perizinan sub sektor penangkapan ikan",
              indicator: "Persentase Kapal Perikanan yang berizin",
              children: [
                { id: "1.1.5.1",
                  label: "Diterbitkannya Rekomendasi Buku Kapal Perikanan (BKP)",
                  indicator: "Jumlah Rekomendasi Buku Kapal Perikanan (BKP) yang Diterbitkan",
                }
              ]
            }
          ]
        }
      ]
    },    
    {
      id: "2",
      label: "Meningkatnya Kontribusi PDRB sektor perikanan provinsi",
      indicator: "Persentase Kontribusi PDRB sektor perikanan provinsi bali terhadap PDRB provinsi bali (ADHB)",
      children: [
        { id: "2.1",
          label: "Meningkatnya Produktivitas Produksi Perikanan Budidaya",
          indicator: "Persentase peningkatan produktivitas produksi perikanan budidaya",
          children: [
            { id: "2.1.1",
              label: "Meningkatnya produksi Perikanan Budidaya di Laut",
              indicator: "Jumlah Produksi Perikanan Budidaya",
              children: [
                { id: "2.1.1.1",
                  label: "Tersedianya Data dan Informasi Pembudidayaan Ikan di Laut dan Lintas Daerah Kabupaten/Kota",
                  indicator: "Jumlah Data dan Informasi Pembudidayaan Ikan di Laut dan Lintas Daerah Kabupaten/Kota ",
                },
                { id: "2.1.1.2",
                  label: "Tersedianya Sarana dan Prasarana Pembudidayaan Ikan di Laut",
                  indicator: "Jumlah Sarana dan Prasarana Pembudidayaan Ikan di Laut ",
                },
                { id: "2.1.1.3",
                  label: "Terbinanya Pembudidayaan Ikan di Laut dan di Kawasan Konservasi yang Dikelola oleh Pemerintah Daerah Provinsi",
                  indicator: "Jumlah Pembudidaya ",
                },
                { id: "2.1.1.4",
                  label: "Penyediaan Sarana Prasarana Unit Pengelolaan Kesehatan dan Ikan",
                  indicator: "Jumlah Sarana Prasarana Unit Pengelolaan Kesehatan Ikan dan Lingkungan yang Tersedia",
                },
                { id: "2.1.1.5",
                  label: "Termonitornya Kesehatan Ikan dan Lingkungan Budidaya di Laut dan Lintas Daerah Kabupaten/Kota",
                  indicator: "Dokumen Hasil Pelaksanaan Monitoring Kesehatan Ikan dan Lingkungan Budidaya di Laut dan Lintas Daerah Kabupaten/Kota",
                }
              ]
            },
            { id: "2.1.2",
              label: "Meningkatnya produksi Perikanan Budidaya di Perairan Darat",
              indicator: "Jumlah Produksi Induk dan Benih yang Berkualitas",
              children: [
                { id: "2.1.2.1",
                  label: "Tersedianya Sarana Pembudidayaan Ikan di Air Payau dan Air Tawar Lintas Daerah Kabupaten/Kota",
                  indicator: "Jumlah Sarana Pembudidayaan Ikan di Air Payau dan Air Tawar Lintas Daerah Kabupaten/Kota",
                },
                { id: "2.1.2.2",
                  label: "Tersedianya Prasarana Pembudidayaan Ikan di Air Payau dan Air Tawar Lintas Daerah Kabupaten/Kota",
                  indicator: "Jumlah Prasarana Pembudidayaan Ikan di Air Payau dan Air Tawar Lintas Daerah Kabupaten/Kota",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "3",
      label: "Meningkatnya Daya Saing Produk Olahan Hasil Perikanan",
      indicator: "Persentase Kontribusi Ekspor Produk Perikanan Terhadap Total Nilai Ekspor Provinsi Bali",
      children: [
        { id: "3.1", 
          label: "Meningkatnya Produksi Olahan Hasil Perikanan",
          indicator: "Persentase Peningkatan  produksi olahan hasil perikanan",
          children: [
            { id: "3.1.1",
              label: "Meningkatnya unit pengolah dan pemasar hasil perikanan yang memenuhi izin usaha",
              indicator: "Persentase Unit Usaha Pengolahan dan Pemasar Hasil Perikanan yang memenuhi standar izin usaha",
              children: [
                { id: "3.1.1.1",
                  label: "Tersedianya Data dan Informasi Usaha Subsektor Pengolahan Ikan, Subsektor Pemasaran Ikan, dan Usaha Jasa Pasca Panen Penangkapan Ikan berdasarkan skala usaha dan risiko",
                  indicator: "Jumlah Data dan Informasi Usaha Subsektor Pengolahan Ikan, Subsektor Pemasaran Ikan, dan Usaha Jasa Pasca Panen Penangkapan Ikan berdasarkan skala usaha dan risiko",
                },
                { id: "3.1.1.2",
                  label: "Terlaksananya verifikasi perizinan berusaha sesuai dengan standar usaha bidang Pengolahan dan Pemasaran Hasil Perikanan berdasarkan skala usaha dan tingkat risiko",
                  indicator: "Jumlah rekomendasi perizinan berusaha sesuai dengan standar usaha bidang Pengolahan dan Pemasaran Hasil Perikanan berdasarkan skala usaha dan tingkat risiko",
                }
              ]
            },
            { id: "3.1.2",
              label: "Meningkatnya kemampuan dan pemahaman dalam penerapan standar mutu dan keamanan hasil perikanan",
              indicator: "Jumlah Unit Usaha pengolah dan pemasar yang dibina",
              children: [
                { id: "3.1.2.1",
                  label: "Terlaksananya Pembinaan, Fasilitasi, Pemantauan, dan Evaluasi terhadap Mutu dan Keamanan Hasil Perikanan, dan Daya",
                  indicator: "Jumlah Pembinaan, Fasilitasi, Pemantauan, dan Evaluasi terhadap Mutu dan Keamanan Hasil Perikanan, dan Daya Saing",
                }
              ]
            },
            { id: "3.1.3",
              label: "Tersedianya Data dan Informasi kebutuhan bahan baku industri Pengolahan Ikan bagi unit usaha",
              indicator: "Jumlah unit usaha yang terdata kebutuhan bahan baku industri pengolahan ikan",
              children: [
                { id: "3.1.3.1",
                  label: "Terlaksananya Pemetaan dan Pemantauan Kebutuhan Bahan Baku Usaha Pengolahan Ikan",
                  indicator: "Jumlah Dokumen Hasil Pemetaan dan Pemantauan Kebutuhan Bahan Baku Usaha Pengolahan Ikan",
                }
              ]
            },
            { id: "3.1.4",
              label: "Meningkatnya Tingkat Konsumsi Ikan",
              indicator: "Tingkat Konsumsi Ikan",
              children: [
                { id: "3.1.4.1",
                  label: "Terlaksananya fasilitasi akses pasar dan promosi peningkatan konsumsi ikan untuk skala usaha menengah dan skala usaha besar",
                  indicator: "Jumlah peningkatan angka konsumsi ikan untuk skala usaha menengah dan skala usaha besar",
                }
              ]
            },
            { id: "3.1.5",
              label: "Meningkatnya Jumlah Sertifikat kelayakan pengolahan (SKP) hasil perikanan yang diterbitkan",
              indicator: "Jumlah Sertifikat Kelayakan Pengolahan (SKP) yang di terbitkan oleh pemerintah pusat",
              children: [
                { id: "3.1.5.1",
                  label: "Terlaksananya Penerbitan rekomendasi Sertifikat Kelayakan Pengolahan/Good Manufacturing Practices (GMP) untuk Unit Pengolahan Ikan (UPI) skala usaha menengah dan skala usaha besar",
                  indicator: "Jumlah rekomendasi Sertifikat Kelayakan Pengolahan/Good Manufacturing Practices (GMP) untuk Unit Pengolahan Ikan (UPI) skala usaha menengah dan skala usaha besar yang diterbitkan",
                }
              ]
            }
          ]
        },
        { id: "3.2",
          label: "Meningkatnya Mutu dan Keamanan Produk Hasil Kelautan dan Perikanan",
          indicator: "Persentase peningkatanan mutu dan keamanan Produk Hasil Kelautan dan Perikanan",
          children: [
            { id: "3.2.1",
              label: "Meningkatnya Produk Hasil Perikanan yang menerapkan Standar Nasional Indonesia (SNI)",
              indicator: "Jumlah Produk Hasil Perikanan yang bersertifikat SNI",
              children: [
                { id: "3.2.1.1",
                  label: "Pemberdayaan Usaha dalam rangka Menghasilkan Produk yang Aman dan Bermutu untuk dikonsumsi atau digunakan, dan Berdaya Saing",
                  indicator: "Jumlah Pemberdayaan Usaha dalam rangka Menghasilkan Produk yang Aman dan Bermutu untuk dikonsumsi atau digunakan, dan Berdaya Saing",
                }
              ]
            },
            { id: "3.2.2",
              label: "Meningkatnya Jaminan Mutu dan Keamanan Produk Hasil Kelautan dan Perikanan",
              indicator: "Jumlah hasil uji mutu dan keamanan produk hasil kelautan dan perikanan",
              children: [
                { id: "3.2.2.1",
                  label: "Terlaksananya Pengujian mutu dan keamanan hasil kelautan dan perikanan untuk skala usaha menengah dan besar dengan penanaman modal dalam negeri",
                  indicator: "Jumlah sampel yang diuji mutu dan keamanannya",
                }
              ]
            }
          ]
        },
      ]
    },
    {
      id: "4",
      label: "Meningkatnya lingkungan wilayah pesisir dan pulau-pulau kecil yang sehat, beragam dan produktif",
      indicator: "Persentase Pemanfaatan Ruang Laut",
      children: [
        { id: "4.1",
          label: "Mengoptimalkan pengelolaan Wilayah Pesisir dan Pulau-Pulau Kecil yang lestari dan berkelanjutan",
          indicator: "Persentase pengelolaan wilayah pesisir dan pulau-pulau kecil",
          children: [
            { id: "4.1.1",
              label: "Meningkatnya Persentase  Pengelolaan Ruang Laut Sampai Dengan 12 Mil di Luar Minyak dan Gas Bumi yang telah terfasilitasi",
              indicator: "Persentase  Pengelolaan Ruang Laut Sampai Dengan 12 Mil di Luar Minyak dan Gas Bumi yang telah terfasilitasi",
              children: [
                { id: "4.1.1.1",
                  label: "Terkelolanya Kawasan Konservasi di Wilayah Pesisir dan Pulau-Pulau Kecil Berdasarkan Penetapan dari Pemerintah Pusat",
                  indicator: "Luasan Kawasan Konservasi di Wilayah Pesisir dan Pulau-Pulau Kecil yang Terkelola",
                },
                { id: "4.1.1.2",
                  label: "Terehabilitasinya Wilayah Perairan Pesisir dan Pulau-Pulau Kecil",
                  indicator: "Luasan Wilayah Perairan Pesisir dan Pulau-Pulau Kecil yang Direhabilitasi",
                },
                { id: "4.1.1.3",
                  label: "Tersusunnya dokumen Monitoring dan Evaluasi Materi Teknis Perairan Pesisir",
                  indicator: "Dokumen Monitoring dan Evaluasi Materi Teknis Perairan Pesisir yang menginformasikan perwujudan ruang sesuai Materi Teknis Perairan Pesisir/ dalam Perda RTRWP",
                },
                { id: "4.1.1.4",
                  label: "Tersosialisasinya Perizinan Berusaha dalam rangka Pemanfaatan Ruang Laut mendukung Ekonomi Biru",
                  indicator: "Jumlah Pelaku usaha yang tersosialisasi dalam rangka Pemanfaat Ruang Laut Mendukung Ekonomi Biru",
                },
                { id: "4.1.1.5",
                  label: "Terlibatnya masyarakat dalam operasional dan pemeliharaan prasarana tambak garam",
                  indicator: "Jumlah kelompok masyarakat yang terlibat dalam operasional dan pemeliharaan prasarana tambak garam",
                },
                { id: "4.1.1.6",
                  label: "Terkelolanya Sentra Ekonomi Garam Rakyat (SEGAR) Berdasarkan Penetapan dari Pemerintah Pusat",
                  indicator: "Volume produksi garam lokal pada SEGAR ",
                },
                { id: "4.1.1.7",
                  label: "Tersedianya Data dan Informasi Pergaraman",
                  indicator: "Jumlah data dan Informasi pergaraman yang tersedia",
                }
              ]
            },
            { id: "4.1.2",
              label: "Meningkatnya Kemampuan Masyarakat Pesisr dan Pulau-Pulau Kecil",
              indicator: "Persentase  Kelompok Masyarakat Pesisir yang di berdayakan",
              children: [
                { id: "4.1.2.1",
                  label: "Meningkatnya Kapasitas Masyarakat Pesisir dan Pulau-Pulau Kecil",
                  indicator: "Jumlah Masyarakat Pesisir dan Pulau-Pulau Kecil yang Meningkat Kapasitasnya",
                },
                { id: "4.1.2.2",
                  label: "Jumlah Masyarakat Pesisir dan Pulau-Pulau Kecil yang Meningkat Kapasitasnya",
                  indicator: "Jumlah Kelompok Masyarakat yang Mengikuti Penguatan dan Pengembangan Kelembagaan Masyarakat Pesisir dan Pulau-Pulau Kecil ",
                },
                { id: "4.1.2.3",
                  label: "Terpenuhinya Pendampingan, Kemudahanan Akses Ilmu Pengetahuan, Teknologi dan Informasi, Serta Penyelenggaraan Pendidikan dan Pelatihan",
                  indicator: "Jumlah kelompok Masyarakat yang memperoleh Pendampingan, Kemudahanan Akses Ilmu Pengetahuan, Teknologi dan Informasi, Serta Penyelenggaraan Pendidikan dan Pelatihan ",
                },
                { id: "4.1.2.4",
                  label: "Tersedianya Sarana dan Prasarana Usaha Pergaraman",
                  indicator: "Jumlah Sarana dan Prasarana Usaha Pergaraman yang tersedia",
                }
              ]
            },
            { id: "4.1.3",
              label: "Meningkatnya kesesuaian kegiatan pemanfaatan ruang laut (KKPRL)",
              indicator: "Persentase masyarakat lokal dan tradisional yang terfasilitasi KKPRL",
              children: [
                { id: "4.1.3.1",
                  label: "Terfasilitasinya Penerbitan Rekomendasi Penerbitan Perizinan Berusaha Pemanfaatan Sumber Daya Persisir dan Laut yang menjadi kewenangan provinsi di Luar Minyak dan Gas Bumi bagi Masyarakat Lokal dan Tradisional",
                  indicator: "Jumlah Fasilitasi Penerbitan Rekomendasi Penerbitan Perizinan Berusaha Pemanfaatan Sumber Daya Persisir dan Laut yang menjadi kewenangan provinsi di Luar Minyak dan Gas Bumi bagi Masyarakat Lokal dan Tradisional",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "5",
      label: "Terwujudnya kedaulatan dalam pengelolaan sumber daya kelautan dan perikanan",
      indicator: "Indeks Kepatuhan (Compliance) Pelaku Usaha",
      children: [
        { id: "5.1",
          label: "Meningkatnya pengawasan pemanfatan sumber daya kelautan dan perikanan",
          indicator: "Persentase Kepatuhan Pelaku Usaha Kelautan dan Perikanan terhadap Ketentuan Peraturan Perundangan yang Berlaku",
          children: [
            { id: "5.1.1",
              label:"Meningkatnya Kepatuhan Pelaku Usaha Pemanfaatan Sumber Daya Kelautan dan Perikanan sampai dengan 12 Mil",
              indicator:"Persentase Kepatuhan Pelaku Usaha Pemanfaatan Sumber Daya Kelautan dan Perikanan sampai dengan 12 Mil",
              children: [
                { id: "5.1.1.1",
                  label: "Perkara sanksi administratif bidang kelautan dan perikanan yang memiliki izin provinsi yang ditangani",
                  indicator: "Jumlah perkara sanksi administratif bidang kelautan dan perikanan yang memiliki izin provinsi yang ditangani",
                },
                { id: "5.1.1.2",
                  label: "Peningkatan Sumber Daya Manusia Pengawasan Sumber Daya Kelautan dan Perikanan yang dibentuk",
                  indicator: "Jumlah Sumber Daya Manusia Pengawasan Sumber Daya Kelautan dan Perikanan yang dibentuk",
                },
                { id: "5.1.1.3",
                  label: "Operasional Kapal Pengawas Kelautan dan Perikanan",
                  indicator: "Jumlah hari operasi Kapal Pengawas Kelautan dan Perikanan",
                },
                { id: "5.1.1.4",
                  label: "Pengadaan Kapal Pengawas Kelautan dan Perikanan yang diadakan",
                  indicator: "Jumlah Kapal Pengawas Kelautan dan Perikanan yang diadakan",
                },
                { id: "5.1.1.5",
                  label: "Pemeliharaan Kapal Pengawas Kelautan dan Perikanan",
                  indicator: "Jumlah Kapal Pengawas Kelautan dan Perikanan yang dirawat",
                },
                { id: "5.1.1.6",
                  label: "Pengawasan Pelaku Usaha Pembudidayaan Ikan di Laut sampai dengan 12 Mil",
                  indicator: "Jumlah pelaku Usaha pembudidayaan ikan di Laut sampai dengan 12 Mil yang diperiksa kepatuhannya",
                },
                { id: "5.1.1.7",
                  label: "Pengawasan Usaha penangkapan ikan dan/atau usaha pengangkutan ikan sampai dengan 12 Mil",
                  indicator: "Jumlah pelaku usaha penangkapan ikan dan/atau usaha pengangkutan ikan sampai dengan 12 mil yang diperiksa kepatuhannya",
                },
                { id: "5.1.1.8",
                  label: "Pengawasan Pelaku usaha pemanfaatan sumber daya kelautan yang diperiksa kepatuhannya",
                  indicator: "Jumlah Pelaku usaha pemanfaatan sumber daya kelautan yang diperiksa kepatuhannya",
                },
                { id: "5.1.1.9",
                  label: "Tersedianya Prasarana Pengawasan Sumber Daya Kelautan dan Perikanan yang dibangun",
                  indicator: "Jumlah Prasarana Pengawasan Sumber Daya Kelautan dan Perikanan yang dibangun",
                },
                { id: "5.1.1.10",
                  label: "Penumbuh dan Pengembangan Kelompok Masyarakat Pengawas (POKMASWAS)",
                  indicator: "Jumlah POKMASWAS yang ditumbuhkan, dan dikembangkan",
                },
                { id: "5.1.1.10",
                  label: "Terlaksananya Forum Koordinasi Penanganan TPKP tingkat Daerah",
                  indicator: "Jumlah Forum Koordinasi Penanganan TPKP tingkat Daerah yang dilaksanakan",
                }
              ]
            },
            { id: "5.1.2",
              label:"Meningkatnya Kepatuhan Pelaku Usaha Pemanfaatan Sumber Daya Perikanan di Wilayah Sungai, Danau, Waduk, Rawa, dan Genangan Air Lainnya yang Dapat Diusahakan Lintas Kabupaten/Kota dalam 1 (Satu) Daerah Provinsi",
              indicator:"Persentase Kepatuhan Pelaku Usaha Pemanfaatan Sumber Daya Perikanan di Wilayah Sungai, Danau, Waduk, Rawa, dan Genangan Air Lainnya yang Dapat Diusahakan Lintas Kabupaten/Kota dalam 1 (Satu) Daerah Provinsi",
              children: [
                { id: "5.1.2.1",
                  label: "Pengawasan Usaha Pemasaran hasil perikanan dan/atau usaha Pengolahan Hasil Perikanan",
                  indicator: "Jumlah pelaku Usaha Pemasaran hasil perikanan dan/atau usaha Pengolahan Hasil Perikanan yang diperiksa kepatuhannya",
                }
              ]
            },
            { id: "5.1.3",
              label:"Meningkatnya Pengawasan Pemanfaatan Kawasan Konservasi yang di kelola sesuai dengan Ketentuan Peraturan Perundang-Undangan",
              indicator:"Persentase Peningkatan kegiatan Pengawasan yang terlaksana sesuai dengan ketentuan peraturan perundang-undangan",
              children: [
                { id: "5.1.3.1",
                  label: "Pengawasan pelaksanaan pemanfaatan Kawasan Konservasi yang dikelola sesuai dengan ketentuan peraturan perundang-undangan",
                  indicator: "Jumlah kegiatan pemanfaatan Kawasan Konservasi yang dikelola sesuai dengan ketentuan peraturan perundang-undangan yang terawasi",
                }
              ]
            },
            { id: "5.1.4",
              label:"Terwujudnya tertib hukum di bidang kelautan dan perikanan di wilayah provinsi yang ditangani",
              indicator:"Jumlah sanksi administratif bidang kelautan dan perikanan yang di terbitkan di wilayah provinsi",
              children: [
                { id: "5.1.4.1",
                  label: "Penanganan Perkara sanksi administratif bidan kelautan dan Perikanan yang memiliki izin di wilayah provinsi",
                  indicator: "Jumlah perkara sanksi administratif bidang kelautan dan perikanan yang memiliki izin di wilayah provinsi yang ditangani",
                }
              ]
            },
          ]
        }
      ]
    }
  ]
};

// Recursive Tree Component
const TreeNodeBox: React.FC<{
  node: TreeNode;
  openNodes: string[];
  setOpenNodes: React.Dispatch<React.SetStateAction<string[]>>;
  level?: number;
}> = ({ node, openNodes, setOpenNodes, level = 0 }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isOpen = openNodes.includes(node.id);

  const toggleNode = () => {
    if (!hasChildren) return;

    setOpenNodes((prev) => {
      if (isOpen) {
        // Tutup node ini dan semua anaknya
        return prev.filter((id) => !id.startsWith(node.id));
      } else {
        // Buka node ini
        return [...prev, node.id];
      }
    });
  };

  //warna//
  const bgColors = ["bg-gray-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100"];
  const bgColor = bgColors[level % bgColors.length];

  return (
    <div className="flex flex-col items-start relative">
      {/* Kotak node */}
      <div
        className={`p-2 max-w-[400px] text-justify text-sm border border-gray-500 rounded-lg ${bgColor} cursor-pointer break-words mb-1`}
        onClick={toggleNode}
      >
        {node.label}
        {node.indicator && (
          <div className="text-xs text-gray-500">
            {node.indicator}
          </div>
        )}
      </div>
      

      {hasChildren && isOpen && (
        <div className="flex flex-col ml-45 mt-6 relative">
          {node.children!.map((child, idx) => (
            <div key={child.id} className="relative flex">
              {/* ===== GARIS HORIZONTAL KE CHILD ===== */}
              <div className="absolute left-[-30px] top-5 w-24 h-0.5 bg-gray-400" />

              {/* ===== GARIS VERTIKAL ===== */}
              {node.children!.length > 1 ? (
                // Kalau lebih dari 1 anak, garis vertikal hanya untuk yang bukan terakhir
                idx !== node.children!.length - 1 && (
                  <div className="absolute left-[-30px] top-[-28] bottom-[-20] w-0.5 bg-gray-400" />
                )
              ) : (
                // Kalau cuma 1 anak, buat garis vertikal pendek (sesuai tinggi kotak)
                <div className="absolute left-[-30px] top-[-28] h-12 w-0.5 bg-gray-400" />
              )}

              {/* ===== KOTAK CHILD ===== */}
              <TreeNodeBox node={child} openNodes={openNodes} setOpenNodes={setOpenNodes} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function LogicModel() {
  const [openNodes, setOpenNodes] = useState<string[]>([]);

  return (
    <div className="rounded-3xl p-3 overflow-auto h-screen bg-white">
      <TreeNodeBox node={treeData} openNodes={openNodes} setOpenNodes={setOpenNodes} />
    </div>
  );
}
