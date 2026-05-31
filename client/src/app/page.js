export default function Home() { return (<div className="page active">
  <section className="hero">
    <div className="hero-bg">
      <div className="hero-blob"></div>
      <div className="hero-blob"></div>
      <div className="hero-blob"></div>
    </div>
    <div className="hero-badge"><div className="dot"></div> Student-Built. Community-Driven. Always Free.</div>
    <h1>VIT&apos;s <span>Academic Memory</span><br/>Lives Here</h1>
    <p>The central archive for CAT, FAT, PAT papers, question banks, and memory-based questions — organized, searchable, and preserved for every batch.</p>
    <div className="hero-search">
      <i className="fas fa-search" ></i>
      <input type="text" placeholder="Search by course code, name, or topic... (e.g. MAT1001, OOP, CAT1)"/>
      <button >Search</button>
    </div>
    <div className="hero-tags">
      <span className="hero-tag" >CAT Papers</span>
      <span className="hero-tag" >FAT Papers</span>
      <span className="hero-tag" >PAT Papers</span>
      <span className="hero-tag" >Question Bank</span>
      <span className="hero-tag" >All Courses</span>
      <span className="hero-tag" >Memory Questions</span>
    </div>
    <div className="hero-stats">
      <div className="hero-stat"><div className="num">2,847</div><div className="label">Papers Archived</div></div>
      <div className="hero-stat"><div className="num">12,400+</div><div className="label">Questions Indexed</div></div>
      <div className="hero-stat"><div className="num">480</div><div className="label">Courses Covered</div></div>
      <div className="hero-stat"><div className="num">1,200+</div><div className="label">Contributors</div></div>
    </div>
  </section>

  
  <section className="quick-access">
    <div className="section-title">What do you need today?</div>
    <div className="section-sub">Jump straight to what you&apos;re looking for.</div>
    <div className="cards-grid">
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-file-pdf"></i></div>
        <div className="qcard-title">Browse Papers</div>
        <div className="qcard-desc">Filter by course, exam type, year, slot, and school.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> Explore Archive</div>
      </div>
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-lightbulb"></i></div>
        <div className="qcard-title">Question Bank</div>
        <div className="qcard-desc">Search past questions by topic, subject, or exam type.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> Explore Q&apos;s</div>
      </div>
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-upload"></i></div>
        <div className="qcard-title">Upload Paper</div>
        <div className="qcard-desc">Share your papers and contribute to the community archive.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> Upload Now</div>
      </div>
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-brain"></i></div>
        <div className="qcard-title">Memory Questions</div>
        <div className="qcard-desc">Submit or browse recall-based questions from recent exams.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> View Memory Q&apos;s</div>
      </div>
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-graduation-cap"></i></div>
        <div className="qcard-title">Course Pages</div>
        <div className="qcard-desc">All papers, questions, and resources for a specific course.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> Find Course</div>
      </div>
      <div className="qcard" >
        <div className="qcard-icon" ><i className="fas fa-hand-paper"></i></div>
        <div className="qcard-title">Request Papers</div>
        <div className="qcard-desc">Can&apos;t find what you need? Submit a request for the community.</div>
        <div className="qcard-arrow"><i className="fas fa-arrow-right"></i> Submit Request</div>
      </div>
    </div>
  </section>

  
  <section className="recent-section">
    <div className="recent-header">
      <div>
        <div className="section-title">Recently Added</div>
        <div className="section-sub" >Freshly uploaded by the community</div>
      </div>
      <button className="btn-outline" >View All <i className="fas fa-arrow-right"></i></button>
    </div>
    <div className="papers-grid">
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-cat">CAT 1</span><span className="paper-year">2024</span></div>
        <div className="paper-title">Data Structures and Algorithms</div>
        <div className="paper-meta">
          <span className="paper-tag">CSE1006</span>
          <span className="paper-tag">SCOPE</span>
          <span className="paper-tag">Slot A1</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">R</div> Rahul K.</div>
          <button className="btn-download"><i className="fas fa-download"></i> PDF</button>
        </div>
      </div>
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-fat">FAT</span><span className="paper-year">2024</span></div>
        <div className="paper-title">Engineering Mathematics IV</div>
        <div className="paper-meta">
          <span className="paper-tag">MAT2004</span>
          <span className="paper-tag">SMEC</span>
          <span className="paper-tag">Slot B1+TB1</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">A</div> Ananya S.</div>
          <button className="btn-download"><i className="fas fa-download"></i> PDF</button>
        </div>
      </div>
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-cat">CAT 2</span><span className="paper-year">2024</span></div>
        <div className="paper-title">Object Oriented Programming</div>
        <div className="paper-meta">
          <span className="paper-tag">CSE1007</span>
          <span className="paper-tag">SCOPE</span>
          <span className="paper-tag">Slot C1</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">P</div> Priya M.</div>
          <button className="btn-download"><i className="fas fa-download"></i> PDF</button>
        </div>
      </div>
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-pat">PAT</span><span className="paper-year">2024</span></div>
        <div className="paper-title">Computer Networks</div>
        <div className="paper-meta">
          <span className="paper-tag">CSE3501</span>
          <span className="paper-tag">SCOPE</span>
          <span className="paper-tag">Memory-based</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">S</div> Suresh P.</div>
          <button className="btn-download"><i className="fas fa-image"></i> Image</button>
        </div>
      </div>
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-fat">FAT</span><span className="paper-year">2023</span></div>
        <div className="paper-title">Digital Signal Processing</div>
        <div className="paper-meta">
          <span className="paper-tag">ECE3003</span>
          <span className="paper-tag">SELECT</span>
          <span className="paper-tag">Slot D1</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">V</div> Vishnu T.</div>
          <button className="btn-download"><i className="fas fa-download"></i> PDF</button>
        </div>
      </div>
      <div className="paper-card">
        <div className="paper-header"><span className="paper-type type-cat">CAT 1</span><span className="paper-year">2024</span></div>
        <div className="paper-title">Theory of Computation</div>
        <div className="paper-meta">
          <span className="paper-tag">CSE3002</span>
          <span className="paper-tag">SCOPE</span>
          <span className="paper-tag">Slot E1</span>
        </div>
        <div className="paper-footer">
          <div className="paper-uploader"><div className="avatar-sm">N</div> Nidhi R.</div>
          <button className="btn-download"><i className="fas fa-download"></i> PDF</button>
        </div>
      </div>
    </div>
  </section>

  
  <div >
    <div >
      <div >Built for students. Maintained by students.</div>
      <div >No ads. No paywalls. No gating. Forever free and open source.</div>
      <div >
        <div ><i className="fas fa-lock-open"></i> Open Access</div>
        <div ><i className="fas fa-code"></i> Open Source</div>
        <div ><i className="fas fa-shield-alt"></i> No Credentials Stored</div>
        <div ><i className="fas fa-infinity"></i> Preserved for Future Batches</div>
      </div>
    </div>
  </div>
</div>); }