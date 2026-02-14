# find node_modules and delete them
find . -name "node_modules" -exec rm -rf {} \;

# find pnpm-lock.yaml and delete them
find . -name "pnpm-lock.yaml" -exec rm -rf {} \;