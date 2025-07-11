
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSessionCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatTime(seconds: number): string {
  return seconds.toString().padStart(2, '0');
}

export function getShareableLink(sessionCode: string): string {
  return `${window.location.origin}/join?code=${sessionCode}`;
}

export type ClipboardResult = {
  success: boolean;
  message: string;
  method: 'modern' | 'legacy' | 'manual' | 'error';
};

/**
 * Robust clipboard utility with multiple fallback methods
 * Works in various environments including localhost, HTTPS, and restricted contexts
 */
export async function copyToClipboard(text: string): Promise<ClipboardResult> {
  // Method 1: Modern Clipboard API
  if (navigator?.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return {
        success: true,
        message: 'Copied to clipboard!',
        method: 'modern'
      };
    } catch (error) {
      console.warn('Modern clipboard API failed:', error);
      // Continue to fallback methods
    }
  }

  // Method 2: Legacy execCommand method
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.zIndex = '-1';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      return {
        success: true,
        message: 'Copied to clipboard!',
        method: 'legacy'
      };
    }
  } catch (error) {
    console.warn('Legacy clipboard method failed:', error);
  }

  // Method 3: Manual selection fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '50%';
    textArea.style.top = '50%';
    textArea.style.transform = 'translate(-50%, -50%)';
    textArea.style.padding = '10px';
    textArea.style.border = '2px solid #007bff';
    textArea.style.borderRadius = '4px';
    textArea.style.backgroundColor = '#f8f9fa';
    textArea.style.zIndex = '9999';
    textArea.setAttribute('readonly', '');
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(textArea)) {
        document.body.removeChild(textArea);
      }
    }, 5000);
    
    return {
      success: true,
      message: 'Text selected for you to copy manually (Ctrl+C or Cmd+C)',
      method: 'manual'
    };
  } catch (error) {
    console.error('All clipboard methods failed:', error);
  }

  // Method 4: Complete fallback - just return the text
  return {
    success: false,
    message: `Copy this link manually: ${text}`,
    method: 'error'
  };
}

/**
 * Quick clipboard function for simple use cases
 * Returns a promise that resolves to boolean for success/failure
 */
export async function quickCopy(text: string): Promise<boolean> {
  const result = await copyToClipboard(text);
  return result.success;
}
