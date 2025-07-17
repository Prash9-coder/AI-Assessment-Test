# Fix remaining merge conflicts in Reports.jsx
Write-Host "Fixing remaining merge conflicts in Reports.jsx..."

$filePath = "c:/Users/nimma/OneDrive/Desktop/AI-Assessment-Test/client/src/pages/hr/Reports.jsx"

if (Test-Path $filePath) {
    # Read the file content
    $content = Get-Content $filePath -Raw
    
    # Remove all remaining conflict markers
    $content = $content -replace '=======\r?\n', ''
    $content = $content -replace '>>>>>>> upstream/main\r?\n', ''
    $content = $content -replace '<<<<<<< HEAD\r?\n', ''
    
    # Remove duplicate imports
    $content = $content -replace '} from "lucide-react";\r?\n} from "lucide-react";', '} from "lucide-react";'
    
    # Write the cleaned content back
    Set-Content $filePath -Value $content -NoNewline
    
    Write-Host "✅ Fixed Reports.jsx"
} else {
    Write-Host "❌ File not found: $filePath"
}

# Check for any remaining conflicts in the entire project
Write-Host "Checking for remaining conflicts in entire project..."
$remainingConflicts = git diff --name-only --diff-filter=U

if ($remainingConflicts.Count -eq 0) {
    Write-Host "✅ No remaining conflicts found!"
} else {
    Write-Host "⚠️ Still have conflicts in:"
    $remainingConflicts | ForEach-Object { Write-Host "  - $_" }
}