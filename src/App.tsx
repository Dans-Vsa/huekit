import { ContrastChecker } from './components/ContrastChecker'
import { ImageExtractor } from './components/ImageExtractor'
import { PaletteGenerator } from './components/PaletteGenerator'
import { SavedPalettes } from './components/SavedPalettes'
import { useSavedPalettes } from './hooks/useSavedPalettes'

export default function App() {
  const { palettes, save, remove } = useSavedPalettes()

  return (
    <div className="shell">
      <header className="top">
        <h1>huekit</h1>
        <p>Check contrast, build palettes and export design tokens.</p>
      </header>
      <main>
        <ContrastChecker />
        <PaletteGenerator onSave={save} />
        <ImageExtractor onSave={save} />
        <SavedPalettes palettes={palettes} onRemove={remove} />
      </main>
      <footer className="foot">Runs entirely in your browser. No data leaves this page.</footer>
    </div>
  )
}
