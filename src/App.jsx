import { useState, useRef, useEffect } from "react";

// ─── Responsive CSS injected into <head> ─────────────────────────────────────
const STYLES = `
  * { box-sizing: border-box; }
  .app-wrap { min-height: 100vh; background: linear-gradient(135deg, #0f2044 0%, #1a3a6b 50%, #0f2044 100%); font-family: 'Segoe UI', system-ui, sans-serif; }
  .header { background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.1); padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; gap: 12px; backdrop-filter: blur(10px); flex-wrap: wrap; }
  .header-logo { display: flex; align-items: center; gap: 12px; }
  .nav { display: flex; gap: 6px; flex-wrap: wrap; }
  .nav button { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.2s; white-space: nowrap; }
  .main-pad { padding: 24px 28px; }
  .eye-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .patient-row { display: flex; gap: 18px; flex-wrap: wrap; }
  .patient-field { flex: 1; min-width: 200px; }
  .drop-row { display: grid; grid-template-columns: 26px 1fr 100px 82px; gap: 8px; margin-bottom: 9px; align-items: start; }
  .rx-layout { display: grid; grid-template-columns: 310px 1fr; gap: 22px; align-items: start; }
  .rx-paper { width: 500px; margin: 0 auto; }
  .formulary-toolbar { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }

  @media (max-width: 900px) {
    .eye-grid { grid-template-columns: 1fr; }
    .rx-layout { grid-template-columns: 1fr; }
    .rx-paper { width: 100%; }
  }

  @media (max-width: 640px) {
    .header { padding: 12px 14px; }
    .nav button { padding: 7px 9px; font-size: 11px; }
    .main-pad { padding: 14px 12px; }
    .patient-field { min-width: 100%; }
    .drop-row { grid-template-columns: 24px 1fr; gap: 6px; }
    .drop-selects { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 5px; }
    .formulary-toolbar { flex-direction: column; align-items: stretch; }
    .formulary-toolbar > div:first-child { margin-bottom: 4px; }
  }

  @media (max-width: 400px) {
    .nav button { font-size: 10px; padding: 6px 7px; }
  }

  select, input { font-size: 16px !important; }
  @media (min-width: 641px) {
    select, input { font-size: 13px !important; }
  }
`;

function InjectStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

// ─── Seed formulary ───────────────────────────────────────────────────────────
const SEED_FORMULARY = [
  { id:1,  brand:"Azarga",      generic:"Brinzolamide 1% / Timolol 0.5%",       defaultFreq:2, defaultDrops:1, lu:"310" },
  { id:2,  brand:"Alphagan",    generic:"Brimonidine 0.2%",                       defaultFreq:2, defaultDrops:1, lu:"172" },
  { id:3,  brand:"Alphagan-P",  generic:"Brimonidine 0.15%",                      defaultFreq:2, defaultDrops:1, lu:"172" },
  { id:4,  brand:"Azopt",       generic:"Brinzolamide 1%",                        defaultFreq:2, defaultDrops:1, lu:"172" },
  { id:5,  brand:"Betagan",     generic:"Levobunolol 0.5%",                       defaultFreq:2, defaultDrops:1, lu:"—"   },
  { id:6,  brand:"Betoptic-S",  generic:"Betaxolol 0.25%",                        defaultFreq:2, defaultDrops:1, lu:"—"   },
  { id:7,  brand:"Combigan",    generic:"Brimonidine 0.2% / Timolol 0.5%",       defaultFreq:2, defaultDrops:1, lu:"310" },
  { id:8,  brand:"Cosopt",      generic:"Dorzolamide 2% / Timolol 0.5%",         defaultFreq:2, defaultDrops:1, lu:"310" },
  { id:9,  brand:"Cosopt-PF",   generic:"Dorzolamide 2% / Timolol 0.5% PF",      defaultFreq:2, defaultDrops:1, lu:"310" },
  { id:10, brand:"DuoTrav",     generic:"Travaprost 0.004% / Timolol 0.5%",      defaultFreq:1, defaultDrops:1, lu:"310" },
  { id:11, brand:"Izba",        generic:"Travaprost 0.03%",                       defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:12, brand:"Lumigan-RC",  generic:"Bimatoprost 0.01%",                      defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:13, brand:"Monoprost",   generic:"Latanoprost PF 0.005%",                  defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:14, brand:"Pilocarpine", generic:"Pilocarpine 2%",                         defaultFreq:3, defaultDrops:1, lu:"—"   },
  { id:15, brand:"Simbrinza",   generic:"Brinzolamide 1% / Brimonidine 0.2%",    defaultFreq:2, defaultDrops:1, lu:"466" },
  { id:16, brand:"Timoptic",    generic:"Timolol 0.5%",                           defaultFreq:2, defaultDrops:1, lu:"—"   },
  { id:17, brand:"Timoptic-XE", generic:"Timolol 0.5% XE",                       defaultFreq:1, defaultDrops:1, lu:"—"   },
  { id:18, brand:"Travatan-Z",  generic:"Travaprost 0.004%",                      defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:19, brand:"Trusopt",     generic:"Dorzolamide 2%",                         defaultFreq:2, defaultDrops:1, lu:"172" },
  { id:20, brand:"Trusopt-PF",  generic:"Dorzolamide 2% PF",                     defaultFreq:2, defaultDrops:1, lu:"172" },
  { id:21, brand:"Vistitan",    generic:"Bimatoprost 0.03%",                      defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:22, brand:"Vyzulta",     generic:"Latanoprostene Bunod 0.024%",            defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:23, brand:"Xalacom",     generic:"Latanoprost 0.005% / Timolol 0.5%",     defaultFreq:1, defaultDrops:1, lu:"310" },
  { id:24, brand:"Xalatan",     generic:"Latanoprost 0.005%",                     defaultFreq:1, defaultDrops:1, lu:"172" },
  { id:25, brand:"Zimed-PF",    generic:"Bimatoprost 0.03% PF",                  defaultFreq:1, defaultDrops:1, lu:"172" },
];

