import { useState } from 'react'
import { Telegram } from "@twa-dev/types";
import './App.css'
import BarcodeScannerComponent from 'react-barcode-scanner-updated';


declare global {
  interface Window {
    Telegram: Telegram;
  }
}

function App() {
  const [data, setData] = useState("Not Found");


  const tg = window?.Telegram?.WebApp;
  const onError = (error: unknown) => {
    console.log(error)
  };
  return (
    <div style={{ maxWidth: 500 }}>


      <BarcodeScannerComponent
        facingMode='environment'
        onError={onError}
        // videoConstraints={{
        //   facingMode: "user"
        // }}
        // torch={true}
        onUpdate={(err: unknown, result) => {
          if (result) {
            setData(result.getText());
            tg.sendData(result.getText())
            console.log(result.getText())
          }
          else setData("Not Found");
        }}
      />
      <p>{data}</p>
    </div>
  );
}

export default App
