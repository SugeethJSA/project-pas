export default function QBank() { return (<div className="page active">
  <div className="page-header">
    <div >
      <h1><i className="fas fa-lightbulb" ></i>Question Bank</h1>
      <p>12,400+ questions indexed from past papers, filterable by topic, course, and exam.</p>
    </div>
  </div>
  <div className="qbank-container">
    <div >
      <div className="search-bar" ><i className="fas fa-search"></i><input type="text" placeholder="Search questions by keyword or topic..."/></div>
      <button className="btn-primary" ><i className="fas fa-gamepad"></i> Quiz Mode</button>
    </div>
    <div className="qbank-filters">
      <div className="filter-pill active">All Subjects</div>
      <div className="filter-pill">DSA</div>
      <div className="filter-pill">OOP</div>
      <div className="filter-pill">DBMS</div>
      <div className="filter-pill">OS</div>
      <div className="filter-pill">CN</div>
      <div className="filter-pill">TOC</div>
      <div className="filter-pill">AI</div>
      <div className="filter-pill">Maths</div>
    </div>
    <div className="qbank-filters">
      <span >Exam: </span>
      <div className="filter-pill active">All</div>
      <div className="filter-pill">CAT 1</div>
      <div className="filter-pill">CAT 2</div>
      <div className="filter-pill">FAT</div>
      <div className="filter-pill">PAT</div>
    </div>
    <div className="results-info">Showing 12,400 questions</div>
    <div className="question-list">
      <div className="question-card">
        <div className="q-num">01</div>
        <div className="q-body">
          <div className="q-text">What is the time complexity of Quicksort in the average case? Justify your answer with proper derivation. [5M]</div>
          <div className="q-tags"><span className="q-tag">Sorting</span><span className="q-tag">Complexity</span><span className="q-tag">CSE1006</span></div>
          <div className="q-meta"><span>CAT 2 • 2024</span><span className="q-freq"><i className="fas fa-redo"></i> Asked 9 times</span><span>Source: 3 papers</span></div>
        </div>
      </div>
      <div className="question-card">
        <div className="q-num">02</div>
        <div className="q-body">
          <div className="q-text">Differentiate between process and thread. Why is context switching faster in threads than processes? [7M]</div>
          <div className="q-tags"><span className="q-tag">Processes</span><span className="q-tag">Threads</span><span className="q-tag">CSE3001</span></div>
          <div className="q-meta"><span>FAT • 2024</span><span className="q-freq"><i className="fas fa-redo"></i> Asked 12 times</span><span>Source: 5 papers</span></div>
        </div>
      </div>
      <div className="question-card">
        <div className="q-num">03</div>
        <div className="q-body">
          <div className="q-text">What are the ACID properties of a database transaction? Explain each with an example. [10M]</div>
          <div className="q-tags"><span className="q-tag">ACID</span><span className="q-tag">Transactions</span><span className="q-tag">CSE3505</span></div>
          <div className="q-meta"><span>CAT 1 • 2023</span><span className="q-freq"><i className="fas fa-redo"></i> Asked 15 times</span><span>Source: 7 papers</span></div>
        </div>
      </div>
      <div className="question-card">
        <div className="q-num">04</div>
        <div className="q-body">
          <div className="q-text">Construct an NFA for the language that accepts all strings over {"{a,b}"} ending with &apos;abb&apos;. Convert it to a DFA. [12M]</div>
          <div className="q-tags"><span className="q-tag">NFA</span><span className="q-tag">DFA</span><span className="q-tag">CSE3002</span></div>
          <div className="q-meta"><span>CAT 1 • 2024</span><span className="q-freq"><i className="fas fa-redo"></i> Asked 6 times</span><span>Source: 3 papers</span></div>
        </div>
      </div>
    </div>
  </div>
</div>); }