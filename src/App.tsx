import { ContrastChecker } from './components/ContrastChecker'

export default function App() {
  return (
    <div className="shell">
      <header className="top">
        <h1>huekit</h1>
        <p>Check contrast, build palettes and export design tokens.</p>
      </header>
      <main>
        <ContrastChecker />
      </main>
      <footer className="foot">Runs entirely in your browser. No data leaves this page.</footer>
    </div>
  )
}
