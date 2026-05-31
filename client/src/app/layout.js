
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <div className="announcement-bar">
          VITArchive is in <strong>Beta</strong> — Help us grow by uploading your papers!
        </div>
        <nav id="mainNav">
          <Link href="/" className="nav-logo">
            <div className="logo-icon"><i className="fas fa-book-open"></i></div>
            VITArchive
          </Link>
          <div className="nav-links">
            <Link href="/" className="nav-link"><i className="fas fa-home"></i> Home</Link>
            <Link href="/browse" className="nav-link"><i className="fas fa-folder-open"></i> Browse</Link>
            <Link href="/qbank" className="nav-link"><i className="fas fa-lightbulb"></i> Question Bank</Link>
            <Link href="/upload" className="nav-link"><i className="fas fa-upload"></i> Upload</Link>
          </div>
          <div className="nav-actions">
            <Link href="/upload" className="btn-upload-nav"><i className="fas fa-upload"></i> Upload Paper</Link>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