const FREQ_LABEL   = { 1:"Once daily", 2:"Twice daily", 3:"Three times daily", 4:"Four times daily", 6:"Six times daily" };
const FREQ_OPTIONS = [1,2,3,4,6];
const DROP_OPTIONS = [1,2,3];
const EMPTY_DROP   = { brand:"", freq:2, drops:1 };
const BLANK_MED    = { brand:"", generic:"", defaultFreq:2, defaultDrops:1, lu:"" };

function makeEmptySlots() { return Array.from({ length:5 }, () => ({ ...EMPTY_DROP })); }
function getDaysInMonth(y,m) { return new Date(y,m+1,0).getDate(); }
const DAY_NAMES   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth <= 640);
  useEffect(() => {
    const h = () => setMobile(window.innerWidth <= 640);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mobile;
}

function CheckBoxes({ count }) {
  return (
    <div style={{ display:"flex", gap:4, flexWrap:"wrap", justifyContent:"center" }}>
      {Array.from({ length:count }).map((_,i) =>
        <span key={i} style={{ fontSize:16, cursor:"default", color:"#4a5568" }}>☐</span>
      )}
    </div>
  );
}

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div className="patient-field" style={{ marginBottom:10 }}>
      <label style={{ fontSize:11, fontWeight:700, color:"#4a5568", textTransform:"uppercase", letterSpacing:"0.5px", display:"block", marginBottom:4 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", padding:"8px 12px", borderRadius:7, border:"1.5px solid #cbd5e0", color:"#2d3748", outline:"none", background:"#fff", boxSizing:"border-box" }}
      />
    </div>
  );
}

const thBase  = { padding:"10px 12px", color:"#fff", fontSize:12, fontWeight:700, textAlign:"center", border:"1px solid rgba(255,255,255,0.15)", letterSpacing:"0.3px" };
const th2Base = { padding:"8px 10px",  color:"#fff", fontSize:11, fontWeight:600, textAlign:"center", border:"1px solid rgba(255,255,255,0.15)" };
const tdBase  = { padding:"7px 8px",   border:"1px solid #e2e8f0", textAlign:"center", fontSize:13, verticalAlign:"middle" };

export default function App() {
  const today   = new Date();
  const isMobile = useIsMobile();

  const [formulary, setFormulary] = useState(SEED_FORMULARY);
  const [editingId, setEditingId] = useState(null);
  const [editBuf,   setEditBuf]   = useState({});
  const [addingNew, setAddingNew] = useState(false);
  const [newMed,    setNewMed]    = useState({ ...BLANK_MED });
  const [searchQ,   setSearchQ]   = useState("");
  const [sortCol,   setSortCol]   = useState("brand");
  const [sortAsc,   setSortAsc]   = useState(true);

  const [activeTab,      setActiveTab]      = useState("selection");
  const [scheduleMonth,  setScheduleMonth]  = useState(today.getMonth());
  const [scheduleYear,   setScheduleYear]   = useState(today.getFullYear());
  const [rightDrops,     setRightDrops]     = useState(makeEmptySlots());
  const [leftDrops,      setLeftDrops]      = useState(makeEmptySlots());
  const [patientName,    setPatientName]    = useState("");
  const [patientAddress, setPatientAddress] = useState("");

  const [physicianName, setPhysicianName] = useState("");
  const [clinicName,    setClinicName]    = useState("");
  const [clinicAddress, setClinicAddress] = useState("");
  const [clinicCity,    setClinicCity]    = useState("");
  const [clinicPhone,   setClinicPhone]   = useState("");
  const [licenseNum,    setLicenseNum]    = useState("");
  const [rxRefills,     setRxRefills]     = useState(0);
  const [rxNotes,       setRxNotes]       = useState("");

  const printRef   = useRef();
  const rxPrintRef = useRef();

  // ── Formulary ──
  const nextId    = () => Math.max(0, ...formulary.map(m => m.id)) + 1;
  const startEdit = (med) => { setEditingId(med.id); setEditBuf({ ...med }); };
  const cancelEdit= () => { setEditingId(null); setEditBuf({}); };
  const saveEdit  = () => {
    if (!editBuf.brand.trim()) return;
    setFormulary(f => f.map(m => m.id === editingId ? { ...editBuf } : m));
    setEditingId(null); setEditBuf({});
  };
  const deleteMed = (id) => {
    if (!window.confirm("Remove this medication from the formulary?")) return;
    setFormulary(f => f.filter(m => m.id !== id));
  };
  const saveNew = () => {
    if (!newMed.brand.trim()) return;
    setFormulary(f => [...f, { ...newMed, id: nextId() }]);
    setNewMed({ ...BLANK_MED }); setAddingNew(false);
  };
  const handleSort = (col) => {
    if (sortCol === col) setSortAsc(a => !a);
    else { setSortCol(col); setSortAsc(true); }
  };
  const displayedFormulary = [...formulary]
    .filter(m => m.brand.toLowerCase().includes(searchQ.toLowerCase()) || m.generic.toLowerCase().includes(searchQ.toLowerCase()) || m.lu.toLowerCase().includes(searchQ.toLowerCase()))
    .sort((a,b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av==="string") av=av.toLowerCase();
      if (typeof bv==="string") bv=bv.toLowerCase();
      return av<bv ? (sortAsc?-1:1) : av>bv ? (sortAsc?1:-1) : 0;
    });

  // ── Drop selection ──
  const updateDrop = (side, index, field, value) => {
    const setter = side==="right" ? setRightDrops : setLeftDrops;
    setter(prev => {
      const next = prev.map((d,i) => i===index ? { ...d, [field]:value } : d);
      if (field==="brand" && value) {
        const med = formulary.find(m => m.brand===value);
        if (med) { next[index].freq=med.defaultFreq; next[index].drops=med.defaultDrops; }
      }
      return next;
    });
  };

  const activeRight = rightDrops.filter(d => d.brand);
  const activeLeft  = leftDrops.filter(d => d.brand);
  const allDrops    = [...activeRight.map(d=>({...d,eye:"Right Eye (OD)"})), ...activeLeft.map(d=>({...d,eye:"Left Eye (OS)"}))];
  const mergedDrops = [];
  allDrops.forEach(d => {
    const ex = mergedDrops.find(m => m.brand===d.brand && m.freq===d.freq && m.drops===d.drops);
    if (ex) ex.eye="Both Eyes (OU)"; else mergedDrops.push({...d});
  });

  const numDays  = getDaysInMonth(scheduleYear, scheduleMonth);
  const months   = Array.from({length:12},(_,i)=>({value:i,label:MONTH_NAMES[i]}));
  const years    = [today.getFullYear()-1, today.getFullYear(), today.getFullYear()+1];
  const todayStr = today.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});

  // ── Print ──
  const handlePrint = () => {
    const win = window.open("","_blank");
    win.document.write(`<html><head><title>Eye Drop Schedule</title><style>
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',sans-serif;font-size:9px;color:#1a202c}
      .print-wrap{padding:12px}table{width:100%;border-collapse:collapse}
      th{background:#1a365d;color:#fff;padding:4px 5px;font-size:8px;text-align:center;border:1px solid #2d3748}
      td{border:1px solid #cbd5e0;padding:3px 4px;text-align:center;vertical-align:middle;font-size:8px}
      tr:nth-child(even) td{background:#f7fafc}
      @media print{@page{margin:0.4in;size:landscape}}
    </style></head><body><div class="print-wrap">${printRef.current.innerHTML}</div></body></html>`);
    win.document.close(); win.print();
  };
  const handleRxPrint = () => {
    const win = window.open("","_blank");
    win.document.write(`<html><head><title>Prescription</title><style>
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Times New Roman',Georgia,serif;background:#fff;color:#111}
      @media print{@page{size:5.5in 8in;margin:0}body{margin:0}}
    </style></head><body>${rxPrintRef.current.innerHTML}</body></html>`);
    win.document.close(); win.print();
  };

  const tabs = [
    { id:"formulary", label:"🗂 Formulary"      },
    { id:"selection", label:"💊 Drop Selection" },
    { id:"schedule",  label:"📅 Schedule"       },
    { id:"rx",        label:"📋 Rx Template"    },
  ];

  const EditCell = ({ field, type="text" }) => {
    if (type==="freq")  return <select value={editBuf[field]} onChange={e=>setEditBuf(b=>({...b,[field]:Number(e.target.value)}))} style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #4299e1",outline:"none" }}>{FREQ_OPTIONS.map(f=><option key={f} value={f}>{f}x/day</option>)}</select>;
    if (type==="drops") return <select value={editBuf[field]} onChange={e=>setEditBuf(b=>({...b,[field]:Number(e.target.value)}))} style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #4299e1",outline:"none" }}>{DROP_OPTIONS.map(d=><option key={d} value={d}>{d}</option>)}</select>;
    return <input value={editBuf[field]||""} onChange={e=>setEditBuf(b=>({...b,[field]:e.target.value}))} style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #4299e1",outline:"none",boxSizing:"border-box" }}/>;
  };
  const SortTh = ({ col, children, style={} }) => (
    <th onClick={()=>handleSort(col)} style={{...style,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"}}>
      {children}{sortCol===col?(sortAsc?" ↑":" ↓"):" ·"}
    </th>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrap">
      <InjectStyles />

      {/* ── HEADER ── */}
      <div className="header">
        <div className="header-logo">
          <div style={{ width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,#63b3ed,#4299e1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:"0 4px 15px rgba(66,153,225,0.4)",flexShrink:0 }}>👁</div>
          <div>
            <div style={{ fontSize:19,fontWeight:700,color:"#fff",letterSpacing:"-0.3px" }}>Eye Drop Scheduler</div>
            <div style={{ fontSize:11,color:"#90cdf4",marginTop:1 }}>Patient Medication Tracker</div>
          </div>
        </div>
        <div className="nav">
          {tabs.map(t => (
            <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{ background:activeTab===t.id?"linear-gradient(135deg,#4299e1,#3182ce)":"rgba(255,255,255,0.1)", color:activeTab===t.id?"#fff":"#90cdf4", boxShadow:activeTab===t.id?"0 4px 15px rgba(66,153,225,0.35)":"none" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="main-pad">

        {/* ══════════ FORMULARY ══════════ */}
        {activeTab==="formulary" && (
          <div>
            <div style={{ background:"rgba(255,255,255,0.95)",borderRadius:14,padding:"16px 22px",marginBottom:18,boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
              <div className="formulary-toolbar">
                <div>
                  <div style={{ fontSize:17,fontWeight:700,color:"#1a365d" }}>Drug Formulary</div>
                  <div style={{ fontSize:12,color:"#718096",marginTop:1 }}>{formulary.length} medications · tap any row to edit</div>
                </div>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="🔍  Search brand, generic, or LU code…"
                  style={{ flex:1,minWidth:160,padding:"9px 14px",borderRadius:8,border:"1.5px solid #cbd5e0",outline:"none" }}
                />
                <button onClick={()=>{setAddingNew(true);setEditingId(null);}} disabled={addingNew}
                  style={{ background:addingNew?"#e2e8f0":"linear-gradient(135deg,#48bb78,#38a169)",color:addingNew?"#a0aec0":"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontWeight:700,cursor:addingNew?"default":"pointer",boxShadow:addingNew?"none":"0 4px 12px rgba(72,187,120,0.35)",whiteSpace:"nowrap" }}>
                  + Add Medication
                </button>
              </div>
            </div>

            <div style={{ background:"rgba(255,255,255,0.97)",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",minWidth:680 }}>
                  <thead>
                    <tr style={{ background:"linear-gradient(135deg,#1a365d,#2a4a8a)" }}>
                      <SortTh col="brand"        style={{...thBase,textAlign:"left",paddingLeft:18,width:140}}>Brand Name</SortTh>
                      <SortTh col="generic"      style={{...thBase,textAlign:"left"}}>Generic Name</SortTh>
                      <SortTh col="defaultFreq"  style={{...thBase,width:110}}>Frequency</SortTh>
                      <SortTh col="defaultDrops" style={{...thBase,width:90}}># Drops</SortTh>
                      <SortTh col="lu"           style={{...thBase,width:90}}>LU Code</SortTh>
                      <th style={{...thBase,width:110}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {addingNew && (
                      <tr style={{ background:"#fffff0",borderBottom:"2px solid #f6e05e" }}>
                        <td style={{...tdBase,paddingLeft:14}}><input value={newMed.brand} onChange={e=>setNewMed(m=>({...m,brand:e.target.value}))} placeholder="Brand name" style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #f6ad55",outline:"none",boxSizing:"border-box" }}/></td>
                        <td style={tdBase}><input value={newMed.generic} onChange={e=>setNewMed(m=>({...m,generic:e.target.value}))} placeholder="Generic / concentration" style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #f6ad55",outline:"none",boxSizing:"border-box" }}/></td>
                        <td style={tdBase}><select value={newMed.defaultFreq} onChange={e=>setNewMed(m=>({...m,defaultFreq:Number(e.target.value)}))} style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #f6ad55",outline:"none" }}>{FREQ_OPTIONS.map(f=><option key={f} value={f}>{f}x/day</option>)}</select></td>
                        <td style={tdBase}><select value={newMed.defaultDrops} onChange={e=>setNewMed(m=>({...m,defaultDrops:Number(e.target.value)}))} style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #f6ad55",outline:"none" }}>{DROP_OPTIONS.map(d=><option key={d} value={d}>{d}</option>)}</select></td>
                        <td style={tdBase}><input value={newMed.lu} onChange={e=>setNewMed(m=>({...m,lu:e.target.value}))} placeholder="e.g. 172" style={{ width:"100%",padding:"5px 8px",borderRadius:6,border:"1.5px solid #f6ad55",outline:"none",boxSizing:"border-box" }}/></td>
                        <td style={tdBase}><div style={{ display:"flex",gap:5,justifyContent:"center" }}><button onClick={saveNew} style={{ padding:"4px 10px",borderRadius:5,border:"none",background:"#38a169",color:"#fff",fontWeight:700,cursor:"pointer" }}>Save</button><button onClick={()=>{setAddingNew(false);setNewMed({...BLANK_MED});}} style={{ padding:"4px 10px",borderRadius:5,border:"none",background:"#e2e8f0",color:"#4a5568",fontWeight:700,cursor:"pointer" }}>Cancel</button></div></td>
                      </tr>
                    )}
                    {displayedFormulary.length===0 && !addingNew && (
                      <tr><td colSpan={6} style={{ padding:"32px",textAlign:"center",color:"#a0aec0" }}>No medications match your search.</td></tr>
                    )}
                    {displayedFormulary.map((med,idx) => {
                      const isEditing = editingId===med.id;
                      const rowBg = isEditing?"#ebf8ff":idx%2===0?"#fff":"#f7fafc";
                      return (
                        <tr key={med.id} style={{ background:rowBg }}>
                          <td style={{...tdBase,background:rowBg,textAlign:"left",paddingLeft:18,fontWeight:700,color:"#1a365d"}}>{isEditing?<EditCell field="brand"/>:med.brand}</td>
                          <td style={{...tdBase,background:rowBg,textAlign:"left",fontSize:12,color:"#4a5568"}}>{isEditing?<EditCell field="generic"/>:med.generic}</td>
                          <td style={{...tdBase,background:rowBg}}>{isEditing?<EditCell field="defaultFreq" type="freq"/>:<span style={{ padding:"2px 10px",borderRadius:20,background:med.defaultFreq===1?"#c6f6d5":med.defaultFreq===2?"#bee3f8":"#fed7aa",fontSize:11,fontWeight:700,color:med.defaultFreq===1?"#276749":med.defaultFreq===2?"#2b6cb0":"#c05621",whiteSpace:"nowrap" }}>{med.defaultFreq}x / day</span>}</td>
                          <td style={{...tdBase,background:rowBg,fontWeight:600}}>{isEditing?<EditCell field="defaultDrops" type="drops"/>:`${med.defaultDrops} drop${med.defaultDrops>1?"s":""}`}</td>
                          <td style={{...tdBase,background:rowBg}}>{isEditing?<EditCell field="lu"/>:(med.lu&&med.lu!=="—"?<span style={{ padding:"2px 10px",borderRadius:20,background:"#e9d8fd",fontSize:11,fontWeight:700,color:"#553c9a" }}>{med.lu}</span>:<span style={{ color:"#a0aec0" }}>—</span>)}</td>
                          <td style={{...tdBase,background:rowBg}}>{isEditing?(<div style={{ display:"flex",gap:5,justifyContent:"center" }}><button onClick={saveEdit} style={{ padding:"4px 10px",borderRadius:5,border:"none",background:"#3182ce",color:"#fff",fontWeight:700,cursor:"pointer" }}>Save</button><button onClick={cancelEdit} style={{ padding:"4px 10px",borderRadius:5,border:"none",background:"#e2e8f0",color:"#4a5568",fontWeight:700,cursor:"pointer" }}>Cancel</button></div>):(<div style={{ display:"flex",gap:5,justifyContent:"center" }}><button onClick={()=>startEdit(med)} style={{ padding:"4px 10px",borderRadius:5,border:"1.5px solid #4299e1",background:"#fff",color:"#2b6cb0",fontWeight:700,cursor:"pointer" }}>Edit</button><button onClick={()=>deleteMed(med.id)} style={{ padding:"4px 10px",borderRadius:5,border:"1.5px solid #fc8181",background:"#fff",color:"#c53030",fontWeight:700,cursor:"pointer" }}>✕</button></div>)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ padding:"10px 18px",background:"#f7fafc",borderTop:"1px solid #e2e8f0",display:"flex",gap:16,fontSize:11,color:"#718096",flexWrap:"wrap" }}>
                <span>🟢 1x/day &nbsp;🔵 2x/day &nbsp;🟠 3-4x/day</span>
                <span style={{ marginLeft:"auto" }}>Changes here auto-populate Drop Selection</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ DROP SELECTION ══════════ */}
        {activeTab==="selection" && (
          <div>
            <div style={{ background:"rgba(255,255,255,0.95)",borderRadius:14,padding:"18px 22px",marginBottom:18,boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
              <div className="patient-row">
                <FormField label="Patient Name"    value={patientName}    onChange={setPatientName}    placeholder="Enter patient name…"    />
                <FormField label="Patient Address" value={patientAddress} onChange={setPatientAddress} placeholder="Enter patient address…" />
              </div>
            </div>

            <div className="eye-grid">
              {[
                { label:"RIGHT EYE (OD)", side:"right", drops:rightDrops, color:"#2b6cb0", light:"#ebf8ff" },
                { label:"LEFT EYE (OS)",  side:"left",  drops:leftDrops,  color:"#276749", light:"#f0fff4" },
              ].map(({ label,side,drops,color,light }) => (
                <div key={side} style={{ background:"rgba(255,255,255,0.97)",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
                  <div style={{ background:color,padding:"13px 20px",color:"#fff",fontSize:15,fontWeight:700 }}>{label}</div>
                  <div style={{ padding:"16px 18px" }}>
                    {/* Column headers — hidden on smallest screens */}
                    <div className="drop-row" style={{ marginBottom:10,fontSize:11,fontWeight:700,color:"#718096",textTransform:"uppercase",letterSpacing:"0.5px" }}>
                      <div>#</div><div>Medication</div>
                      {!isMobile && <><div>Times / Day</div><div># Drops</div></>}
                    </div>
                    {drops.map((drop,i) => {
                      const med = formulary.find(m => m.brand===drop.brand);
                      return (
                        <div key={i} className="drop-row">
                          <div style={{ width:24,height:24,marginTop:4,background:drop.brand?color:"#e2e8f0",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:drop.brand?"#fff":"#a0aec0",flexShrink:0 }}>{i+1}</div>
                          <div>
                            <select value={drop.brand} onChange={e=>updateDrop(side,i,"brand",e.target.value)}
                              style={{ width:"100%",padding:"7px 10px",borderRadius:8,border:`1.5px solid ${drop.brand?color:"#cbd5e0"}`,color:drop.brand?"#1a202c":"#a0aec0",background:drop.brand?light:"#fff",outline:"none",cursor:"pointer" }}>
                              <option value="">— Select medication —</option>
                              {[...formulary].sort((a,b)=>a.brand.localeCompare(b.brand)).map(m=><option key={m.id} value={m.brand}>{m.brand}</option>)}
                            </select>
                            <div style={{ fontSize:10,color:"#718096",marginTop:3,paddingLeft:2,minHeight:16,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                              <span style={{ fontStyle:"italic" }}>{med?med.generic:""}</span>
                              {med&&med.lu&&med.lu!=="—"&&<span style={{ background:"#e9d8fd",color:"#553c9a",borderRadius:10,padding:"1px 7px",fontWeight:700,fontStyle:"normal",whiteSpace:"nowrap" }}>LU {med.lu}</span>}
                            </div>
                            {/* On mobile: selects stack under the medication dropdown */}
                            {isMobile && (
                              <div className="drop-selects">
                                <select value={drop.freq} onChange={e=>updateDrop(side,i,"freq",Number(e.target.value))} disabled={!drop.brand}
                                  style={{ width:"100%",padding:"6px 8px",borderRadius:8,border:`1.5px solid ${drop.brand?color:"#e2e8f0"}`,color:drop.brand?"#1a202c":"#a0aec0",background:drop.brand?light:"#f7fafc",outline:"none" }}>
                                  {FREQ_OPTIONS.map(f=><option key={f} value={f}>{f}x / day</option>)}
                                </select>
                                <select value={drop.drops} onChange={e=>updateDrop(side,i,"drops",Number(e.target.value))} disabled={!drop.brand}
                                  style={{ width:"100%",padding:"6px 8px",borderRadius:8,border:`1.5px solid ${drop.brand?color:"#e2e8f0"}`,color:drop.brand?"#1a202c":"#a0aec0",background:drop.brand?light:"#f7fafc",outline:"none" }}>
                                  {DROP_OPTIONS.map(d=><option key={d} value={d}>{d} drop{d>1?"s":""}</option>)}
                                </select>
                              </div>
                            )}
                          </div>
                          {/* On desktop: selects are grid columns */}
                          {!isMobile && <>
                            <select value={drop.freq} onChange={e=>updateDrop(side,i,"freq",Number(e.target.value))} disabled={!drop.brand}
                              style={{ width:"100%",padding:"7px 8px",borderRadius:8,border:`1.5px solid ${drop.brand?color:"#e2e8f0"}`,color:drop.brand?"#1a202c":"#a0aec0",background:drop.brand?light:"#f7fafc",outline:"none" }}>
                              {FREQ_OPTIONS.map(f=><option key={f} value={f}>{f}x / day</option>)}
                            </select>
                            <select value={drop.drops} onChange={e=>updateDrop(side,i,"drops",Number(e.target.value))} disabled={!drop.brand}
                              style={{ width:"100%",padding:"7px 8px",borderRadius:8,border:`1.5px solid ${drop.brand?color:"#e2e8f0"}`,color:drop.brand?"#1a202c":"#a0aec0",background:drop.brand?light:"#f7fafc",outline:"none" }}>
                              {DROP_OPTIONS.map(d=><option key={d} value={d}>{d} drop{d>1?"s":""}</option>)}
                            </select>
                          </>}
                        </div>
                      );
                    })}
                  </div>
                  {drops.filter(d=>d.brand).length>0 && (
                    <div style={{ margin:"0 18px 16px",padding:"11px 14px",background:light,borderRadius:10,border:`1px solid ${color}30` }}>
                      <div style={{ fontSize:11,fontWeight:700,color,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px" }}>Selected</div>
                      {drops.filter(d=>d.brand).map((d,i) => {
                        const med = formulary.find(m=>m.brand===d.brand);
                        return (
                          <div key={i} style={{ fontSize:12,color:"#2d3748",marginBottom:3,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4 }}>
                            <span style={{ fontWeight:600 }}>{d.brand}</span>
                            <span style={{ color:"#718096",display:"flex",gap:8,alignItems:"center" }}>
                              <span>{d.freq}x/day · {d.drops} drop{d.drops>1?"s":""}</span>
                              {med&&med.lu&&med.lu!=="—"&&<span style={{ background:"#e9d8fd",color:"#553c9a",borderRadius:10,padding:"1px 7px",fontSize:10,fontWeight:700 }}>LU {med.lu}</span>}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop:20,display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap" }}>
              <button onClick={()=>setActiveTab("schedule")} style={{ background:"linear-gradient(135deg,#4299e1,#3182ce)",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 20px rgba(66,153,225,0.4)" }}>📅 Generate Schedule →</button>
              <button onClick={()=>setActiveTab("rx")}       style={{ background:"linear-gradient(135deg,#805ad5,#6b46c1)",color:"#fff",border:"none",borderRadius:10,padding:"12px 28px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 6px 20px rgba(107,70,193,0.4)" }}>📋 Create Rx →</button>
            </div>
          </div>
        )}

        {/* ══════════ SCHEDULE ══════════ */}
        {activeTab==="schedule" && (
          <div>
            <div style={{ background:"rgba(255,255,255,0.95)",borderRadius:14,padding:"16px 22px",marginBottom:18,boxShadow:"0 8px 32px rgba(0,0,0,0.25)",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap" }}>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <label style={{ fontSize:13,fontWeight:600,color:"#4a5568" }}>Month:</label>
                <select value={scheduleMonth} onChange={e=>setScheduleMonth(Number(e.target.value))} style={{ padding:"7px 12px",borderRadius:8,border:"1.5px solid #cbd5e0",outline:"none" }}>
                  {months.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                <label style={{ fontSize:13,fontWeight:600,color:"#4a5568" }}>Year:</label>
                <select value={scheduleYear} onChange={e=>setScheduleYear(Number(e.target.value))} style={{ padding:"7px 12px",borderRadius:8,border:"1.5px solid #cbd5e0",outline:"none" }}>
                  {years.map(y=><option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button onClick={handlePrint} style={{ marginLeft:"auto",background:"linear-gradient(135deg,#48bb78,#38a169)",color:"#fff",border:"none",borderRadius:8,padding:"9px 22px",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(72,187,120,0.35)" }}>🖨 Print Schedule</button>
            </div>

            {activeRight.length===0&&activeLeft.length===0 ? (
              <div style={{ background:"rgba(255,255,255,0.95)",borderRadius:14,padding:40,textAlign:"center",boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
                <div style={{ fontSize:48,marginBottom:12 }}>💊</div>
                <div style={{ fontSize:17,fontWeight:700,color:"#2d3748",marginBottom:6 }}>No drops selected</div>
                <div style={{ fontSize:13,color:"#718096" }}>Go to Drop Selection to choose medications</div>
              </div>
            ) : (
              <div ref={printRef}>
                <div style={{ background:"rgba(255,255,255,0.97)",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
                  <div style={{ background:"linear-gradient(135deg,#1a365d,#2a4a8a)",padding:"15px 22px",color:"#fff",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10 }}>
                    <div>
                      <div style={{ fontSize:17,fontWeight:700 }}>{patientName&&`${patientName} — `}Eye Drop Schedule</div>
                      <div style={{ fontSize:12,color:"#90cdf4",marginTop:2 }}>{MONTH_NAMES[scheduleMonth]} {scheduleYear}</div>
                    </div>
                    <div style={{ display:"flex",gap:18 }}>
                      {activeRight.length>0&&<div style={{ textAlign:"center" }}><div style={{ fontSize:10,color:"#90cdf4",marginBottom:2 }}>RIGHT EYE (OD)</div><div style={{ fontSize:13,fontWeight:700 }}>{activeRight.length} drop{activeRight.length>1?"s":""}</div></div>}
                      {activeLeft.length >0&&<div style={{ textAlign:"center" }}><div style={{ fontSize:10,color:"#90cdf4",marginBottom:2 }}>LEFT EYE (OS)</div><div  style={{ fontSize:13,fontWeight:700 }}>{activeLeft.length}  drop{activeLeft.length>1?"s":""}</div></div>}
                    </div>
                  </div>
                  <div style={{ overflowX:"auto" }}>
                    <table style={{ width:"100%",borderCollapse:"collapse",minWidth:500 }}>
                      <thead>
                        <tr>
                          <th style={{...thBase,width:100,background:"#2d3748"}}>Date</th>
                          <th style={{...thBase,width:44,background:"#2d3748"}}>Day</th>
                          {activeRight.length>0&&<th colSpan={activeRight.length} style={{...thBase,background:"#1a4a8a"}}>RIGHT EYE (OD)</th>}
                          {activeLeft.length >0&&<th colSpan={activeLeft.length}  style={{...thBase,background:"#1a5c3a"}}>LEFT EYE (OS)</th>}
                          <th style={{...thBase,background:"#2d3748",width:80}}>Notes</th>
                        </tr>
                        <tr>
                          <th style={{...th2Base,background:"#4a5568"}}></th>
                          <th style={{...th2Base,background:"#4a5568"}}></th>
                          {activeRight.map((d,i)=><th key={i} style={{...th2Base,background:"#2b6cb0"}}><div style={{ fontWeight:700,fontSize:11 }}>{d.brand}</div><div style={{ fontSize:10,color:"#bee3f8",fontWeight:400,marginTop:1 }}>{d.freq}x/day · {d.drops} drop{d.drops>1?"s":""}</div></th>)}
                          {activeLeft.map( (d,i)=><th key={i} style={{...th2Base,background:"#276749"}}><div style={{ fontWeight:700,fontSize:11 }}>{d.brand}</div><div style={{ fontSize:10,color:"#c6f6d5",fontWeight:400,marginTop:1 }}>{d.freq}x/day · {d.drops} drop{d.drops>1?"s":""}</div></th>)}
                          <th style={{...th2Base,background:"#4a5568"}}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({length:numDays},(_,dayIdx)=>{
                          const date=new Date(scheduleYear,scheduleMonth,dayIdx+1);
                          const dow=date.getDay();
                          const isSun=dow===0,isSat=dow===6;
                          const rowBg=isSun?"#fff5f5":isSat?"#ebf8ff":dayIdx%2===1?"#f7fafc":"#fff";
                          const dateStr=date.toLocaleDateString("en-CA",{month:"short",day:"2-digit",year:"numeric"}).replace(",","");
                          return (
                            <tr key={dayIdx}>
                              <td style={{...tdBase,background:rowBg,fontWeight:600,color:isSun?"#c53030":isSat?"#2b6cb0":"#2d3748",fontSize:11,whiteSpace:"nowrap"}}>{dateStr}</td>
                              <td style={{...tdBase,background:rowBg,fontWeight:700,fontSize:11,color:isSun?"#c53030":isSat?"#2b6cb0":"#718096"}}>{DAY_NAMES[dow]}</td>
                              {activeRight.map((d,i)=><td key={i} style={{...tdBase,background:rowBg}}><CheckBoxes count={d.freq}/></td>)}
                              {activeLeft.map( (d,i)=><td key={i} style={{...tdBase,background:rowBg}}><CheckBoxes count={d.freq}/></td>)}
                              <td style={{...tdBase,background:rowBg}}></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ padding:"10px 18px",background:"#f7fafc",borderTop:"1px solid #e2e8f0",fontSize:11,color:"#718096",display:"flex",gap:20,flexWrap:"wrap" }}>
                    <span>☐ = Check box after administering each drop</span>
                    <span style={{ color:"#c53030" }}>■ Sunday</span>
                    <span style={{ color:"#2b6cb0" }}>■ Saturday</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ RX TEMPLATE ══════════ */}
        {activeTab==="rx" && (
          <div className="rx-layout">
            <div style={{ background:"rgba(255,255,255,0.95)",borderRadius:14,overflow:"hidden",boxShadow:"0 8px 32px rgba(0,0,0,0.25)" }}>
              <div style={{ background:"linear-gradient(135deg,#553c9a,#6b46c1)",padding:"13px 18px",color:"#fff" }}>
                <div style={{ fontSize:14,fontWeight:700 }}>Physician Details</div>
                <div style={{ fontSize:11,color:"#e9d8fd",marginTop:2 }}>Auto-fills the prescription header</div>
              </div>
              <div style={{ padding:"16px 18px" }}>
                {[
                  ["Physician Name",         physicianName,  setPhysicianName,  "Dr. Jane Smith, MD"           ],
                  ["Clinic / Practice Name", clinicName,     setClinicName,     "City Eye Care Associates"     ],
                  ["Street Address",         clinicAddress,  setClinicAddress,  "123 Medical Drive, Suite 400" ],
                  ["City, Province / State", clinicCity,     setClinicCity,     "Toronto, ON  M5V 2T6"         ],
                  ["Phone Number",           clinicPhone,    setClinicPhone,    "(416) 555-0100"               ],
                  ["License / DEA / CPSO #", licenseNum,     setLicenseNum,     "ON-123456"                    ],
                ].map(([label,val,setter,ph]) => (
                  <div key={label} style={{ marginBottom:10 }}>
                    <label style={{ fontSize:11,fontWeight:700,color:"#4a5568",textTransform:"uppercase",letterSpacing:"0.5px",display:"block",marginBottom:4 }}>{label}</label>
                    <input value={val} onChange={e=>setter(e.target.value)} placeholder={ph}
                      style={{ width:"100%",padding:"8px 12px",borderRadius:7,border:"1.5px solid #cbd5e0",color:"#2d3748",outline:"none",background:"#fff",boxSizing:"border-box" }}
                    />
                  </div>
                ))}
                <hr style={{ border:"none",borderTop:"1px solid #e2e8f0",margin:"12px 0 10px" }}/>
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11,fontWeight:700,color:"#4a5568",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8 }}>Refills Authorized</div>
                  <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>
                    {[0,1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>setRxRefills(n)} style={{ width:34,height:34,borderRadius:"50%",border:`2px solid ${rxRefills===n?"#6b46c1":"#cbd5e0"}`,background:rxRefills===n?"#6b46c1":"#fff",color:rxRefills===n?"#fff":"#4a5568",fontWeight:700,cursor:"pointer" }}>
                        {n===0?"✕":n}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize:11,color:"#718096",marginTop:5 }}>{rxRefills===0?"No refills":`${rxRefills} refill${rxRefills>1?"s":""} authorized`}</div>
                </div>
                <div>
                  <div style={{ fontSize:11,fontWeight:700,color:"#4a5568",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4 }}>Additional Notes</div>
                  <textarea value={rxNotes} onChange={e=>setRxNotes(e.target.value)} placeholder="e.g. Apply gentle pressure to inner corner of eye for 1 minute…" rows={3}
                    style={{ width:"100%",padding:"8px 12px",borderRadius:7,border:"1.5px solid #cbd5e0",fontSize:13,color:"#2d3748",outline:"none",resize:"vertical",fontFamily:"inherit",boxSizing:"border-box" }}
                  />
                </div>
                <button onClick={handleRxPrint} style={{ width:"100%",marginTop:12,background:"linear-gradient(135deg,#805ad5,#6b46c1)",color:"#fff",border:"none",borderRadius:8,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 12px rgba(107,70,193,0.4)" }}>
                  🖨 Print Prescription
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.45)",marginBottom:10,textAlign:"center" }}>Preview — print to give to patient</div>
              <div ref={rxPrintRef}>
                <div className="rx-paper" style={{ background:"#fff",border:"2px solid #1a365d",padding:"28px 34px 110px",boxShadow:"0 16px 50px rgba(0,0,0,0.4)",position:"relative",minHeight:680,fontFamily:"'Times New Roman',Georgia,serif",color:"#111" }}>
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:12,borderBottom:"2.5px solid #1a365d",marginBottom:14,flexWrap:"wrap",gap:10 }}>
                    <div style={{ lineHeight:1 }}>
                      <span style={{ fontSize:60,fontWeight:900,color:"#1a365d",fontStyle:"italic",fontFamily:"'Times New Roman',serif" }}>R</span>
                      <span style={{ fontSize:26,fontWeight:900,color:"#1a365d",fontStyle:"italic",verticalAlign:"super" }}>x</span>
                    </div>
                    <div style={{ textAlign:"right",fontSize:11,lineHeight:1.65,color:"#222",maxWidth:260 }}>
                      {clinicName    &&<div style={{ fontSize:14,fontWeight:700,color:"#1a365d",marginBottom:2 }}>{clinicName}</div>}
                      {physicianName &&<div style={{ fontWeight:600,fontSize:12 }}>{physicianName}</div>}
                      {clinicAddress &&<div>{clinicAddress}</div>}
                      {clinicCity    &&<div>{clinicCity}</div>}
                      {clinicPhone   &&<div>{clinicPhone}</div>}
                      {licenseNum    &&<div style={{ color:"#666",fontSize:10,marginTop:2 }}>Lic. # {licenseNum}</div>}
                    </div>
                  </div>
                  <div style={{ display:"flex",justifyContent:"flex-end",fontSize:11,marginBottom:14,alignItems:"center",gap:8 }}>
                    <span style={{ fontWeight:700 }}>Date:</span>
                    <span style={{ borderBottom:"1px solid #555",minWidth:160,paddingBottom:1,paddingLeft:6,fontSize:12 }}>{todayStr}</span>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ marginBottom:9 }}><span style={{ fontSize:11,fontWeight:700 }}>Patient: </span><span style={{ display:"inline-block",borderBottom:"1px solid #666",minWidth:280,fontSize:13,paddingBottom:1,paddingLeft:4 }}>{patientName}</span></div>
                    <div><span style={{ fontSize:11,fontWeight:700 }}>Address: </span><span style={{ display:"inline-block",borderBottom:"1px solid #666",minWidth:270,fontSize:12,paddingBottom:1,paddingLeft:4 }}>{patientAddress}</span></div>
                  </div>
                  <hr style={{ border:"none",borderTop:"1.5px solid #1a365d",margin:"0 0 14px" }}/>
                  <div style={{ fontSize:13,fontWeight:700,color:"#1a365d",marginBottom:14,fontStyle:"italic" }}>Prescription:</div>
                  {mergedDrops.length===0
                    ? <div style={{ fontSize:12,color:"#aaa",fontStyle:"italic",padding:"14px 0" }}>No medications selected — go to Drop Selection tab.</div>
                    : mergedDrops.map((d,i)=>{
                        const med=formulary.find(m=>m.brand===d.brand);
                        return (
                          <div key={i} style={{ marginBottom:15,paddingLeft:14,borderLeft:"3px solid #1a365d" }}>
                            <div style={{ fontSize:15,fontWeight:700,color:"#1a365d" }}>{d.brand}</div>
                            {med&&<div style={{ fontSize:10,color:"#666",fontStyle:"italic",marginTop:2 }}>{med.generic}</div>}
                            <div style={{ fontSize:12,marginTop:5,color:"#111",lineHeight:1.6 }}>Instill <strong>{d.drops}</strong> drop{d.drops>1?"s":""} — <strong>{FREQ_LABEL[d.freq]||`${d.freq}x/day`}</strong></div>
                            <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:3 }}>
                              <span style={{ fontSize:11,color:"#2b6cb0",fontWeight:700 }}>{d.eye}</span>
                              {med&&med.lu&&med.lu!=="—"&&<span style={{ fontSize:10,background:"#e9d8fd",color:"#553c9a",borderRadius:10,padding:"1px 8px",fontWeight:700 }}>LU {med.lu}</span>}
                            </div>
                          </div>
                        );
                      })
                  }
                  {rxNotes&&<div style={{ marginTop:10,fontSize:11,color:"#444",fontStyle:"italic",borderLeft:"2px solid #ccc",paddingLeft:10,lineHeight:1.6 }}>{rxNotes}</div>}
                  <div style={{ position:"absolute",bottom:22,left:34,right:34 }}>
                    <div style={{ borderTop:"1.5px solid #1a365d",paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:10 }}>
                      <div style={{ fontSize:11 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                          <span style={{ fontWeight:700,fontSize:12 }}>Do Not Refill</span>
                          <span style={{ width:18,height:18,border:"1.5px solid #333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700 }}>{rxRefills===0?"✓":""}</span>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                          <span style={{ fontWeight:700,fontSize:12,marginRight:2 }}>Refill</span>
                          {[1,2,3,4,5].map(n=><span key={n} style={{ width:22,height:22,borderRadius:"50%",border:"1.5px solid #333",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,background:rxRefills>=n?"#1a365d":"#fff",color:rxRefills>=n?"#fff":"#333" }}>{n}</span>)}
                        </div>
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ borderBottom:"1.5px solid #333",width:190,height:36,marginBottom:5 }}></div>
                        <div style={{ fontSize:11,color:"#555" }}>Signature</div>
                        {physicianName&&<div style={{ fontSize:10,color:"#888",marginTop:2 }}>{physicianName}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
