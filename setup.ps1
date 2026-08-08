$ErrorActionPreference = "Stop"

npm install
npm run lint
npm run build

Write-Host "ClinicCare frontend setup completed." -ForegroundColor Green
