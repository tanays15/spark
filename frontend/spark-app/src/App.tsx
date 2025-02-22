import './App.css'

function App() {
  return (
    <div className="min-h-screen flex">
      {/* Left Column with Background Color */}
      <div className="w-1/2 bg-blue-500 flex items-center justify-center text-white">
        <div className="p-8">
          <h2 className="text-3xl font-semibold">Left Column</h2>
          <p className="mt-4">This column has a blue background.</p>
        </div>
      </div>

      {/* Right Column with Background Color */}
      <div className="w-1/2 bg-green-500 flex items-center justify-center text-white">
        <div className="p-8">
          <h2 className="text-3xl font-semibold">Right Column</h2>
          <p className="mt-4">This column has a green background.</p>
        </div>
      </div>
    </div>
  )
}

export default App
