import re
import json
import os
from collections import defaultdict

DATA_DIR = os.path.join(os.path.dirname(__file__), "datasheet")

MONTH_MAP = {
    "Ιανουάριος": 1, "Φεβρουάριος": 2, "Μάρτιος": 3, "Απρίλιος": 4,
    "Μάιος": 5, "Ιούνιος": 6, "Ιούλιος": 7, "Αύγουστος": 8,
    "Σεπτέμβριος": 9, "Οκτώβριος": 10, "Νοέμβριος": 11, "Δεκέμβριος": 12
}

def make_timestamp(entry: dict) -> str | None:
    year = entry.get("Year")
    month_str = entry.get("Month")
    month = MONTH_MAP.get(month_str)
    if year and month:
        return f"{year}-{month:02d}-01"
    return None

def clean_value(value_str: str) -> float | None:
    if not value_str or str(value_str).strip() in ("ΔΠ^5", "ΔΠ"):
        return None
    # Καθαρισμός συμβόλων και κράτημα μόνο του πρώτου αριθμού
    clean_val = re.sub(r'[<>≥≤\^]', '', str(value_str)).split()[0]
    clean_val = clean_val.replace(',', '.')
    try:
        return float(clean_val)
    except ValueError:
        return None

def load_area_data(area_name: str):
    file_path = os.path.join(DATA_DIR, f"{area_name}.json")
    if not os.path.exists(file_path):
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def analyze_water_quality(area_name: str):
    data = load_area_data(area_name)
    if not data:
        return {"error": "Area not found"}

    results = []
    for entry in data:
        param_name = entry.get("Φυσικοχημικές Παράμετροι", "Unknown")
        value = clean_value(entry.get("Τιμή"))
        limit = clean_value(entry.get("Παραμετρική τιμή1"))

        status = "Unknown"
        percentage = None

        if value is not None:
            if "υδρογόνου" in param_name or "pH" in param_name:
                status = "Good" if 6.5 <= value <= 9.5 else "Bad"
                percentage = round((value / 9.5) * 100, 1)
            elif "χλώριο" in param_name.lower():
                status = "Good" if value >= 0.2 else "Warning"
                percentage = min(round((value / 0.2) * 100, 1), 100.0)
            elif limit is not None:
                status = "Good" if value <= limit else "Bad"
                percentage = round((value / limit) * 100, 1) if limit != 0 else 0

        results.append({
            "ts": make_timestamp(entry),
            "param": param_name, # <-- Εδώ το κλειδί είναι "param"
            "val": value,        # <-- Εδώ το κλειδί είναι "val"
            "pct": percentage,
            "status": status,
        })
    return results

def calculate_wqi(analyzed_results: list):
    # Έλεγχος αν έχουμε λίστα
    if not isinstance(analyzed_results, list):
        return None

    sum_wi_qi = 0
    sum_wi = 0
    
    config = {
        "pH": {"Si": 8.5, "ideal": 7.0, "weight": 0.22},
        "Θολότητα": {"Si": 1.0, "ideal": 0.0, "weight": 0.15},
        "Χλωριούχα": {"Si": 250.0, "ideal": 0.0, "weight": 0.10},
        "Αγωγιμότητα": {"Si": 2500.0, "ideal": 0.0, "weight": 0.08},
        "Αργίλιο": {"Si": 200.0, "ideal": 0.0, "weight": 0.12},
        "χλώριο": {"Si": 0.5, "ideal": 0.0, "weight": 0.20}
    }

    for item in analyzed_results:
        # Χρησιμοποιούμε .get για ασφάλεια
        param_name = item.get("param") # <-- Διορθώθηκε από "parameter"
        value = item.get("val")        # <-- Διορθώθηκε από "value"
        
        if param_name is None or value is None:
            continue
            
        match = next((cfg for key, cfg in config.items() if key.lower() in param_name.lower()), None)
        
        if match:
            Si = match["Si"]
            Vi = match["ideal"]
            Wi = match["weight"]
            
            # Αποφυγή διαίρεσης με το μηδέν
            if Si - Vi == 0: continue
            
            qi = 100 * ((value - Vi) / (Si - Vi))
            sum_wi_qi += (Wi * qi)
            sum_wi += Wi

    if sum_wi == 0:
        return None

    wqi_final = sum_wi_qi / sum_wi
    
    if wqi_final <= 25: status = "Excellent"
    elif wqi_final <= 50: status = "Good"
    elif wqi_final <= 75: status = "Poor"
    elif wqi_final <= 100: status = "Very Poor"
    else: status = "Unsuitable for drinking"
    
    return {
        "score": round(wqi_final, 2),
        "rating": status
    }




