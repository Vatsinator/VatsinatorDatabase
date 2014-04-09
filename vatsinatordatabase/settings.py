# Django settings for VatsinatorDatabase project.
import os.path
import sys
import glob

try:
  ROOT_DIR
except NameError:
  ROOT_DIR = os.path.dirname(__file__)

sys.path.append(ROOT_DIR)

conf_files_path = os.path.join(ROOT_DIR, 'settings', '*.conf.py')
conffiles = glob.glob(conf_files_path)
conffiles.sort()

for f in conffiles:
  execfile(os.path.abspath(f))
