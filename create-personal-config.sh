#!/bin/bash

CONFIG_FILE="app/src/main/resources/application-personal.yml"

# Create directories if they don't exist
mkdir -p "$(dirname "$CONFIG_FILE")"

# Check if the file exists
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Creating $CONFIG_FILE..."
    
    # Prompt for environment
    read -p "Enter your Pinecone environment: " PINECONE_ENV
    
    # Prompt for project ID
    read -p "Enter your Pinecone project ID: " PINECONE_PROJECT_ID
    
    cat > "$CONFIG_FILE" << EOL
spring:
  ai:
    vectorstore:
      pinecone:
        environment: $PINECONE_ENV
        projectId: $PINECONE_PROJECT_ID
        apiKey: \${PINECONE_API_KEY}
EOL
    echo "File created successfully!"
else
    echo "File already exists at $CONFIG_FILE"
fi 