'use client';

import { useActionState } from 'react';
import {
  Button,
  Input,
  CardRoot as Card,
  CardBody as CardContent,
  CardHeader,
  Heading as CardTitle,
  Heading,
  Box,
  VStack,
  Text,
  Alert,
  AlertIndicator,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Loader2, Lock } from 'lucide-react';
import { User } from '@DonaldNgai/next-utils/auth/users';
import useSWR from 'swr';
import { Suspense } from 'react';
import { getCurrentUserFullDetails } from '@DonaldNgai/next-utils/auth/users';
import { updateAccount, updatePassword } from '@/app/actions/auth';

type ActionState = {
  name?: string;
  error?: string;
  success?: string;
};

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type AccountFormProps = {
  state: ActionState;
  nameValue?: string;
  emailValue?: string;
};

function AccountForm({
  state,
  nameValue = '',
  emailValue = ''
}: AccountFormProps) {
  return (
    <VStack align="stretch" gap={4}>
      <Box>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          defaultValue={state.name || nameValue}
          required
        />
      </Box>
      <Box>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          defaultValue={emailValue}
          required
        />
      </Box>
    </VStack>
  );
}

function AccountFormWithData({ state }: { state: ActionState }) {
  const { data: user } = useSWR<User | null>(
    'current-user',
    getCurrentUserFullDetails
  );
  // Prefill name from user_metadata.name, fallback to user.name
  const nameValue = user?.user_metadata?.name ?? user?.name ?? '';
  return (
    <AccountForm
      state={state}
      nameValue={nameValue}
      emailValue={user?.email ?? ''}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  return (
    <Box flex="1" maxW="4xl" w="full">
      <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
        General Settings
      </Heading>

      <VStack align="stretch" gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <VStack align="stretch" gap={4}>
                <Suspense fallback={<AccountForm state={state} />}>
                  <AccountFormWithData state={state} />
                </Suspense>
                
                {state.error && (
                  <Alert.Root status="error" borderRadius="md">
                    <AlertIndicator />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                  </Alert.Root>
                )}
                
                {state.success && (
                  <Alert.Root status="success" borderRadius="md">
                    <AlertIndicator />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{state.success}</AlertDescription>
                  </Alert.Root>
                )}
                
                <Box>
                  <Button
                    type="submit"
                    colorScheme="orange"
                    disabled={isPending}
                    width={{ base: 'full', sm: 'auto' }}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </Box>
              </VStack>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={passwordAction}>
              <VStack align="stretch" gap={4}>
                <Box>
                  <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.newPassword}
                  />
                </Box>
                <Box>
                  <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.confirmPassword}
                  />
                </Box>
                
                {passwordState.error && (
                  <Alert.Root status="error" borderRadius="md">
                    <AlertIndicator />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordState.error}</AlertDescription>
                  </Alert.Root>
                )}
                
                {passwordState.success && (
                  <Alert.Root status="success" borderRadius="md">
                    <AlertIndicator />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{passwordState.success}</AlertDescription>
                  </Alert.Root>
                )}
                
                <Box>
                  <Button
                    type="submit"
                    colorScheme="orange"
                    disabled={isPasswordPending}
                    width={{ base: 'full', sm: 'auto' }}
                  >
                    {isPasswordPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </Box>
              </VStack>
            </form>
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
}
