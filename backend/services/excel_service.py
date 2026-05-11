import pandas as pd

def parse_excel(file_path: str):
    df = pd.read_excel(file_path, dtype=str)

    print("RAW ROWS:", len(df))

    df.columns = df.columns.str.strip().str.lower()

    # remove completely empty rows only
    df = df.dropna(how="all")

    df = df.fillna("")

    if "year" not in df.columns:
        df["year"] = "2026"

    print("FINAL ROWS:", len(df))
    print(df.tail())

    return df.to_dict(orient="records")