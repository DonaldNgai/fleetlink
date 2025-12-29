'use server';

import { upsertUserMetadata, updateUserPassword, getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { auth0 } from '@/lib/auth/auth0';

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

/**
 * Server action to update account information
 * Directly calls upsertUserMetadata to update user metadata
 */
export async function updateAccount(prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (!name || !email) {
      return {
        error: 'Name and email are required',
      };
    }

    // Update user metadata with name
    await upsertUserMetadata({ name });

    return {
      success: 'Account updated successfully',
    };
  } catch (error) {
    console.error('Error updating account:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to update account',
    };
  }
}

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

/**
 * Server action to update user password
 * Collects form data and calls updateUserPassword from next-utils
 */
export async function updatePassword(prevState: PasswordState, formData: FormData): Promise<PasswordState> {
  try {
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!newPassword || !confirmPassword) {
      return {
        error: 'New password and confirmation are required',
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        error: 'New password and confirmation do not match',
      };
    }

    if (newPassword.length < 8) {
      return {
        error: 'Password must be at least 8 characters long',
      };
    }

    // Call the server function from next-utils
    await updateUserPassword(newPassword);

    return {
      success: 'Password updated successfully. Please log in again with your new password.',
    };
  } catch (error) {
    console.error('Error updating password:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to update password',
    };
  }
}

/**
 * Server action to get the current user
 * Directly calls getCurrentUserFullDetails with auth0
 */
export async function getCurrentUser() {
  try {
    return await getCurrentUserFullDetails(auth0);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
