export const Footer = () => {
  return (
    <footer className="bg-united-white border-t border-united-gray-200 mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg"
              alt="Manchester United"
              className="h-8 w-8"
            />
            <span className="text-sm text-united-gray-600">Manchester United</span>
          </div>
          <p className="text-sm text-united-gray-600">
            © 2026 Manchester United. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-united-gray-600">
            <a href="#" className="hover:text-united-red transition-colors">Privacy</a>
            <a href="#" className="hover:text-united-red transition-colors">Terms</a>
            <a href="#" className="hover:text-united-red transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-united-gray-600">
          <span className="text-united-red">●</span> Glory Glory Man United <span className="text-united-red">●</span>
        </div>
      </div>
    </footer>
  )
}