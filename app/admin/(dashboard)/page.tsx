'use client';

import {
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Avatar,
  AvatarImage,
  CardRoot as Card,
  CardBody as CardContent,
  CardHeader,
  Heading as CardTitle,
  CardFooter,
  Input,
  RadioGroup,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Alert,
  AlertIndicator,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import {
  SubscriptionSkeleton,
  ManageSubscription,
  TeamMembersSkeleton,
  TeamMembers,
  InviteTeamMemberSkeleton,
} from '@ui';
import { customerPortalAction } from '@repo/next-utils/payments/actions';
import { useActionState, useEffect, useState } from 'react';
import { TeamDataWithMembers } from '@repo/next-utils/db/schema';
import { User } from '@utils/auth/users';
import useSWR from 'swr';
import { Suspense } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserById } from '@utils/auth/users';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function InviteTeamMember() {
  const { user: auth0User } = useUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchUser() {
      if (auth0User?.sub) {
        const u = await getUserById(auth0User.sub);
        if (!cancelled) {
          setUser(u);
        }
      } else {
        setUser(null);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [auth0User]);

  const isOwner = (user?.app_metadata?.role as string) === 'owner' || auth0User?.role === 'owner';
  // TODO: Implement inviteTeamMember action
  const [inviteState, inviteAction, isInvitePending] = useActionState<
    ActionState,
    FormData
  >(async () => ({}), {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={inviteAction}>
          <VStack align="stretch" gap={4}>
            <Box>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
                disabled={!isOwner}
              />
            </Box>
            <Box>
              <Text
                fontSize="sm"
                fontWeight="medium"
                display="block"
                mb={2}
              >
                Role
              </Text>
              <RadioGroup.Root
                defaultValue="member"
                name="role"
                disabled={!isOwner}
              >
                <HStack gap={4} mt={2}>
                  <HStack gap={2}>
                    <RadioGroup.Item value="member" id="member" />
                    <label htmlFor="member" className="text-sm cursor-pointer">
                      Member
                    </label>
                  </HStack>
                  <HStack gap={2}>
                    <RadioGroup.Item value="owner" id="owner" />
                    <label htmlFor="owner" className="text-sm cursor-pointer">
                      Owner
                    </label>
                  </HStack>
                </HStack>
              </RadioGroup.Root>
            </Box>
            {inviteState?.error && (
              <Alert.Root status="error" borderRadius="md">
                <AlertIndicator />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{inviteState.error}</AlertDescription>
              </Alert.Root>
            )}
            {inviteState?.success && (
              <Alert.Root status="success" borderRadius="md">
                <AlertIndicator />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{inviteState.success}</AlertDescription>
              </Alert.Root>
            )}
            <Box>
              <Button
                type="submit"
                colorScheme="orange"
                disabled={isInvitePending || !isOwner}
                width={{ base: 'full', sm: 'auto' }}
              >
              {isInvitePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Inviting...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Invite Member
                </>
              )}
              </Button>
            </Box>
          </VStack>
        </form>
      </CardContent>
      {!isOwner && (
        <CardFooter>
          <Text fontSize="sm" color="gray.500">
            You must be a team owner to invite new members.
          </Text>
        </CardFooter>
      )}
    </Card>
  );
}

export default function SettingsPage() {
  // const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);


  const { user: auth0User } = useUser();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    console.log('fetchUser called');
    console.log('auth0User:', auth0User);
    async function fetchUser() {
      if (auth0User?.sub) {
        console.log('getUserById called');
        console.log('auth0User.sub:', auth0User.sub);
        const u = await getUserById(auth0User.sub);
        console.log('user:', u);
        if (!cancelled) {
          setUser(u);
        }
      } else {
        setUser(null);
      }
    }
    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [auth0User]);


  useEffect(() => {
    console.log('auth0User changed:', auth0User);
  }, [auth0User]);

  return (
    <Box flex="1" maxW="4xl" w="full">
      <Heading
        as="h1"
        size={{ base: 'lg', lg: 'xl' }}
        fontWeight="medium"
        mb={6}
      >
        Team Settings
      </Heading>
      <VStack align="stretch" gap={6}>
        {/* <Suspense fallback={<SubscriptionSkeleton />}>
          <ManageSubscription teamData={teamData} customerPortalAction={customerPortalAction} />
        </Suspense>
        <Suspense fallback={<TeamMembersSkeleton />}>
          <TeamMembers teamData={teamData} />
        </Suspense> */}
        <Suspense fallback={<InviteTeamMemberSkeleton />}>
          <InviteTeamMember />
        </Suspense>
      </VStack>
    </Box>
  );
}
