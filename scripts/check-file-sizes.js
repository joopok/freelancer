#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const FILE_SIZE_LIMITS = {
  IDEAL: 300,
  ACCEPTABLE: 500,
  WARNING: 1000,
  CRITICAL: 1500
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

// Function to get all TSX files
function getTsxFiles(dir) {
  const files = [];
  
  function walk(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules and .next directories
          if (item !== 'node_modules' && item !== '.next' && !item.startsWith('.')) {
            walk(fullPath);
          }
        } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
          files.push(fullPath);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${currentDir}:`, err.message);
    }
  }
  
  walk(dir);
  return files;
}

// Function to count lines in a file
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
    return 0;
  }
}

// Main function
function checkFileSizes() {
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    console.error(`${colors.red}Error: src directory not found${colors.reset}`);
    process.exit(1);
  }
  
  const files = getTsxFiles(srcDir);
  const results = {
    ideal: [],
    acceptable: [],
    warning: [],
    critical: []
  };
  
  // Analyze each file
  files.forEach(file => {
    const lines = countLines(file);
    const relativePath = path.relative(process.cwd(), file);
    
    if (lines <= FILE_SIZE_LIMITS.IDEAL) {
      results.ideal.push({ path: relativePath, lines });
    } else if (lines <= FILE_SIZE_LIMITS.ACCEPTABLE) {
      results.acceptable.push({ path: relativePath, lines });
    } else if (lines <= FILE_SIZE_LIMITS.WARNING) {
      results.warning.push({ path: relativePath, lines });
    } else {
      results.critical.push({ path: relativePath, lines });
    }
  });
  
  // Display results
  console.log('\n' + colors.bold + '📊 File Size Analysis Report' + colors.reset);
  console.log('=' .repeat(80));
  
  // Summary statistics
  const total = files.length;
  console.log(`\n${colors.bold}Summary:${colors.reset}`);
  console.log(`Total files analyzed: ${total}`);
  console.log(`${colors.green}✓ Ideal (<${FILE_SIZE_LIMITS.IDEAL} lines): ${results.ideal.length} files (${((results.ideal.length/total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.blue}○ Acceptable (${FILE_SIZE_LIMITS.IDEAL}-${FILE_SIZE_LIMITS.ACCEPTABLE} lines): ${results.acceptable.length} files (${((results.acceptable.length/total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.yellow}⚠ Warning (${FILE_SIZE_LIMITS.ACCEPTABLE}-${FILE_SIZE_LIMITS.WARNING} lines): ${results.warning.length} files (${((results.warning.length/total)*100).toFixed(1)}%)${colors.reset}`);
  console.log(`${colors.red}✗ Critical (>${FILE_SIZE_LIMITS.WARNING} lines): ${results.critical.length} files (${((results.critical.length/total)*100).toFixed(1)}%)${colors.reset}`);
  
  // Show warning files
  if (results.warning.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}⚠ Warning - Files requiring attention:${colors.reset}`);
    results.warning.forEach(file => {
      console.log(`  ${colors.yellow}${file.path} (${file.lines} lines)${colors.reset}`);
    });
  }
  
  // Show critical files
  if (results.critical.length > 0) {
    console.log(`\n${colors.red}${colors.bold}✗ CRITICAL - Files requiring immediate refactoring:${colors.reset}`);
    results.critical.forEach(file => {
      console.log(`  ${colors.red}${file.path} (${file.lines} lines)${colors.reset}`);
    });
    
    console.log(`\n${colors.red}${colors.bold}ACTION REQUIRED:${colors.reset}`);
    console.log(`${colors.red}The following files exceed ${FILE_SIZE_LIMITS.WARNING} lines and MUST be refactored:${colors.reset}`);
    results.critical.forEach(file => {
      const complexity = Math.ceil(file.lines / FILE_SIZE_LIMITS.IDEAL);
      console.log(`  - ${file.path}: Split into ~${complexity} smaller components${colors.reset}`);
    });
  }
  
  // Show top 10 largest files
  const allFiles = [...results.acceptable, ...results.warning, ...results.critical]
    .sort((a, b) => b.lines - a.lines)
    .slice(0, 10);
    
  if (allFiles.length > 0) {
    console.log(`\n${colors.bold}Top 10 Largest Files:${colors.reset}`);
    allFiles.forEach((file, index) => {
      const color = file.lines > FILE_SIZE_LIMITS.WARNING ? colors.red : 
                   file.lines > FILE_SIZE_LIMITS.ACCEPTABLE ? colors.yellow : 
                   colors.blue;
      console.log(`  ${index + 1}. ${color}${file.path} (${file.lines} lines)${colors.reset}`);
    });
  }
  
  // Exit with error code if critical files exist
  if (results.critical.length > 0) {
    console.log(`\n${colors.red}${colors.bold}❌ File size check failed! Please refactor critical files.${colors.reset}\n`);
    process.exit(1);
  } else if (results.warning.length > 0) {
    console.log(`\n${colors.yellow}${colors.bold}⚠️  File size check passed with warnings. Consider refactoring large files.${colors.reset}\n`);
  } else {
    console.log(`\n${colors.green}${colors.bold}✅ File size check passed! All files are within acceptable limits.${colors.reset}\n`);
  }
}

// Run the check
checkFileSizes(); 