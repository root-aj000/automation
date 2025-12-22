import os
import json
import re
from collections import defaultdict
from urllib.parse import urlparse

# =========================================================
# FILE TYPES & SKIP RULES
# =========================================================
INCLUDE_EXT = {".py", ".ts", ".tsx"}

SKIP_FOLDERS = {
    "venv", ".venv", "env", ".env",
    "node_modules", "__pycache__", ".git",
    ".pytest_cache", "site-packages", "_pytest",
    "dist", "build", ".next", "out",
    ".idea"
}

# =========================================================
# HARD-CODED PATHS
# =========================================================
filename = "sim"
ROOT_DIR = f"U:/foldersim/{filename}"
CONTEXT_DIR = "U:/foldersim/sim/context"
OUTPUT_JSON = f"{CONTEXT_DIR}/{filename}.json"

# =========================================================
# FEATURE FLAGS
# =========================================================
RUN_SQL_SCAN = True
RUN_SQL_EXTRACTION = True
RUN_DRIZZLE_ORM_SCAN = True
RUN_IMPORT_TREE = True
RUN_FULL_JSON_COPY = False
RUN_URL_TXT_CODE_COPY = False

# =========================================================
# OUTPUT FILES
# =========================================================
SQL_LOG_FILE = f"{CONTEXT_DIR}/sql_hits.txt"
SQL_CODE_JSON = f"{CONTEXT_DIR}/sql_code_blocks.json"
DRIZZLE_ORM_JSON = f"{CONTEXT_DIR}/drizzle_orm_usage.json"
IMPORT_TREE_FILE = f"{CONTEXT_DIR}/import_usage_tree.txt"
FULL_CODE_JSON = f"{CONTEXT_DIR}/full_repo_code.json"
URL_TXT_FILE = f"{CONTEXT_DIR}/file_urls.txt"
URL_CODE_JSON = f"{CONTEXT_DIR}/url_code_dump.json"

# =========================================================
# SQL REGEX (RAW SQL ONLY)
# =========================================================
SQL_STATEMENT_REGEX = re.compile(
    r"(select|insert|update|delete)\s+.*?(from|into|set|values|join)",
    re.IGNORECASE | re.DOTALL
)

# =========================================================
# HELPERS
# =========================================================
def should_skip_folder(path):
    parts = path.replace("\\", "/").split("/")
    return any(p in SKIP_FOLDERS for p in parts)


def is_backend_file(path):
    path = path.replace("\\", "/")
    return path.endswith(".py") or "/api/" in path

# =========================================================
# ORIGINAL TREE + FILE JSON (UNCHANGED)
# =========================================================
def build_tree(root_path, current_path=""):
    full_path = os.path.join(root_path, current_path)
    if should_skip_folder(full_path):
        return None

    tree = {
        "name": os.path.basename(current_path) if current_path else os.path.basename(root_path),
        "type": "folder",
        "children": []
    }

    try:
        entries = sorted(os.listdir(full_path))
    except PermissionError:
        return None

    for entry in entries:
        entry_full = os.path.join(full_path, entry)
        rel_entry = os.path.join(current_path, entry)

        if os.path.isdir(entry_full):
            subtree = build_tree(root_path, rel_entry)
            if subtree:
                tree["children"].append(subtree)
        else:
            if os.path.splitext(entry)[1] in INCLUDE_EXT:
                tree["children"].append({"name": entry, "type": "file"})

    return tree


def collect_file_contents(root_path):
    file_map = {}

    for folder, dirs, files in os.walk(root_path):
        if should_skip_folder(folder):
            dirs[:] = []
            continue

        for f in files:
            if os.path.splitext(f)[1] not in INCLUDE_EXT:
                continue

            full_path = os.path.join(folder, f)
            rel_path = os.path.relpath(full_path, root_path)

            try:
                with open(full_path, "r", encoding="utf-8") as file:
                    file_map[rel_path] = file.read()
            except:
                file_map[rel_path] = "<<Error reading file>>"

    return file_map


def generate_output(root_directory, output_file):
    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(
            {"tree": build_tree(root_directory), "files": collect_file_contents(root_directory)},
            out,
            indent=2
        )

# =========================================================
# 1. RAW SQL SCAN
# =========================================================
def scan_for_sql(root_path):
    hits = set()

    for folder, _, files in os.walk(root_path):
        if should_skip_folder(folder):
            continue

        for f in files:
            path = os.path.join(folder, f)
            if not is_backend_file(path):
                continue

            try:
                with open(path, "r", encoding="utf-8") as file:
                    if SQL_STATEMENT_REGEX.search(file.read()):
                        hits.add(path.replace("\\", "/"))
            except:
                pass

    with open(SQL_LOG_FILE, "w", encoding="utf-8") as out:
        out.write("\n".join(sorted(hits)))

