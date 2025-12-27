$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path (Join-Path $scriptDir "..")
Set-Location $rootDir

function New-Base64Secret {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    [Convert]::ToBase64String($bytes)
}

$envFile = Join-Path $rootDir ".env.local"
if (!(Test-Path $envFile)) {
    $nextAuthSecret = New-Base64Secret
    $authSecret = New-Base64Secret
    $envLines = @(
        "NEXTAUTH_URL=http://localhost:3000"
        "NEXTAUTH_SECRET=$nextAuthSecret"
        "AUTH_SECRET=$authSecret"
        "AUTH_TRUST_HOST=true"
        "ADMIN_EMAILS=admin@example.com"
    )
    $envLines | Set-Content -Path $envFile -Encoding ASCII
    Write-Host "Created .env.local with local defaults."
} else {
    Write-Host "Using existing .env.local."
}

$composeArgs = @(
    "--env-file", ".env.local",
    "-f", "docker-compose.yml",
    "-f", "docker-compose.local.yml",
    "up", "-d", "--build"
)
& docker compose @composeArgs

$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    & docker compose --env-file .env.local -f docker-compose.yml -f docker-compose.local.yml exec -T db pg_isready -U postgres | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $ready = $true
        break
    }
    Start-Sleep -Seconds 2
}

if (-not $ready) {
    throw "Postgres did not become ready in time."
}

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}

$env:DATABASE_URL = "postgresql://postgres:password@localhost:5432/linart"
$env:NODE_ENV = "development"

Write-Host "Applying Prisma schema..."
npx prisma db push --skip-generate --schema prisma/schema.prisma

Write-Host "Seeding database..."
npm run db:seed

Write-Host ""
Write-Host "Local site is ready:"
Write-Host "Public:    http://localhost:3000"
Write-Host "Admin:     http://localhost:3000/admin (admin@example.com / admin)"
Write-Host "Dashboard: http://localhost:3000/dashboard (user@example.com / user)"
Write-Host "Logs:      docker compose -f docker-compose.yml -f docker-compose.local.yml logs -f web"
