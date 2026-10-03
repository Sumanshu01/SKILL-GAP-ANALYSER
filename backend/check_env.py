import sys

modules = [
    'fastapi',
    'uvicorn',
    'multipart',
    'pypdf',
    'sentence_transformers',
    'transformers',
    'torch',
    'sklearn',
    'reportlab',
    'pandas',
    'numpy',
]

print(f"Python: {sys.version}")
missing = []
for m in modules:
    try:
        mod = __import__(m)
        ver = getattr(mod, '__version__', 'installed')
        print(f"  [OK] {m}: {ver}")
    except Exception as e:
        print(f"  [MISSING] {m}: {e}")
        missing.append(m)

print(f"Summary: {len(modules) - len(missing)}/{len(modules)} installed. Missing: {missing}")
