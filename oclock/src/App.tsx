import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import Horloge from './components/horloge';
import Minuteur from './components/minuteur';
import Chronometre from './components/chronometre';
import Reveil from './components/reveil';
import { ThemeProvider } from "@/components/theme-provider"

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex justify-center  min-h-screen">
        <div className="w-full max-w-[800px] p-4">
          <Tabs defaultValue="horloge" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="horloge">Horloge</TabsTrigger>
              <TabsTrigger value="minuteur">Minuteur</TabsTrigger>
              <TabsTrigger value="chronometre">Chronomètre</TabsTrigger>
              <TabsTrigger value="reveil">Réveil</TabsTrigger>
            </TabsList>
            <TabsContent value="horloge">
              <Horloge />
            </TabsContent>
            <TabsContent value="minuteur">
              <Minuteur />
            </TabsContent>
            <TabsContent value="chronometre">
              <Chronometre />
            </TabsContent>
            <TabsContent value="reveil">
              <Reveil />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App