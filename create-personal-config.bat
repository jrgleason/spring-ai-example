@echo off
setlocal

set CONFIG_FILE=app\src\main\resources\application-personal.yml

:: Create directories if they don't exist
if not exist "app\src\main\resources" mkdir "app\src\main\resources"

:: Check if the file exists
if not exist "%CONFIG_FILE%" (
    echo Creating %CONFIG_FILE%...
    
    :: Prompt for environment
    set /p PINECONE_ENV="Enter your Pinecone environment: "
    
    :: Prompt for project ID
    set /p PINECONE_PROJECT_ID="Enter your Pinecone project ID: "
    
    (
        echo spring:
        echo   ai:
        echo     vectorstore:
        echo       pinecone:
        echo         environment: %PINECONE_ENV%
        echo         projectId: %PINECONE_PROJECT_ID%
        echo         apiKey: ${PINECONE_API_KEY}
    ) > "%CONFIG_FILE%"
    echo File created successfully!
) else (
    echo File already exists at %CONFIG_FILE%
) 