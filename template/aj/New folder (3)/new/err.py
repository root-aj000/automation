import os
import json
import re
from collections import defaultdict

# =========================================================
# CONFIG
# =========================================================
INCLUDE_EXT = {".ts", ".tsx"}

SKIP_FOLDERS = {
    "node_modules", ".git", "dist", "build",
    ".next", "out", ".idea", "__pycache__"
}

CONTEXT_DIR = "U:/foldersim/sim/context/new"
# root_path = "U:/foldersim/sim"
SCHEMA_JSON = f"{CONTEXT_DIR}/schema_relationships.json"
SCHEMA_TXT = f"{CONTEXT_DIR}/schema.txt"
SCHEMA_MERMAID = f"{CONTEXT_DIR}/schema.mmd"

# =========================================================
# HELPERS
# =========================================================
def should_skip_folder(path):
    path = path.replace("\\", "/")
    return any(f"/{s}/" in f"/{path}/" for s in SKIP_FOLDERS)

# =========================================================
# 1. FIND schema.ts FILES
# =========================================================
def find_schema_files(root_path):
    schemas = []

    for folder, _, files in os.walk(root_path):
        if should_skip_folder(folder):
            continue

        for f in files:
            if f.lower() == "schema.ts":
                schemas.append(os.path.join(folder, f).replace("\\", "/"))

    return schemas

# =========================================================
# 2. PARSE DRIZZLE TABLES & COLUMNS
# =========================================================
def parse_drizzle_schema(schema_path):
    with open(schema_path, "r", encoding="utf-8") as f:
        code = f.read()

    tables = {}

    table_pattern = re.compile(
        r"export\s+const\s+(\w+)\s*=\s*pgTable\(\s*['\"](\w+)['\"]\s*,\s*\{(.*?)\}\s*\)",
        re.DOTALL
    )

    column_pattern = re.compile(
        r"(\w+)\s*:\s*(\w+)\((.*?)\)",
        re.DOTALL
    )

    for table_var, table_name, body in table_pattern.findall(code):
        columns = []

        for col_name, col_type, col_args in column_pattern.findall(body):
            columns.append({
                "name": col_name,
                "type": col_type,
                "raw": col_args.strip()
            })

        tables[table_name] = {
            "variable": table_var,
            "columns": columns
        }

    return tables

# =========================================================
# 3. EXTRACT FOREIGN KEYS
# =========================================================
def extract_foreign_keys(schema_path):
    with open(schema_path, "r", encoding="utf-8") as f:
        code = f.read()

    fk_pattern = re.compile(
        r"(\w+)\s*:\s*\w+\(.*?\.references\(\s*\(\)\s*=>\s*(\w+)\.(\w+)\s*\)",
        re.DOTALL
    )

    fks = []

    for col, ref_table, ref_col in fk_pattern.findall(code):
        fks.append({
            "column": col,
            "references_table": ref_table,
            "references_column": ref_col
        })

    return fks

# =========================================================
# 4. MAIN SCHEMA ANALYSIS
# =========================================================
def analyze_schema_relationships(root_path):
    schemas = find_schema_files(root_path)
    result = {}

    for schema in schemas:
        tables = parse_drizzle_schema(schema)
        fks = extract_foreign_keys(schema)

        result[schema] = {
            "tables": tables,
            "foreign_keys": fks
        }

    with open(SCHEMA_JSON, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    return result

# =========================================================
# 5. EXPORT TEXT VIEW
# =========================================================
def export_schema_text(schema_data):
    lines = []

    for schema_path, schema in schema_data.items():
        lines.append(f"\nSCHEMA FILE: {schema_path}")
        lines.append("=" * 80)

        for table, info in schema["tables"].items():
            lines.append(f"\nTABLE: {table}")
            for col in info["columns"]:
                lines.append(f"  - {col['name']} ({col['type']})")

        if schema["foreign_keys"]:
            lines.append("\nRELATIONSHIPS:")
            for fk in schema["foreign_keys"]:
                lines.append(
                    f"  {fk['column']} → "
                    f"{fk['references_table']}.{fk['references_column']}"
                )

    with open(SCHEMA_TXT, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

# =========================================================
# 6. EXPORT MERMAID ER DIAGRAM (VISUAL)
# =========================================================
def export_schema_mermaid(schema_data):
    lines = ["erDiagram"]

    tables_seen = set()

    for schema in schema_data.values():
        for table, info in schema["tables"].items():
            if table in tables_seen:
                continue

            tables_seen.add(table)
            lines.append(f"{table} {{")
            for col in info["columns"]:
                lines.append(f"  {col['type']} {col['name']}")
            lines.append("}")

        for fk in schema["foreign_keys"]:
            src_col = fk["column"]
            ref_table = fk["references_table"]
            lines.append(
                f"{ref_table} ||--o{{ {table} : {src_col}"
            )

    with open(SCHEMA_MERMAID, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

# =========================================================
# 7. RUN EVERYTHING
# =========================================================



# =========================================================
# 7. RUN EVERYTHING
# =========================================================
def run_schema_analysis(root_path):
    schema_data = analyze_schema_relationships(root_path)
    export_schema_text(schema_data)
    export_schema_mermaid(schema_data)

    print(" Schema analysis complete")
    print(f" JSON      {SCHEMA_JSON}")
    print(f"Text     {SCHEMA_TXT}")
    print(f" Mermaid  {SCHEMA_MERMAID}")


# =========================================================
# MAIN
# =========================================================
if __name__ == "__main__":
    ROOT_DIR = "U:/foldersim/sim"  # must contain schema.ts somewhere
    run_schema_analysis(ROOT_DIR)