import { useState } from 'react'

const AUTOMATION_SAVINGS_RATE = 0.80
const RISK_REDUCTION_RATE = 0.70

function formatCurrency(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `$${Math.round(n / 1000)}k`
  return `$${Math.round(n).toLocaleString()}`
}

function formatNumber(n) {
  return Math.round(n).toLocaleString()
}

function SliderInput({ label, description, value, onChange, min, max, step, format }) {
  return (
    <div className="input-group">
      <div className="input-label">
        <div>
          <label>{label}</label>
          {description && <span className="input-description">{description}</span>}
        </div>
        <span className="value-display">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      />
      <div className="slider-labels">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

function BreakdownBar({ label, value, total, colorClass }) {
  const pct = total > 0 ? Math.min((value / total) * 100, 100) : 0
  return (
    <div className="breakdown-item">
      <div className="breakdown-item-header">
        <span className="breakdown-item-label">{label}</span>
        <span className="breakdown-item-value">{formatCurrency(value)}/yr</span>
      </div>
      <div className="breakdown-bar-track">
        <div
          className={`breakdown-bar-fill ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function App() {
  const [vendors, setVendors] = useState(200)
  const [minutesPerVendor, setMinutesPerVendor] = useState(25)
  const [hourlyRate, setHourlyRate] = useState(45)
  const [incidentsPerYear, setIncidentsPerYear] = useState(3)
  const [costPerIncident, setCostPerIncident] = useState(15000)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [industry, setIndustry] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [currentProcess, setCurrentProcess] = useState('')

  const annualHours = (vendors * minutesPerVendor * 12) / 60
  const laborCost = annualHours * hourlyRate
  const riskExposure = incidentsPerYear * costPerIncident
  const overheadCost = laborCost * 0.15
  const totalCost = laborCost + riskExposure + overheadCost
  const automationSavings = (laborCost * AUTOMATION_SAVINGS_RATE) + (riskExposure * RISK_REDUCTION_RATE) + (overheadCost * AUTOMATION_SAVINGS_RATE)
  const costPerVendor = vendors > 0 ? totalCost / vendors : 0
  const fteDays = annualHours / 8
  const costWithTrustLayer = totalCost - automationSavings

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) setEmailSent(true)
  }

  return (
    <>
      <nav className="topbar">
        <img src="/logo_white.webp" alt="TrustLayer" className="topbar-logo" />
        <a
          href="https://www.trustlayer.io/meet-with-us"
          target="_blank"
          rel="noopener noreferrer"
          className="topbar-cta"
        >
          Meet with us
        </a>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <span className="hero-badge">Free Assessment Tool</span>
          <h1>How Much Is Manual COI Tracking Costing You?</h1>
          <p>
            Most teams underestimate the true cost of chasing certificates, verifying coverage,
            and managing vendor compliance by hand. Find out in 30 seconds.
          </p>
        </div>
      </header>

      <div className="calculator-layout">
        <div className="card">
          <div className="card-header">
            <div className="column-tag tag-manual">Your Current Process</div>
            <h2>Your Organization</h2>
            <p>Adjust the sliders to match your current workflow</p>
          </div>

          <SliderInput
            label="Vendors & Subcontractors"
            description="How many outside companies do you need COIs from?"
            value={vendors}
            onChange={setVendors}
            min={0}
            max={2000}
            step={10}
            format={v => v.toLocaleString()}
          />
          <SliderInput
            label="Minutes per Vendor per Month"
            description="Time spent chasing, reviewing, and filing each vendor's docs"
            value={minutesPerVendor}
            onChange={setMinutesPerVendor}
            min={0}
            max={60}
            step={1}
            format={v => `${v} min`}
          />
          <SliderInput
            label="Compliance Staff Hourly Rate"
            description="Fully loaded cost of the person doing this work"
            value={hourlyRate}
            onChange={setHourlyRate}
            min={0}
            max={100}
            step={5}
            format={v => `$${v}/hr`}
          />
          <SliderInput
            label="Non-Compliance Incidents per Year"
            description="Times a vendor's lapsed or wrong coverage caused a problem"
            value={incidentsPerYear}
            onChange={setIncidentsPerYear}
            min={0}
            max={20}
            step={1}
            format={v => v.toString()}
          />
          <SliderInput
            label="Average Cost per Incident"
            description="Denied claims, project delays, fines, legal fees"
            value={costPerIncident}
            onChange={setCostPerIncident}
            min={0}
            max={100000}
            step={1000}
            format={v => formatCurrency(v)}
          />

          <div className="qualify-section">
            <div className="qualify-title">Customize your results</div>
            <div className="qualify-grid">
              <div className="qualify-field">
                <label>Your industry</label>
                <select value={industry} onChange={e => setIndustry(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="construction">Construction</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="lending">Lending & Finance</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="transportation">Transportation</option>
                  <option value="energy">Energy & Utilities</option>
                  <option value="events">Events & Hospitality</option>
                  <option value="franchise">Franchise</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="qualify-field">
                <label>Company size</label>
                <select value={companySize} onChange={e => setCompanySize(e.target.value)}>
                  <option value="">Select...</option>
                  <option value="1-50">1 - 50 employees</option>
                  <option value="51-200">51 - 200 employees</option>
                  <option value="201-500">201 - 500 employees</option>
                  <option value="501-1000">501 - 1,000 employees</option>
                  <option value="1001+">1,000+ employees</option>
                </select>
              </div>
            </div>
            <div className="qualify-field">
              <label>How do you track COIs today?</label>
              <select value={currentProcess} onChange={e => setCurrentProcess(e.target.value)}>
                <option value="">Select...</option>
                <option value="spreadsheets">Spreadsheets</option>
                <option value="email">Email chains and attachments</option>
                <option value="paper">Paper files</option>
                <option value="basic-software">Generic software (not COI-specific)</option>
                <option value="coi-tool">A COI tracking tool</option>
                <option value="broker">Our broker handles it</option>
                <option value="none">We don't really track them</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card results-panel">
          <div className="card-header">
            <div className="column-tag tag-results">What It's Costing You</div>
          </div>

          <div className="result-hero-card">
            <div className="result-label">Total Annual Cost of Manual Tracking</div>
            <div className="result-value">{formatCurrency(totalCost)}</div>
            <div className="result-subtitle">{formatCurrency(totalCost / 12)}/month across your organization</div>
          </div>

          <div className="result-grid">
            <div className="result-card">
              <div className="result-label">Hours Spent / Year</div>
              <div className="result-value warning">{formatNumber(annualHours)}</div>
              <div className="result-detail">{Math.round(fteDays)} full workdays</div>
            </div>
            <div className="result-card">
              <div className="result-label">Cost per Vendor</div>
              <div className="result-value danger">{formatCurrency(costPerVendor)}</div>
              <div className="result-detail">per vendor per year</div>
            </div>
            <div className="result-card">
              <div className="result-label">Labor Cost</div>
              <div className="result-value primary">{formatCurrency(laborCost)}</div>
              <div className="result-detail">staff time on COI tasks</div>
            </div>
            <div className="result-card">
              <div className="result-label">Risk Exposure</div>
              <div className="result-value danger">{formatCurrency(riskExposure)}</div>
              <div className="result-detail">{incidentsPerYear} incidents/yr</div>
            </div>
          </div>

          <div className="breakdown-section">
            <div className="breakdown-title">Where Your Money Goes</div>
            <BreakdownBar
              label="Staff labor (collection, follow-ups, verification)"
              value={laborCost}
              total={totalCost}
              colorClass="bar-labor"
            />
            <BreakdownBar
              label="Non-compliance risk (claims, fines, project delays)"
              value={riskExposure}
              total={totalCost}
              colorClass="bar-risk"
            />
            <BreakdownBar
              label="Administrative overhead (systems, filing, reporting)"
              value={overheadCost}
              total={totalCost}
              colorClass="bar-overhead"
            />
          </div>

          <div className="comparison-section">
            <div className="comparison-header">
              <div className="column-tag tag-trustlayer">With TrustLayer</div>
            </div>
            <div className="comparison-grid">
              <div className="comparison-card comparison-before">
                <div className="comparison-label">Manual Process</div>
                <div className="comparison-value">{formatCurrency(totalCost)}</div>
                <div className="comparison-detail">per year</div>
              </div>
              <div className="comparison-arrow">&#8594;</div>
              <div className="comparison-card comparison-after">
                <div className="comparison-label">With TrustLayer</div>
                <div className="comparison-value">{formatCurrency(costWithTrustLayer)}</div>
                <div className="comparison-detail">per year</div>
              </div>
            </div>
            <div className="savings-highlight">
              You save <strong>{formatCurrency(automationSavings)}/yr</strong> and
              reclaim <strong>~{formatNumber(annualHours * AUTOMATION_SAVINGS_RATE)} hours</strong> for
              your team
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <div className="cta-main">
            <h2>Ready to cut your compliance costs{totalCost > 0 ? ` by ${Math.round((automationSavings / totalCost) * 100)}%` : ''}?</h2>
            <p>Talk to our team with your numbers already on the table.</p>
            <a
              href="https://www.trustlayer.io/meet-with-us"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button-primary"
            >
              Schedule a free consultation
            </a>
          </div>
          <div className="cta-divider">
            <span>or</span>
          </div>
          <div className="cta-secondary">
            <h3>Share this report with your team</h3>
            <p>We'll email you a summary with your numbers, ready to forward to the person who approves the budget.</p>
            {!emailSent ? (
              <form className="email-form" onSubmit={handleEmailSubmit}>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="email-input"
                />
                <button type="submit" className="email-button">Send Report</button>
              </form>
            ) : (
              <div className="email-success">
                Report sent, check your inbox.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="social-proof">
        <div className="social-proof-content">
          <div className="social-proof-stat">
            <span className="social-proof-number">517,000+</span>
            <span className="social-proof-label">companies in the network</span>
          </div>
          <div className="social-proof-divider" />
          <div className="social-proof-stat">
            <span className="social-proof-number">400,000+</span>
            <span className="social-proof-label">COIs processed monthly</span>
          </div>
          <div className="social-proof-divider" />
          <div className="social-proof-stat">
            <span className="social-proof-number">80%</span>
            <span className="social-proof-label">reduction in manual work</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>
          Built by Leo Palmaro as a product marketing concept for the insurance compliance space.
          <br />Not affiliated with TrustLayer, Inc.
        </p>
      </footer>
    </>
  )
}

export default App
