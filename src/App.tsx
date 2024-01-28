import { useEffect, useState } from 'react'
import { Html5Qrcode } from "html5-qrcode";
import { Telegram } from "@twa-dev/types";
import './App.css'

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

function App() {
  const [isEnabled, setEnabled] = useState(true);
  const [qrMessage, setQrMessage] = useState("");

  const tg = window?.Telegram?.WebApp;
  tg.expand()

  useEffect(() => {
    const config = { fps: 10, qrbox: { width: 200, height: 200 } };

    const html5QrCode = new Html5Qrcode("qrCodeContainer");

    const qrScanerStop = () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
          .stop()
          .then(() => console.log("Scaner stop"))
          .catch((err: unknown) => console.log("Scaner error", err));
      }
    };

    const qrCodeSuccess = (decodedText: string) => {
      setQrMessage(decodedText);
      tg.sendData(decodedText)
      setEnabled(false);
    };
    const qrCodeFailure = () => {
      setEnabled(false);
    };

    if (isEnabled) {
      html5QrCode.start({ facingMode: "environment" }, config, qrCodeSuccess, qrCodeFailure);
      setQrMessage("");
    } else {
      qrScanerStop();
    }

    return () => {
      qrScanerStop();
    };
  }, [isEnabled, tg]);

  return (
    <div className="scaner">
      <div id="qrCodeContainer" />
      {qrMessage && <div className="qr-message">{qrMessage}</div>}
      <button className="start-button" onClick={() => setEnabled(!isEnabled)}>
        {isEnabled ? "On" : "Off"}
      </button>
    </div>
  );
}

export default App
