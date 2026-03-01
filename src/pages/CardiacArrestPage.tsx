import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function CardiacArrestPage() {
  return (
    <div className="algo-page">
      <Navbar title="Adult Cardiac Arrest Algorithm" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">💔</span>
        <h1 className="algo-page-title">Adult Cardiac Arrest Algorithm</h1>
        <span className="algo-page-case">ACLS Cases 6</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Start */}
          <FlowchartNode
            type="start"
            title="ACTIVATE EMERGENCY RESPONSE"
          />

          <FlowchartArrow direction="down" />

          {/* Step 1 */}
          <FlowchartNode
            type="action"
            title="START CPR"
            stepNumber={1}
            items={[
              'Give oxygen',
              'Attach monitor/defibrillator',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decision: Shockable? */}
          <FlowchartNode
            type="decision"
            title="SHOCKABLE RHYTHM?"
            items={['Check rhythm on monitor']}
          />

          <FlowchartArrow direction="down" />

          {/* Branch: VF/pVT vs Asystole/PEA */}
          <div className="flowchart-branch">

            {/* LEFT: Shockable (VF/pVT) */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">YES — VF/pVT</span>

              <FlowchartArrow direction="down" />
              <FlowchartNode type="action" title="VF/pVT" stepNumber={2} />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="critical" title="ADMINISTER SHOCK" stepNumber={3} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="CPR FOR TWO MINUTES"
                stepNumber={4}
                items={['IV/IO access']}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="SHOCKABLE RHYTHM?" />

              <FlowchartArrow direction="down" label="YES" />
              <FlowchartNode type="critical" title="ADMINISTER SHOCK" stepNumber={5} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="CPR FOR TWO MINUTES"
                stepNumber={6}
                items={[
                  'Epinephrine every 3 to 5 min',
                  'Consider advanced airway and capnography',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="SHOCKABLE RHYTHM?" />

              <FlowchartArrow direction="down" label="YES" />
              <FlowchartNode type="critical" title="ADMINISTER SHOCK" stepNumber={7} />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="CPR FOR TWO MINUTES"
                stepNumber={8}
                items={[
                  'Amiodarone or Lidocaine',
                  'Treat reversible causes',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="ASSESS ROSC"
                items={[
                  'If no signs of ROSC, go to step 5 or 7',
                  'If signs of ROSC, go to Post-Cardiac Arrest Care',
                ]}
              />
            </div>

            {/* RIGHT: Non-Shockable (Asystole/PEA) */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NO — Asystole/PEA</span>

              <FlowchartArrow direction="down" />
              <FlowchartNode type="action" title="ASYSTOLE/PEA" stepNumber={9} />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="critical" title="EPINEPHRINE ASAP" />

              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="CPR FOR TWO MINUTES"
                stepNumber={10}
                items={[
                  'Epinephrine every 3 to 5 min',
                  'Consider advanced airway and capnography',
                ]}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="SHOCKABLE RHYTHM?" />

              <FlowchartArrow direction="down" label="NO" />
              <FlowchartNode
                type="action"
                title="CPR TWO MINUTES"
                stepNumber={11}
                items={['Treat reversible causes']}
              />

              <FlowchartArrow direction="down" />
              <FlowchartNode type="decision" title="SHOCKABLE RHYTHM?" />

              <FlowchartArrow direction="down" label="YES" />
              <FlowchartNode
                type="warning"
                title="GO TO STEP 5 OR 7"
                items={['Switch to shockable rhythm pathway']}
              />

              <FlowchartArrow direction="down" label="NO" />
              <FlowchartNode
                type="info"
                title="ASSESS ROSC"
                items={[
                  'If no signs of ROSC, go to step 10 or 11',
                  'If signs of ROSC, go to Post-Cardiac Arrest Care',
                ]}
              />
            </div>
          </div>
        </div>

        {/* Sidebar: Doses */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="Medications"
            accentColor="#c0392b"
            items={[
              { label: 'Epinephrine', detail: '1 mg IV/IO every 3–5 minutes' },
              { label: 'Amiodarone (1st dose)', detail: '300 mg bolus IV/IO' },
              { label: 'Amiodarone (2nd dose)', detail: '150 mg IV/IO' },
              { label: 'Lidocaine (1st dose)', detail: '1–1.5 mg/kg IV/IO' },
              { label: 'Lidocaine (subsequent)', detail: '0.5–0.75 mg/kg IV/IO' },
            ]}
          />
          <DosePanel
            title="H's and T's (Reversible Causes)"
            accentColor="#5b6abf"
            items={[
              { label: 'H — Hypovolemia', detail: 'Volume resuscitation' },
              { label: 'H — Hypoxia', detail: 'Oxygenation/ventilation' },
              { label: 'H — Hydrogen Ion', detail: 'Acidosis correction' },
              { label: 'H — Hypo/Hyperkalemia', detail: 'Electrolyte correction' },
              { label: 'H — Hypothermia', detail: 'Rewarming' },
              { label: 'T — Tension Pneumothorax', detail: 'Needle decompression' },
              { label: 'T — Tamponade (cardiac)', detail: 'Pericardiocentesis' },
              { label: 'T — Toxins', detail: 'Specific antidotes' },
              { label: 'T — Thrombosis (coronary)', detail: 'PCI / fibrinolytics' },
              { label: 'T — Thrombosis (pulmonary)', detail: 'Embolectomy / fibrinolytics' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
