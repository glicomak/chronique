import ContentPane from "./components/ContentPane";
import SidePane from "./components/SidePane";

import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen flex text-[#eceef3]">
      <SidePane />
      <ContentPane />
    </div>
  );
}

export default App;
