'use server';

import { upsertUserMetadata } from '@utils/auth/users';

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
