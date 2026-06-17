import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import "./index.css";
import App from "./App.tsx";
import LoadingScreen from "./components/LoadingScreen";

// Auto-select text in number inputs on focus/click
if (typeof document !== "undefined") {
  const handleSelect = (event: Event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.type === "number") {
      target.select();
    }
  };

  document.addEventListener("focus", handleSelect, true);
  document.addEventListener("click", handleSelect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
);

