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
import { AvatarFallback } from '@ui';
import { customerPortalAction } from '@/lib/payments/actions';
import { useActionState } from 'react';
import { TeamDataWithMembers, User } from '@/lib/db/schema';
import useSWR from 'swr';
import { Suspense } from 'react';
import { Loader2, PlusCircle } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { getUserByEmail } from '@/app/actions/user';

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function SubscriptionSkeleton() {
  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Skeleton height="20px" width="200px" />
          <Skeleton height="16px" width="150px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

function ManageSubscription() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <HStack
            justify="space-between"
            align={{ base: 'start', sm: 'center' }}
            flexDirection={{ base: 'column', sm: 'row' }}
            gap={4}
          >
            <VStack align="start" gap={1}>
              <Text fontWeight="medium" fontSize="md">
                Current Plan: {teamData?.planName || 'Free'}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {teamData?.subscriptionStatus === 'active'
                  ? 'Billed monthly'
                  : teamData?.subscriptionStatus === 'trialing'
                  ? 'Trial period'
                  : 'No active subscription'}
              </Text>
            </VStack>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline">
                Manage Subscription
              </Button>
            </form>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

function TeamMembersSkeleton() {
  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <HStack gap={4}>
            <SkeletonCircle size="10" />
            <VStack align="start" gap={2}>
              <Skeleton height="16px" width="120px" />
              <Skeleton height="12px" width="60px" />
            </VStack>
          </HStack>
        </VStack>
      </CardContent>
    </Card>
  );
}

function TeamMembers() {
  const { data: teamData } = useSWR<TeamDataWithMembers>('/api/team', fetcher);
  // TODO: Implement removeTeamMember action
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(async () => ({}), {});

  const getUserDisplayName = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    return user.name || user.email || 'Unknown User';
  };

  if (!teamData?.teamMembers?.length) {
    return (
      <Card mb={8}>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Text color="gray.500">No team members yet.</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card mb={8}>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          {teamData.teamMembers.map((member, index) => (
            <HStack
              key={member.id}
              justify="space-between"
              align="center"
              gap={4}
            >
              <HStack gap={4}>
                <Avatar.Root>
                  {/* 
                    This app doesn't save profile images, but here
                    is how you'd show them:

                    <Avatar.Image
                      src={member.user.image || ''}
                      alt={getUserDisplayName(member.user)}
                    />
                  */}
                  <AvatarFallback>
                    {getUserDisplayName(member.user)
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar.Root>
                <VStack align="start" gap={0}>
                  <Text fontWeight="medium" fontSize="md">
                    {getUserDisplayName(member.user)}
                  </Text>
                  <Text fontSize="sm" color="gray.500" textTransform="capitalize">
                    {member.role}
                  </Text>
                </VStack>
              </HStack>
              {index > 1 ? (
                <form action={removeAction}>
                  <input type="hidden" name="memberId" value={member.id} />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    disabled={isRemovePending}
                  >
                    {isRemovePending ? 'Removing...' : 'Remove'}
                  </Button>
                </form>
              ) : null}
            </HStack>
          ))}
        </VStack>
        {removeState?.error && (
          <Alert.Root status="error" borderRadius="md" mt={4}>
            <AlertIndicator />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{removeState.error}</AlertDescription>
          </Alert.Root>
        )}
      </CardContent>
    </Card>
  );
}

function InviteTeamMemberSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Team Member</CardTitle>
      </CardHeader>
      <CardContent>
        <VStack align="stretch" gap={4}>
          <Box>
            <Skeleton height="16px" width="50px" mb={2} />
            <Skeleton height="40px" />
          </Box>
          <Box>
            <Skeleton height="16px" width="40px" mb={2} />
            <HStack gap={4}>
              <Skeleton height="20px" width="80px" />
              <Skeleton height="20px" width="80px" />
            </HStack>
          </Box>
          <Skeleton height="40px" width="150px" />
        </VStack>
      </CardContent>
    </Card>
  );
}

function InviteTeamMember() {
  const { user: auth0User } = useUser();
  const { data: user } = useSWR<User | null>(
    auth0User?.email ? `user-${auth0User.email}` : null,
    async () => {
      if (!auth0User?.email) return null;
      return getUserByEmail(auth0User.email);
    }
  );
  const isOwner = user?.role === 'owner';
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
        <Suspense fallback={<SubscriptionSkeleton />}>
          <ManageSubscription />
        </Suspense>
        <Suspense fallback={<TeamMembersSkeleton />}>
          <TeamMembers />
        </Suspense>
        <Suspense fallback={<InviteTeamMemberSkeleton />}>
          <InviteTeamMember />
        </Suspense>
      </VStack>
    </Box>
  );
}
