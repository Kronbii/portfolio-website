import styles from './authority.module.css'

interface DiagramProps {
  id: string
  caption: string
  alt: string
}

interface DiagramNodeProps {
  title: string
  detail?: string
}

function Node({ title, detail }: DiagramNodeProps) {
  return (
    <div className={styles.diagramNode}>
      <span className={styles.diagramNodeTitle}>{title}</span>
      {detail ? <span className={styles.diagramNodeDetail}>{detail}</span> : null}
    </div>
  )
}

function Arrow({ label }: { label?: string }) {
  return (
    <span className={styles.diagramArrow} aria-hidden="true">
      {label ?? '→'}
    </span>
  )
}

function pidLoop() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Setpoint" detail="Desired value r(t) from the caller." />
        <Arrow />
        <Node title="Error" detail="e(t) = r(t) − y(t) computed on each sample." />
        <Arrow />
        <Node title="PID sum" detail="P · e + I · ∫e dt + D · de/dt with filtering and anti-windup." />
      </div>
      <div className={styles.diagramRow} style={{ marginTop: '1rem' }}>
        <Node title="Output limits" detail="Bounded actuator command u(t)." />
        <Arrow />
        <Node title="Plant" detail="Motor, heater, or valve driven by u(t)." />
        <Arrow />
        <Node title="Sensor" detail="Measured y(t) fed back to the error step." />
      </div>
    </div>
  )
}

function lightTracker() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="4 × LDR" detail="Top, bottom, left, right sensors form a directional error." />
        <Arrow />
        <Node title="PID controller" detail="Runs on Arduino; per-axis gains, filtering, and limits." />
        <Arrow />
        <Node title="Yaw & pitch servos" detail="Two servos move the sensor assembly." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Debug output" detail="Per-term contributions to distinguish measurement vs controller." />
        <Node title="Mechanical limits" detail="Backlash, travel, and chassis flex are inside the loop." />
        <Node title="Feedback" detail="New sensor pose changes the light distribution — closing the loop." />
      </div>
    </div>
  )
}

function prescriptionFlow() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Ingest" detail="CLI batches or validated FastAPI requests with images." />
        <Arrow />
        <Node title="Extract" detail="Gemini call returns structured medicine-name candidates." />
        <Arrow />
        <Node title="Normalize" detail="Optional medicine database supports lookup and review." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Structured result" detail="Medicine names, uncertainty, and error paths." />
        <Node title="Human review" detail="Every result is verified against the source image." />
        <Node title="Boundary" detail="Not a prescribing, dispensing, or clinical system." />
      </div>
    </div>
  )
}

function supportCouncil() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Intake" detail="Synthetic B2B submissions enter the console." />
        <Arrow />
        <Node title="LLM proposal" detail="Ollama local model (or optional OpenAI-compatible provider)." />
        <Arrow />
        <Node title="Deterministic rules" detail="Confidence thresholds and escalation conditions." />
      </div>
      <div className={styles.diagramRow} style={{ marginTop: '1rem' }}>
        <Node title="Human review" detail="Original submission, proposal, confidence, and rules — all visible." />
        <Arrow />
        <Node title="PostgreSQL" detail="Reviewed state persists here; Redis/RQ handles background work." />
        <Arrow />
        <Node title="JSON export" detail="Reflects the reviewed state, not intermediate predictions." />
      </div>
    </div>
  )
}

function signTranslation() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Camera" detail="Signer, background, lighting, and hardware differ per deployment." />
        <Arrow />
        <Node title="Recognition" detail="Visual model produces candidate signs with confidence." />
        <Arrow />
        <Node title="Language output" detail="Recognized signs are converted for a listener in context." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Mobile" detail="Handheld deployment with limited compute." />
        <Node title="Web" detail="Browser deployment with different latency profile." />
        <Node title="Offline embedded" detail="Standalone device without network dependency." />
      </div>
    </div>
  )
}

function postureLoop() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Camera" detail="Desk-mounted camera estimates posture." />
        <Arrow />
        <Node title="ESP32 policy" detail="Dead bands, mechanical limits, slow transitions." />
        <Arrow />
        <Node title="Actuators" detail="Motorized height and tilt change the work surface." />
      </div>
      <div className={styles.diagramRow} style={{ marginTop: '1rem' }}>
        <Node title="Feedback" detail="LED signals current state to the user." />
        <Arrow />
        <Node title="Dashboard" detail="Longer-term posture patterns for review." />
        <Arrow />
        <Node title="Manual override" detail="A person can stop or unset any correction." />
      </div>
    </div>
  )
}

function uavFod() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Airframe" detail="Raspberry Pi 5B UAV carries the camera at low altitude." />
        <Arrow />
        <Node title="YOLOv11" detail="Lightweight variant runs onboard at the edge." />
        <Arrow />
        <Node title="Similarity match" detail="Reduces false positives across consecutive frames." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Detections" detail="Tracked FOD candidates with position." />
        <Node title="Flight test" detail="Parking-lot environments simulate runway conditions." />
        <Node title="Human review" detail="Detections are inspected before action." />
      </div>
    </div>
  )
}

function fpvStack() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Motors & props" detail="Chosen from thrust and current targets." />
        <Arrow />
        <Node title="Battery" detail="Voltage sets the power budget and headroom." />
        <Arrow />
        <Node title="Frame" detail="Weight and component placement decide response." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Betaflight config" detail="Wires flight-controller behavior together." />
        <Node title="PID tuning" detail="Only after the physical build is coherent." />
        <Node title="Flight modes / GPS / RTH" detail="Configured and evaluated in real conditions." />
      </div>
    </div>
  )
}

function emotionPipeline() {
  return (
    <div className={styles.diagram}>
      <div className={styles.diagramRow}>
        <Node title="Camera" detail="Face is captured in the target context." />
        <Arrow />
        <Node title="Landmarks" detail="Facial-landmark extractor produces geometric features." />
        <Arrow />
        <Node title="CNN" detail="Small CNN runs on Jetson Orin Nano." />
      </div>
      <div className={styles.diagramRowThree} style={{ marginTop: '1rem' }}>
        <Node title="Confidence" detail="Predictions are qualified rather than reported as certain." />
        <Node title="Boundary" detail="Not a diagnostic tool; not a substitute for a clinician." />
        <Node title="Context evaluation" detail="Any use must be evaluated with the intended people and settings." />
      </div>
    </div>
  )
}

const RENDERERS: Record<string, () => JSX.Element> = {
  'pid-loop': pidLoop,
  'light-tracker': lightTracker,
  'prescription-flow': prescriptionFlow,
  'support-council': supportCouncil,
  'sign-translation': signTranslation,
  'posture-loop': postureLoop,
  'uav-fod': uavFod,
  'fpv-stack': fpvStack,
  'emotion-pipeline': emotionPipeline,
}

export function Diagram({ id, caption, alt }: DiagramProps) {
  const render = RENDERERS[id]
  if (!render) {
    return null
  }
  return (
    <figure aria-label={alt}>
      {render()}
      <figcaption className={styles.diagramCaption}>{caption}</figcaption>
    </figure>
  )
}

export function hasDiagram(id: string) {
  return Boolean(RENDERERS[id])
}
