import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function ACSPage() {
  return (
    <div className="algo-page">
      <Navbar title="Acute Coronary Syndrome" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🫀</span>
        <h1 className="algo-page-title">Adult Coronary Syndrome Algorithm</h1>
        <span className="algo-page-case">ACLS Cases 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Start */}
          <FlowchartNode
            type="start"
            title="SYMPTOMS OF INFARCTION OR ISCHEMIA"
          />

          <FlowchartArrow direction="down" />

          {/* EMS Assessment */}
          <FlowchartNode
            type="critical"
            title="EMS ASSESSMENT / HOSPITAL CARE"
            items={[
              'Support ABCs; prepare for CPR/defibrillation',
              'Give aspirin, morphine, nitroglycerin, and oxygen if needed',
              'Obtain 12-lead ECG',
              'If ST elevation:',
              '  • Notify hospital; note first medical contact and onset time',
              '  • Hospital should prepare to respond to STEMI',
              '  • If prehospital fibrinolysis, use fibrinolytic checklist',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* ED Assessment */}
          <FlowchartNode
            type="action"
            title="EMS / ED ASSESSMENT & TREATMENT"
            items={[
              'Check vitals/O2 saturation',
              'IV access',
              'Perform targeted history/physical exam',
              'Complete fibrinolytic checklist, check contraindications',
              'Obtain preliminary cardiac marker levels',
              'Obtain portable chest x-ray (<30min)',
              'Immediate ED Treatment:',
              '  • If O2 saturation <94%, start O2 at 4 L/min, titrate',
              '  • Aspirin 160 to 325 mg PO',
              '  • Nitroglycerin spray or sublingual',
              '  • Morphine IV if nitroglycerin not effective',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* ECG Interpretation Decision */}
          <FlowchartNode
            type="decision"
            title="INTERPRET ECG"
          />

          <FlowchartArrow direction="down" />

          {/* 3-way branch: STEMI / NSTEMI / Normal */}
          <div className="flowchart-branch">

            {/* STEMI */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#e94560', background: 'rgba(233, 69, 96, 0.1)' }}>STEMI</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="ST-ELEVATION OR NEW LBBB"
                items={['High possibility for injury (STEMI)']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="BEGIN ADJUNCTIVE THERAPIES"
                items={['Do not delay reperfusion']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="ONSET TIME ≤12 HOURS?"
              />
              <FlowchartArrow direction="down" label="YES" />
              <FlowchartNode
                type="critical"
                title="REPERFUSION GOALS"
                items={[
                  'Fibrinolysis (door-to-needle) goal less than 30 minutes',
                  'PCI (door-to-balloon inflation) goal less than 90 minutes',
                ]}
              />
            </div>

            {/* NSTEMI */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#e67e22', background: 'rgba(230, 126, 34, 0.1)' }}>NSTEMI/UA</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="warning"
                title="ST DEPRESSION / T-WAVE CHANGES"
                items={[
                  'High possibility for ischemia',
                  'High-risk unstable angina / non-ST-elevation MI (UA/NSTEMI)',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="HIGH-RISK INDICATORS"
                items={[
                  'Elevated troponin or high-risk patient',
                  'Early invasive strategy if:',
                  '  • Ventricular tachycardia',
                  '  • Signs of heart failure',
                  '  • Hemodynamic instability',
                  '  • Refractory ischemic chest discomfort',
                  '  • Persistent/recurrent ST deviation',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="BEGIN ADJUNCTIVE TREATMENTS"
                items={[
                  'Heparin (UFH or LMWH)',
                  'Nitroglycerin',
                  'Consider clopidogrel',
                  'Consider GP IIb/IIIa inhibitor',
                ]}
              />
            </div>

            {/* Normal */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label" style={{ color: '#4a8c5c', background: 'rgba(74, 140, 92, 0.1)' }}>NORMAL/NON-DIAGNOSTIC</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="NORMAL OR NON-DIAGNOSTIC CHANGES"
                items={[
                  'Low-intermediate risk ACS',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="ADMIT TO ED CHEST PAIN UNIT"
                items={[
                  'Cardiac marker numbers (troponin)',
                  'Continuous ST-segment monitoring',
                  'Repeat ECG monitor',
                  'Noninvasive diagnostic test',
                ]}
              />
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Immediate ED Treatment"
            accentColor="#e94560"
            items={[
              { label: 'Oxygen', detail: 'If O2 sat <94%, start at 4 L per minute, titrate' },
              { label: 'Aspirin', detail: '160 to 325 mg PO (chew)' },
              { label: 'Nitroglycerin', detail: 'Spray or sublingual' },
              { label: 'Morphine', detail: 'IV if nitroglycerin not effective' },
            ]}
          />
          <DosePanel
            title="Reperfusion Targets"
            accentColor="#c0392b"
            items={[
              { label: 'Fibrinolysis', detail: 'Door-to-needle goal < 30 minutes' },
              { label: 'PCI', detail: 'Door-to-balloon inflation goal < 90 minutes' },
              { label: 'First Medical Contact', detail: 'Note time of first medical contact and symptom onset' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