# =========================================================
# 2. RAW SQL CODE EXTRACTION
# =========================================================
def extract_sql_code_blocks():
    if not os.path.exists(SQL_LOG_FILE):
        return

    result = {}

    with open(SQL_LOG_FILE, "r", encoding="utf-8") as f:
        files = [line.strip() for line in f if line.strip()]

    for path in files:
        try:
            with open(path, "r", encoding="utf-8") as file:
                code = file.read()
        except:
            continue

        functions = re.findall(
            r"(def\s+\w+\(.*?\):[\s\S]*?)(?=\ndef|\Z)", code
        )

        matched = [fn for fn in functions if SQL_STATEMENT_REGEX.search(fn)]
        result[path] = matched if matched else [code]

    with open(SQL_CODE_JSON, "w", encoding="utf-8") as out:
        json.dump(result, out, indent=2)

# =========================================================
# 3. DRIZZLE ORM SCAN (NEW)
# =========================================================
def scan_drizzle_orm_usage(root_path):
    drizzle_results = {}

    DRIZZLE_REGEX = re.compile(
        r"(from\s+['\"]drizzle-orm['\"]|packages/db|db\.query|db\.(select|update|insert|delete))",
        re.IGNORECASE
    )

    for folder, _, files in os.walk(root_path):
        if should_skip_folder(folder):
            continue

        for f in files:
            if not f.endswith((".ts", ".tsx")):
                continue

            path = os.path.join(folder, f).replace("\\", "/")

            try:
                with open(path, "r", encoding="utf-8") as file:
                    code = file.read()
            except:
                continue

            if not DRIZZLE_REGEX.search(code):
                continue

            drizzle_results[path] = {
                "imports": [
                    line.strip() for line in code.splitlines()
                    if "drizzle-orm" in line or "packages/db" in line
                ],
                "queries": [
                    line.strip() for line in code.splitlines()
                    if any(k in line for k in ("db.query", "db.update", "db.insert", "db.delete", "eq(", "and(", "or("))
                ],
                "full_code": code
            }

    with open(DRIZZLE_ORM_JSON, "w", encoding="utf-8") as out:
        json.dump(drizzle_results, out, indent=2)

# =========================================================
# 4. IMPORT USAGE TREE
# =========================================================
def build_import_usage_tree(root_path):
    usage = defaultdict(list)

    for folder, _, files in os.walk(root_path):
        if should_skip_folder(folder):
            continue

        for f in files:
            if os.path.splitext(f)[1] not in INCLUDE_EXT:
                continue

            path = os.path.join(folder, f).replace("\\", "/")

            try:
                with open(path, "r", encoding="utf-8") as file:
                    for line in file:
                        m = re.search(r"(?:from|import)\s+['\"](.+?)['\"]", line)
                        if m:
                            usage[m.group(1)].append(path)
            except:
                pass

    with open(IMPORT_TREE_FILE, "w", encoding="utf-8") as out:
        for imp, files in sorted(usage.items(), key=lambda x: -len(x[1])):
            out.write(f"\n📦 {imp} ({len(files)} uses)\n")
            for f in sorted(set(files)):
                out.write(f"   └── {f}\n")

# =========================================================
# 5. FULL REPO JSON
# =========================================================
def dump_full_repo_json(root_path):
    with open(FULL_CODE_JSON, "w", encoding="utf-8") as out:
        json.dump(collect_file_contents(root_path), out, indent=2)

# =========================================================
# 6. TXT → FILE PATH / URL → JSON
# =========================================================
def dump_code_from_url_txt():
    if not os.path.exists(URL_TXT_FILE):
        return

    result = {}

    with open(URL_TXT_FILE, "r", encoding="utf-8") as f:
        for line in f:
            raw = line.strip()
            if not raw:
                continue

            path = urlparse(raw).path if raw.startswith("file://") else raw

            try:
                with open(path, "r", encoding="utf-8") as file:
                    result[raw] = file.read()
            except:
                result[raw] = "<<Error reading file>>"

    with open(URL_CODE_JSON, "w", encoding="utf-8") as out:
        json.dump(result, out, indent=2)

# =========================================================
# CONTROLLER
# =========================================================
def run_optional_features():
    if RUN_SQL_SCAN:
        scan_for_sql(ROOT_DIR)
    if RUN_SQL_EXTRACTION:
        extract_sql_code_blocks()
    if RUN_DRIZZLE_ORM_SCAN:
        scan_drizzle_orm_usage(ROOT_DIR)
    if RUN_IMPORT_TREE:
        build_import_usage_tree(ROOT_DIR)
    if RUN_FULL_JSON_COPY:
        dump_full_repo_json(ROOT_DIR)
    if RUN_URL_TXT_CODE_COPY:
        dump_code_from_url_txt()

# =========================================================
# MAIN
# =========================================================
if __name__ == "__main__":
    generate_output(ROOT_DIR, OUTPUT_JSON)
    run_optional_features()
