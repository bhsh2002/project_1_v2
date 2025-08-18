import pandas as pd
from pathlib import Path

file_dir = Path(__file__).resolve().parent
original_file_path = file_dir / "12.xlsx"
new_file_path = file_dir / "filtered_data_with_header.xlsx"
columns_to_keep = [31, 33, 34]  # price, barcode, name

try:
    df = pd.read_excel(original_file_path, header=None)

    df = df[columns_to_keep]
    df.columns = ["price", "barcode", "name"]

    df_final = df[
        df["price"].apply(
            lambda x: pd.notna(x) and str(x).replace(".", "", 1).isdigit()
        )
    ]
    df_final = df_final[df_final["barcode"].apply(lambda x: pd.notna(x))]

    df_final = df_final[
        df_final["name"].apply(lambda x: pd.notna(x) and str(x).strip() != "")
    ]

    df_final = df_final.drop_duplicates(subset=["barcode"])

    df_final.to_excel(new_file_path, index=False)

    print(f"Operation completed successfully! New file created at: {new_file_path}")
    print(f"Number of rows in the original file: {len(df)}")
    print(f"Number of rows in the new filtered file: {len(df_final)}")

except FileNotFoundError:
    print(
        f"Error: The file '{original_file_path}' was not found."
        f" Please check the name and path."
    )
except KeyError as e:
    print(
        f"Error: Column number {e} does not exist in the file."
        f" Make sure your file has enough columns."
    )
except Exception as e:
    print(f"An unexpected error occurred: {e}")
