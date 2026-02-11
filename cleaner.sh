# find node_modules and delete them
find . -name "node_modules" -exec rm -rf {} \;

# find package-lock.json and delete them
find . -name "package-lock.json" -exec rm -rf {} \;