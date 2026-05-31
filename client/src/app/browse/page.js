export default function Browse() { return (<div className="page active">
  <div className="page-header">
    <div >
      <h1><i className="fas fa-folder-open" ></i>Browse Papers</h1>
      <p>Filter and explore 2,847 archived papers across all schools and courses.</p>
    </div>
  </div>
  <div className="browse-layout">
    <aside className="sidebar">
      <div className="filter-group">
        <div className="filter-label">Exam Type</div>
        <div className="filter-options">
          <div className="filter-option selected">All Types <span className="filter-count">2847</span></div>
          <div className="filter-option">CAT 1 <span className="filter-count">842</span></div>
          <div className="filter-option">CAT 2 <span className="filter-count">798</span></div>
          <div className="filter-option">FAT <span className="filter-count">900</span></div>
          <div className="filter-option">PAT <span className="filter-count">207</span></div>
          <div className="filter-option">Assignment <span className="filter-count">100</span></div>
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">School</div>
        <div className="filter-options">
          <div className="filter-option selected">All Schools <span className="filter-count">2847</span></div>
          <div className="filter-option">SCOPE <span className="filter-count">1204</span></div>
          <div className="filter-option">SMEC <span className="filter-count">620</span></div>
          <div className="filter-option">SELECT <span className="filter-count">480</span></div>
          <div className="filter-option">SCAS <span className="filter-count">310</span></div>
          <div className="filter-option">SBST <span className="filter-count">233</span></div>
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">Academic Year</div>
        <div className="filter-options">
          <div className="filter-option selected">All Years</div>
          <div className="filter-option">2024–25</div>
          <div className="filter-option">2023–24</div>
          <div className="filter-option">2022–23</div>
          <div className="filter-option">2021–22</div>
          <div className="filter-option">2020–21</div>
        </div>
      </div>
      <div className="filter-group">
        <div className="filter-label">Slot</div>
        <div className="filter-options">
          <div className="filter-option selected">All Slots</div>
          <div className="filter-option">A1</div>
          <div className="filter-option">B1</div>
          <div className="filter-option">C1</div>
          <div className="filter-option">D1</div>
          <div className="filter-option">E1</div>
        </div>
      </div>
    </aside>
    <div className="browse-main">
      <div className="browse-toolbar">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search within results..."/>
        </div>
        <button className="sort-btn"><i className="fas fa-sort-amount-down"></i> Newest First</button>
      </div>
      <div className="results-info">Showing 2,847 papers — sorted by date uploaded</div>
      <div className="papers-grid">
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-cat">CAT 1</span><span className="paper-year">2024</span></div><div className="paper-title">Data Structures and Algorithms</div><div className="paper-meta"><span className="paper-tag">CSE1006</span><span className="paper-tag">SCOPE</span><span className="paper-tag">A1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">R</div> Rahul K.</div><button className="btn-download"><i className="fas fa-download"></i> PDF</button></div></div>
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-fat">FAT</span><span className="paper-year">2024</span></div><div className="paper-title">Engineering Mathematics IV</div><div className="paper-meta"><span className="paper-tag">MAT2004</span><span className="paper-tag">SMEC</span><span className="paper-tag">B1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">A</div> Ananya S.</div><button className="btn-download"><i className="fas fa-download"></i> PDF</button></div></div>
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-pat">PAT</span><span className="paper-year">2024</span></div><div className="paper-title">Object Oriented Programming</div><div className="paper-meta"><span className="paper-tag">CSE1007</span><span className="paper-tag">SCOPE</span><span className="paper-tag">C1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">P</div> Priya M.</div><button className="btn-download"><i className="fas fa-image"></i> Image</button></div></div>
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-cat">CAT 2</span><span className="paper-year">2023</span></div><div className="paper-title">Computer Networks</div><div className="paper-meta"><span className="paper-tag">CSE3501</span><span className="paper-tag">SCOPE</span><span className="paper-tag">D1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">S</div> Suresh P.</div><button className="btn-download"><i className="fas fa-download"></i> PDF</button></div></div>
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-fat">FAT</span><span className="paper-year">2023</span></div><div className="paper-title">Digital Signal Processing</div><div className="paper-meta"><span className="paper-tag">ECE3003</span><span className="paper-tag">SELECT</span><span className="paper-tag">E1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">V</div> Vishnu T.</div><button className="btn-download"><i className="fas fa-download"></i> PDF</button></div></div>
        <div className="paper-card"><div className="paper-header"><span className="paper-type type-cat">CAT 1</span><span className="paper-year">2024</span></div><div className="paper-title">Theory of Computation</div><div className="paper-meta"><span className="paper-tag">CSE3002</span><span className="paper-tag">SCOPE</span><span className="paper-tag">E1</span></div><div className="paper-footer"><div className="paper-uploader"><div className="avatar-sm">N</div> Nidhi R.</div><button className="btn-download"><i className="fas fa-download"></i> PDF</button></div></div>
      </div>
    </div>
  </div>
</div>); }