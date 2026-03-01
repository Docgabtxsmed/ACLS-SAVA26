import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import DosePanel from '../components/DosePanel';
import './AlgoPage.css';

export default function StrokePage() {
  return (
    <div className="algo-page">
      <Navbar title="Acute Stroke Algorithm" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🧠</span>
        <h1 className="algo-page-title">Acute Stroke Algorithm</h1>
        <span className="algo-page-case">ACLS Cases 7</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Start */}
          <FlowchartNode
            type="critical"
            title="ACTIVATE EMERGENCY RESPONSE"
            items={['Identify symptoms/signs of stroke']}
          />

          <FlowchartArrow direction="down" />

          {/* EMS Assessment */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">NINDS TIME GOALS</span>
            <FlowchartNode
              type="action"
              title="IMPORTANT EMS ASSESSMENT/ACTIONS"
              items={[
                'Complete prehospital stroke assessment',
                'Note time of symptom onset (last normal)',
                'Support ABCs; give O2',
                'Check glucose',
                'Triage to stroke center',
                'Alert hospital',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* General Assessment */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">ED ARRIVAL WITHIN 10 MINUTES OR LESS</span>
            <FlowchartNode
              type="action"
              title="GENERAL ASSESSMENT/STABILIZATION"
              items={[
                'Evaluate vital signs/ABCs',
                'Attain IV access/perform lab assessments',
                'Attain 12-lead ECG',
                'Give O2 if hypoxemic',
                'Check glucose; treat if needed',
                'Complete neurologic screening assessment',
                'Order MRI of brain/emergency CT scan',
                'Activate stroke team',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Neuro Assessment */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">ED ARRIVAL WITHIN 25 MINUTES OR LESS</span>
            <FlowchartNode
              type="action"
              title="NEUROLOGIC ASSESSMENT BY STROKE TEAM"
              items={[
                'Go over patient history',
                'Complete neurologic examination (CPSS or NIH Stroke Scale)',
                'Note last known normal or symptom onset time',
              ]}
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* CT Decision */}
          <div className="flowchart-node-wrapper">
            <span className="flowchart-time-label">ED ARRIVAL WITHIN 45 MINUTES OR LESS</span>
            <FlowchartNode
              type="decision"
              title="CT SCAN DISPLAYS HEMORRHAGE?"
            />
          </div>

          <FlowchartArrow direction="down" />

          {/* Branch: Hemorrhagic vs Ischemic */}
          <div className="flowchart-branch">

            {/* YES → Hemorrhagic */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">YES — HEMORRHAGIC</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="SEE NEUROSURGEON/NEUROLOGIST"
                items={['Transfer if not available']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="info"
                title="GIVE ASPIRIN"
                items={['Manage hemorrhagic stroke per protocol']}
              />
            </div>

            {/* NO → Ischemic */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NO — ISCHEMIC</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="ACUTE ISCHEMIC STROKE LIKELY"
                items={[
                  'Prepare for fibrinolytic therapy',
                  'Repeat neurologic exam; deficits improving to normal?',
                  'Search for fibrinolytic exclusions',
                ]}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="decision"
                title="FIBRINOLYTIC THERAPY STILL POSSIBLE?"
              />
              <FlowchartArrow direction="down" />

              <div className="flowchart-branch">
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--yes">CANDIDATE</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="critical"
                    title="ADMINISTER rtPA (ALTEPLASE)"
                    items={[
                      'Begin fibrinolytic therapy per protocol',
                      'Monitor for complications',
                      'Admit to stroke unit/ICU',
                    ]}
                  />
                </div>
                <div className="flowchart-branch-path">
                  <span className="flowchart-branch-label flowchart-branch-label--no">NON-CANDIDATE</span>
                  <FlowchartArrow direction="down" />
                  <FlowchartNode
                    type="info"
                    title="GIVE ASPIRIN"
                    items={[
                      'Consider thrombectomy if LVO',
                      'Admit to stroke unit',
                      'Continue supportive care',
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="flowchart-sidebar">
          <DosePanel
            title="NINDS Time Goals"
            accentColor="#8e44ad"
            items={[
              { label: 'Door-to-physician', detail: '10 minutes' },
              { label: 'Door-to-CT completion', detail: '25 minutes' },
              { label: 'Door-to-CT read', detail: '45 minutes' },
              { label: 'Door-to-drug (rtPA)', detail: '60 minutes' },
              { label: 'Door-to-monitored bed', detail: '3 hours' },
            ]}
          />
          <DosePanel
            title="Stroke Assessment Scales"
            accentColor="#5b6abf"
            items={[
              { label: 'CPSS (Cincinnati)', detail: 'Facial Droop, Arm Drift, Speech' },
              { label: 'NIH Stroke Scale', detail: 'Quantifies stroke severity (0-42)' },
              { label: 'Key: Last Known Normal', detail: 'Critical for fibrinolytic eligibility window' },
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
