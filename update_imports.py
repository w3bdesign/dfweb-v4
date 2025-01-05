import os

def fix_import(line):
    if not ('from' in line or 'import' in line):
        return line
        
    if '@/' in line:
        return line.replace('@/', '@/')
    elif '@/app/' in line:
        return line.replace('@/app/', '@/app/')
    elif '../../lib/' in line:
        return line.replace('../../lib/', '@/lib/')
    elif '../../utils/' in line:
        return line.replace('../../utils/', '@/utils/')
    elif 'components/' in line and not '@/components/' in line:
        return line.replace('components/', '@/components/')
    elif 'app/' in line and not '@/app/' in line:
        return line.replace('app/', '@/app/')
    elif 'lib/' in line and not '@/lib/' in line:
        return line.replace('lib/', '@/lib/')
    elif 'utils/' in line and not '@/utils/' in line:
        return line.replace('utils/', '@/utils/')
    return line

def update_imports_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    updated_lines = [fix_import(line) for line in lines]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(updated_lines)

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                print(f"Processing {file_path}")
                try:
                    update_imports_in_file(file_path)
                    print(f"✓ Updated {file_path}")
                except Exception as e:
                    print(f"✗ Error processing {file_path}: {str(e)}")

if __name__ == '__main__':
    tests_dir = '__tests__'
    print(f"Starting import path updates in {tests_dir}...")
    process_directory(tests_dir)
    print("Import paths updated successfully!")
