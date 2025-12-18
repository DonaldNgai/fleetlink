'use client';

import { useActionState } from 'react';
import {
  Button,
  Input,
  CardRoot as Card,
  CardBody as CardContent,
  CardHeader,
  Heading as CardTitle,
  Box,
  VStack,
  Text,
  Alert,
  AlertIndicator,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Loader2 } from 'lucide-react';
import { User } from '@repo/next-utils/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserByEmail, updateAccount } from '@/app/actions/user';

type ActionState = {
  name?: string;
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
        <Text as="label" htmlFor="name" fontSize="sm" fontWeight="medium" display="block" mb={2}>
          Name
        </Text>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          defaultValue={state.name || nameValue}
          required
        />
      </Box>
      <Box>
        <Text as="label" htmlFor="email" fontSize="sm" fontWeight="medium" display="block" mb={2}>
          Email
        </Text>
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
  const { user: auth0User } = useUser();
  const { data: user } = useSWR<User | null>(
    auth0User?.email ? `user-${auth0User.email}` : null,
    async () => {
      if (!auth0User?.email) return null;
      return getUserByEmail(auth0User.email);
    }
  );
  return (
    <AccountForm
      state={state}
      nameValue={user?.name ?? ''}
      emailValue={user?.email ?? ''}
    />
  );
}

export default function GeneralPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAccount,
    {}
  );

  return (
    <Box flex="1" maxW="4xl" w="full">
      <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
        General Settings
      </Heading>

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
    </Box>
  );
}