def get_year_monthly_wqi(area_name: str, year: str):
    """Επιστρέφει το WQI για κάθε μήνα ενός συγκεκριμένου έτους."""
    full_data = analyze_water_quality(area_name)
    if isinstance(full_data, dict) and "error" in full_data: return full_data

    # Φιλτράρουμε μόνο τα δεδομένα του συγκεκριμένου έτους
    year_data = [e for e in full_data if e.get("ts") and e.get("ts").startswith(year)]
    
    if not year_data:
        return {"error": f"No data found for year {year}"}

    # Ομαδοποίηση ανά μήνα
    monthly_groups = defaultdict(list)
    for entry in year_data:
        monthly_groups[entry["ts"]].append(entry)

    # Υπολογισμός WQI για κάθε μήνα του έτους
    results = []
    for ts in sorted(monthly_groups.keys()):
        results.append({
            "month_ts": ts,
            "wqi": calculate_wqi(monthly_groups[ts])
        })
    
    return results

def get_year_overall_wqi(area_name: str, year: str):
    """Επιστρέφει ένα συνολικό (overall) WQI για όλο το έτος."""
    full_data = analyze_water_quality(area_name)
    if isinstance(full_data, dict) and "error" in full_data: return full_data

    # Συγκέντρωση όλων των μετρήσεων του έτους σε μία λίστα
    year_data = [e for e in full_data if e.get("ts") and e.get("ts").startswith(year)]
    
    if not year_data:
        return {"error": f"No data found for year {year}"}

    # Υπολογισμός ενός ενιαίου WQI για όλες τις μετρήσεις του έτους μαζί
    overall_wqi = calculate_wqi(year_data)
    
    return {
        "year": year,
        "overall_wqi": overall_wqi,
        "total_measurements": len(year_data)
    }


def get_available_months(area_name: str):
    """Επιστρέφει μόνο τη λίστα με τους μήνες και τα βασικά stats."""
    full_data = analyze_water_quality(area_name)
    if isinstance(full_data, dict) and "error" in full_data: return full_data
    
    months = sorted(list(set(entry.get("ts") for entry in full_data if entry.get("ts"))))
    return {
        "available_months": months,
        "total": len(months),
        "latest": months[-1] if months else None
    }

def get_monthly_analysis(area_name: str, month_ts: str):
    """Επιστρέφει τα δεδομένα και το WQI για έναν συγκεκριμένο μήνα."""
    full_data = analyze_water_quality(area_name)
    if isinstance(full_data, dict) and "error" in full_data: return full_data
    
    # Φιλτράρισμα μόνο για τον συγκεκριμένο μήνα (π.χ. "2023-12-01")
    month_data = [e for e in full_data if e.get("ts") == month_ts]
    
    if not month_data:
        return {"error": "No data for this month"}
        
    return {
        "month": month_ts,
        "measurements": month_data
    }


def get_yearly_stats(area_name: str, year: str):
    """Υπολογίζει τα στατιστικά συμμόρφωσης για ένα συγκεκριμένο έτος."""
    full_data = analyze_water_quality(area_name)
    if isinstance(full_data, dict) and "error" in full_data: 
        return full_data

    # Φιλτράρουμε μόνο τα δεδομένα του συγκεκριμένου έτους
    year_data = [e for e in full_data if e.get("ts") and e.get("ts").startswith(year)]
    
    if not year_data:
        return {"error": f"No data found for year {year}"}

    expected = 21  # Ο αριθμός που θέλεις ως βάση
    
    # Μετρήσεις που έχουν τιμή (val δεν είναι None)
    with_data = len([e for e in year_data if e.get("val") is not None])
    
    # Συμμόρφωση: Πόσες μετρήσεις έχουν status "Good"
    compliance = len([e for e in year_data if e.get("status") == "Good"])
    
    # Αποτυχίες: Πόσες έχουν status "Bad" ή "Warning"
    failures = len([e for e in year_data if e.get("status") in ["Bad", "Warning"]])
    
    # Χωρίς δεδομένα: Η διαφορά από τα αναμενόμενα
    no_data = max(0, expected - with_data)

    return {
        "Έτος": year,
        "Αναμενόμενες μετρήσεις": expected,
        "Μετρήσεις με δεδομένα": with_data,
        "Συμμόρφωση": compliance,
        "Αποτυχίες": failures,
        "Χωρίς δεδομένα": no_data
    }