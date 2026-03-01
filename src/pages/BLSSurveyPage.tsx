import Navbar from '../components/Navbar';
import FlowchartNode from '../components/FlowchartNode';
import FlowchartArrow from '../components/FlowchartArrow';
import './AlgoPage.css';

export default function BLSSurveyPage() {
  return (
    <div className="algo-page">
      <Navbar title="BLS Survey for Adults" showBack />

      <header className="algo-page-header">
        <span className="algo-page-icon">🫁</span>
        <h1 className="algo-page-title">BLS Survey for Adults</h1>
        <span className="algo-page-case">ACLS Cases 5 — Basic Life Support</span>
      </header>

      <div className="flowchart-layout">
        <div className="flowchart-main">

          {/* Step 1: Check Responsiveness */}
          <FlowchartNode
            type="action"
            title="CHECK RESPONSIVENESS"
            stepNumber={1}
            items={[
              'Shake and shout, "Are you okay?"',
              'Check for breathing for no more than 10 seconds',
              'If NOT breathing or insufficiently breathing, continue survey',
            ]}
          />

          <FlowchartArrow direction="right" />

          {/* Step 2: Call EMS & Get AED */}
          <FlowchartNode
            type="action"
            title="CALL EMS & GET AED"
            stepNumber={2}
            items={[
              'Send someone to call for emergency medical services (EMS)',
              'Send someone to get an automated external defibrillator (AED)',
              'If you are the ONLY provider, activate EMS and get AED',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Step 3: Defibrillation */}
          <FlowchartNode
            type="critical"
            title="DEFIBRILLATION"
            stepNumber={3}
            items={[
              'If NO pulse, check for shockable rhythm with AED',
              'If shockable rhythm, stand clear when delivering shocks',
              'Provide CPR between shocks, starting with chest compressions',
            ]}
          />

          <FlowchartArrow direction="down" />

          {/* Decision: Pulse check */}
          <FlowchartNode
            type="decision"
            title="PULSE CHECK"
            items={['Check for a pulse for no more than 10 seconds']}
          />

          <FlowchartArrow direction="down" />

          {/* Branch: Pulse vs No Pulse */}
          <div className="flowchart-branch">
            {/* Pulse Present */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--yes">PULSE</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="START RESCUE BREATHING"
                items={['Provide ventilations']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="action"
                title="ONE BREATH EVERY 5 TO 6 SECONDS"
                items={['or 10 to 12 breaths per min']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="start"
                title="CHECK PULSE EVERY 2 MIN"
                items={['Reassess and continue as needed']}
              />
            </div>

            {/* No Pulse */}
            <div className="flowchart-branch-path">
              <span className="flowchart-branch-label flowchart-branch-label--no">NO PULSE</span>
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="START CPR"
                items={['Begin chest compressions immediately']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="30 COMPRESSIONS PER 2 BREATHS"
                items={['Depth of compression at least 2 inches']}
              />
              <FlowchartArrow direction="down" />
              <FlowchartNode
                type="critical"
                title="RATE OF 100–120 COMPRESSIONS PER MIN"
                items={['Allow full chest recoil between compressions', 'Minimize interruptions']}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
