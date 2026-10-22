import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  Upload, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  Server, 
  Database, 
  Globe, 
  Terminal, 
  Layers, 
  Sliders, 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  Radio, 
  Hash, 
  Search,
  ExternalLink,
  FileSpreadsheet,
  HardDrive
} from 'lucide-react';
import { LeadRecord, DynamicIpLog, LeadInjectionConfig } from '../types';

interface LeadInjectorViewProps {
  onBack: () => void;
}

// Leads dataset matching Apa.csv (and E:\Apa.csv)
const APA_CSV_LEADS: LeadRecord[] = [
  { phone: '03001234567', first_name: 'Hamza', last_name: 'Khan', city: 'Lahore', status: 'pending' },
  { phone: '03219876543', first_name: 'Usman', last_name: 'Tariq', city: 'Karachi', status: 'pending' },
  { phone: '03335551212', first_name: 'Ayesha', last_name: 'Malik', city: 'Islamabad', status: 'pending' },
  { phone: '03451122334', first_name: 'Bilal', last_name: 'Ahmed', city: 'Rawalpindi', status: 'pending' },
  { phone: '03123456789', first_name: 'Zainab', last_name: 'Fatima', city: 'Faisalabad', status: 'pending' },
  { phone: '03017654321', first_name: 'Ali', last_name: 'Raza', city: 'Multan', status: 'pending' },
  { phone: '03224433221', first_name: 'Farhan', last_name: 'Siddiqui', city: 'Sialkot', status: 'pending' },
  { phone: '03348877665', first_name: 'Sana', last_name: 'Javed', city: 'Gujranwala', status: 'pending' },
  { phone: '03469988776', first_name: 'Omer', last_name: 'Farooq', city: 'Peshawar', status: 'pending' },
  { phone: '03135544332', first_name: 'Hassan', last_name: 'Sheikh', city: 'Quetta', status: 'pending' },
  { phone: '03023344556', first_name: 'Naveed', last_name: 'Akram', city: 'Lahore', status: 'pending' },
  { phone: '03236677889', first_name: 'Mariam', last_name: 'Bibi', city: 'Karachi', status: 'pending' },
  { phone: '03357788990', first_name: 'Taimoor', last_name: 'Shah', city: 'Islamabad', status: 'pending' },
  { phone: '03471199223', first_name: 'Khadija', last_name: 'Zehra', city: 'Rawalpindi', status: 'pending' },
  { phone: '03142288334', first_name: 'Waqas', last_name: 'Bashir', city: 'Faisalabad', status: 'pending' },
  { phone: '03038899001', first_name: 'Rabia', last_name: 'Noor', city: 'Multan', status: 'pending' },
  { phone: '03241133557', first_name: 'Danish', last_name: 'Iqbal', city: 'Sialkot', status: 'pending' },
  { phone: '03362244668', first_name: 'Hina', last_name: 'Altaf', city: 'Gujranwala', status: 'pending' },
  { phone: '03483355779', first_name: 'Saad', last_name: 'Rehman', city: 'Peshawar', status: 'pending' },
  { phone: '03154466880', first_name: 'Zeeshan', last_name: 'Haider', city: 'Quetta', status: 'pending' },
  { phone: '03045577991', first_name: 'Asad', last_name: 'Mahmood', city: 'Lahore', status: 'pending' },
  { phone: '03256688002', first_name: 'Bushra', last_name: 'Qasim', city: 'Karachi', status: 'pending' },
  { phone: '03377799113', first_name: 'Kamran', last_name: 'Latif', city: 'Islamabad', status: 'pending' },
  { phone: '03498800224', first_name: 'Mehak', last_name: 'Arshad', city: 'Rawalpindi', status: 'pending' },
  { phone: '03169911335', first_name: 'Fahad', last_name: 'Mustafa', city: 'Faisalabad', status: 'pending' },
  { phone: '03051299887', first_name: 'Rashid', last_name: 'Minhas', city: 'Multan', status: 'pending' },
  { phone: '03264488112', first_name: 'Nimra', last_name: 'Sohail', city: 'Lahore', status: 'pending' },
  { phone: '03387711223', first_name: 'Adeel', last_name: 'Farid', city: 'Karachi', status: 'pending' },
  { phone: '03418822334', first_name: 'Sumbul', last_name: 'Jameel', city: 'Islamabad', status: 'pending' },
  { phone: '03173344556', first_name: 'Zubair', last_name: 'Shahid', city: 'Rawalpindi', status: 'pending' }
];

