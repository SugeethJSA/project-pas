export default function Upload() { return (<div className="page active">
  <div className="page-header">
    <div >
      <h1><i className="fas fa-upload" ></i>Upload a Paper</h1>
      <p>Share your paper with the entire VIT community. Takes less than 2 minutes.</p>
    </div>
  </div>
  <div className="upload-container">
    <div className="step-indicator">
      <div className="step active"><div className="step-num">1</div> Upload File</div>
      <div className="step-line"></div>
      <div className="step"><div className="step-num">2</div> Add Details</div>
      <div className="step-line"></div>
      <div className="step"><div className="step-num">3</div> Review</div>
      <div className="step-line"></div>
      <div className="step"><div className="step-num">4</div> Submit</div>
    </div>
    <div className="upload-zone" id="uploadZone">
      <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
      <h3>Drag & Drop your file here</h3>
      <p>Supports PDF, PNG, JPG, JPEG — Max 25MB</p>
      <div className="or">— or —</div>
      <button className="btn-primary" ><i className="fas fa-folder-open"></i> Browse Files</button>
    </div>
    <div className="form-card">
      <h3><i className="fas fa-info-circle" ></i> Paper Details</h3>
      <div className="form-row">
        <div className="form-group">
          <label>Course Code *</label>
          <input type="text" placeholder="e.g. CSE1006"/>
        </div>
        <div className="form-group">
          <label>Course Name</label>
          <input type="text" placeholder="Auto-filled from code"/>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Exam Type *</label>
          <select>
            <option>Select exam type...</option>
            <option>CAT 1</option>
            <option>CAT 2</option>
            <option>FAT</option>
            <option>PAT</option>
            <option>Assignment</option>
          </select>
        </div>
        <div className="form-group">
          <label>Academic Year *</label>
          <select>
            <option>2024–25</option>
            <option>2023–24</option>
            <option>2022–23</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Slot *</label>
          <select>
            <option>Select slot...</option>
            <option>A1</option><option>A2</option>
            <option>B1</option><option>B2</option>
            <option>C1</option><option>C2</option>
            <option>D1</option><option>D2</option>
            <option>E1</option><option>E2</option>
          </select>
        </div>
        <div className="form-group">
          <label>School / Department *</label>
          <select>
            <option>Select school...</option>
            <option>SCOPE</option><option>SMEC</option>
            <option>SELECT</option><option>SCAS</option>
            <option>SBST</option><option>SSL</option>
            <option>SIAS</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Exam Date</label>
        <input type="date"/>
      </div>
      <div className="form-group">
        <label>Additional Notes (Optional)</label>
        <textarea rows="3" placeholder="Any context, missing pages, or notes for reviewers..."></textarea>
      </div>
    </div>
    <div className="form-card">
      <h3><i className="fas fa-user" ></i> Your Details (Optional)</h3>
      <p >Stay anonymous or get credited for your contribution — your choice.</p>
      <div className="form-row">
        <div className="form-group">
          <label>Display Name</label>
          <input type="text" placeholder="How you want to be credited"/>
        </div>
        <div className="form-group">
          <label>Registration Number</label>
          <input type="text" placeholder="Optional, for verification"/>
        </div>
      </div>
    </div>
    <div >
      <button className="btn-outline">Save as Draft</button>
      <button className="btn-primary" ><i className="fas fa-paper-plane"></i> Submit Paper</button>
    </div>
  </div>
</div>); }