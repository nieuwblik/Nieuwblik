# PowerShell script to optimize all service pages
# Replaces staggerContainer with optimizedStaggerContainer(shouldReduceMotion)
# Replaces staggerItem with optimizedStaggerItem(shouldReduceMotion)

$files = @(
    "d:\Antigravity sites\Nieuwblik\src\pages\services\WebsiteOpMaat.tsx",
    "d:\Antigravity sites\Nieuwblik\src\pages\services\Webshops.tsx",
    "d:\Antigravity sites\Nieuwblik\src\pages\services\Ecommerce.tsx"
)

foreach ($file in $files) {
    Write-Host "Processing: $file" -ForegroundColor Cyan
    
    # Read file content
    $content = Get-Content $file -Raw
    
    # Count replacements
    $staggerContainerCount = ([regex]::Matches($content, "variants=\{staggerContainer\}")).Count
    $staggerContainerSlowCount = ([regex]::Matches($content, "variants=\{staggerContainerSlow\}")).Count
    $staggerItemCount = ([regex]::Matches($content, "variants=\{staggerItem\}")).Count
    
    Write-Host "  - staggerContainer: $staggerContainerCount" -ForegroundColor Yellow
    Write-Host "  - staggerContainerSlow: $staggerContainerSlowCount" -ForegroundColor Yellow
    Write-Host "  - staggerItem: $staggerItemCount" -ForegroundColor Yellow
    
    # Replace staggerContainer with optimizedStaggerContainer(shouldReduceMotion)
    $content = $content -replace 'variants=\{staggerContainer\}', 'variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}'
    
    # Replace staggerContainerSlow with optimizedStaggerContainer (same speed now)
    $content = $content -replace 'variants=\{staggerContainerSlow\}', 'variants={optimizedStaggerContainer(shouldReduceMotion)} viewport={optimizedViewport}'
    
    # Replace staggerItem with optimizedStaggerItem(shouldReduceMotion) and add GPU acceleration
    $content = $content -replace '(\s+)variants=\{staggerItem\}', '$1variants={optimizedStaggerItem(shouldReduceMotion)} style={gpuAcceleration}'
    
    # Write back to file
    Set-Content $file -Value $content -NoNewline
    
    Write-Host "  ✅ Done!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🎉 All service pages optimized!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- All staggerContainer → optimizedStaggerContainer(shouldReduceMotion)" -ForegroundColor White
Write-Host "- All staggerContainerSlow → optimizedStaggerContainer(shouldReduceMotion)" -ForegroundColor White  
Write-Host "- All staggerItem → optimizedStaggerItem(shouldReduceMotion)" -ForegroundColor White
Write-Host "- Added GPU acceleration (willChange) to all items" -ForegroundColor White
Write-Host "- Added optimized viewport settings" -ForegroundColor White
