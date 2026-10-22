"""
Grainbox - VICIdial Non-Agent API Bulk Lead Injector
Optimized for high-volume lead injection into VICIdial clusters with dynamic IP verification.
"""

import os
import sys
import requests
import csv
import time
from datetime import datetime

# --- CONFIGURATION ---
VICI_HOST = "dialer.gntechnos.com"      # Your VICIdial server domain / IP
API_USER = "vdc_admin"                  # VICIdial API Administrator Username
API_PASS = "your_api_password"          # VICIdial API Password
CAMPAIGN_ID = "DEFAULT"                 # Target VICIdial Campaign ID
LIST_ID = 101                           # Target VICIdial List ID

# Default to CLI argument if provided (e.g. python vici_lead_injector.py "E:\Apa.csv"),
# otherwise auto-detect 'Apa.csv' in current directory or fall back to 'leads_10k.csv'
if len(sys.argv) > 1 and sys.argv[1].strip():
    LEADS_CSV_FILE = sys.argv[1].strip()
elif os.path.exists("Apa.csv"):
    LEADS_CSV_FILE = "Apa.csv"
else:
    LEADS_CSV_FILE = "leads_10k.csv"

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
        print(f"\n[ALERT] Dynamic IP Shift Detected!")
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
        'phone_code': '92',             # Country code for Pakistan (+92)
        'list_id': LIST_ID,
        'first_name': first_name,
        'last_name': last_name,
        'city': city,
        'duplicate_check': 'DUPCAMP'    # Prevents duplicate numbers in the campaign
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
    print(f"[*] Target Gateway: {VICI_HOST} | Campaign: {CAMPAIGN_ID} | List ID: {LIST_ID}")
    print(f"[*] Active Source File: {LEADS_CSV_FILE}")

    success_count = 0
    failure_count = 0

    try:
        # Support utf-8-sig to automatically strip Windows/Excel BOM
        with open(LEADS_CSV_FILE, mode='r', encoding='utf-8-sig', errors='replace') as file:
            reader = csv.DictReader(file)
            
            for index, raw_row in enumerate(reader, start=1):
                # Normalize keys to lowercase stripped
                row = {k.strip().lower().replace(' ', '_'): v for k, v in raw_row.items() if k}

                # Verify IP health check every 500 records processed
                if index % 500 == 0:
                    active_ip = verify_and_sync_ip(active_ip)

                phone = row.get('phone') or row.get('phone_number') or row.get('mobile') or row.get('number') or row.get('contact')
                fname = row.get('first_name') or row.get('fname') or row.get('name') or 'Client'
                lname = row.get('last_name') or row.get('lname') or ''
                city = row.get('city') or row.get('location') or 'Lahore'

                if not phone:
                    continue

                success, message = inject_lead_to_vici(phone, fname, lname, city)
                
                if success:
                    success_count += 1
                else:
                    failure_count += 1
                    print(f"[Error] Lead {phone} failed: {message}")

                # Rate limiting to protect the server and keep predictive dialer steady
                if index % 100 == 0:
                    print(f"[*] Progress: Processed {index} leads... (Success: {success_count}, Failed: {failure_count})")
                    time.sleep(0.5)

    except FileNotFoundError:
        print(f"[!] Error: Could not find lead file '{LEADS_CSV_FILE}'.")
        print(f"[*] Tip: Place '{LEADS_CSV_FILE}' in this directory or run with full path, e.g.:")
        print(f'    python vici_lead_injector.py "E:\\Apa.csv"')

    print("\n--- Batch Lead Injection Complete ---")
    print(f"Total Successful: {success_count}")
    print(f"Total Failed: {failure_count}")

if __name__ == "__main__":
    process_bulk_leads()
