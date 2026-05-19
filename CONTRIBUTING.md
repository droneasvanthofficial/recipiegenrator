# Contributing to Recipe Generator

Thank you for your interest in contributing to the Recipe Generator project! We welcome contributions from everyone.

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming and inclusive environment.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn or pnpm
- Git
- Groq API key (for testing)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/recipe-generator.git
   cd recipe-generator
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your Groq API key to .env.local
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to http://localhost:3000

## Development Workflow

### Making Changes

1. **Create a feature branch from `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments for complex logic
   - Update related documentation

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm test (when tests are added)
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Clear description of changes"
   ```
   
   Use conventional commits:
   - `feat: add new feature`
   - `fix: fix bug`
   - `docs: update documentation`
   - `style: formatting changes`
   - `refactor: code refactoring`
   - `perf: performance improvements`
   - `test: add tests`
   - `chore: maintenance tasks`

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear title and description
   - Reference any related issues
   - Explain the changes and why they were made
   - Include screenshots for UI changes

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Use meaningful variable names
- Keep functions small and focused
- Add comments for complex logic

### File Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── generate/          # Recipe generation page
│   ├── results/           # Results page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── error.tsx          # Error page
│   └── not-found.tsx      # 404 page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── loading-spinner.tsx
│   └── theme-provider.tsx
├── lib/                   # Utility functions
│   ├── api-client.ts     # API client
│   ├── config.ts         # Configuration
│   ├── validation.ts     # Input validation
│   └── utils.ts          # Utilities
├── styles/               # Global styles
├── public/               # Static assets
└── tests/                # Tests (coming soon)
```

## Commit Guidelines

- Write clear, concise commit messages
- Use imperative mood ("add feature" not "added feature")
- Reference issues when applicable
- Keep commits atomic and focused
- Don't mix refactoring with feature changes

## Pull Request Guidelines

1. **One feature per PR**: Keep PRs focused and easy to review
2. **Update documentation**: Update README or other docs if needed
3. **Add tests**: Test your changes (when tests are added)
4. **Check CI/CD**: Ensure all automated checks pass
5. **Request reviews**: Ask for feedback from maintainers

### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Related Issues
Fixes #123

## Changes
- Change 1
- Change 2
- Change 3

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Include before/after screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Bug Reports

When reporting bugs:

1. **Use GitHub Issues**
2. **Include details**:
   - Browser/environment
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots or logs
3. **Be specific**: Avoid vague descriptions
4. **Try latest version**: Make sure bug still exists

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: 
- OS: 
- Node version: 
- npm version: 

## Additional Context
Any other relevant information
```

## Feature Requests

1. **Use GitHub Issues**
2. **Explain the use case**
3. **Describe the desired behavior**
4. **Provide examples if possible**

### Feature Request Template

```markdown
## Description
Describe the feature you want

## Use Case
Why do you need this feature?

## Proposed Solution
How should it work?

## Alternatives Considered
Any alternatives?
```

## Testing

### Unit Tests (Coming Soon)

```bash
npm test
npm run test:watch
```

### Manual Testing

Before submitting a PR:

1. Test on different browsers (Chrome, Firefox, Safari, Edge)
2. Test on different devices (desktop, tablet, mobile)
3. Test with different ingredient inputs
4. Test error cases
5. Test image uploads

## Performance Considerations

- Minimize bundle size
- Optimize images
- Use code splitting
- Lazy load components
- Minimize API calls

## Documentation

- Update README for user-facing changes
- Add JSDoc comments for functions
- Update API documentation
- Add comments for complex logic

## Questions?

- Check existing issues and discussions
- Read the documentation
- Ask in GitHub Discussions (coming soon)
- Email: support@recipe-generator.com

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README

Thank you for contributing! 🎉

---

**Last Updated**: May 2026
