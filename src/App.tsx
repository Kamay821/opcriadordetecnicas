import OceanMenu from "@/pages/OceanMenu";
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <div className="w-full h-full">
      <OceanMenu />
      <Analytics />
    </div>
  );
}

export default App;
