# Spring AI Example

A working Spring AI example application featuring OpenAI integration, Pinecone vector store, and a React frontend.

## Features

- **OpenAI Chat**: Chat with OpenAI's GPT models
- **DALL·E Image Generation**: Generate images using OpenAI's DALL·E
- **Vector Store**: Pinecone integration for document search and retrieval
- **Memory**: Conversation memory with caching
- **Device Control**: Mock IoT device control functionality
- **WebSocket**: Real-time updates for device states
- **Audio**: Text-to-speech for AI responses

## Prerequisites

### Required Software
- **Java 24** (or Java 23 with compatible Gradle version)
- **Node.js** (for the UI)
- **Gradle 8.14+** (included via wrapper)

### Required API Keys
You'll need accounts and API keys for:
- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Pinecone**: Create a free account at [Pinecone](https://www.pinecone.io/) and get your API key

## Getting Started

### 1. Clone and Setup Environment Variables

```bash
# Set your API keys as environment variables
export PINECONE_API_KEY="your-pinecone-api-key"
export SPRING_AI_OPENAI_API_KEY="your-openai-api-key"
export SPRING_PROFILES_ACTIVE="local,personal"
```

### 2. Configure Pinecone

Create your personal configuration file:

**On macOS/Linux:**
```bash
./create-personal-config.sh
```

**On Windows:**
```cmd
create-personal-config.bat
```

This creates `app/src/main/resources/application-personal.yml`. Edit it with your Pinecone details:

```yaml
spring:
  ai:
    vectorstore:
      pinecone:
        environment: aped-4627-b74a      # Your Pinecone environment ID
        projectId: bk8jiap              # Your Pinecone project ID  
        apiKey: ${PINECONE_API_KEY}     # References environment variable
```

**Finding your Pinecone values:**
1. Go to your [Pinecone Console](https://app.pinecone.io/)
2. **Environment**: Found in your project settings (format: `xxxx-xxxx-xxx`)
3. **Project ID**: Found in your project settings (short alphanumeric string)
4. **API Key**: Generate from API Keys section (set as environment variable)

### 3. Build and Run

#### Option A: Using Gradle (Recommended)
```bash
# Build and run the application (includes UI build)
./gradlew bootRun
```

#### Option B: Separate UI Development
If you want to develop the UI separately:

```bash
# Terminal 1: Run the backend
./gradlew compileJava
./gradlew bootRun

# Terminal 2: Run the frontend in development mode
cd ui
npm install
npm run dev
```

### 4. Access the Application

Open your browser to: **http://localhost:8055/**

## Usage

### Chat Interface
- **OpenAI Chat**: General conversation with GPT
- **DALL·E**: Generate images by describing what you want

### Adding Documents
1. Click "Add Document" to upload files to the vector store
2. Chat with your documents using the OpenAI Chat mode
3. The system will search relevant documents and include them in responses

### Device Control
- Use the device control panel to simulate IoT device interactions
- Try asking the AI to "turn on the living room light" or "check the status of the kitchen fan"

## Configuration Files

### Main Configuration (`app/src/main/resources/application.yml`)
- Server port: 8055
- Spring AI settings
- WebSocket configuration

### Personal Configuration (`app/src/main/resources/application-personal.yml`)
- Your Pinecone credentials
- Environment-specific settings

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up
```

## Kubernetes Deployment

```bash
# Deploy to Kubernetes
kubectl apply -f spring-ai-k8s.yml
```

## Troubleshooting

### Common Issues

**Build fails with npm error:**
- Make sure Node.js is installed
- Try running `npm install` in the `ui/` directory first

**Pinecone connection issues:**
- Verify your API key and environment settings
- Check that your Pinecone index exists
- Ensure your account has sufficient credits

**OpenAI API errors:**
- Verify your OpenAI API key is valid
- Check your OpenAI account has sufficient credits
- Ensure the API key has the necessary permissions

**Java version issues:**
- This project requires Java 24 or Java 23 with Gradle 8.14+
- Check your Java version: `java -version`
- Update JAVA_HOME if necessary

### Debug Mode

For more detailed logging, add this to your environment:
```bash
export SPRING_PROFILES_ACTIVE="local,personal,debug"
```

## Architecture

- **Backend**: Spring Boot with Spring AI framework
- **Frontend**: React with Vite build system
- **Vector Store**: Pinecone for document embeddings
- **AI Models**: OpenAI GPT and DALL·E
- **Real-time**: WebSocket for device state updates
- **Memory**: In-memory conversation history with caching

## API Endpoints

- `GET /openai?message=hello` - Chat with OpenAI
- `GET /openai/image?message=sunset` - Generate image with DALL·E
- `GET /openai/stream?message=hello` - Streaming chat response
- `POST /pinecone/add` - Add documents to vector store
- `GET /device/status` - Get device states
- `WebSocket /device-state` - Real-time device updates

## Development

### Project Structure
```
├── app/                    # Spring Boot backend
│   ├── src/main/java/      # Java source code
│   ├── src/main/resources/ # Configuration files
│   └── build.gradle        # Dependencies and build config
├── ui/                     # React frontend
│   ├── src/               # React components and hooks
│   ├── package.json       # Node dependencies
│   └── vite.config.js     # Build configuration
└── docker-compose.yml     # Container deployment
```

### Key Technologies
- Spring AI 1.0.0-M6
- Spring Boot 3.4.3
- Java 24
- React 18
- Tailwind CSS
- Vite
- WebSocket