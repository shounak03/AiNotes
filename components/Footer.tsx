export default function Footer() {
    return (
      <footer className="absolute bottom-0 left-0 right-0 border-t border-gray-600 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-900">
        © {new Date().getFullYear()} AI Notes. All rights reserved.
        </div>
      </footer>
    )
  }
  
  