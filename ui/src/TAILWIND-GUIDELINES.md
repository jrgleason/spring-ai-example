# UI Component Guidelines

## Tailwind CSS v4 Integration

This project uses Tailwind CSS v4 with Material UI integration, following best practices for theme management.

### Color Usage
Use theme variables for all colors rather than explicit hex/rgb values:

```jsx
// ✅ Good
<div className="bg-primary-500 text-white">
  Button
</div>

// ❌ Bad
<div className="bg-blue-500" style={{ color: '#ffffff' }}>
  Button
</div>
```

### CSS Layers
The project uses CSS layers for proper cascading:
- `theme` - Theme variables
- `base` - Base styles
- `mui` - Material UI styles
- `components` - Custom component styles
- `utilities` - Tailwind utilities

### Custom Components
Add custom component styles in the appropriate CSS file using the `@layer components` directive:

```css
@layer components {
  .custom-button {
    @apply bg-primary-500 text-white rounded-md px-4 py-2 hover:bg-primary-600;
  }
}
```

### Material UI Integration
When using Material UI components, prefer Tailwind classes over the `sx` prop:

```jsx
// ✅ Good
<Button className="bg-primary-500 text-white">Click me</Button>

// ❌ Bad
<Button sx={{ bgcolor: 'primary.main', color: 'white' }}>Click me</Button>
```

### Shadow Usage
Use theme shadow variables:

```jsx
// ✅ Good
<div className="shadow-md">Card</div>

// ❌ Bad
<div style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>Card</div>
```
