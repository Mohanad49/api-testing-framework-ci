const fs = require('fs');
const path = require('path');

const root = process.cwd();
const reportDir = path.join(root, 'reports', 'newman');
const publicDir = path.join(root, 'public');
const summaryPath = path.join(reportDir, 'summary.json');
const htmlReportPath = path.join(reportDir, 'newman-report.html');
const publicHtmlReportPath = path.join(publicDir, 'newman-report.html');

fs.mkdirSync(publicDir, { recursive: true });

function safeReadSummary() {
  if (!fs.existsSync(summaryPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
}

function metric(summary, key, fallback = 0) {
  return summary?.run?.stats?.[key] || fallback;
}

function pct(numerator, denominator) {
  if (!denominator) return 0;
  return Math.round((numerator / denominator) * 100);
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const summary = safeReadSummary();

if (fs.existsSync(htmlReportPath)) {
  fs.copyFileSync(htmlReportPath, publicHtmlReportPath);
}

const requests = metric(summary, 'requests');
const assertions = metric(summary, 'assertions');
const testScripts = metric(summary, 'testScripts');
const prerequestScripts = metric(summary, 'prerequestScripts');
const requestTotal = requests.total || 0;
const requestFailed = requests.failed || 0;
const assertionTotal = assertions.total || 0;
const assertionFailed = assertions.failed || 0;
const passRate = pct(assertionTotal - assertionFailed, assertionTotal);
const executions = summary?.run?.executions || [];
const failures = summary?.run?.failures || [];
const duration = summary?.run?.timings?.completed && summary?.run?.timings?.started
  ? Math.max(0, summary.run.timings.completed - summary.run.timings.started)
  : 0;

const rows = executions.map((execution, index) => {
  const name = execution.item?.name || `Request ${index + 1}`;
  const code = execution.response?.code ?? '—';
  const time = execution.response?.responseTime ?? '—';
  const assertionFailures = failures.filter(f => f.source?.name === name);
  const statusClass = assertionFailures.length ? 'fail' : 'pass';
  return `<tr>
    <td>${String(index + 1).padStart(2, '0')}</td>
    <td>${escapeHtml(name)}</td>
    <td><span class="status ${statusClass}">${statusClass.toUpperCase()}</span></td>
    <td>${escapeHtml(code)}</td>
    <td>${escapeHtml(time)} ms</td>
  </tr>`;
}).join('\n');

const failureCards = failures.length
  ? failures.map(failure => `<article class="failure-card">
      <span>${escapeHtml(failure.source?.name || 'Unknown request')}</span>
      <strong>${escapeHtml(failure.error?.test || failure.error?.name || 'Failed assertion')}</strong>
      <p>${escapeHtml(failure.error?.message || 'No failure message was provided by Newman.')}</p>
    </article>`).join('\n')
  : `<article class="failure-card clean"><span>NO ACTIVE FAILURES</span><strong>All assertions passed.</strong><p>The latest CI run produced a clean API evidence set.</p></article>`;

const generated = new Date().toISOString();
const hasHtmlReport = fs.existsSync(publicHtmlReportPath);

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>API Evidence Console · Restful Booker</title>
  <meta name="description" content="Published Newman API testing evidence for a Postman/Newman CI framework." />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;700&family=Spectral:wght@500;700&display=swap');

    :root {
      --ink: #f6f0e8;
      --muted: #a79f92;
      --paper: #10100d;
      --panel: rgba(246, 240, 232, 0.065);
      --panel-strong: rgba(246, 240, 232, 0.12);
      --acid: #c8ff2e;
      --amber: #ffb000;
      --danger: #ff3b30;
      --line: rgba(246, 240, 232, 0.18);
      --shadow: 0 28px 90px rgba(0, 0, 0, 0.5);
    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      color: var(--ink);
      background:
        radial-gradient(circle at 16% 6%, rgba(200, 255, 46, 0.14), transparent 28rem),
        radial-gradient(circle at 88% 18%, rgba(255, 176, 0, 0.12), transparent 30rem),
        linear-gradient(135deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 20px),
        var(--paper);
      font-family: 'IBM Plex Mono', monospace;
      min-height: 100vh;
      overflow-x: hidden;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      opacity: 0.28;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.42'/%3E%3C/svg%3E");
      mix-blend-mode: soft-light;
    }

    .shell {
      width: min(1180px, calc(100% - 36px));
      margin: 0 auto;
      padding: 36px 0 60px;
      position: relative;
    }

    .top-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border: 1px solid var(--line);
      background: rgba(0, 0, 0, 0.32);
      box-shadow: var(--shadow);
      padding: 12px 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
      font-size: 12px;
      animation: slideDown 700ms ease both;
    }

    .signal {
      display: inline-flex;
      gap: 9px;
      align-items: center;
      color: var(--acid);
      font-weight: 700;
    }

    .signal::before {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--acid);
      box-shadow: 0 0 26px var(--acid);
      animation: pulse 1500ms ease-in-out infinite;
    }

    .hero {
      display: grid;
      grid-template-columns: 1.05fr 0.95fr;
      gap: 30px;
      align-items: end;
      padding: 72px 0 38px;
    }

    h1 {
      margin: 0;
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(4.2rem, 12vw, 10.8rem);
      line-height: 0.78;
      letter-spacing: -0.035em;
      text-transform: uppercase;
      max-width: 850px;
      text-shadow: 0 0 42px rgba(200, 255, 46, 0.08);
      animation: lift 900ms ease both 120ms;
    }

    .hero-copy {
      border-left: 3px solid var(--acid);
      padding: 18px 0 18px 24px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.7;
      animation: lift 900ms ease both 260ms;
    }

    .hero-copy strong { color: var(--ink); }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 22px;
    }

    .button {
      color: var(--paper);
      background: var(--acid);
      border: 1px solid var(--acid);
      padding: 13px 16px;
      text-decoration: none;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      box-shadow: 8px 8px 0 rgba(255, 176, 0, 0.8);
      transition: transform 180ms ease, box-shadow 180ms ease;
    }

    .button:hover {
      transform: translate(-3px, -3px);
      box-shadow: 12px 12px 0 rgba(255, 176, 0, 0.95);
    }

    .button.secondary {
      color: var(--ink);
      background: transparent;
      box-shadow: none;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin: 22px 0;
    }

    .card {
      min-height: 142px;
      border: 1px solid var(--line);
      background: linear-gradient(180deg, var(--panel-strong), var(--panel));
      padding: 18px;
      position: relative;
      overflow: hidden;
      animation: lift 700ms ease both;
    }

    .card:nth-child(2) { animation-delay: 70ms; }
    .card:nth-child(3) { animation-delay: 140ms; }
    .card:nth-child(4) { animation-delay: 210ms; }

    .card::after {
      content: attr(data-code);
      position: absolute;
      right: 12px;
      bottom: 6px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 56px;
      color: rgba(246, 240, 232, 0.06);
      letter-spacing: -0.05em;
    }

    .label {
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 12px;
    }

    .value {
      display: block;
      margin-top: 14px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 58px;
      line-height: 0.9;
      letter-spacing: -0.02em;
    }

    .value.acid { color: var(--acid); }
    .value.amber { color: var(--amber); }
    .value.danger { color: var(--danger); }

    .section {
      margin-top: 28px;
      border: 1px solid var(--line);
      background: rgba(0, 0, 0, 0.26);
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: center;
      padding: 18px;
      border-bottom: 1px solid var(--line);
      background: rgba(246, 240, 232, 0.05);
    }

    h2 {
      margin: 0;
      font-family: 'Spectral', serif;
      font-size: clamp(1.5rem, 3vw, 2.3rem);
      letter-spacing: -0.02em;
    }

    .stamp {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .failure-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 14px;
      padding: 18px;
    }

    .failure-card {
      padding: 18px;
      border: 1px solid rgba(255, 59, 48, 0.46);
      background: rgba(255, 59, 48, 0.08);
    }

    .failure-card.clean {
      border-color: rgba(200, 255, 46, 0.45);
      background: rgba(200, 255, 46, 0.07);
    }

    .failure-card span {
      display: block;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 10px;
    }

    .failure-card strong {
      display: block;
      color: var(--ink);
      font-size: 17px;
      margin-bottom: 8px;
    }

    .failure-card p { color: var(--muted); line-height: 1.6; margin: 0; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    th, td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--line);
      text-align: left;
    }

    th {
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(246, 240, 232, 0.04);
    }

    tr:hover td { background: rgba(200, 255, 46, 0.035); }

    .status {
      display: inline-flex;
      padding: 4px 8px;
      border: 1px solid currentColor;
      font-weight: 700;
      font-size: 11px;
    }

    .status.pass { color: var(--acid); }
    .status.fail { color: var(--danger); }

    .footer-note {
      color: var(--muted);
      line-height: 1.7;
      margin: 24px 0 0;
      max-width: 780px;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.7); opacity: 0.42; }
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-14px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes lift {
      from { opacity: 0; transform: translateY(22px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 860px) {
      .hero { grid-template-columns: 1fr; padding-top: 48px; }
      .grid { grid-template-columns: repeat(2, 1fr); }
      .top-strip { align-items: flex-start; flex-direction: column; }
      table { min-width: 720px; }
      .table-wrap { overflow-x: auto; }
    }

    @media (max-width: 520px) {
      .grid { grid-template-columns: 1fr; }
      .shell { width: min(100% - 24px, 1180px); padding-top: 20px; }
      .button { width: 100%; text-align: center; }
    }
  </style>
</head>
<body>
  <main class="shell">
    <div class="top-strip">
      <span class="signal">API EVIDENCE STREAM ${failures.length ? 'UNSTABLE' : 'CLEAN'}</span>
      <span>Generated ${escapeHtml(generated)}</span>
    </div>

    <section class="hero">
      <div>
        <h1>Contract<br />Under<br />Pressure</h1>
      </div>
      <div class="hero-copy">
        <p><strong>Restful Booker API Testing Framework</strong> — a Postman/Newman suite proving health checks, authentication, CRUD lifecycle behavior, negative paths, schema expectations, and CI-ready reporting.</p>
        <div class="actions">
          ${hasHtmlReport ? '<a class="button" href="./newman-report.html">Open Newman HTML Report</a>' : '<span class="button secondary">Newman HTML report not generated yet</span>'}
          <a class="button secondary" href="https://restful-booker.herokuapp.com/apidoc/index.html">Target API Docs</a>
        </div>
      </div>
    </section>

    <section class="grid" aria-label="Run metrics">
      <article class="card" data-code="REQ"><span class="label">Requests</span><strong class="value">${requestTotal}</strong></article>
      <article class="card" data-code="AST"><span class="label">Assertions</span><strong class="value acid">${assertionTotal}</strong></article>
      <article class="card" data-code="PASS"><span class="label">Assertion Pass Rate</span><strong class="value ${passRate === 100 ? 'acid' : 'amber'}">${passRate}%</strong></article>
      <article class="card" data-code="FAIL"><span class="label">Failures</span><strong class="value ${assertionFailed || requestFailed ? 'danger' : 'acid'}">${assertionFailed + requestFailed}</strong></article>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Failure Triage</h2>
        <span class="stamp">Duration ${duration} ms · Test scripts ${testScripts.total || 0} · Pre-request scripts ${prerequestScripts.total || 0}</span>
      </div>
      <div class="failure-grid">
        ${failureCards}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Execution Ledger</h2>
        <span class="stamp">Source: Newman JSON summary</span>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Request</th><th>Status</th><th>HTTP</th><th>Time</th></tr></thead>
          <tbody>
            ${rows || '<tr><td colspan="5">No executions found. Run npm run test:api, then npm run build:report-hub.</td></tr>'}
          </tbody>
        </table>
      </div>
    </section>

    <p class="footer-note">This page is intentionally generated from the CI report artifact. It is portfolio evidence, not decoration: every number above should be traceable to the Newman run output.</p>
  </main>
</body>
</html>`;

fs.writeFileSync(path.join(publicDir, 'index.html'), html);
console.log(`Report hub generated at ${path.join(publicDir, 'index.html')}`);
