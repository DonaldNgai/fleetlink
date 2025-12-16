'use client';

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
  Heading,
} from '@chakra-ui/react';
import { Lock, Trash2, Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { updatePassword, deleteAccount } from '@/app/actions/user';

type PasswordState = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
  error?: string;
  success?: string;
};

type DeleteState = {
  password?: string;
  error?: string;
  success?: string;
};

export default function SecurityPage() {
  const [passwordState, passwordAction, isPasswordPending] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, {});

  const [deleteState, deleteAction, isDeletePending] = useActionState<
    DeleteState,
    FormData
  >(deleteAccount, {});

  return (
    <Box flex="1" maxW="4xl" w="full">
      <Heading as="h1" size={{ base: 'lg', lg: 'xl' }} fontWeight="medium" mb={6}>
        Security Settings
      </Heading>
      
      <VStack align="stretch" gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={passwordAction}>
              <VStack align="stretch" gap={4}>
                <Box>
                  <Text as="label" htmlFor="current-password" fontSize="sm" fontWeight="medium" display="block" mb={2}>
                    Current Password
                  </Text>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    minLength={8}
                    maxLength={100}
                    defaultValue={passwordState.currentPassword}
                  />
                </Box>
                <Box>
                  <Text as="label" htmlFor="new-password" fontSize="sm" fontWeight="medium" display="block" mb={2}>
                    New Password
                  </Text>
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
                  <Text as="label" htmlFor="confirm-password" fontSize="sm" fontWeight="medium" display="block" mb={2}>
                    Confirm New Password
                  </Text>
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

        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack align="stretch" gap={4}>
              <Text fontSize="sm" color="gray.600">
                Account deletion is non-reversable. Please proceed with caution.
              </Text>
              
              <form action={deleteAction}>
                <VStack align="stretch" gap={4}>
                  <Box>
                    <label htmlFor="delete-password" className="block text-sm font-medium mb-2">
                      Confirm Password
                    </label>
                    <Input
                      id="delete-password"
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      maxLength={100}
                      defaultValue={deleteState.password}
                    />
                  </Box>
                  
                  {deleteState.error && (
                    <Alert.Root status="error" borderRadius="md">
                      <AlertIndicator />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{deleteState.error}</AlertDescription>
                    </Alert.Root>
                  )}
                  
                  <Box>
                    <Button
                      type="submit"
                      colorScheme="red"
                      variant="solid"
                      disabled={isDeletePending}
                      width={{ base: 'full', sm: 'auto' }}
                    >
                      {isDeletePending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Account
                        </>
                      )}
                    </Button>
                  </Box>
                </VStack>
              </form>
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </Box>
  );
}
