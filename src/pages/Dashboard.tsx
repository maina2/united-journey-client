export const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {['Matches', 'Win Rate', 'Grounds', 'Level'].map((label) => (
          <div key={label} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">-</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h2>
        <p className="text-gray-500 text-center py-8">No matches logged yet. Start your journey!</p>
      </div>
    </div>
  )
}
