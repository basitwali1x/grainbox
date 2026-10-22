import React, { useState } from 'react';
import { Code2, Copy, Check, Terminal, FileCode, ExternalLink, X } from 'lucide-react';

interface FlaskInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlaskInspectorModal: React.FC<FlaskInspectorModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'app' | 'login' | 'recordings' | 'admin'>('welcome');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    welcome: `<!-- templates/welcome.html (Flask Jinja2 + Bootstrap 5) -->
<!-- Generated for Grainbox VICIdial Portal | Powered By Global Nexus Technos -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title|default("Grainbox") }}</title>
    
    <!-- Bootstrap 5.3 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">

    <style>
        :root {
            --grainbox-bg: #090d16;
            --grainbox-card-bg: #0f172a;
            --grainbox-border: rgba(255, 255, 255, 0.08);
            --grainbox-primary: #0284c7;
            --grainbox-accent-cyan: #06b6d4;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--grainbox-bg);
            color: #f8fafc;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .gateway-card {
            background: var(--grainbox-card-bg);
            border: 1px solid var(--grainbox-border);
            border-radius: 16px;
            padding: 2rem 1.75rem;
            transition: all 0.28s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .gateway-card:hover {
            transform: translateY(-6px);
            border-color: rgba(56, 189, 248, 0.5);
            box-shadow: 0 20px 40px -15px rgba(2, 132, 199, 0.25);
        }
    </style>
</head>
<body>
    <!-- Top Bar -->
    <header class="py-3 border-bottom border-secondary" style="background: rgba(15, 23, 42, 0.85);">
        <div class="container-xl d-flex align-items-center justify-content-between">
            <a href="/" class="d-flex align-items-center gap-2 text-decoration-none text-white">
                <i class="bi bi-broadcast-pin fs-3 text-info"></i>
                <div>
                    <h1 class="h6 mb-0 fw-bold">Grainbox</h1>
                    <span class="small text-info">VICIdial Enterprise Suite</span>
                </div>
            </a>
            <div class="badge bg-dark border border-secondary text-light p-2">
                Asterisk 16.30 / VICIdial 2.14 Online
            </div>
        </div>
    </header>

    <!-- Main Hero & Gateway Cards -->
    <main class="container-xl py-5 flex-grow-1">
        <div class="text-center mb-5">
            <span class="text-info fw-bold text-uppercase small">Client Telephony Gateway</span>
            <h2 class="display-6 fw-bold text-white mt-1">Grainbox</h2>
            <p class="text-muted">Select your operational gateway to authenticate into the predictive dialer or view recordings.</p>
        </div>

        <div class="row g-4 justify-content-center">
            <!-- 1. AGENT LOGIN CARD -->
            <div class="col-12 col-md-4">
                <div class="gateway-card">
                    <div class="mb-4 text-info"><i class="bi bi-headset fs-1"></i></div>
                    <h3 class="h5 fw-bold text-white">Agent Login</h3>
                    <p class="text-muted small flex-grow-1">Dialer workstation console for call center agents. Connect WebRTC/SIP softphone, manage leads, and dispositions.</p>
                    <a href="{{ url_for('login', role='agent') if url_for is defined else '/login?role=agent' }}" class="btn btn-primary w-100 fw-semibold">
                        Launch Agent Console &rarr;
                    </a>
                </div>
            </div>

            <!-- 2. ADMIN LOGIN CARD -->
            <div class="col-12 col-md-4">
                <div class="gateway-card">
                    <div class="mb-4 text-primary"><i class="bi bi-shield-lock fs-1"></i></div>
                    <h3 class="h5 fw-bold text-white">Admin Login</h3>
                    <p class="text-muted small flex-grow-1">Full system administration control center. Orchestrate live campaigns, SIP trunks, IVR trees, and real-time screens.</p>
                    <a href="{{ url_for('login', role='admin') if url_for is defined else '/login?role=admin' }}" class="btn btn-outline-light w-100 fw-semibold">
                        Admin Portal Login &rarr;
                    </a>
                </div>
            </div>

            <!-- 3. DASHBOARD RECORDINGS CARD -->
            <div class="col-12 col-md-4">
                <div class="gateway-card">
                    <div class="mb-4 text-success"><i class="bi bi-soundwave fs-1"></i></div>
                    <h3 class="h5 fw-bold text-white">Dashboard Recordings</h3>
                    <p class="text-muted small flex-grow-1">Centralized audio archive and QA audit repository. Stream call audio logs, agent QA scores, and Call Detail Records.</p>
                    <a href="{{ url_for('recordings') if url_for is defined else '/recordings' }}" class="btn btn-outline-info w-100 fw-semibold">
                        Access Recordings &rarr;
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Professional Footer -->
    <footer class="mt-auto py-4 bg-black border-top border-secondary text-muted">
        <div class="container-xl d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <div>
                <strong class="text-info">Powered By Global Nexus Technos</strong>
                <p class="small text-secondary mb-0">dialer.gntechnos.com · High-Availability Telephony Cluster</p>
            </div>
            <div class="small">
                &copy; {{ current_year|default("2026") }} Global Nexus Technos. All rights reserved.
            </div>
        </div>
    </footer>
</body>
</html>`,
    app: `# app.py - Multi-Portal Flask Backend
# Powered by Global Nexus Technos (dialer.gntechnos.com)

import os
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, session, flash, Response
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "grainbox-vicidial-secret-key-2026")

USERS_DB = {
    "1004": {
        "username": "1004", "name": "Sarah Jenkins", "role": "agent",
        "password_hash": generate_password_hash("password123", method="scrypt")
    },
    "admin": {
        "username": "admin", "name": "System Administrator", "role": "admin",
        "password_hash": generate_password_hash("adminpassword123", method="scrypt")
    }
}

def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login", next=request.path))
        return f(*args, **kwargs)
    return decorated

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if session.get("role") != role and session.get("role") != "admin":
                return redirect(url_for("agent_workspace" if session.get("role") == "agent" else "admin_dashboard"))
            return f(*args, **kwargs)
        return decorator
    return decorator

@app.route("/")
def index():
    return render_template("welcome.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    role = request.args.get("role", "agent").lower()
    if request.method == "POST":
        user = USERS_DB.get(request.form.get("username", ""))
        if user and user["role"] == role and check_password_hash(user["password_hash"], request.form.get("password", "")):
            session["user_id"] = user["username"]
            session["role"] = user["role"]
            return redirect(url_for("admin_dashboard" if role == "admin" else "agent_workspace"))
        flash("Invalid credentials", "danger")
    return render_template("login.html", role=role)

@app.route("/agent")
@login_required
@role_required("agent")
def agent_workspace():
    return render_template("agent.html")

@app.route("/admin")
@login_required
@role_required("admin")
def admin_dashboard():
    return render_template("admin.html")

@app.route("/recordings")
def recordings():
    return render_template("recordings.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)`,
    login: `<!-- templates/login.html -->
<!-- VICIdial Agent & Admin Login forms -->
<form action="/auth" method="POST">
    <input type="text" name="phone_login" placeholder="Phone Login (1004)" required>
    <input type="password" name="phone_pass" placeholder="Phone Password" required>
    <input type="text" name="user_login" placeholder="Agent User ID" required>
    <input type="password" name="user_pass" placeholder="Agent Password" required>
    <select name="campaign">
        <option value="SOLAR_OUT_Q4">SOLAR_OUT_Q4</option>
        <option value="INBOUND_CARE">INBOUND_CARE</option>
    </select>
    <button type="submit">Submit & Login</button>
</form>`,
    recordings: `<!-- templates/recordings.html -->
<!-- Audio recordings archive & playback -->
<table class="table table-dark">
    <thead>
        <tr><th>ID</th><th>Timestamp</th><th>Agent</th><th>Campaign</th><th>Phone</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <!-- Loop through recordings -->
    </tbody>
</table>`,
    admin: `<!-- templates/admin.html -->
<!-- Grainbox VICIdial Administration Dashboard -->
<!-- Featuring Dynamic IP Widget (Pakistan Dynamic ISP handling) and Call Recordings Management with HTML5 Audio -->

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ title|default("Grainbox - VICIdial Administration Console") }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-dark text-light">
    <!-- Top Nav with Branding & Logout -->
    <nav class="navbar navbar-dark bg-black border-bottom border-secondary px-4">
        <a class="navbar-brand fw-bold text-info" href="/">Grainbox</a>
        <a href="/logout" class="btn btn-sm btn-danger">Log Out</a>
    </nav>

    <!-- Dynamic IP Widget -->
    <div class="card bg-secondary text-white m-4 p-3">
        <h5>Dynamic IP & SIP Trunk NAT Status</h5>
        <p>Current Public IP: <strong>39.45.182.94</strong> (PTCL Pakistan)</p>
        <button onclick="reverifyDynamicIP()" class="btn btn-sm btn-outline-info">Re-verify IP</button>
    </div>

    <!-- Call Recordings Table with HTML5 Audio -->
    <div class="m-4">
        <button onclick="syncWithVicidial()" class="btn btn-primary mb-3">Sync with VICIdial</button>
        <table class="table table-dark">
            <thead>
                <tr><th>Call ID</th><th>Lead Phone</th><th>Agent</th><th>Duration</th><th>Timestamp</th><th>Audio</th></tr>
            </thead>
            <tbody>
                <!-- Row with audio streaming -->
                <tr>
                    <td>REC-98214-01</td>
                    <td>+1 (555) 382-9011</td>
                    <td>Sarah Jenkins</td>
                    <td>04:32</td>
                    <td>2026-10-21 09:22:14</td>
                    <td>
                        <audio controls preload="none">
                            <source src="/recordings/stream/REC-20261021-98214" type="audio/wav">
                        </audio>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Flask Template & Backend Generator
              </h3>
              <p className="text-xs text-slate-400">
                Created in file tree: <code className="text-cyan-300 font-mono">templates/welcome.html</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900 border-b border-slate-800">
          <div className="flex gap-2">
            {[
              { id: 'welcome', label: 'templates/welcome.html' },
              { id: 'app', label: 'app.py' },
              { id: 'admin', label: 'templates/admin.html' },
              { id: 'login', label: 'templates/login.html' },
              { id: 'recordings', label: 'templates/recordings.html' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCopy(codeSnippets[activeTab])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre">
            <code>{codeSnippets[activeTab]}</code>
          </pre>
        </div>

        {/* Footer with run command */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>To run locally with Flask:</span>
            <code className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-cyan-300 font-mono">
              pip install flask && python app.py
            </code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
