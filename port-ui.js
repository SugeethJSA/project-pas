const fs = require('fs');

const html = fs.readFileSync('vit-archive.html', 'utf-8');

// 1. Extract CSS
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  fs.writeFileSync('client/src/app/globals.css', styleMatch[1].trim());
  console.log("CSS extracted.");
}

// 2. Extract Body sections
// We'll roughly extract the NAV and the PAGES
const navMatch = html.match(/<nav[\s\S]*?<\/nav>/);
const homeMatch = html.match(/<div class="page active" id="page-home">([\s\S]*?)<\/div>\s*<!-- ===== BROWSE PAGE ===== -->/);
const browseMatch = html.match(/<div class="page" id="page-browse">([\s\S]*?)<\/div>\s*<!-- ===== SEARCH PAGE ===== -->/);
const qbankMatch = html.match(/<div class="page" id="page-qbank">([\s\S]*?)<\/div>\s*<!-- ===== LEADERBOARD ===== -->/);
const uploadMatch = html.match(/<div class="page" id="page-upload">([\s\S]*?)<\/div>\s*<!-- ===== MEMORY QUESTIONS ===== -->/);

function htmlToJsx(str) {
  if (!str) return "";
  return str
    .replace(/class=/g, 'className=')
    .replace(/onclick="showPage\('[^']+'\)"/g, '') // remove onclick
    .replace(/onclick="showToast\('[^']+'\)"/g, '') // remove onclick
    .replace(/style="([^"]+)"/g, (match, p1) => {
      // Very basic style converter (e.g. "top: 32px;" -> style={{top: '32px'}})
      // For simplicity, we just strip style for now, or you can manually fix.
      // Let's just remove style= to avoid JSX compilation errors, or wrap it.
      // Actually, removing style might break layout a bit, but we can fix it.
      return '';
    })
    .replace(/<!--[\s\S]*?-->/g, '') // remove comments
    .replace(/<br>/g, '<br/>')
    .replace(/<input([^>]*[^\/])>/g, '<input$1/>') // self closing tags
    .replace(/<img([^>]*[^\/])>/g, '<img$1/>');
}

const navJsx = htmlToJsx(navMatch ? navMatch[0] : '');
const homeJsx = htmlToJsx(homeMatch ? homeMatch[1] : '');
const browseJsx = htmlToJsx(browseMatch ? browseMatch[1] : '');
const qbankJsx = htmlToJsx(qbankMatch ? qbankMatch[1] : '');
const uploadJsx = htmlToJsx(uploadMatch ? uploadMatch[1] : '');

const layoutContent = `
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
`;

fs.writeFileSync('client/src/app/layout.js', layoutContent);
fs.writeFileSync('client/src/app/page.js', "export default function Home() { return (<div className=\"page active\">" + homeJsx + "</div>); }");

if (!fs.existsSync('client/src/app/browse')) fs.mkdirSync('client/src/app/browse');
fs.writeFileSync('client/src/app/browse/page.js', "export default function Browse() { return (<div className=\"page active\">" + browseJsx + "</div>); }");

if (!fs.existsSync('client/src/app/qbank')) fs.mkdirSync('client/src/app/qbank');
fs.writeFileSync('client/src/app/qbank/page.js', "export default function QBank() { return (<div className=\"page active\">" + qbankJsx + "</div>); }");

if (!fs.existsSync('client/src/app/upload')) fs.mkdirSync('client/src/app/upload');
fs.writeFileSync('client/src/app/upload/page.js', "export default function Upload() { return (<div className=\"page active\">" + uploadJsx + "</div>); }");

console.log("Pages generated!");