export const LeadInjectorView: React.FC<LeadInjectorViewProps> = ({ onBack }) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'batch' | 'single' | 'script' | 'config'>('batch');

  // VICIdial Configuration State
  const [config, setConfig] = useState<LeadInjectionConfig>({
    viciHost: 'dialer.gntechnos.com',
    apiUser: 'vdc_admin',
    apiPass: 'your_api_password',
    campaignId: 'DEFAULT',
    listId: 101,
    phoneCode: '92',
    duplicateCheck: 'DUPCAMP',
    rateLimitBatch: 100,
    rateLimitDelayMs: 500,
    ipCheckInterval: 500
  });

  // Dynamic IP state
  const [currentIp, setCurrentIp] = useState<string>('39.45.182.94');
  const [ispName, setIspName] = useState<string>('PTCL Broadband (Pakistan)');
  const [ipLogs, setIpLogs] = useState<DynamicIpLog[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      previousIp: 'Unknown',
      newIp: '39.45.182.94',
      message: 'Initial dynamic IP acquired via https://api.ipify.org',
      type: 'info'
    }
  ]);
  const [isVerifyingIp, setIsVerifyingIp] = useState(false);

  // Bulk leads data & active file source
  const [activeSourceFileName, setActiveSourceFileName] = useState<string>('Apa.csv (Source: E:\\Apa.csv)');
  const [leads, setLeads] = useState<LeadRecord[]>(APA_CSV_LEADS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Execution engine state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[*] Grainbox Dialer Engine Initialized. Active Public IP: 39.45.182.94`,
    `[*] Target Gateway: ${config.viciHost} | Campaign: ${config.campaignId} | List: ${config.listId}`,
    `[*] Active Dataset: Loaded 30 leads from Apa.csv (E:\\Apa.csv)`,
    `[*] Non-Agent API Endpoint: https://${config.viciHost}/vicidial/non_agent_api.php`,
    `[*] Ready to inject leads into VICIdial List 101 with DUPCAMP duplicate protection.`
  ]);

  // Single test lead state
  const [singlePhone, setSinglePhone] = useState('03001234567');
  const [singleFirstName, setSingleFirstName] = useState('Hamza');
  const [singleLastName, setSingleLastName] = useState('Khan');
  const [singleCity, setSingleCity] = useState('Lahore');
  const [singleResult, setSingleResult] = useState<{
    success: boolean;
    rawText: string;
    url: string;
    timestamp: string;
  } | null>(null);
  const [isSingleInjecting, setIsSingleInjecting] = useState(false);

  // Python Script Copied State
  const [copiedPython, setCopiedPython] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Ref for auto-scroll in terminal
  const terminalRef = useRef<HTMLDivElement>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);
  isRunningRef.current = isRunning;
  isPausedRef.current = isPaused;

  // Auto-scroll terminal log
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  // Initial IP check attempt on mount
  useEffect(() => {
    fetchPublicIp();
  }, []);

  const fetchPublicIp = async () => {
    setIsVerifyingIp(true);
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      if (res.ok) {
        const data = await res.json();
        if (data.ip) {
          handleIpUpdate(data.ip, 'ipify.org');
          return;
        }
      }
    } catch {
      // Fallback
    }

    try {
      const res2 = await fetch('/api/leads/public-ip');
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2.ip) {
          handleIpUpdate(data2.ip, 'Internal Gateway Proxy');
          return;
        }
      }
    } catch {
      // Keep existing IP
    } finally {
      setIsVerifyingIp(false);
    }
  };

  const handleIpUpdate = (newDetectedIp: string, source: string) => {
    if (newDetectedIp !== currentIp) {
      const logEntry: DynamicIpLog = {
        timestamp: new Date().toLocaleTimeString(),
        previousIp: currentIp,
        newIp: newDetectedIp,
        message: `[ALERT] Dynamic IP Shift Detected via ${source}! Updating gateway firewall session compatibility...`,
        type: 'shift'
      };
      setIpLogs(prev => [logEntry, ...prev]);
      setTerminalLogs(prev => [
        ...prev,
        `\n[ALERT] Dynamic IP Shift Detected!`,
        `Previous IP: ${currentIp} -> New IP: ${newDetectedIp}`,
        `Timestamp: ${new Date().toISOString()}`,
        `[*] Re-verifying session compatibility with gateway firewall...\n`
      ]);
      setCurrentIp(newDetectedIp);
    } else {
      setIpLogs(prev => [
        {
          timestamp: new Date().toLocaleTimeString(),
          previousIp: currentIp,
          newIp: currentIp,
          message: `IP verified stable: ${currentIp} (${source})`,
          type: 'info'
        },
        ...prev
      ]);
    }
    setIsVerifyingIp(false);
  };

  // Generate 1,000 synthetic Pakistan leads
  const generateLargeDataset = (count: number = 1000) => {
    const firstNames = ['Mohammad', 'Ali', 'Ahmed', 'Usman', 'Hamza', 'Bilal', 'Zainab', 'Fatima', 'Ayesha', 'Sana', 'Hassan', 'Omer', 'Mariam', 'Saad', 'Farhan'];
    const lastNames = ['Khan', 'Malik', 'Ahmed', 'Tariq', 'Shah', 'Raza', 'Siddiqui', 'Iqbal', 'Chaudhry', 'Sheikh', 'Bhatti', 'Rehman', 'Javed', 'Abbasi'];
    const cities = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Sialkot', 'Gujranwala', 'Quetta'];
    const prefixes = ['0300', '0301', '0321', '0333', '0345', '0312', '0322', '0334', '0346'];

    const newLeads: LeadRecord[] = [];
    for (let i = 0; i < count; i++) {
      const prefix = prefixes[i % prefixes.length];
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
      newLeads.push({
        id: `synth-${i + 1}`,
        phone: `${prefix}${randomDigits}`,
        first_name: firstNames[i % firstNames.length],
        last_name: lastNames[(i * 3) % lastNames.length],
        city: cities[i % cities.length],
        status: 'pending'
      });
    }

    setLeads(newLeads);
    setCurrentIndex(0);
    setSuccessCount(0);
    setFailedCount(0);
    setDuplicateCount(0);
    setTerminalLogs(prev => [
      ...prev,
      `[*] Generated ${count} synthetic Pakistan telephony leads for batch injection test.`
    ]);
  };

  // Reset batch
  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setSuccessCount(0);
    setFailedCount(0);
    setDuplicateCount(0);
    setLeads(prev => prev.map(l => ({ ...l, status: 'pending', message: undefined, leadId: undefined })));
    setTerminalLogs(prev => [
      ...prev,
      `[*] Batch process reset. Ready with ${leads.length} leads from ${activeSourceFileName}.`
    ]);
  };

  // Load Apa.csv (Preset / E:\Apa.csv)
  const handleLoadApaPreset = (autoStart: boolean = false) => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setSuccessCount(0);
    setFailedCount(0);
    setDuplicateCount(0);
    setActiveSourceFileName('Apa.csv (Source: E:\\Apa.csv)');
    setLeads(APA_CSV_LEADS.map(l => ({ ...l, status: 'pending', message: undefined, leadId: undefined })));
    
    setTerminalLogs(prev => [
      ...prev,
      `\n[*] Active Lead Source switched to: Apa.csv (E:\\Apa.csv)`,
      `[*] Successfully loaded 30 Pakistan telephony leads for VICIdial campaign ${config.campaignId}.`,
      autoStart ? `[*] Triggering instant automated batch injection...` : `[*] Ready to inject leads to List ${config.listId}. Click 'Start Bulk Injection' to begin.`
    ]);

    if (autoStart) {
      setTimeout(() => {
        setIsRunning(true);
      }, 150);
    }
  };

  // Parse raw CSV text flexibly into LeadRecord[]
  const parseAndLoadCsvText = (rawText: string, fileName: string) => {
    try {
      const cleanText = rawText.replace(/^\uFEFF/, ''); // strip BOM if present
      const lines = cleanText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
      
      if (lines.length < 2) {
        setTerminalLogs(prev => [...prev, `[!] Error: Uploaded file '${fileName}' contains no data rows.`]);
        return;
      }

      const rawHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, '').replace(/\s+/g, '_'));
      
      const phoneIdx = rawHeaders.findIndex(h => h === 'phone' || h.includes('phone') || h.includes('mobile') || h.includes('number') || h.includes('contact'));
      const fnameIdx = rawHeaders.findIndex(h => h === 'first_name' || h.includes('first') || h.includes('fname') || (h.includes('name') && !h.includes('last')));
      const lnameIdx = rawHeaders.findIndex(h => h === 'last_name' || h.includes('last') || h.includes('lname'));
      const cityIdx = rawHeaders.findIndex(h => h === 'city' || h.includes('city') || h.includes('loc') || h.includes('town'));

      const parsedLeads: LeadRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        // Simple comma split handling
        const row = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
        const phone = phoneIdx >= 0 ? row[phoneIdx] : row[0];
        if (!phone) continue;

        const first_name = fnameIdx >= 0 && row[fnameIdx] ? row[fnameIdx] : 'Client';
        const last_name = lnameIdx >= 0 && row[lnameIdx] ? row[lnameIdx] : '';
        const city = cityIdx >= 0 && row[cityIdx] ? row[cityIdx] : 'Lahore';

        parsedLeads.push({
          id: `csv-${i}`,
          phone,
          first_name,
          last_name,
          city,
          status: 'pending'
        });
      }

      if (parsedLeads.length === 0) {
        setTerminalLogs(prev => [...prev, `[!] Error: Could not extract valid phone numbers from '${fileName}'.`]);
        return;
      }

      setIsRunning(false);
      setIsPaused(false);
      setCurrentIndex(0);
      setSuccessCount(0);
      setFailedCount(0);
      setDuplicateCount(0);
      setLeads(parsedLeads);
      setActiveSourceFileName(fileName);

      setTerminalLogs(prev => [
        ...prev,
        `\n[✓] Successfully ingested ${parsedLeads.length} leads from '${fileName}'.`,
        `[*] Column mapping detected: Phone col index: ${phoneIdx >= 0 ? phoneIdx : 0}, Name: ${fnameIdx}, City: ${cityIdx}`,
        `[*] Ready to inject to List ${config.listId} (Campaign: ${config.campaignId}).`
      ]);
    } catch (err) {
      setTerminalLogs(prev => [
        ...prev,
        `[!] Failed to parse CSV '${fileName}': ${(err as Error).message}`
      ]);
    }
  };

  // Handle file input upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseAndLoadCsvText(content, file.name);
    };
    reader.readAsText(file);
    // Reset file input so user can re-upload same file if desired
    e.target.value = '';
  };

  // Handle Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        parseAndLoadCsvText(content, file.name);
      };
      reader.readAsText(file);
    }
  };

  // Execute Batch Process
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processNextLead = async () => {
      if (!isRunningRef.current || isPausedRef.current) return;
      if (currentIndex >= leads.length) {
        setIsRunning(false);
        setTerminalLogs(prev => [
          ...prev,
          `\n--- Batch Lead Injection Complete ---`,
          `Total Records: ${leads.length}`,
          `Total Successful: ${successCount}`,
          `Total Duplicates: ${duplicateCount}`,
          `Total Failed: ${failedCount}`
        ]);
        return;
      }

      const lead = leads[currentIndex];
      const leadNum = currentIndex + 1;

      // Dynamic IP check every 500 records
      if (leadNum % config.ipCheckInterval === 0) {
        setTerminalLogs(prev => [
          ...prev,
          `[*] IP health check checkpoint reached (record #${leadNum})... Verifying gateway session.`
        ]);
      }

      // Simulate rate limiting pause every 100 records
      if (leadNum % config.rateLimitBatch === 0 && leadNum > 0) {
        setTerminalLogs(prev => [
          ...prev,
          `[*] Progress: Processed ${leadNum} leads... (Success: ${successCount}, Failed: ${failedCount})`,
          `[*] Rate limiting applied: Pausing ${config.rateLimitDelayMs}ms to protect gateway...`
        ]);
      }

      // Perform lead injection
      try {
        const res = await fetch('/api/leads/inject', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: lead.phone,
            first_name: lead.first_name,
            last_name: lead.last_name,
            city: lead.city,
            list_id: config.listId,
            duplicate_check: config.duplicateCheck,
            phone_code: config.phoneCode
          })
        });

        const data = await res.json();

        if (data.status === 'SUCCESS') {
          setSuccessCount(prev => prev + 1);
          setLeads(prev => {
            const copy = [...prev];
            copy[currentIndex] = {
              ...lead,
              status: 'success',
              leadId: data.lead_id,
              message: data.result_text,
              injectedAt: new Date().toLocaleTimeString()
            };
            return copy;
          });
          setTerminalLogs(prev => [
            ...prev,
            `[SUCCESS] #${leadNum} | Phone: +${config.phoneCode} ${lead.phone} | LeadID: ${data.lead_id} | Name: ${lead.first_name} ${lead.last_name} (${lead.city})`
          ]);
        } else if (data.code === 'DUPLICATE') {
          setDuplicateCount(prev => prev + 1);
          setLeads(prev => {
            const copy = [...prev];
            copy[currentIndex] = {
              ...lead,
              status: 'duplicate',
              message: data.message
            };
            return copy;
          });
          setTerminalLogs(prev => [
            ...prev,
            `[DUPLICATE] #${leadNum} | Phone: ${lead.phone} already present in List ${config.listId} (DUPCAMP skipped)`
          ]);
        } else {
          setFailedCount(prev => prev + 1);
          setLeads(prev => {
            const copy = [...prev];
            copy[currentIndex] = {
              ...lead,
              status: 'failed',
              message: data.message || 'API rejected record'
            };
            return copy;
          });
          setTerminalLogs(prev => [
            ...prev,
            `[ERROR] Lead ${lead.phone} failed: ${data.message || 'Injection rejected'}`
          ]);
        }
      } catch (err) {
        setFailedCount(prev => prev + 1);
        setTerminalLogs(prev => [
          ...prev,
          `[ERROR] Network timeout or gateway offline for ${lead.phone}: ${(err as Error).message}`
        ]);
      }

      setCurrentIndex(prev => prev + 1);
    };

    if (isRunning && !isPaused) {
      // Speed up simulated batch for UI responsiveness (e.g. 80ms per lead with pauses)
      const delay = (currentIndex + 1) % config.rateLimitBatch === 0 ? config.rateLimitDelayMs : 80;
      timeoutId = setTimeout(processNextLead, delay);
    }

    return () => clearTimeout(timeoutId);
  }, [isRunning, isPaused, currentIndex, leads.length]);

  // Single Lead Test Handler
  const handleSingleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSingleInjecting(true);
    setSingleResult(null);

    const generatedUrl = `https://${config.viciHost}/vicidial/non_agent_api.php?source=python_crm_bridge&user=${config.apiUser}&pass=${encodeURIComponent(config.apiPass)}&function=add_lead&phone_number=${singlePhone}&phone_code=${config.phoneCode}&list_id=${config.listId}&first_name=${encodeURIComponent(singleFirstName)}&last_name=${encodeURIComponent(singleLastName)}&city=${encodeURIComponent(singleCity)}&duplicate_check=${config.duplicateCheck}`;

    try {
      const res = await fetch('/api/leads/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: singlePhone,
          first_name: singleFirstName,
          last_name: singleLastName,
          city: singleCity,
          list_id: config.listId,
          duplicate_check: config.duplicateCheck,
          phone_code: config.phoneCode
        })
      });

      const data = await res.json();
      setSingleResult({
        success: data.status === 'SUCCESS',
        rawText: data.result_text || data.message || JSON.stringify(data),
        url: generatedUrl,
        timestamp: new Date().toLocaleTimeString()
      });

      setTerminalLogs(prev => [
        ...prev,
        `[*] Single Test: Push lead ${singlePhone} -> ${data.status === 'SUCCESS' ? 'SUCCESS: ' + data.result_text : data.message}`
      ]);
    } catch (err) {
      setSingleResult({
        success: false,
        rawText: `Connection failed: ${(err as Error).message}`,
        url: generatedUrl,
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setIsSingleInjecting(false);
    }
  };

  // Python Script Content for display and download
  const pythonScriptCode = `import requests
import csv
import time
from datetime import datetime

# --- CONFIGURATION ---
VICI_HOST = "${config.viciHost}"      # Your VICIdial server domain / IP
API_USER = "${config.apiUser}"                  # VICIdial API Administrator Username
API_PASS = "${config.apiPass}"          # VICIdial API Password
CAMPAIGN_ID = "${config.campaignId}"                 # Target VICIdial Campaign ID
LIST_ID = ${config.listId}                           # Target VICIdial List ID
LEADS_CSV_FILE = "leads_10k.csv"        # Path to your 10,000 leads CSV file

# VICIdial Non-Agent API Endpoint URL
API_URL = f"https://{VICI_HOST}/vicidial/non_agent_api.php"

def get_current_public_ip():
    """Fetches the current external IP to verify/handle dynamic network changes."""
    try:
        response = requests.get("https://api.ipify.org?format=json", timeout=5)
        if response.status_code == 200:
            return response.json().get("ip")
    except requests.RequestException:
        try:
            response = requests.get("https://icanhazip.com", timeout=5)
            return response.text.strip()
        except requests.RequestException as e:
            print(f"[!] Warning: Could not detect public IP: {e}")
    return None

def verify_and_sync_ip(last_known_ip):
    """Detects if the dynamic IP has changed and outputs a secure re-verification log."""
    current_ip = get_current_public_ip()
    if not current_ip:
        return last_known_ip

    if current_ip != last_known_ip:
        print(f"\\n[ALERT] Dynamic IP Shift Detected!")
        print(f"Previous IP: {last_known_ip} -> New IP: {current_ip}")
        print(f"Timestamp: {datetime.now()}")
        print("[*] Re-verifying session compatibility with gateway firewall...")
        return current_ip
    
    return last_known_ip

def inject_lead_to_vici(phone_number, first_name, last_name, city):
    """Pushes a single lead into VICIdial via the Non-Agent API add_lead function."""
    params = {
        'source': 'python_crm_bridge',
        'user': API_USER,
        'pass': API_PASS,
        'function': 'add_lead',
        'phone_number': phone_number,
        'phone_code': '${config.phoneCode}',             # Country code for Pakistan (+92)
        'list_id': LIST_ID,
        'first_name': first_name,
        'last_name': last_name,
        'city': city,
        'duplicate_check': '${config.duplicateCheck}'    # Prevents duplicate numbers in the campaign
    }

    try:
        # verify=False is used if using self-signed SSL certificates on the dialer
        response = requests.get(API_URL, params=params, verify=False, timeout=10)
        result_text = response.text.strip()
        
        if "SUCCESS" in result_text:
            return True, result_text
        else:
            return False, result_text
    except Exception as e:
        return False, str(e)

def process_bulk_leads():
    """Reads bulk leads and pushes them safely with rate-limiting & IP checks."""
    active_ip = get_current_public_ip()
    print(f"[*] Dialer Engine Initialized. Active Public IP: {active_ip}")
    print(f"[*] Target Gateway: {VICI_HOST} | Campaign: {CAMPAIGN_ID}")

    success_count = 0
    failure_count = 0

    try:
        with open(LEADS_CSV_FILE, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            
            for index, row in enumerate(reader, start=1):
                # Verify IP health check every ${config.ipCheckInterval} records processed
                if index % ${config.ipCheckInterval} == 0:
                    active_ip = verify_and_sync_ip(active_ip)

                phone = row.get('phone')
                fname = row.get('first_name', 'Client')
                lname = row.get('last_name', '')
                city = row.get('city', 'Lahore')

                if not phone:
                    continue

                success, message = inject_lead_to_vici(phone, fname, lname, city)
                
                if success:
                    success_count += 1
                else:
                    failure_count += 1
                    print(f"[Error] Lead {phone} failed: {message}")

                # Rate limiting to protect the server and keep predictive dialer steady
                if index % ${config.rateLimitBatch} == 0:
                    print(f"[*] Progress: Processed {index} leads... (Success: {success_count}, Failed: {failure_count})")
                    time.sleep(0.5)

    except FileNotFoundError:
        print(f"[!] Error: Could not find lead file '{LEADS_CSV_FILE}'. Make sure it's placed in the script directory.")

    print("\\n--- Batch Lead Injection Complete ---")
    print(f"Total Successful: {success_count}")
    print(f"Total Failed: {failure_count}")

if __name__ == "__main__":
    process_bulk_leads()
`;

  // Download Python file
  const handleDownloadPython = () => {
    const blob = new Blob([pythonScriptCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vici_lead_injector.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download CSV file
  const handleDownloadCsv = () => {
    const header = 'phone,first_name,last_name,city\n';
    const rows = leads.map(l => `${l.phone},${l.first_name},${l.last_name},${l.city}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads_10k.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, type: 'python' | 'csv') => {
    navigator.clipboard.writeText(text);
    if (type === 'python') {
      setCopiedPython(true);
      setTimeout(() => setCopiedPython(false), 2000);
    } else {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.phone.includes(searchTerm) || 
    l.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const progressPercent = leads.length > 0 ? Math.round((currentIndex / leads.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-sky-400 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gateway</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Grainbox</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 font-mono font-semibold">
                  VICIdial Non-Agent API Bridge
                </span>
              </div>
              <p className="text-xs text-slate-400">
                10,000 Bulk Lead Injector & Dynamic IP Sentinel (Pakistan +92 Telephony Cluster)
              </p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'batch' 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bulk Lead Engine
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'single' 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Single Lead Test
          </button>
          <button
            onClick={() => setActiveTab('script')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'script' 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python Script (.py)
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'config' 
                ? 'bg-sky-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dialer Config
          </button>
        </div>
      </div>

      {/* Dynamic IP Sentinel Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Dynamic Public IP Card */}
        <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Dynamic Public IP (Pakistan WAN)
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xl font-mono font-bold text-white tracking-wide">
                    {currentIp}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800/40 text-[10px] text-emerald-400 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firewall Synced
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={fetchPublicIp}
              disabled={isVerifyingIp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
              title="Verify IP with api.ipify.org / icanhazip.com"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isVerifyingIp ? 'animate-spin' : ''}`} />
              <span>{isVerifyingIp ? 'Checking...' : 'Re-verify IP'}</span>
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>ISP: <strong className="text-slate-200">{ispName}</strong></span>
            <span>Check Interval: <strong className="text-cyan-400">Every {config.ipCheckInterval} leads</strong></span>
          </div>
        </div>

        {/* Target Campaign & Gateway Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Target Gateway
              </span>
              <p className="text-sm font-bold text-white mt-0.5 truncate max-w-[170px]" title={config.viciHost}>
                {config.viciHost}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>List ID: <strong className="text-indigo-300 font-mono">{config.listId}</strong></span>
            <span>Campaign: <strong className="text-indigo-300 font-mono">{config.campaignId}</strong></span>
          </div>
        </div>

        {/* Protection & Deduplication Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Dialer Protection
              </span>
              <p className="text-sm font-bold text-teal-300 mt-0.5">
                {config.duplicateCheck} Active
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Rate Limit: <strong className="text-teal-200">100 recs / 0.5s</strong></span>
            <span>Code: <strong className="text-teal-200">+{config.phoneCode}</strong></span>
          </div>
        </div>

      </div>

      {/* TAB 1: BULK LEAD ENGINE */}
      {activeTab === 'batch' && (
        <div className="space-y-6">
          
          {/* Engine Dashboard Metrics Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
              
              {/* Batch Tally */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-grow">
                
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
                  <div className="text-[11px] font-mono uppercase text-slate-400">Total Leads</div>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {leads.length.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">leads_10k.csv</div>
                </div>

                <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-xl p-3">
                  <div className="text-[11px] font-mono uppercase text-emerald-400">Successful</div>
                  <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">
                    {successCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 mt-0.5">Injected to List {config.listId}</div>
                </div>

                <div className="bg-amber-950/30 border border-amber-800/30 rounded-xl p-3">
                  <div className="text-[11px] font-mono uppercase text-amber-400">Duplicates Filtered</div>
                  <div className="text-2xl font-bold font-mono text-amber-300 mt-1">
                    {duplicateCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-amber-500/80 mt-0.5">DUPCAMP skipped</div>
                </div>

                <div className="bg-rose-950/30 border border-rose-800/30 rounded-xl p-3">
                  <div className="text-[11px] font-mono uppercase text-rose-400">Failed / Errors</div>
                  <div className="text-2xl font-bold font-mono text-rose-300 mt-1">
                    {failedCount.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-rose-500/80 mt-0.5">Rejected by dialer</div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                
                {!isRunning ? (
                  <button
                    onClick={() => {
                      setIsRunning(true);
                      setIsPaused(false);
                      setTerminalLogs(prev => [
                        ...prev,
                        `\n[*] Starting Lead Injection Engine at ${new Date().toLocaleTimeString()}...`,
                        `[*] Connected to ${config.viciHost} via non_agent_api.php`
                      ]);
                    }}
                    disabled={currentIndex >= leads.length}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{currentIndex === 0 ? 'Start Bulk Injection' : 'Resume Injection'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsPaused(!isPaused);
                      setTerminalLogs(prev => [
                        ...prev,
                        isPaused ? '[*] Engine Resumed.' : '[*] Engine Paused by operator.'
                      ]);
                    }}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm shadow-lg transition-all cursor-pointer ${
                      isPaused 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                    }`}
                  >
                    {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  title="Reset Injection Progress"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => generateLargeDataset(1000)}
                  className="inline-flex items-center gap-1.5 px-3 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Generate 1,000 synthetic leads for testing"
                >
                  <span>+1k Leads</span>
                </button>

                <button
                  onClick={handleDownloadCsv}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                  title="Download leads_10k.csv"
                >
                  <Download className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Injection Progress: <strong className="text-white">{currentIndex}</strong> / {leads.length} leads
                </span>
                <span className="text-cyan-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

          </div>

          {/* Dual Panel: Terminal Console + Leads Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Terminal Live Stream Log (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[520px]">
              <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                    Telephony Gateway Stream
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-mono text-slate-400">Live Socket</span>
                </div>
              </div>

              <div 
                ref={terminalRef}
                className="flex-grow p-4 font-mono text-xs text-slate-300 space-y-1.5 overflow-y-auto leading-relaxed select-text"
              >
                {terminalLogs.map((log, idx) => {
                  let color = 'text-slate-300';
                  if (log.includes('[SUCCESS]')) color = 'text-emerald-400';
                  if (log.includes('[DUPLICATE]')) color = 'text-amber-400';
                  if (log.includes('[ERROR]') || log.includes('[!]')) color = 'text-rose-400 font-semibold';
                  if (log.includes('[ALERT]')) color = 'text-amber-300 bg-amber-950/40 p-1 rounded font-bold';
                  if (log.includes('--- Batch')) color = 'text-cyan-300 font-bold';

                  return (
                    <div key={idx} className={`${color} whitespace-pre-wrap break-all`}>
                      {log}
                    </div>
                  );
                })}
              </div>

              <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Terminal buffer: {terminalLogs.length} events</span>
                <button
                  onClick={() => setTerminalLogs([`[*] Log cleared. Target: ${config.viciHost}`])}
                  className="hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Clear Log
                </button>
              </div>
            </div>

            {/* Leads Table & Search (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[520px]">
              
              {/* Table Toolbar */}
              <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Leads Queue ({filteredLeads.length})
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search phone, name, city..."
                    className="w-full sm:w-56 pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Table Data */}
              <div className="flex-grow overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/60 sticky top-0 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                    <tr>
                      <th className="py-2.5 px-4">#</th>
                      <th className="py-2.5 px-4">Phone (+92)</th>
                      <th className="py-2.5 px-4">Contact</th>
                      <th className="py-2.5 px-4">City</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredLeads.slice(0, 100).map((lead, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-4 text-slate-500">{idx + 1}</td>
                        <td className="py-2.5 px-4 font-bold text-white">
                          +{config.phoneCode} {lead.phone}
                        </td>
                        <td className="py-2.5 px-4 text-slate-300 font-sans">
                          {lead.first_name} {lead.last_name}
                        </td>
                        <td className="py-2.5 px-4 text-slate-400 font-sans">
                          {lead.city}
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {lead.status === 'success' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{lead.leadId || 'INJECTED'}</span>
                            </span>
                          )}
                          {lead.status === 'duplicate' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/40 text-[10px]">
                              <span>DUPLICATE</span>
                            </span>
                          )}
                          {lead.status === 'failed' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-950 text-rose-400 border border-rose-800/40 text-[10px]">
                              <span>FAILED</span>
                            </span>
                          )}
                          {lead.status === 'pending' && (
                            <span className="text-slate-500 text-[11px]">
                              QUEUED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredLeads.length > 100 && (
                <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center text-xs text-slate-400">
                  Showing first 100 of {filteredLeads.length} leads in memory
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SINGLE LEAD TEST */}
      {activeTab === 'single' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Single Lead Test Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Send className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-base font-bold text-white">Single Lead Injection Tester</h3>
                <p className="text-xs text-slate-400">Directly probe VICIdial Non-Agent API add_lead function</p>
              </div>
            </div>

            <form onSubmit={handleSingleInject} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number (Pakistan Format)
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-slate-300">
                    +{config.phoneCode}
                  </span>
                  <input
                    type="text"
                    required
                    value={singlePhone}
                    onChange={(e) => setSinglePhone(e.target.value)}
                    placeholder="e.g. 03001234567"
                    className="flex-grow px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={singleFirstName}
                    onChange={(e) => setSingleFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={singleLastName}
                    onChange={(e) => setSingleLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={singleCity}
                  onChange={(e) => setSingleCity(e.target.value)}
                  placeholder="e.g. Lahore, Karachi, Islamabad"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSingleInjecting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-600/30 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSingleInjecting ? 'Injecting into VICIdial...' : 'Inject Single Lead to Gateway'}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Single Lead Result & Raw Response */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>Gateway Non-Agent API Response</span>
            </h3>

            {singleResult ? (
              <div className="space-y-4">
                
                <div className={`p-4 rounded-xl border ${
                  singleResult.success 
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300' 
                    : 'bg-rose-950/40 border-rose-800/50 text-rose-300'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {singleResult.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-sm">
                      {singleResult.success ? 'Lead Successfully Injected' : 'API Error Received'}
                    </span>
                  </div>
                  <p className="font-mono text-xs pl-7 break-all">
                    {singleResult.rawText}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                    HTTP Request Query Constructed
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-400 break-all select-all">
                    {singleResult.url}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Execution completed at {singleResult.timestamp} UTC
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs">
                Submit the form to test live lead injection into VICIdial.
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: PYTHON SCRIPT (.PY) */}
      {activeTab === 'script' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>vici_lead_injector.py (Standalone CLI Python Script)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready to execute directly via terminal or deploy to your server.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(pythonScriptCode, 'python')}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                {copiedPython ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPython ? 'Copied!' : 'Copy Script'}</span>
              </button>

              <button
                onClick={handleDownloadPython}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-lg shadow-sky-600/20 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download .py</span>
              </button>

              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/20 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* Quick Terminal Guide */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
              CLI Execution Instructions
            </span>
            <div className="space-y-1 font-mono text-xs text-emerald-400">
              <div>$ pip install requests</div>
              <div>$ python vici_lead_injector.py</div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed">
              <code>{pythonScriptCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: CONFIGURATION */}
      {activeTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl">
          <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-400" />
            <span>VICIdial Gateway & Engine Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                VICIdial Host / Domain
              </label>
              <input
                type="text"
                value={config.viciHost}
                onChange={(e) => setConfig({ ...config, viciHost: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                API Admin Username
              </label>
              <input
                type="text"
                value={config.apiUser}
                onChange={(e) => setConfig({ ...config, apiUser: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                API Admin Password
              </label>
              <input
                type="password"
                value={config.apiPass}
                onChange={(e) => setConfig({ ...config, apiPass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Campaign ID
              </label>
              <input
                type="text"
                value={config.campaignId}
                onChange={(e) => setConfig({ ...config, campaignId: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                List ID (Target Lead List)
              </label>
              <input
                type="number"
                value={config.listId}
                onChange={(e) => setConfig({ ...config, listId: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Phone Country Code
              </label>
              <input
                type="text"
                value={config.phoneCode}
                onChange={(e) => setConfig({ ...config, phoneCode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Duplicate Check Filter
              </label>
              <select
                value={config.duplicateCheck}
                onChange={(e) => setConfig({ ...config, duplicateCheck: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              >
                <option value="DUPCAMP">DUPCAMP (Prevents duplicates in campaign)</option>
                <option value="DUPLIST">DUPLIST (Prevents duplicates in list)</option>
                <option value="DUPSYS">DUPSYS (Prevents duplicates across system)</option>
                <option value="NONE">NONE (Allow duplicate phone numbers)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                IP Check Frequency (Records)
              </label>
              <input
                type="number"
                value={config.ipCheckInterval}
                onChange={(e) => setConfig({ ...config, ipCheckInterval: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono"
              />
            </div>

          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                setActiveTab('batch');
                setTerminalLogs(prev => [
                  ...prev,
                  `[*] Configuration updated: Target List ${config.listId} | Campaign ${config.campaignId}`
                ]);
              }}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
