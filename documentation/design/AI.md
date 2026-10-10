# AI Development Setup Documentation

## Overview
This document explains how to configure the VS Code Continue.dev extension with OpenRouter for contributing to the Discord ExcaliMath project. Continue.dev provides AI-powered development assistance and code editing capabilities.

## Prerequisites

### Before You Begin
- VS Code installed
- Node.js and pnpm installed
- Git configured
- A valid OpenRouter API key

## What You'll Get
- AI code suggestions and completions
- Code generation from natural language
- Code refactoring assistance
- Context-aware AI editing
- Integration with your existing development workflow

## Step-by-Step Setup Guide

### 1. Install Continue.dev Extension

1. Open VS Code
2. Go to the Extensions view (Ctrl+Shift+X)
3. Search for "Continue"
4. Install the "Continue" extension by continues-ai
5. Restart VS Code when prompted

### 2. Configure OpenRouter API Key

1. Create a free account at [openrouter.ai](https://openrouter.ai)
2. Navigate to your API keys dashboard
3. Click "Create API Key"
4. Copy the generated API key

**Security Note**: Never share your API key in public repositories, pull requests, or chat logs. Add it to your environment variables instead.

### 3. Environment Configuration

Create or update your `.env` file:

```env
# Add to your environment variables
OPENROUTER_API_KEY=your-api-key-here
OPENROUTER_SITE_URL=https://github.com/your-username/excali-math
OPENROUTER_SITE_NAME=Discord ExcaliMath
OPENROUTER_ORG_NAME=your-org-name (optional)
```

### 4. VS Code Settings Configuration

Press `Ctrl+,` to open Settings, then:

**Method 1: Settings UI**
1. Click the gear icon → "Settings (JSON)"
2. Add the following configuration:

```json
{
  "continue.allowAnonymousTelemetry": false,
  "continue.turboMode": false,
  "continue.summarize": true,
  "continue.maxPromptTokens": 8000,
  "continue.model": "openrouter/google/gemini-2.0-flash-exp",
  "continue.apiBaseUrl": "https://openrouter.ai/api/v1",
  "continue.useLegacyWebview": false,
  "continue.title": "Continue.dev AI Assistant",
  "continue.friendlyDescription": "AI-powered development assistant",
  "continue.hidden": false
}
```

**Method 2: Settings File**
1. Press `Ctrl+Shift+P` and select "Preferences: Open Settings (File)"
2. Add the configuration above to your `settings.json` file

### 5. Local Development Setup

#### Frontend Environment
```bash
cd frontend
pnpm install
pnpm dev
```

#### Backend Environment
```bash
cd backend
pnpm install
pnpm dev
```

### 6. Testing AI Integration

1. Open any React component file (e.g., `frontend/src/App.tsx`)
2. Select some code you'd like to modify
3. Right-click and select "Continue: Explain this code"
4. Place cursor at a location and press `Ctrl+K Ctrl+C` or say "Generate code here"

## Project-Specific Configuration

### Recommended Model Settings for This Project

For the Discord ExcaliMath project, use these optimized settings:

```json
{
  "continue.model": "openrouter/anthropic/claude-3-7-sonnet-20250219",
  "continue.modelOptions": {
    "temperature": 0.1,
    "maxTokens": 4000,
    "topP": 0.9,
    "topK": 40
  },
  "continue.requestOptions": {
    "timeout": 60000,
    "headers": {
      "User-Agent": "Continue.dev/1.0 DiscordExcaliMath"
    }
  }
}
```

### Code Generation Prompts

To generate code related to your project, use these prompt formats:

#### Example: Generate a Board Component
```
Generate a React component for the main whiteboard area that includes:
- Full viewport integration
- State management for board data
- Event handlers for drawing operations
- Real-time collaboration capabilities
- Theme support for Discord dark/light mode

Follow the existing code style and patterns from App.tsx and Board.tsx.
```

#### Example: Fix Collaboration Bug
```
I have a bug in the room sync where two clients can't see each other's updates.
Here's the current code in frontend/src/Board.tsx
[provide relevant code section]

Please help me identify the issue and fix it.
```

## FAQ and Troubleshooting

### Q: What if my API key doesn't work?
**A**: Check that:
1. Your OpenRouter account has credits
2. The API key hasn't expired
3. No typos in the key
4. Environment variables are loaded

### Q: Why is AI not responding?
**A**: Common solutions:
1. Ensure internet connection
2. Check "Continue" extension status
3. Verify model availability in your account
4. Try a different model

### Q: How do I get better AI responses?
**A**: 
- Be specific in your requests
- Provide relevant context from your code
- Use the "Explain this code" feature for complex logic
- Include relevant file names in your prompts

### Q: Can I use custom OpenRouter models?
**A**: Yes! You can browse available models at:
- [OpenRouter Models](https://openrouter.ai/models)
- Replace `continue.model` with any available model ID

## Best Practices for Contributors

### 1. API Key Security
- Never commit `.env` files to version control
- Use `.env.local` for local development
- Check `.gitignore` to ensure env files are ignored

### 2. AI Usage Guidelines
- Use AI for code completion, not replacement
- Review and test AI-generated code
- Credit AI when it significantly contributes to code
- Avoid over-reliance on AI for critical logic

### 3. Integration with Existing Workflow
- Use AI suggestions selectively
- Maintain code review standards
- Ensure all changes pass existing tests
- Follow the project's coding conventions

## Additional Resources

### Continue.dev Documentation
- [Official Documentation](https://continue.dev/docs)
- [GitHub Repository](https://github.com/continuedev/continue)

### OpenRouter Documentation
- [API Reference](https://openrouter.ai/docs)
- [Model Pricing](https://openrouter.ai/docs/pricing)
- [Quick Start Guide](https://openrouter.ai/docs/quick-start)

### Discord ExcaliMath Documentation
- [Project Plan](documentation/design/PLAN.md)
- [Development Workflow](README.md)

## Troubleshooting Common Issues

### Issue: Extension not loading
**Solution**: 
1. Check extension is enabled
2. Clear extension cache (Ctrl+Shift+P → "Developer: Clear Extension Host Cache")
3. Restart VS Code

### Issue: API calls failing
**Solution**:
1. Check OpenRouter dashboard for usage limits
2. Verify API key permissions
3. Try different models if one fails
4. Check network connectivity

### Issue: Slow AI responses
**Solution**:
1. Use smaller models for faster responses
2. Increase model timeout settings
3. Consider using local AI models for offline development

## Getting Help

If you encounter issues:
1. Check the [Continue.dev Discord](https://continue.dev/discord) community
2. Review [OpenRouter support](https://openrouter.ai/docs)
3. Submit issues in the Continue.dev repository
4. Contact project maintainers for configuration questions

## License for AI Tools

This project welcomes contributions using AI tools like Continue.dev and OpenRouter. While the AI-generated content is helpful for development, all code should:
- Follow the project's coding standards
- Include appropriate documentation
- Pass existing tests
- Maintain security and privacy best practices

Enjoy your AI-powered development experience! 🚀

---

## Continue.dev config.yaml Example

Continue.dev reads its configuration from `~/.continue/config.yaml` (Mac/Linux) or `%USERPROFILE%\.continue\config.yaml` (Windows). This single YAML file defines your models, API settings, and behaviors.

Below is the exact example configuration, followed by detailed field explanations:

```yaml
# Example: $ cat ~/.continue/config.yaml
name: Main Config
version: 1.0.0
schema: v1
models:
  - name: Free Models Router
    provider: openrouter
    model: openrouter/free
    apiKey: ****************
    capabilities:
      - tool_use
    tabAutocompleteModel: null
    embeddingsProvider: null
    options:
      maxTokens: 4096
      temperature: 0.2
```

### Detailed Purpose of Key Fields

**`tabAutocompleteModel: null`**
- This specifies which AI model should be used for tab-completion (inline code suggestions while typing).
- Setting it to `null` disables the tab-autocomplete feature, meaning you won't get AI-powered auto-suggestions as you type.
- Why set it to null? Often users prefer to use only the chat interface for AI assistance rather than automatic inline suggestions, which can interrupt workflow or cause accidental insertions.
- If set to an actual model name (e.g., `openrouter/free`), Continue.dev would use that model to suggest code completions when you press the Tab key.

**`embeddingsProvider: null`**
- This controls the embedding provider used for semantic search across your codebase.
- Embeddings convert code into numerical representations that allow AI to understand context and relationships between files.
- Setting it to `null` disables the embedding/indexing feature.
- Why disable it? For smaller projects or when privacy is a concern, users may prefer not to index code. Embedding generation also requires API calls and processing time.
- When configured with a provider (e.g., `openai` or `ollama`), Continue.dev can search across your entire codebase to find relevant context for AI responses.

**`options` block**
- These are inference/parameter settings that control how the AI generates responses.
- Key sub-fields:
  - `maxTokens`: Maximum number of tokens (words/word-pieces) to generate in the response. Higher = longer answers, lower = shorter answers.
  - `temperature`: Controls randomness/creativity (0.0 = very deterministic/precise, 1.0 = very creative/random). For code, values like 0.1-0.3 are preferred.
  - `topP`: Controls diversity via nucleus sampling (0.9 = diverse, 0.1 = focused).
  - `presencePenalty` / `frequencyPenalty`: Adjust likelihood of repeating tokens (useful for avoiding repetitive code patterns).
- These settings directly affect code quality, response length, and consistency with your coding style.

### Additional Recommended Fields

```yaml
# Full production-ready example
name: ExcaliMath AI Config
version: 1.0.0
schema: v1

# Define which models are available
models:
  - name: Claude 3.7 Sonnet
    provider: openrouter
    model: openrouter/anthropic/claude-3-7-sonnet-20250219
    apiKey: ${OPENROUTER_API_KEY}
    capabilities:
      - tool_use
      - chat
      - embed
    tabAutocompleteModel: null        # Disabled for focused workflow
    embeddingsProvider: null         # Disabled; can be enabled for codebase search
    options:
      maxTokens: 8192
      temperature: 0.1               # Low temperature for consistent, accurate code
      topP: 0.9
      topK: 40
      presencePenalty: 0.0
      frequencyPenalty: 0.0

# Which model is used for new conversation chats
defaultModel: "Claude 3.7 Sonnet"

# Features available via slash commands
commands:
  - name: explain
    description: Explain selected code
  - name: fix
    description: Fix bugs in selected code
  - name: test
    description: Generate tests

# Telemetry settings (recommended to disable for privacy)
telemetry: false

# System message that defines AI behavior
systemMessage: "You are a TypeScript expert helping build Discord ExcaliMath, a collaborative whiteboard. Follow documentation/design/PLAN.md strictly. Use strict pure TypeScript, minimal code, production-oriented patterns."
```