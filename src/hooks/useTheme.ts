/**
 * Theme Hook
 *
 * Re-exports the useTheme hook from ThemeProvider for convenience.
 * This maintains backward compatibility with existing code.
 */

export { useTheme, useTheme as default } from '../components/ThemeProvider';
