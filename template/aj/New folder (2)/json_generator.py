import os
import json

# File extensions to include
INCLUDE_EXT = {".ts", ".py", ".tsx"}

# Folders to skip (anywhere in the path)
SKIP_FOLDERS = {
    "venv", ".venv", "env", ".env",
    "node_modules", "__pycache__", ".git",
    ".pytest_cache", "site-packages", "_pytest",
    "dist", "build", ".next", "out",
    ".idea"
}

def should_skip_folder(path):
    """Return True if any skip folder appears anywhere in the path."""
    parts = path.replace("\\", "/").split("/")
    return any(p in SKIP_FOLDERS for p in parts)


def build_tree(root_path, current_path=""):
    """Recursively build a tree structure, skipping unwanted folders."""
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
        return None  # Skip un-readable folders

    for entry in entries:
        entry_full = os.path.join(full_path, entry)
        rel_entry = os.path.join(current_path, entry)

        if os.path.isdir(entry_full):
            subtree = build_tree(root_path, rel_entry)
            if subtree:
                tree["children"].append(subtree)
        else:
            ext = os.path.splitext(entry)[1]
            if ext in INCLUDE_EXT:
                tree["children"].append({"name": entry, "type": "file"})

    return tree


def collect_file_contents(root_path):
    """Return { relative_filepath: content } for valid file types."""
    file_map = {}

    for folder, dirs, files in os.walk(root_path):

        # Skip whole folder
        if should_skip_folder(folder):
            dirs[:] = []  # prevent recursion
            continue

        # Filter subdirectories in-place
        dirs[:] = [d for d in dirs if not should_skip_folder(os.path.join(folder, d))]

        for f in files:
            ext = os.path.splitext(f)[1]
            if ext not in INCLUDE_EXT:
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
    tree = build_tree(root_directory)
    files = collect_file_contents(root_directory)

    output = {
        "tree": tree,
        "files": files,
    }

    with open(output_file, "w", encoding="utf-8") as out:
        json.dump(output, out, indent=2)

    print(f"JSON output saved to {output_file}")


if __name__ == "__main__":
    filename = "auth"
    root_dir = f"U:/foldersim/sim/apps/sim/app/api/{filename}"
    output_file = f"U:/foldersim/sim/context/{filename}.json"
    generate_output(root_dir, output_file)
