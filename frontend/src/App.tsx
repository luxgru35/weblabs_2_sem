//app.tsx
import { Provider } from "react-redux";
import { store } from "./store/store"; // Импорт Redux store
import { RouterProvider } from "react-router-dom";
import router from "@routes/router";

function App() {
  return (
    <Provider store={store}>
      <div>
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}

export default App;