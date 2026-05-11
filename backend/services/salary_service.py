import math
 
def format_indian_currency(amount):
    """Format number with Indian currency commas (e.g., 12,34,567)"""
    try:
        num = int(round(float(amount)))
        s = str(num)
        # Handle negative numbers
        if num < 0:
            return "-" + format_indian_currency(abs(num))
        # Last 3 digits
        last3 = s[-3:]
        # Remaining digits
        rest = s[:-3]
        if rest:
            # Reverse and group by 2 digits
            rest = rest[::-1]
            parts = [rest[i:i+2] for i in range(0, len(rest), 2)]
            rest = ",".join(parts)[::-1]
            return rest + "," + last3
        else:
            return last3
    except:
        return str(amount)
 
 
def calculate_salary(ctc):
    try:
        ctc = float(str(ctc).replace(",", ""))
    except:
        return {}
 
    # ==============================
    # BASIC
    # ==============================
    basic = ctc * 0.40
    hra = basic * 0.40
 
    # ==============================
    # FIXED COMPONENTS
    # ==============================
    lta = 50000
    mobile = 12000
    broadband = 12000
    book = 12000
    gym = 18000
    insurance = 15000
    term_insurance = 2000
 
    # CONDITION: LOW SALARY FIX
    if ctc < 400000:
        mobile = 0
        broadband = 0
        gym = 0
 
    # ==============================
    # PF
    # ==============================
    employee_pf = basic * 0.12
 
    if (basic / 12) >= 15000:
        employer_pf = 21600
    else:
        employer_pf = basic * 0.12
 
    # ==============================
    # GRATUITY
    # ==============================
    gratuity = round((basic / 12) * 15 / 26)
 
    # ==============================
    # ANNUAL GROSS
    # ==============================
    annual_gross = ctc - (insurance + term_insurance + employer_pf + gratuity)
 
    # ==============================
    # SPECIAL ALLOWANCE
    # ==============================
    special_allowance = annual_gross - (
        basic + hra + lta + mobile + broadband + book + gym + employee_pf
    )
 
    # Optional safety
    if special_allowance < 0:
        special_allowance = 0
 
    def monthly(x):
        return round(x / 12)
 
    return {
        # Basic
        "Basic": format_indian_currency(round(basic)),
        "Basic_Monthly": format_indian_currency(monthly(basic)),
 
        # HRA
        "HRA": format_indian_currency(round(hra)),
        "HRA_Monthly": format_indian_currency(monthly(hra)),
 
        # Special Allowance
        "Special_Allowance": format_indian_currency(round(special_allowance)),
        "Special_Allowance_Monthly": format_indian_currency(monthly(special_allowance)),
 
        # LTA
        "LTA": format_indian_currency(lta),
        "LTA_Monthly": format_indian_currency(monthly(lta)),
 
        # Mobile
        "Mobile": format_indian_currency(mobile),
        "Mobile_Monthly": format_indian_currency(monthly(mobile)),
 
        # Broadband
        "Broadband": format_indian_currency(broadband),
        "Broadband_Monthly": format_indian_currency(monthly(broadband)),
 
        # Gym
        "Gym": format_indian_currency(gym),
        "Gym_Monthly": format_indian_currency(monthly(gym)),
 
        # Book
        "Book": format_indian_currency(book),
        "Book_Monthly": format_indian_currency(monthly(book)),
 
        # Employee PF
        "Employee_PF": format_indian_currency(round(employee_pf)),
        "Employee_PF_Monthly": format_indian_currency(monthly(employee_pf)),
 
        # Annual Gross
        "Annual_Gross": format_indian_currency(round(annual_gross)),
        "Annual_Gross_Monthly": format_indian_currency(monthly(annual_gross)),
 
        # Insurance
        "Insurance": format_indian_currency(insurance),
        "Insurance_Monthly": format_indian_currency(monthly(insurance)),
 
        # Employer PF
        "Employer_PF": format_indian_currency(round(employer_pf)),
        "Employer_PF_Monthly": format_indian_currency(monthly(employer_pf)),
 
        # Gratuity
        "Gratuity": format_indian_currency(gratuity),
        "Gratuity_Monthly": format_indian_currency(monthly(gratuity)),
 
        # CTC
        "CTC": format_indian_currency(round(ctc)),
        "CTC_Monthly": format_indian_currency(monthly(ctc)),
    }