# Final comprehensive conflict resolution script
Write-Host "Running final conflict resolution..."

# List of all files that might have conflicts
$files = @(
    "client/src/components/layout/Footer.jsx",
    "client/src/components/reports/CandidatePerformanceTable.jsx", 
    "client/src/components/reports/TestAnalytics.jsx",
    "client/src/pages/candidate/TakeTest.jsx",
    "client/src/pages/hr/MonitorTests.jsx",
    "client/src/pages/hr/Reports.jsx"
)

foreach ($file in $files) {
    $fullPath = "c:/Users/nimma/OneDrive/Desktop/AI-Assessment-Test/$file"
    if (Test-Path $fullPath) {
        Write-Host "Processing $file..."
        
        # Read content
        $content = Get-Content $fullPath -Raw
        
        # Remove all conflict markers
        $content = $content -replace '<<<<<<< HEAD\r?\n', ''
        $content = $content -replace '=======\r?\n', ''
        $content = $content -replace '>>>>>>> upstream/main\r?\n', ''
        
        # Write back
        Set-Content $fullPath -Value $content -NoNewline
        Write-Host "  ✅ Fixed $file"
    }
}

# Check if any files still have conflicts
Write-Host "Checking for remaining conflict markers..."
$conflictPattern = "======="
$remainingConflicts = @()

foreach ($file in $files) {
    $fullPath = "c:/Users/nimma/OneDrive/Desktop/AI-Assessment-Test/$file"
    if (Test-Path $fullPath) {
        $content = Get-Content $fullPath -Raw
        if ($content -match $conflictPattern) {
            $remainingConflicts += $file
        }
    }
}

if ($remainingConflicts.Count -eq 0) {
    Write-Host "✅ All conflicts resolved!"
} else {
    Write-Host "⚠️ Still have conflicts in:"
    $remainingConflicts | ForEach-Object { Write-Host "  - $_" }
}