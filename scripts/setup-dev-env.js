const path = require('path');
const fs = require('fs');
const cp = require('child_process');

// Get path where all packages are located in
const packagesBase = path.resolve(path.dirname(__dirname), 'packages');

// Define list of packages with `npm link`-specific order
const packages = [
    'cljs-helpers',
    'cljs-types',
    'cljs-parser',
    'cljs-translator',
    'cljs-generator',
    'cljs-core',
    'cljs-register',
    'cljs-loader'
];

const getPackagePath = (package) => path.join(packagesBase, package);

packages.forEach((package) => {
    try {
        // Build package path
        const packagePath = getPackagePath(package);

        // Get list of dependent packages
        const packageDeps = Object.keys(
            require(path.join(packagePath, 'package.json')).dependencies || {}
        );

        // Filter only cljs-* deps
        const packageCljsDeps = packageDeps.filter((dep) =>
            dep.startsWith('cljs-')
        );

        // Link cljs-* deps
        packageCljsDeps.forEach((dep) => {
            cp.execFileSync('npm', [ 'link', dep ], { cwd: packagePath });
        });

        // Link package iteself
        cp.execFileSync('npm', [ 'link' ], { cwd: packagePath });
        console.log(`Linked ${package} package`);
    } catch (error) {
        console.error(`Failed to link ${package} package`);
    }
});