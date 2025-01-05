import os
import re

def update_imports_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace ../../src/ with @/
    content = re.sub(r'from ["\']../../src/', 'from "@/', content)
    content = re.sub(r'import .* from ["\']../../src/', lambda m: m.group(0).replace('../../src/', '@/'), content)
    
    # Replace ../../app/ with @/app/
    content = re.sub(r'from ["\']../../app/', 'from "@/app/', content)
    content = re.sub(r'import .* from ["\']../../app/', lambda m: m.group(0).replace('../../app/', '@/app/'), content)
    
    # Replace ../../lib/ with @/lib/
    content = re.sub(r'from ["\']../../lib/', 'from "@/lib/', content)
    content = re.sub(r'import .* from ["\']../../lib/', lambda m: m.group(0).replace('../../lib/', '@/lib/'), content)
    
    # Replace ../../utils/ with @/utils/
    content = re.sub(r'from ["\']../../utils/', 'from "@/utils/', content)
    content = re.sub(r'import .* from ["\']../../utils/', lambda m: m.group(0).replace('../../utils/', '@/utils/'), content)

    # Replace bare imports with @/ prefix
    content = re.sub(r'from ["\']components/', 'from "@/components/', content)
    content = re.sub(r'import .* from ["\']components/', lambda m: m.group(0).replace('components/', '@/components/'), content)
    
    content = re.sub(r'from ["\']app/', 'from "@/app/', content)
    content = re.sub(r'import .* from ["\']app/', lambda m: m.group(0).replace('app/', '@/app/'), content)
    
    content = re.sub(r'from ["\']lib/', 'from "@/lib/', content)
    content = re.sub(r'import .* from ["\']lib/', lambda m: m.group(0).replace('lib/', '@/lib/'), content)
    
    content = re.sub(r'from ["\']utils/', 'from "@/utils/', content)
    content = re.sub(r'import .* from ["\']utils/', lambda m: m.group(0).replace('utils/', '@/utils/'), content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                file_path = os.path.join(root, file)
                print(f"Processing {file_path}")
                update_imports_in_file(file_path)

if __name__ == '__main__':
    tests_dir = '__tests__'
    process_directory(tests_dir)
    print("Import paths updated successfully!")
