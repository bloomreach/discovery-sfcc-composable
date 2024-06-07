# Path to the JSON file
$jsonFilePath = ".\credentials.json"

# Check if the file exists
if (Test-Path $jsonFilePath) {
    Write-Output "Reading environment variables from $jsonFilePath"

    # Read the JSON file
    $jsonContent = Get-Content -Path $jsonFilePath -Raw | ConvertFrom-Json

    # Iterate over each property and set the environment variable
    foreach ($key in $jsonContent.PSObject.Properties.Name) {
        $value = $jsonContent.$key.value
        [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
        Write-Output "Set $key='$value'"
    }

    Write-Output "Environment variables set successfully."
} else {
    Write-Output "File $jsonFilePath not found!"
}
