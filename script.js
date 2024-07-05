  $(document).ready(function() {
      let durasiKerja = 25 * 60;
      let durasiIstirahatPendek = 5 * 60;
      let durasiIstirahatPanjang = 15 * 60;
      let timer;
      let sisaWaktu = durasiKerja;
      let sedangBekerja = true;
      let sesiSelesai = 0;
      let pomodoroSelesai = 0;
      let dijeda = false;
      const audio = $('#audio')[0];

      $('#plusBtn').click(function() {
          let inputWaktu = parseInt($('#inputWaktu').text());
          if (inputWaktu < 240) {
              inputWaktu += 5;
              $('#inputWaktu').text(inputWaktu);
              setTimerDuration(inputWaktu);
          }
      });

      $('#minusBtn').click(function() {
          let inputWaktu = parseInt($('#inputWaktu').text());
          if (inputWaktu > 5) {
              inputWaktu -= 5;
              $('#inputWaktu').text(inputWaktu);
              setTimerDuration(inputWaktu);
          }
      });

      function setTimerDuration(minutes) {
          durasiKerja = minutes * 60;
          sisaWaktu = durasiKerja;
          perbaruiTampilanWaktu(sisaWaktu);
          perbaruiTampilanStatus("Waktu Fokus");
          sedangBekerja = true;
          dijeda = false;
          sesiSelesai = 0;
          pomodoroSelesai = 0;
          $('#sesiSelesai').text(sesiSelesai);
          if (minutes < 30) {
              $('#deskripsiWaktu').text(`Setel timer ${minutes} menit, tanpa break`);
          } else {
              $('#deskripsiWaktu').text(`Setel timer ${minutes} menit. Waktu fokus 20 menit, break 5 menit setiap sesi, dan setelah 4 sesi break panjang 15 menit`);
          }
      }

      function perbaruiTampilanWaktu(detik) {
          let menit = Math.floor(detik / 60);
          let dtk = detik % 60;
          $('#penghitung-waktu').text(`${menit}:${dtk < 10 ? '0' : ''}${dtk}`);
      }

      function perbaruiTampilanStatus(status) {
          $('#status').text(status);
      }

      function mulaiTimer(durasi, panggilanBalik) {
          clearInterval(timer);
          const targetWaktu = Date.now() + durasi * 1000;
          timer = setInterval(() => {
              if (!dijeda) {
                  const sisa = Math.round((targetWaktu - Date.now()) / 1000);
                  if (sisa >= 0) {
                      sisaWaktu = sisa;
                      perbaruiTampilanWaktu(sisaWaktu);
                  } else {
                      clearInterval(timer);
                      audio.play();
                      panggilanBalik();
                  }
              }
          }, 1000);
      }

      function mulaiPomodoro() {
          sedangBekerja = true;
          perbaruiTampilanStatus("Waktu Fokus");
          let sesiDurasi = (durasiKerja >= 30 * 60) ? 20 * 60 : durasiKerja;
          mulaiTimer(sesiDurasi, () => {
              pomodoroSelesai++;
              sesiSelesai++;
              $('#sesiSelesai').text(sesiSelesai);
              if (pomodoroSelesai % 4 === 0) {
                  mulaiIstirahat(durasiIstirahatPanjang, "Istirahat Panjang");
              } else {
                  if (durasiKerja >= 30 * 60) {
                      mulaiIstirahat(durasiIstirahatPendek, "Istirahat Pendek");
                  } else {
                      perbaruiTampilanStatus("Sesi selesai. Silakan tekan 'Mulai' untuk memulai sesi berikutnya");
                  }
              }
          });
      }

      function mulaiIstirahat(durasi, tipeIstirahat) {
          sedangBekerja = false;
          perbaruiTampilanStatus(tipeIstirahat);
          mulaiTimer(durasi, () => {
              perbaruiTampilanStatus("Istirahat selesai. Silakan tekan 'Mulai' untuk memulai sesi berikutnya");
          });
      }

      $('#tombolMulai').click(function() {
          if (dijeda) {
              dijeda = false;
          } else {
              if (sedangBekerja || pomodoroSelesai % 4 === 0 || durasiKerja < 30 * 60) {
                  mulaiPomodoro();
              } else {
                  mulaiIstirahat(durasiIstirahatPendek, "Istirahat Pendek");
              }
          }
      });

      $('#tombolJeda').click(function() {
          dijeda = true;
      });

      $('#tombolUlang').click(function() {
          clearInterval(timer);
          sisaWaktu = durasiKerja;
          perbaruiTampilanWaktu(sisaWaktu);
          perbaruiTampilanStatus("Waktu Fokus");
          sedangBekerja = true;
          dijeda = false;
          sesiSelesai = 0;
          pomodoroSelesai = 0;
          $('#sesiSelesai').text(sesiSelesai);
      });

      $('#modeToggle').click(function() {
          $('body').toggleClass('dark-mode light-mode');
          const modeText = $('body').hasClass('dark-mode') ? 'Light Mode' : 'Dark Mode';
          $(this).text(modeText);
      });

      perbaruiTampilanWaktu(sisaWaktu);
  });