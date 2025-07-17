# PowerShell script to resolve merge conflicts by choosing HEAD version
Write-Host "Resolving merge conflicts by choosing HEAD version..."

# Get all files with merge conflicts
$conflictFiles = git diff --name-only --diff-filter=U

if ($conflictFiles.Count -eq 0) {
    Write-Host "No merge conflicts found."
    exit 0
}

Write-Host "Found $($conflictFiles.Count) files with conflicts:"
$conflictFiles | ForEach-Object { Write-Host "  - $_" }

# For each file with conflicts, resolve by choosing HEAD version
foreach ($file in $conflictFiles) {
    Write-Host "Resolving conflicts in $file..."
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Remove conflict markers and keep HEAD version
    $resolved = $content -replace '<<<<<<< HEAD\r?\n', ''
    $resolved = $resolved -replace '=======.*?>>>>>>> upstream/main\r?\n', ''
    $resolved = $resolved -replace '=======.*?>>>>>>> main\r?\n', ''
    
    # Write back resolved content
    Set-Content $file -Value $resolved -NoNewline
    
    # Add resolved file to staging
    git add $file
    
    Write-Host "  ✅ Resolved $file"
}

Write-Host "All conflicts resolved. Ready to commit."
Write-Host "Run 'git commit' to complete the merge."