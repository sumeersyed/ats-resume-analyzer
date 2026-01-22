# Add left notification to index.html
$filePath = "c:\Users\GHOST MODE\.gemini\antigravity\scratch\ats-resume-analyzer\index.html"
$content = Get-Content $filePath -Raw

$leftNotifHTML = @"

    <!-- Global User Notification (Left Side) -->
    <div class="global-notification global-notification-left" id="globalNotificationLeft">
        <div class="notification-flag" id="notificationFlagLeft">🇨🇦</div>
        <div class="notification-content">
            <div class="notification-header">
                <strong id="notificationNameLeft">Emma Taylor</strong>
                <span class="notification-country" id="notificationCountryLeft">Canada</span>
            </div>
            <div class="notification-message" id="notificationMessageLeft">"Landed 3 interviews this week! This tool is amazing!"</div>
            <div class="notification-meta">
                <span class="notification-template" id="notificationTemplateLeft">Using ATS-Friendly template</span>
                <span class="notification-time">5 minutes ago</span>
            </div>
        </div>
        <button class="notification-close" onclick="this.parentElement.classList.remove('show')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>

"@

# Find the Payment Modal comment and insert before it
$marker = "    <!-- Payment Modal -->"
if ($content -match [regex]::Escape($marker)) {
    $newContent = $content -replace [regex]::Escape($marker), ($leftNotifHTML + $marker)
    Set-Content -Path $filePath -Value $newContent -NoNewline
    Write-Output "✅ Left notification added successfully!"
} else {
    Write-Output "❌ Could not find Payment Modal marker"
}
