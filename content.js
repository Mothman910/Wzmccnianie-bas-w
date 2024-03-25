// Tworzenie nowej instancji AudioContext
const audioContext = new AudioContext();

// Tworzenie analizatora częstotliwości
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Pobranie elementu wide
const videoElement = document.querySelector(".html5-main-video");

// Ładowanie dźwięku z wideo do kontekstu AudioContext
const source = audioContext.createMediaElementSource(videoElement);

// Połączenie źródła dźwięku z analizatorem
source.connect(analyser);
analyser.connect(audioContext.destination);

// Funkcja regulująca basy i zmniejszająca głośność pozostałych częstotliwości
// Funkcja regulująca basy i wyciszająca dźwięki powyżej 100Hz
// Funkcja regulująca głośność wideo na podstawie pasm częstotliwości
let enableExtension = true;
function adjustVolumeBasedOnFrequency() {
  // Pobranie danych częstotliwości
  if (!enableExtension) {
    videoElement.volume = 1;
    return;
  }
  analyser.getByteFrequencyData(dataArray);

  // Obliczenie średniej mocy dźwięku
  let totalSumHz = 0;
  // Współczynnik wzmocnienia basów
  const bassBoost = {
    // Wprowadzić wartość z przedziału 1-100
    bassPower: 10,
    reversePower: function () {
      return 101 - this.bassPower;
    },
  };

  for (let i = 0; i < dataArray.length; i++) {
    const indexModifier =
      i == 0 ? 1 : Math.round(i ** (1 / bassBoost.reversePower()));
    // console.log("modyfi", indexModifier);
    totalSumHz += dataArray[i] / indexModifier;
  }
  const AverageHz = totalSumHz / dataArray.length;

  // Regulacja głośności wideo na podstawie średniej mocy dźwięku
  const maxVolume = 1; // Maksymalna głośność
  const minVolume = 0.01; // Minimalna głośność

  // Dostosowywanie głośności
  if (!isNaN(AverageHz) && AverageHz >= 0 && AverageHz <= 255) {
    videoElement.volume =
      Math.max(minVolume, AverageHz / 255) * 1.5 <= 1
        ? Math.max(minVolume, AverageHz / 255) * 1.5
        : 1;
    // console.log("volume", videoElement.volume);
  } else {
    console.error("Nieprawidłowa wartość AverageHz:", AverageHz);
  }

  // Powtórzenie funkcji po krótkim czasie

  requestAnimationFrame(adjustVolumeBasedOnFrequency);
}
// Rozpoczęcie regulacji głośności na podstawie pasm częstotliwości
adjustVolumeBasedOnFrequency();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.command === "enableExtension") {
    console.log("Wtyczka włączona");
    enableExtension = true;
    videoElement.volume = 0.1;
    console.log(videoElement.volume);
    adjustVolumeBasedOnFrequency();
  }
});
