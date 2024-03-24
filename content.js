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
function adjustVolumeBasedOnFrequency() {
  // Pobranie danych częstotliwości
  analyser.getByteFrequencyData(dataArray);

  // Obliczenie średniej mocy dźwięku
  let totalSumHz = 0;
  const bassBoost = 3; // Współczynnik wzmocnienia basów
  for (let i = 0; i < dataArray.length; i++) {
    const indexModifier = i == 0 ? 1 : Math.round(i ** (1 / bassBoost));
    console.log("modyfi", indexModifier);
    totalSumHz += dataArray[i] / indexModifier;
  }
  const AverageHz = totalSumHz / dataArray.length;

  // Regulacja głośności wideo na podstawie średniej mocy dźwięku
  const maxVolume = 1; // Maksymalna głośność
  const minVolume = 0.01; // Minimalna głośność

  // Dostosowywanie głośności
  if (!isNaN(AverageHz) && AverageHz >= 0 && AverageHz <= 255) {
    videoElement.volume = Math.max(minVolume, AverageHz / 255);
    console.log("above", videoElement.volume);
  } else {
    console.error("Nieprawidłowa wartość AverageHz:", AverageHz);
  }

  // Powtórzenie funkcji po krótkim czasie

  requestAnimationFrame(adjustVolumeBasedOnFrequency);
}
// Rozpoczęcie regulacji głośności na podstawie pasm częstotliwości
adjustVolumeBasedOnFrequency();
