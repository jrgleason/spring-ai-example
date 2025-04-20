# spring-ai-example

This is a working spring AI example using Pinecone.

## Basic Functionality

### Prerequisites

For the UI make sure you have Node installed.

For the Pinecone, OpenAI and Anthropic functionality please set

* PINECONE_API_KEY (assuming local profile)
* SPRING_AI_OPENAI_API_KEY
* SPRING_AI_ANTHROPIC_API_KEY

### Using Gradle

* Create an application-personal.yml using either `create-personal-config.bat` or `create-personal-config.sh`. It should generate a file with the following template... 

```yaml
spring:
  ai:
    vectorstore:
      pinecone:
        environment: <your environment>
        projectId: <your project id>
        apiKey: ${PINECONE_API_KEY}
```

* `export SPRING_PROFILES_ACTIVE=local,personal`
* `gradle bootRun`
* Open a browser to `http://localhost:8055/`