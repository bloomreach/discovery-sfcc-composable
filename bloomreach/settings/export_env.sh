#!/bin/bash

# Path to the JSON file
file_path="./credentials.json"

# Check if the file exists
if [ -f "$file_path" ]; then
    echo "Reading environment variables from $file_path"

    # Read the JSON file and export variables
    while IFS="=" read -r key value; do
        export "$key"="$value"
        echo "Exported $key=$value"
    done < <(jq -r 'to_entries | .[] | "\(.key)=\(.value.value)"' "$file_path")

    echo "Environment variables exported successfully."
else
    echo "File $file_path not found!"
fi
