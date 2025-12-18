import { useState } from "react";

import ContentPane from "./components/ContentPane";
import SidePane from "./components/SidePane";

import "./App.css";

function App() {
  const [currentEntry, setCurrentEntry] = useState<String | null>(null);

  return (
    <div className="h-screen w-screen flex text-[#eceef3]">
      <SidePane setCurrentEntry={setCurrentEntry} />
      <ContentPane currentEntry={currentEntry} />
    </div>
  );
}

export default App;
